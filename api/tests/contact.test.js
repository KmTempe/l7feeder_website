import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the kv-queue module
vi.mock('../lib/kv-queue.js', () => ({
  enqueue: vi.fn(),
  isKVConfigured: vi.fn(),
}));

// Mock the libredesk module
vi.mock('../lib/libredesk.js', () => ({
  sendToLibreDesk: vi.fn(),
}));

import { enqueue, isKVConfigured } from '../lib/kv-queue.js';
import { sendToLibreDesk } from '../lib/libredesk.js';
import handler from '../contact.js';

// Mock request/response objects
function createMockReq(method, body = {}) {
  return {
    method,
    body,
  };
}

function createMockRes() {
  const res = {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

describe('Contact API Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: KV is configured, enqueue works
    isKVConfigured.mockResolvedValue(true);
    enqueue.mockResolvedValue('test-queue-id-123');
    sendToLibreDesk.mockResolvedValue({ data: { uuid: 'test-uuid' } });
  });

  describe('CORS handling', () => {
    it('should set CORS headers', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();

      await handler(req, res);

      const expectedOrigin = process.env.VERCEL === '1'
        ? 'https://l7feeders.dev'
        : 'http://localhost:3005';
      expect(res.headers['Access-Control-Allow-Origin']).toBe(expectedOrigin);
      expect(res.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(res.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    });

    it('should handle OPTIONS preflight request', async () => {
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
      expect(res.body.error).toBe('Method not allowed');
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
      expect(res.body.error).toBe('All fields are required.');
    });

    it('should reject missing message', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'test@test.com' });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('All fields are required.');
    });

    it('should reject invalid email format', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'invalid-email', message: 'Hi' });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });

    it('should reject email without @', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'nodomain.com', message: 'Hi' });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });

    it('should reject email without domain', async () => {
      const req = createMockReq('POST', { name: 'Test', email: 'user@', message: 'Hi' });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });
  });

  describe('Queue integration', () => {
    it('should enqueue valid contact form submission', async () => {
      const req = createMockReq('POST', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message.'
      });
      const res = createMockRes();

      await handler(req, res);

      expect(enqueue).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message.',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.queued).toBe('test-queue-id-123');
    });

    it('should handle various valid email formats', async () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'user+tag@example.com',
        'user123@test.co.uk',
        'firstname.lastname@company.org',
      ];

      for (const email of validEmails) {
        vi.clearAllMocks();
        enqueue.mockResolvedValue('test-id');

        const req = createMockReq('POST', { name: 'Test', email, message: 'Hi' });
        const res = createMockRes();

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(enqueue).toHaveBeenCalled();
      }
    });

    it('should fallback to direct send if enqueue fails', async () => {
      enqueue.mockRejectedValue(new Error('Queue write error'));
      sendToLibreDesk.mockResolvedValue({ data: { uuid: 'direct-uuid' } });

      const req = createMockReq('POST', {
        name: 'Test',
        email: 'test@test.com',
        message: 'Hi'
      });
      const res = createMockRes();

      await handler(req, res);

      // Should succeed via direct send fallback
      expect(res.statusCode).toBe(200);
      expect(res.body.direct).toBe(true);
      expect(sendToLibreDesk).toHaveBeenCalledWith('Test', 'test@test.com', 'Hi');
    });

    it('should return 500 if both queue and direct send fail', async () => {
      enqueue.mockRejectedValue(new Error('Queue write error'));
      sendToLibreDesk.mockRejectedValue(new Error('LibreDesk error'));

      const req = createMockReq('POST', {
        name: 'Test',
        email: 'test@test.com',
        message: 'Hi'
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Failed to send message. Please try again later.');
    });
  });

  describe('Edge cases', () => {
    it('should accept empty string name (validation should fail)', async () => {
      const req = createMockReq('POST', { name: '', email: 'test@test.com', message: 'Hi' });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should reject messages exceeding max length', async () => {
      const longMessage = 'A'.repeat(5001);
      const req = createMockReq('POST', {
        name: 'Test',
        email: 'test@test.com',
        message: longMessage
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Field exceeds maximum length.');
    });

    it('should accept messages within max length', async () => {
      const message = 'A'.repeat(5000);
      const req = createMockReq('POST', {
        name: 'Test',
        email: 'test@test.com',
        message
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(enqueue).toHaveBeenCalled();
    });

    it('should handle special characters in name and message', async () => {
      const req = createMockReq('POST', {
        name: 'José García <script>alert("xss")</script>',
        email: 'jose@test.com',
        message: 'Message with <html> & "quotes" and émojis 🎉'
      });
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(enqueue).toHaveBeenCalled();
    });

    it('should reject unicode domain email addresses with stricter validation', async () => {
      const req = createMockReq('POST', {
        name: 'Test',
        email: 'user@例え.jp',
        message: 'Hi'
      });
      const res = createMockRes();

      await handler(req, res);

      // Stricter regex rejects non-ASCII domain names
      expect(res.statusCode).toBe(400);
    });
  });
});
