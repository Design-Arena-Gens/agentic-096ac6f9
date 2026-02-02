import styles from "./page.module.css";

export default function Home() {
  const steps = [
    {
      title: "1. Configure environment",
      body: (
        <>
          Create a <code>.env.local</code> file with{" "}
          <code>INSTAGRAM_ACCESS_TOKEN</code>,{" "}
          <code>INSTAGRAM_BUSINESS_ACCOUNT_ID</code>, and{" "}
          <code>INSTAGRAM_VERIFY_TOKEN</code>. Use{" "}
          <code>.env.example</code> as a reference.
        </>
      ),
    },
    {
      title: "2. Register the webhook",
      body: (
        <>
          In Meta Developer tools, subscribe your Instagram app to{" "}
          <code>comments</code> events and set the callback URL to{" "}
          <code>/api/instagram/webhook</code> on your deployment. Use the same
          verify token you configured locally.
        </>
      ),
    },
    {
      title: "3. Deploy & enable",
      body: (
        <>
          Deploy to Vercel, confirm the webhook, and turn on subscriptions. Once
          connected, every new comment from a follower triggers an automated
          direct message with your greeting.
        </>
      ),
    },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Comment‑Triggered Instagram Agent</h1>
        <p>
          Automatically reply to followers who comment on your posts. This agent
          listens for comment webhooks and instantly sends a direct message that
          says <span className={styles.messageHighlight}>hello 👋</span>.
        </p>
      </section>

      <section className={styles.cards}>
        {steps.map((step) => (
          <article key={step.title} className={styles.card}>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.webhook}>
        <h2>Webhook endpoint</h2>
        <p>
          Deploy exposes a JSON webhook under{" "}
          <code>POST /api/instagram/webhook</code>. Use the sample payload to
          test locally:
        </p>
        <pre>
          <code>{`curl -X POST http://localhost:3000/api/instagram/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "test",
      "changes": [{
        "field": "comments",
        "value": {
          "comment_id": "123",
          "text": "great post",
          "from": { "id": "17841400000000000" }
        }
      }]
    }]
  }'`}</code>
        </pre>
        <p>
          The handler validates the verify token handshake, filters for new
          comment events, and uses the Graph API to DM your followers.
        </p>
      </section>
    </main>
  );
}
