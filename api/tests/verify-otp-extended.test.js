import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Mock otp.js ────────────────────────────────────────────────────────────
vi.mock('../lib/otp.js', () => ({
  verifyOtp: vi.fn(),
  getFormData: vi.fn(),
}));

vi.mock('../lib/kv-queue.js', () => ({
  enqueue: vi.fn(),
  isKVConfigured: vi.fn(),
}));

vi.mock('../lib/libredesk.js', () => ({
  sendToLibreDesk: vi.fn(),
}));

import { verifyOtp, getFormData } from '../lib/otp.js';
import { enqueue, isKVConfigured } from '../lib/kv-queue.js';
import { sendToLibreDesk } from '../lib/libredesk.js';
import handler from '../verify-otp.js';

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
describe('Verify OTP API Handler — Extended', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyOtp.mockResolvedValue({ valid: true, message: 'Verified' });
    getFormData.mockResolvedValue({ name: 'John', email: 'john@test.com', message: 'Hello' });
    isKVConfigured.mockResolvedValue(true);
    enqueue.mockResolvedValue('queue-id-123');
    sendToLibreDesk.mockResolvedValue({ data: { uuid: 'uuid-123' } });
  });

  // ── Input validation edge cases ────────────────────────────────────────
  describe('Input validation edge cases', () => {
    it('should reject when both email and otp are missing', async () => {
      const req = createMockReq('POST', {});
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and verification code are required.');
    });

    it('should reject empty string email', async () => {
      const req = createMockReq('POST', { email: '', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject empty string otp', async () => {
      const req = createMockReq('POST', { email: 'test@test.com', otp: '' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject null email', async () => {
      const req = createMockReq('POST', { email: null, otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject undefined otp', async () => {
      const req = createMockReq('POST', { email: 'test@test.com' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    it('should reject PUT method', async () => {
      const req = createMockReq('PUT', { email: 'a@b.com', otp: '1234567' });
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
  });

  // ── OTP verification result handling ───────────────────────────────────
  describe('OTP verification result handling', () => {
    it('should return 400 with remaining attempts message', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Invalid code. 1 attempt(s) remaining.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('1 attempt(s) remaining');
      expect(res.body.expired).toBe(false);
    });

    it('should set expired=true for "not found" message', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Verification code not found or expired.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
    });

    it('should set expired=true for "Too many" message', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Too many incorrect attempts.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
    });

    it('should set expired=false for generic invalid code', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Invalid code. 2 attempt(s) remaining.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '9999999' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.expired).toBe(false);
    });
  });

  // ── Form data retrieval edge cases ─────────────────────────────────────
  describe('Form data retrieval', () => {
    it('should return 410 when getFormData throws error', async () => {
      getFormData.mockRejectedValue(new Error('Redis connection lost'));
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      // getFormData error is caught, formData becomes undefined, returns 410
      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
      expect(res.body.error).toContain('Form data has expired');
    });

    it('should not attempt enqueue if form data is null', async () => {
      getFormData.mockResolvedValue(null);
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(enqueue).not.toHaveBeenCalled();
      expect(sendToLibreDesk).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(410);
    });
  });

  // ── LibreDesk integration after verification ──────────────────────────
  describe('Post-verification delivery', () => {
    it('should enqueue with correct form data', async () => {
      getFormData.mockResolvedValue({ name: 'Alice Smith', email: 'alice@test.com', message: 'Detailed message' });
      const req = createMockReq('POST', { email: 'alice@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(enqueue).toHaveBeenCalledWith({
        name: 'Alice Smith',
        email: 'alice@test.com',
        message: 'Detailed message',
      });
      expect(res.statusCode).toBe(200);
    });

    it('should send directly when KV is not configured', async () => {
      isKVConfigured.mockResolvedValue(false);
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(enqueue).not.toHaveBeenCalled();
      // Note: email comes from req.body, not formData
      expect(sendToLibreDesk).toHaveBeenCalledWith('John', 'test@test.com', 'Hello');
      expect(res.statusCode).toBe(200);
      expect(res.body.direct).toBe(true);
    });

    it('should try direct send when enqueue fails, and succeed', async () => {
      enqueue.mockRejectedValue(new Error('Queue full'));
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(sendToLibreDesk).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body.direct).toBe(true);
    });

    it('should return 500 when KV not configured AND direct send fails', async () => {
      isKVConfigured.mockResolvedValue(false);
      sendToLibreDesk.mockRejectedValue(new Error('LibreDesk API down'));
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toContain('Failed to send message');
    });
  });

  // ── CORS headers ──────────────────────────────────────────────────────
  describe('CORS headers are always set', () => {
    it('should set all CORS headers on success', async () => {
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.headers['Access-Control-Allow-Origin']).toBe('http://localhost:3005');
      expect(res.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(res.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    });

    it('should set CORS headers even on 400 error', async () => {
      const req = createMockReq('POST', {});
      const res = createMockRes();
      await handler(req, res);

      expect(res.headers['Access-Control-Allow-Origin']).toBe('http://localhost:3005');
    });

    it('should handle OPTIONS preflight', async () => {
      const req = createMockReq('OPTIONS');
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(200);
    });
  });

  // ── Full flow verification ─────────────────────────────────────────────
  describe('Full 2FA verification flow', () => {
    it('should verify OTP then retrieve form data then enqueue in order', async () => {
      const callOrder = [];
      verifyOtp.mockImplementation(async () => { callOrder.push('verify'); return { valid: true }; });
      getFormData.mockImplementation(async () => { callOrder.push('getForm'); return { name: 'A', email: 'a@b.com', message: 'Hi' }; });
      isKVConfigured.mockImplementation(async () => { callOrder.push('kvCheck'); return true; });
      enqueue.mockImplementation(async () => { callOrder.push('enqueue'); return 'q-1'; });

      const req = createMockReq('POST', { email: 'a@b.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(callOrder).toEqual(['verify', 'getForm', 'kvCheck', 'enqueue']);
      expect(res.statusCode).toBe(200);
    });

    it('should not retrieve form data if OTP verification fails', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Invalid code. 2 attempt(s) remaining.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(getFormData).not.toHaveBeenCalled();
      expect(enqueue).not.toHaveBeenCalled();
    });

    it('should not call LibreDesk if OTP verification throws', async () => {
      verifyOtp.mockRejectedValue(new Error('Connection error'));
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(getFormData).not.toHaveBeenCalled();
      expect(enqueue).not.toHaveBeenCalled();
      expect(sendToLibreDesk).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
    });
  });

  // ── Response shape ─────────────────────────────────────────────────────
  describe('Response shapes', () => {
    it('should return { success, queued } on queue success', async () => {
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toEqual({ success: true, queued: 'queue-id-123' });
    });

    it('should return { success, direct } on direct send', async () => {
      isKVConfigured.mockResolvedValue(false);
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toEqual({ success: true, direct: true });
    });

    it('should return { error, expired } on invalid OTP', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Invalid code. 2 attempt(s) remaining.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('expired', false);
    });

    it('should return { error, expired: true } on expired OTP', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'expired. Please request a new one.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.body.expired).toBe(true);
    });
  });
});
