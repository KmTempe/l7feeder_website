import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Mock otp.js ────────────────────────────────────────────────────────────
vi.mock('../lib/otp.js', () => ({
  verifyOtp: vi.fn(),
  getFormData: vi.fn(),
}));

// ─── Mock kv-queue & libredesk (same mocks as contact.test.js) ──────────────
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

// ─── Tests ──────────────────────────────────────────────────────────────────
describe('Verify OTP API Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyOtp.mockResolvedValue({ valid: true, message: 'Verified' });
    getFormData.mockResolvedValue({ name: 'John', email: 'john@test.com', message: 'Hello' });
    isKVConfigured.mockResolvedValue(true);
    enqueue.mockResolvedValue('queue-id-123');
    sendToLibreDesk.mockResolvedValue({ data: { uuid: 'uuid-123' } });
  });

  describe('CORS handling', () => {
    it('should set CORS headers', async () => {
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
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

    it('should reject missing email', async () => {
      const req = createMockReq('POST', { otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and verification code are required.');
    });

    it('should reject missing otp', async () => {
      const req = createMockReq('POST', { email: 'test@test.com' });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('OTP verification', () => {
    it('should verify and enqueue valid OTP', async () => {
      const req = createMockReq('POST', { email: 'john@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(verifyOtp).toHaveBeenCalledWith('john@test.com', '1234567');
      expect(getFormData).toHaveBeenCalledWith('john@test.com');
      expect(enqueue).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com',
        message: 'Hello',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.queued).toBe('queue-id-123');
    });

    it('should fallback to direct LibreDesk send if queue fails', async () => {
      enqueue.mockRejectedValue(new Error('Queue error'));
      const req = createMockReq('POST', { email: 'john@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(sendToLibreDesk).toHaveBeenCalledWith('John', 'john@test.com', 'Hello');
      expect(res.statusCode).toBe(200);
      expect(res.body.direct).toBe(true);
    });

    it('should fallback to direct LibreDesk send if KV not configured', async () => {
      isKVConfigured.mockResolvedValue(false);
      const req = createMockReq('POST', { email: 'john@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(sendToLibreDesk).toHaveBeenCalledWith('John', 'john@test.com', 'Hello');
      expect(res.statusCode).toBe(200);
      expect(res.body.direct).toBe(true);
    });

    it('should return 500 if both queue and direct send fail', async () => {
      enqueue.mockRejectedValue(new Error('Queue error'));
      sendToLibreDesk.mockRejectedValue(new Error('API error'));
      const req = createMockReq('POST', { email: 'john@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(500);
    });

    it('should return 400 for invalid OTP code', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Invalid code. 2 attempt(s) remaining.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Invalid code');
      expect(res.body.expired).toBe(false);
    });

    it('should return 410 for expired OTP', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Verification code not found or expired. Please request a new one.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
    });

    it('should return 410 for too many attempts', async () => {
      verifyOtp.mockResolvedValue({ valid: false, message: 'Too many incorrect attempts. Please request a new code.' });
      const req = createMockReq('POST', { email: 'test@test.com', otp: '0000000' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
    });

    it('should return 410 if form data has expired', async () => {
      getFormData.mockResolvedValue(null);
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(410);
      expect(res.body.expired).toBe(true);
    });

    it('should return 500 if verifyOtp throws', async () => {
      verifyOtp.mockRejectedValue(new Error('Redis down'));
      const req = createMockReq('POST', { email: 'test@test.com', otp: '1234567' });
      const res = createMockRes();
      await handler(req, res);

      expect(res.statusCode).toBe(500);
    });
  });
});
