import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Mock otp.js ────────────────────────────────────────────────────────────
vi.mock('../lib/otp.js', () => ({
  generateOtp: vi.fn(),
  storeOtp: vi.fn(),
  storeFormData: vi.fn(),
  checkResendCooldown: vi.fn(),
  sendOtpEmail: vi.fn(),
}));

import {
  generateOtp,
  storeOtp,
  storeFormData,
  checkResendCooldown,
  sendOtpEmail,
} from '../lib/otp.js';
import handler from '../send-otp.js';

// ─── Helpers ────────────────────────────────────────────────────────────────
function createMockReq(method, body = {}) {
  return { method, body };
}

function createMockRes() {
  const res = {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { return this; },
  };
  return res;
}

// ─── Tests ──────────────────────────────────────────────────────────────────
describe('Send OTP API Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateOtp.mockReturnValue('1234567');
    storeOtp.mockResolvedValue();
    storeFormData.mockResolvedValue();
    checkResendCooldown.mockResolvedValue({ allowed: true });
    sendOtpEmail.mockResolvedValue();
  });

  describe('CORS handling', () => {
    it('should set CORS headers', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.headers['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should handle OPTIONS preflight', async () => {
      const req = createMockReq('OPTIONS');
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Request validation', () => {
    it('should reject non-POST methods', async () => {
      const req = createMockReq('GET');
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(405);
    });

    it('should reject missing name', async () => {
      const req = createMockReq('POST', { email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('All fields are required.');
    });

    it('should reject missing email', async () => {
      const req = createMockReq('POST', { name: 'Test', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject missing message', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject empty strings', async () => {
      const req = createMockReq('POST', { name: '   ', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject invalid email format', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'not-an-email', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });
  });

  describe('OTP flow', () => {
    it('should generate OTP and send email on valid request', async () => {
      const req = createMockReq('POST', { name: 'John', email: 'john@test.com', message: 'Hello' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(generateOtp).toHaveBeenCalled();
      expect(storeOtp).toHaveBeenCalledWith('john@test.com', '1234567');
      expect(storeFormData).toHaveBeenCalledWith('john@test.com', {
        name: 'John',
        email: 'john@test.com',
        message: 'Hello',
      });
      expect(sendOtpEmail).toHaveBeenCalledWith('john@test.com', '1234567');
    });

    it('should return 429 when cooldown is active', async () => {
      checkResendCooldown.mockResolvedValue({ allowed: false, retryAfter: 20 });
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(429);
      expect(res.body.retryAfter).toBe(20);
    });

    it('should return 500 if OTP storage fails', async () => {
      storeOtp.mockRejectedValue(new Error('Redis down'));
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(500);
    });

    it('should return 500 if email sending fails', async () => {
      sendOtpEmail.mockRejectedValue(new Error('SMTP error'));
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(500);
    });

    it('should still proceed if cooldown check fails', async () => {
      checkResendCooldown.mockRejectedValue(new Error('Redis down'));
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      // Should still succeed — cooldown failure is non-blocking
      expect(res.statusCode).toBe(200);
    });
  });
});
