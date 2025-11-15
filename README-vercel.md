# Vercel Deployment Instructions

## 1. Environment Variables
- Copy `.env.example` to `.env.local` and fill in your SMTP credentials.
- Never commit `.env.local` to the repo.

## 2. Deploying to Vercel
- Push your repo to GitHub.
- Import the project in Vercel dashboard.
- Set environment variables in Vercel dashboard (from `.env.example`).
- Vercel will auto-detect Vite/React and deploy.

## 3. API Endpoint
- Contact form POSTs to `/api/contact`.
- Backend uses nodemailer to send email to `level7feeders@gmail.com`.

## 4. Notes
- Keep your SMTP credentials secure.
- For Gmail SMTP, you may need an App Password.
- For other providers, use their SMTP settings.

---

## Example SMTP for Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
CONTACT_RECEIVER=example@gmail.com
