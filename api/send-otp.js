// POST /api/send-otp
// Step 1 of 2FA: validate form fields, store form data, generate OTP, send verification email.
// Does NOT create a LibreDesk ticket — that only happens after OTP verification.

import { generateOtp, storeOtp, storeFormData, checkResendCooldown, sendOtpEmail } from './lib/otp.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body;

  // ── Validate required fields ────────────────────────────────────────────
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid field types.' });
  }
  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

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

  try {
    await storeOtp(email, otp);
    await storeFormData(email, { name: name.trim(), email: email.trim(), message: message.trim() });
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
