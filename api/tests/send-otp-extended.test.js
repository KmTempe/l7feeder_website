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

// ─── Extended Tests ─────────────────────────────────────────────────────────
describe('Send OTP API Handler — Extended', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateOtp.mockReturnValue('1234567');
    storeOtp.mockResolvedValue();
    storeFormData.mockResolvedValue();
    checkResendCooldown.mockResolvedValue({ allowed: true });
    sendOtpEmail.mockResolvedValue();
  });

  // ── Input type validation ──────────────────────────────────────────────
  describe('Field type validation', () => {
    it('should reject non-string name (number)', async () => {
      const req = createMockReq('POST', { name: 42, email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid field types.');
    });

    it('should reject non-string email (object)', async () => {
      const req = createMockReq('POST', { name: 'Test', email: { addr: 'test@test.com' }, message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid field types.');
    });

    it('should reject non-string message (array)', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: ['Hello'] });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid field types.');
    });

    it('should reject boolean fields', async () => {
      const req = createMockReq('POST', { name: true, email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  // ── Whitespace and trimming ────────────────────────────────────────────
  describe('Whitespace handling', () => {
    it('should reject whitespace-only email', async () => {
      const req = createMockReq('POST', { name: 'Test', email: '   ', message: 'Hello' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject whitespace-only message', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: '   ' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should trim form data before storing', async () => {
      // Note: email with leading/trailing spaces fails the regex validation,
      // so we test trimming on name and message only
      const req = createMockReq('POST', {
        name: '  John  ',
        email: 'john@test.com',
        message: '  Hello world  ',
      });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(storeFormData).toHaveBeenCalledWith('john@test.com', {
        name: 'John',
        email: 'john@test.com',
        message: 'Hello world',
      });
    });

    it('should reject email with leading/trailing whitespace', async () => {
      const req = createMockReq('POST', {
        name: 'John',
        email: '  john@test.com  ',
        message: 'Hello',
      });
      const res = createMockRes();
      await handler(req, res);
      // Spaces in email fail the regex pattern
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });
  });

  // ── FormData storage failure ───────────────────────────────────────────
  describe('FormData storage failure', () => {
    it('should return 500 if storeFormData fails', async () => {
      storeFormData.mockRejectedValue(new Error('Redis write error'));
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      // storeFormData is called after storeOtp — both in same try/catch
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toContain('Failed to generate verification code');
    });
  });

  // ── Cooldown edge cases ────────────────────────────────────────────────
  describe('Cooldown edge cases', () => {
    it('should return 429 with correct retryAfter value', async () => {
      checkResendCooldown.mockResolvedValue({ allowed: false, retryAfter: 15 });
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(429);
      expect(res.body.retryAfter).toBe(15);
      expect(res.body.error).toContain('15 seconds');
    });

    it('should not call generateOtp when cooldown blocks', async () => {
      checkResendCooldown.mockResolvedValue({ allowed: false, retryAfter: 10 });
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(generateOtp).not.toHaveBeenCalled();
      expect(storeOtp).not.toHaveBeenCalled();
      expect(sendOtpEmail).not.toHaveBeenCalled();
    });
  });

  // ── Email format edge cases ────────────────────────────────────────────
  describe('Email format edge cases', () => {
    it('should reject email with spaces', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test @test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });

    it('should reject email with multiple @ signs', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'a@b@c.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should accept valid plus-addressed email', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'user+tag@example.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  // ── HTTP method edge cases ─────────────────────────────────────────────
  describe('HTTP method edge cases', () => {
    it('should reject PUT method', async () => {
      const req = createMockReq('PUT', { name: 'T', email: 't@t.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(405);
    });

    it('should reject DELETE method', async () => {
      const req = createMockReq('DELETE');
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(405);
    });

    it('should reject PATCH method', async () => {
      const req = createMockReq('PATCH');
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(405);
    });
  });

  // ── Full flow end-to-end validation ────────────────────────────────────
  describe('End-to-end OTP send flow', () => {
    it('should call all functions in correct order for valid request', async () => {
      const callOrder = [];
      checkResendCooldown.mockImplementation(async () => { callOrder.push('cooldown'); return { allowed: true }; });
      generateOtp.mockImplementation(() => { callOrder.push('generate'); return '7654321'; });
      storeOtp.mockImplementation(async () => { callOrder.push('storeOtp'); });
      storeFormData.mockImplementation(async () => { callOrder.push('storeForm'); });
      sendOtpEmail.mockImplementation(async () => { callOrder.push('sendEmail'); });

      const req = createMockReq('POST', { name: 'Alice', email: 'alice@test.com', message: 'Hey' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(callOrder).toEqual(['cooldown', 'generate', 'storeOtp', 'storeForm', 'sendEmail']);
    });

    it('should not send email if storeOtp fails', async () => {
      storeOtp.mockRejectedValue(new Error('Store failed'));
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(sendOtpEmail).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
    });

    it('should pass generated OTP to both storeOtp and sendOtpEmail', async () => {
      generateOtp.mockReturnValue('9999999');
      const req = createMockReq('POST', { name: 'Test', email: 'a@b.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(storeOtp).toHaveBeenCalledWith('a@b.com', '9999999');
      expect(sendOtpEmail).toHaveBeenCalledWith('a@b.com', '9999999');
    });
  });

  // ── Response shape validation ──────────────────────────────────────────
  describe('Response shape', () => {
    it('should return { success: true, message } on success', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    it('should return { error } string on 400', async () => {
      const req = createMockReq('POST', { name: '', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });

    it('should return { error, retryAfter } on 429', async () => {
      checkResendCooldown.mockResolvedValue({ allowed: false, retryAfter: 25 });
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('retryAfter', 25);
    });
  });
});
