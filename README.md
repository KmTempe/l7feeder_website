# Kosmas Temperekidis Portfolio

Live site: https://l7feeders.dev/

React 19 + Vite portfolio site with a local Express API mirror for development and Vercel API Functions in production. The site uses MUI, Emotion, Framer Motion, Vercel Analytics/Speed Insights, and a contact flow with email OTP verification before messages are queued or sent to LibreDesk.

## Project Layout

- `src/`: React app, components, theme, tests, and shared portfolio content.
- `src/data/portfolioData.js`: main content contract for profile, projects, contact, SEO topics, and feature flags.
- `src/config/siteConfig.js`: environment-backed public config for hosted assets and widget URLs.
- `api/`: Vercel API Functions for contact, OTP, queue processing, and cron processing.
- `api/lib/`: shared validation, OTP, queue, sanitization, and LibreDesk helpers.
- `api/tests/`: Node/Vitest API tests.
- `scripts/`: build-time site-file generation and local queue helper scripts.
- `public/`: generated SEO/static files such as `sitemap.xml`, `robots.txt`, `llms.txt`, and `favicon.svg`.

## Main Features

- Metro-inspired tile UI for portfolio projects.
- Featured homelab project tile with expandable stack diagram and scope disclaimer.
- Contact form with `/api/send-otp` and `/api/verify-otp`.
- API-side input validation; the frontend is not trusted as a security boundary.
- Redis-backed OTP and queue support, with local fallbacks where available.
- LibreDesk direct send and queued processing.
- Vercel cron endpoint for contact queue processing.
- Generated `sitemap.xml`, `robots.txt`, `llms.txt`, and favicon during build.

## Requirements

- Node.js 24.x
- npm
- `.env.local` for local API secrets and optional public Vite config

## Development

```bash
npm install
npm run dev
```

`npm run dev` starts both services:

- Express API mirror on `http://localhost:3000`
- Vite frontend on `http://localhost:3005`

Vite proxies `/api/*` to the local Express mirror. In production, `/api/*` resolves to Vercel API Functions.

## Useful Commands

```bash
npm run dev          # Express API + Vite client
npm run dev:client   # Vite only
npm run dev:server   # local Express API only
npm run lint         # ESLint
npm test             # Vitest API + React projects
npm run build        # generate site files, then build Vite app
npm run check        # lint, tests, build
npm run queue:process
```

## API Endpoints

- `POST /api/send-otp`: validates contact input, stores form data, sends verification code.
- `POST /api/verify-otp`: validates OTP, retrieves stored form data, queues or sends to LibreDesk.
- `POST /api/contact`: legacy direct contact endpoint kept for compatibility.
- `GET|POST /api/process-queue`: manual queue processing with `x-queue-secret`.
- `GET /api/cron/process-queue`: Vercel cron processing with `Authorization: Bearer <CRON_SECRET>`.

## Environment

Copy `.env.example` to `.env.local` and fill only the values you need. Do not commit real secrets.

Important groups:

- SMTP: sends OTP emails.
- Redis: stores OTPs and contact queue state.
- LibreDesk: creates conversations after OTP verification.
- Vercel cron/manual secrets: protect queue processing endpoints.
- `VITE_*`: safe public frontend configuration for hosted media and widgets.

See [README-vercel.md](./README-vercel.md) for deployment-specific setup.

## Testing

Vitest has two projects:

- `api`: `api/tests/**/*.test.js` in Node
- `react`: `src/tests/**/*.test.{js,jsx}` in jsdom

Run focused suites when changing one surface:

```bash
npm test -- --project api
npm test -- --project react src/tests/Projects.test.jsx
```

Run `npm run check` before a deploy or PR when the environment allows it.

## Content Notes

Personal portfolio content lives in `src/data/portfolioData.js`; replace it if reusing the project. The homelab/Jellyfin section is documented as a private demonstration project and not a public media service.

## License

MIT. Personal content, contact details, and project descriptions are specific to this portfolio.
