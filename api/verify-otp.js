// POST /api/verify-otp
// Step 2 of 2FA: verify the OTP code, then create the LibreDesk ticket / enqueue.
// The LibreDesk integration and queue logic are untouched — we simply call them
// the same way the old contact.js did, but only after successful OTP verification.

import { verifyOtp, getFormData } from './lib/otp.js';
import { enqueue, isKVConfigured } from './lib/kv-queue.js';
import { sendToLibreDesk } from './lib/libredesk.js';

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

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code are required.' });
  }

  // ── Verify OTP ─────────────────────────────────────────────────────────
  let result;
  try {
    result = await verifyOtp(email, otp);
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'Verification service error. Please try again.' });
  }

  if (!result.valid) {
    // Determine appropriate status code
    const isExpiredOrLocked =
      result.message.includes('expired') ||
      result.message.includes('not found') ||
      result.message.includes('Too many');
    return res.status(isExpiredOrLocked ? 410 : 400).json({
      error: result.message,
      expired: isExpiredOrLocked,
    });
  }

  // ── Retrieve stored form data ──────────────────────────────────────────
  let formData;
  try {
    formData = await getFormData(email);
  } catch (err) {
    console.error('Form data retrieval error:', err);
  }

  if (!formData) {
    return res.status(410).json({
      error: 'Form data has expired. Please fill out the form again.',
      expired: true,
    });
  }

  const { name, message } = formData;

  // ── Send to LibreDesk (same logic as old contact.js) ───────────────────
  const kvAvailable = await isKVConfigured();

  if (kvAvailable) {
    try {
      const queueId = await enqueue({ name, email, message });
      console.log(`Verified contact queued for LibreDesk: ${queueId}`);
      return res.status(200).json({ success: true, queued: queueId });
    } catch (err) {
      console.error('Queue error:', err);
      // Fall through to direct send
    }
  }

  // No KV or queue failed — send directly to LibreDesk
  try {
    console.log('KV not available, sending directly to LibreDesk');
    await sendToLibreDesk(name, email, message);
    console.log('Verified contact sent directly to LibreDesk');
    return res.status(200).json({ success: true, direct: true });
  } catch (err) {
    console.error('LibreDesk error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}
