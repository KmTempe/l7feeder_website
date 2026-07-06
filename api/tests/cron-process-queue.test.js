import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the kv-queue module
vi.mock('../lib/kv-queue.js', () => ({
  getQueue: vi.fn(),
  getPendingItems: vi.fn(),
  markProcessing: vi.fn(),
  markFailed: vi.fn(),
  dequeue: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

import { getQueue, getPendingItems, markProcessing, markFailed, dequeue } from '../lib/kv-queue.js';
import handler from '../cron/process-queue.js';

function createMockReq(authHeader = null) {
  return {
    headers: {
      authorization: authHeader,
    },
  };
}

function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('Cron Process Queue Handler', () => {
  const CRON_SECRET = 'test-cron-secret';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = CRON_SECRET;
    process.env.LIBREDESK_API_URL = 'https://test.libredesk.com/api/v1';
    process.env.LIBREDESK_API_KEY = 'test-key';
    process.env.LIBREDESK_API_SECRET = 'test-secret';
    process.env.LIBREDESK_INBOX_ID = '1';
    process.env.LIBREDESK_AGENT_ID = '40';
    process.env.LIBREDESK_TEAM_ID = '1';
    process.env.LIBREDESK_PRIORITY = 'Low';
    process.env.LIBREDESK_TAGS = 'l7f';

    getQueue.mockResolvedValue([]);
    getPendingItems.mockResolvedValue([]);
    markProcessing.mockResolvedValue();
    markFailed.mockResolvedValue();
    dequeue.mockResolvedValue();
  });

  describe('Authentication', () => {
    it('should reject requests without valid auth', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should reject when CRON_SECRET is not set', async () => {
      delete process.env.CRON_SECRET;
      const req = createMockReq(`Bearer some-secret`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should reject requests with invalid auth header', async () => {
      const req = createMockReq('Bearer wrong-secret');
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should accept requests with valid cron secret', async () => {
      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('Empty Queue', () => {
    it('should return success when queue is empty', async () => {
      getQueue.mockResolvedValue([]);

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Queue empty');
      expect(res.body.processed).toBe(0);
    });
  });

  describe('Queue Processing', () => {
    it('should process pending items', async () => {
      const mockItem = {
        id: 'test-123',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello',
        attempts: 0,
      };

      getQueue.mockResolvedValue([mockItem]);
      getPendingItems.mockResolvedValue([mockItem]);

      // Mock successful API responses
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { uuid: 'conv-uuid-123' } }),
        })
        .mockResolvedValueOnce({ ok: true }) // priority
        .mockResolvedValueOnce({ ok: true }); // tags

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.successful).toBe(1);
      expect(res.body.failed).toBe(0);
      expect(dequeue).toHaveBeenCalledWith('test-123');
    });

    it('should handle failed API calls', async () => {
      const mockItem = {
        id: 'test-456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hi',
        attempts: 0,
      };

      getQueue.mockResolvedValue([mockItem]);
      getPendingItems.mockResolvedValue([mockItem]);

      // Mock failed API response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.successful).toBe(0);
      expect(res.body.failed).toBe(1);
      expect(markFailed).toHaveBeenCalled();
      expect(dequeue).not.toHaveBeenCalled();
    });

    it('should reject malformed queue items before calling LibreDesk', async () => {
      const mockItem = {
        id: 'test-invalid',
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: ['not a string'],
        attempts: 0,
      };

      getQueue.mockResolvedValue([mockItem]);
      getPendingItems.mockResolvedValue([mockItem]);

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.successful).toBe(0);
      expect(res.body.failed).toBe(1);
      expect(markFailed).toHaveBeenCalledWith('test-invalid', 'Invalid field types.');
      expect(global.fetch).not.toHaveBeenCalled();
      expect(dequeue).not.toHaveBeenCalled();
    });

    it('should reject queue items with invalid email before calling LibreDesk', async () => {
      const mockItem = {
        id: 'test-invalid-email',
        name: 'Jane Doe',
        email: 'not-an-email',
        message: 'Hi',
        attempts: 0,
      };

      getQueue.mockResolvedValue([mockItem]);
      getPendingItems.mockResolvedValue([mockItem]);

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.successful).toBe(0);
      expect(res.body.failed).toBe(1);
      expect(markFailed).toHaveBeenCalledWith('test-invalid-email', 'Invalid email address.');
      expect(global.fetch).not.toHaveBeenCalled();
      expect(dequeue).not.toHaveBeenCalled();
    });

    it('should process multiple items', async () => {
      const mockItems = [
        { id: '1', name: 'User 1', email: 'u1@test.com', message: 'Msg 1', attempts: 0 },
        { id: '2', name: 'User 2', email: 'u2@test.com', message: 'Msg 2', attempts: 0 },
        { id: '3', name: 'User 3', email: 'u3@test.com', message: 'Msg 3', attempts: 0 },
      ];

      getQueue.mockResolvedValue(mockItems);
      getPendingItems.mockResolvedValue(mockItems);

      // Mock all successful
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { uuid: 'conv-uuid' } }),
      });

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.processed).toBe(3);
      expect(res.body.successful).toBe(3);
      expect(dequeue).toHaveBeenCalledTimes(3);
    });
  });

  describe('Configuration Validation', () => {
    it('should return error if LibreDesk not configured', async () => {
      delete process.env.LIBREDESK_API_URL;

      const req = createMockReq(`Bearer ${CRON_SECRET}`);
      const res = createMockRes();

      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('LibreDesk not configured');
    });
  });
});
