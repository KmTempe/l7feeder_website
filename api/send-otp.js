// POST /api/send-otp
// Step 1 of 2FA: validate form fields, store form data, generate OTP, send verification email.
// Does NOT create a LibreDesk ticket — that only happens after OTP verification.

import { generateOtp, storeOtp, storeFormData, checkResendCooldown, sendOtpEmail } from './lib/otp.js';
import { validateContactPayload } from './lib/validation.js';

export default async function handler(req, res) {
  // CORS — restrict to production domain or local dev
  const allowedOrigin = process.env.VERCEL === '1'
    ? 'https://l7feeders.dev'
    : 'http://localhost:3005';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const validation = validateContactPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, email, message } = validation.value;

  // ── Validate required fields ────────────────────────────────────────────
  // ── Check resend cooldown (prevent spamming) ────────────────────────────
  try {
    const cooldown = await checkResendCooldown(email);
    if (!cooldown.allowed) {
      return res.status(429).json({
        error: `Please wait ${cooldown.retryAfter} seconds before requesting a new code.`,
        retryAfter: cooldown.retryAfter,
      });
    }
  } catch (err) {
    console.error('Cooldown check error:', err);
    // Continue even if cooldown check fails — don't block the user
  }

  // ── Generate & store OTP, store form data ───────────────────────────────
  const otp = generateOtp();
  //console.log(`Generated OTP: ${otp}`); local debug i guess its fine to leave it commented

  try {
    await storeOtp(email, otp);
    await storeFormData(email, { name, email, message });
  } catch (err) {
    console.error('OTP storage error:', err);
    return res.status(500).json({ error: 'Failed to generate verification code. Please try again.' });
  }

  // ── Send OTP email ─────────────────────────────────────────────────────
  try {
    await sendOtpEmail(email, otp);
    console.log(`OTP sent to ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Verification code sent. Please check your email.',
    });
  } catch (err) {
    console.error('OTP email error:', err);
    return res.status(500).json({ error: 'Failed to send verification email. Please try again later.' });
  }
}
