// OTP (One-Time Password) helper for 2FA contact form verification
// Generates 7-digit codes, stores them in Redis (or in-memory fallback),
// and sends verification emails via nodemailer/SMTP.

import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createClient } from 'redis';

const isVercel = process.env.VERCEL === '1';

// ─── Redis connection (reuses same logic as kv-queue.js) ────────────────────
function getRedisUrl() {
  if (isVercel) return process.env.REDIS_URL;
  return process.env.DEV_REDIS_URL || process.env.REDIS_URL;
}

let redisClient = null;

async function getRedis() {
  if (redisClient && redisClient.isOpen) return redisClient;
  const url = getRedisUrl();
  if (!url) return null;
  try {
    redisClient = createClient({ url });
    redisClient.on('error', (err) => console.error('OTP Redis error:', err));
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error('OTP Redis connect failed:', err);
    return null;
  }
}

// ─── In-memory fallback (local dev without Redis) ───────────────────────────
const memoryStore = new Map();

// ─── Constants ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 7;
const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 30;

// ─── Generate a cryptographically random N-digit OTP ────────────────────────
export function generateOtp(length = OTP_LENGTH) {
  // Generate random bytes and convert to digits
  const bytes = crypto.randomBytes(length);
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += (bytes[i] % 10).toString();
  }
  return otp;
}

// ─── Store OTP (Redis preferred, memory fallback) ───────────────────────────
export async function storeOtp(email, otp) {
  const key = `otp:${email.toLowerCase()}`;
  const data = {
    otp,
    attempts: '0',
    createdAt: new Date().toISOString(),
  };

  const redis = await getRedis();
  if (redis) {
    await redis.hSet(key, data);
    await redis.expire(key, OTP_TTL_SECONDS);
  } else {
    memoryStore.set(key, {
      ...data,
      expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    });
  }
}

// ─── Check resend cooldown ──────────────────────────────────────────────────
export async function checkResendCooldown(email) {
  const key = `otp_cooldown:${email.toLowerCase()}`;

  const redis = await getRedis();
  if (redis) {
    const exists = await redis.exists(key);
    if (exists) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: ttl };
    }
    await redis.set(key, '1', { EX: RESEND_COOLDOWN_SECONDS });
    return { allowed: true };
  }

  // Memory fallback
  const entry = memoryStore.get(key);
  if (entry && Date.now() < entry.expiresAt) {
    const retryAfter = Math.ceil((entry.expiresAt - Date.now()) / 1000);
    return { allowed: false, retryAfter };
  }
  memoryStore.set(key, { expiresAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000 });
  return { allowed: true };
}

// ─── Verify OTP ─────────────────────────────────────────────────────────────
export async function verifyOtp(email, submittedOtp) {
  const key = `otp:${email.toLowerCase()}`;

  const redis = await getRedis();
  if (redis) {
    const exists = await redis.exists(key);
    if (!exists) {
      return { valid: false, message: 'Verification code not found or expired. Please request a new one.' };
    }

    const storedOtp = await redis.hGet(key, 'otp');
    const attempts = parseInt(await redis.hGet(key, 'attempts') || '0', 10);

    if (storedOtp === submittedOtp) {
      await redis.del(key);
      return { valid: true, message: 'Verified successfully.' };
    }

    const newAttempts = attempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      await redis.del(key);
      return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
    }

    await redis.hSet(key, 'attempts', newAttempts.toString());
    const remaining = MAX_ATTEMPTS - newAttempts;
    return { valid: false, message: `Invalid code. ${remaining} attempt(s) remaining.` };
  }

  // Memory fallback
  const entry = memoryStore.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return { valid: false, message: 'Verification code not found or expired. Please request a new one.' };
  }

  if (entry.otp === submittedOtp) {
    memoryStore.delete(key);
    return { valid: true, message: 'Verified successfully.' };
  }

  const attempts = parseInt(entry.attempts, 10) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    memoryStore.delete(key);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
  }

  entry.attempts = attempts.toString();
  const remaining = MAX_ATTEMPTS - attempts;
  return { valid: false, message: `Invalid code. ${remaining} attempt(s) remaining.` };
}

// ─── Store verified form data temporarily (for verify-otp to pick up) ───────
export async function storeFormData(email, formData) {
  const key = `form_data:${email.toLowerCase()}`;
  const redis = await getRedis();
  if (redis) {
    await redis.set(key, JSON.stringify(formData), { EX: OTP_TTL_SECONDS + 60 }); // OTP TTL + 1 min buffer
  } else {
    memoryStore.set(key, {
      data: formData,
      expiresAt: Date.now() + (OTP_TTL_SECONDS + 60) * 1000,
    });
  }
}

export async function getFormData(email) {
  const key = `form_data:${email.toLowerCase()}`;
  const redis = await getRedis();
  if (redis) {
    const raw = await redis.get(key);
    if (!raw) return null;
    await redis.del(key); // one-time use
    return JSON.parse(raw);
  }

  // Memory fallback
  const entry = memoryStore.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  memoryStore.delete(key);
  return entry.data;
}

// ─── Send OTP email via nodemailer ──────────────────────────────────────────
export async function sendOtpEmail(recipientEmail, otp) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP credentials not configured (SMTP_USER / SMTP_PASS).');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 520px; margin: 0 auto; padding: 24px; color: #333;">
  <h2 style="color: #64ffda; border-bottom: 1px solid #233554; padding-bottom: 12px;">
    Email Verification Code
  </h2>

  <p>To complete your contact form submission, please enter the verification code below:</p>

  <div style="background: #112240; border: 2px solid #64ffda; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
    <h1 style="color: #64ffda; margin: 0; font-size: 2.5em; letter-spacing: 0.3em; font-family: 'Fira Code', monospace;">${otp}</h1>
  </div>

  <p><strong>This code is valid for 5 minutes.</strong></p>
  <p style="color: #8892b0; font-size: 0.9em;">If you did not request this code, please ignore this email.</p>

  <hr style="border: none; border-top: 1px solid #233554; margin: 24px 0;">
  <p style="color: #8892b0; font-size: 0.8em;">l7feeders.dev — Contact Form Verification</p>
</body>
</html>`;

  await transporter.sendMail({
    from: `"l7feeders.dev" <${user}>`,
    to: recipientEmail,
    subject: 'Your Verification Code — l7feeders.dev',
    html,
  });
}
