## Instagram Comment Auto-Responder

Next.js app that listens to Instagram comment webhooks and replies to followers with a direct message that says “hello 👋”.

### Prerequisites

- Instagram Business or Creator account connected to a Facebook page
- Meta developer app with the Instagram Graph API enabled
- Comment webhooks subscription configured for the app
- Long-lived Instagram access token with `instagram_manage_comments` and `pages_messaging` scopes

### Environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ACCOUNT_ID=...
INSTAGRAM_VERIFY_TOKEN=...
```

### Local development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Expose `http://localhost:3000/api/instagram/webhook` to the internet (e.g. `ngrok http 3000`)
4. Configure the webhook callback in Meta App Dashboard using the public URL and your verify token

Webhooks are verified via `GET` handshake and processed through `POST`. For each comment from a subscribed follower, the app triggers the Instagram Graph API to send the greeting.

### Deployment

Deploy on Vercel. Make sure to set the same environment variables in the project settings so the webhook can authenticate and respond in production.
