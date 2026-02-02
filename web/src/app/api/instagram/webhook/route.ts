import type { NextRequest } from "next/server";
import {
  extractCommentSendJobs,
  sendInstagramDirectMessage,
} from "@/lib/instagram";

const GREETING_MESSAGE = "hello 👋";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (!mode || !token || !challenge) {
    return new Response("Missing verification parameters.", { status: 400 });
  }

  if (!process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.error("INSTAGRAM_VERIFY_TOKEN is not set.");
    return new Response("Server misconfigured.", { status: 500 });
  }

  if (mode !== "subscribe" || token !== process.env.INSTAGRAM_VERIFY_TOKEN) {
    return new Response("Verification failed.", { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Failed to parse webhook body", error);
    return new Response("Invalid JSON payload.", { status: 400 });
  }

  const jobs = extractCommentSendJobs(body, GREETING_MESSAGE);

  if (jobs.length === 0) {
    return Response.json({ status: "ignored", reason: "no-comment-events" });
  }

  const results = await Promise.all(
    jobs.map(async (job) => {
      try {
        await sendInstagramDirectMessage(job);
        return { ok: true, recipientId: job.recipientId };
      } catch (error) {
        console.error("Failed to send Instagram message", {
          error,
          recipientId: job.recipientId,
          commentId: job.commentId,
        });
        return { ok: false, recipientId: job.recipientId };
      }
    }),
  );

  const failed = results.filter((result) => !result.ok).length;
  const total = results.length;

  if (failed > 0) {
    return Response.json(
      { status: "partial_failure", total, failed },
      { status: 207 },
    );
  }

  return Response.json({ status: "ok", total });
}
