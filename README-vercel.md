# Vercel Deployment Notes

This project deploys as a Vite frontend plus Vercel API Functions from `api/`. Local development uses `server.js` as an Express mirror for the same API routes.

## Build And Routing

`vercel.json` is the production contract:

- `buildCommand`: `npm run check`
- `outputDirectory`: `dist`
- `/api/:path*` stays routed to API Functions.
- The SPA fallback excludes `/api/*` and static files.
- Security headers are configured globally.
- Cron runs `/api/cron/process-queue` at `00:00` and `12:00` UTC.

The Vite build runs `prebuild`, which generates:

- `public/sitemap.xml`
- `public/robots.txt`
- `public/llms.txt`
- `public/favicon.svg`

## Required Environment Variables

Set production values in the Vercel dashboard. Keep local values in `.env.local`.

### SMTP For OTP Email

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

`SMTP_HOST` defaults to `smtp.gmail.com` and `SMTP_PORT` defaults to `587` if omitted, but production should set them explicitly.

### Redis / Vercel KV Compatible URL

```env
REDIS_URL=rediss://default:password@host:6379
DEV_REDIS_URL=redis://localhost:6379
```

Production uses `REDIS_URL`. Local development prefers `DEV_REDIS_URL` and falls back to `REDIS_URL`. Without Redis, OTP uses an in-memory fallback and local queue paths may fall back to file storage, which is not production-safe.

### LibreDesk

```env
LIBREDESK_API_URL=https://support.example.com/api/v1
LIBREDESK_API_KEY=your_api_key
LIBREDESK_API_SECRET=your_api_secret
LIBREDESK_INBOX_ID=1
LIBREDESK_AGENT_ID=40
LIBREDESK_TEAM_ID=1
LIBREDESK_PRIORITY=Low
LIBREDESK_TAGS=l7f
```

`LIBREDESK_AGENT_ID`, `LIBREDESK_TEAM_ID`, `LIBREDESK_PRIORITY`, and `LIBREDESK_TAGS` are optional, but the API URL, key, secret, and inbox ID are needed for message delivery.

### Queue Processing Secrets

```env
CRON_SECRET=long_random_cron_secret
QUEUE_SECRET=long_random_manual_queue_secret
```

Vercel Cron calls `/api/cron/process-queue` with `Authorization: Bearer <CRON_SECRET>`. Manual processing through `/api/process-queue` requires `x-queue-secret: <QUEUE_SECRET>`.

### Public Frontend Config

These values are exposed to the browser because they start with `VITE_`.

```env
VITE_HOMELAB_STACK_DIAGRAM_URL=https://example.public.blob.vercel-storage.com/homelab/docker-compose-diagram.svg
VITE_STRESS_VIDEO_URL=
VITE_LIBREDESK_BASE_URL=https://support.example.com
VITE_LIBREDESK_INBOX_ID=
```

Only put public, non-secret values in `VITE_*` variables.

## Production API Flow

1. Frontend posts contact fields to `/api/send-otp`.
2. The API validates input, stores temporary form data, and sends an OTP email.
3. Frontend posts `{ email, otp }` to `/api/verify-otp`.
4. The API validates the OTP, validates stored form data, and queues or sends the LibreDesk conversation.
5. Vercel cron processes queued items through `/api/cron/process-queue`.

The legacy `/api/contact` route still exists for compatibility, but the frontend contact form should use `/api/send-otp` and `/api/verify-otp`.

## Deployment Checklist

1. Set all required Vercel environment variables.
2. Confirm `REDIS_URL` is available in Production.
3. Confirm SMTP credentials can send from the configured account.
4. Confirm LibreDesk API credentials and inbox ID are valid.
5. Deploy from the linked GitHub repository.
6. Verify `/api/send-otp`, `/api/verify-otp`, and `/api/cron/process-queue` are not served as `index.html`.

Before deploying from local changes, run:

```bash
npm run check
```

## Local Verification

```bash
npm run dev
```

Then open `http://localhost:3005`. The Vite dev server proxies `/api/*` to `server.js` on port `3000`.

Manual queue processing:

```bash
npm run queue:process
```

For the API contract tests:

```bash
npm test -- --project api
```
