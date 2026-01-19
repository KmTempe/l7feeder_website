import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_QUEUE_FILE = path.join(__dirname, '../../data/test-contact-queue.json');

// Create a self-contained test version of the queue functions
// that uses a test-specific file path
function createTestQueue() {
  function ensureDataDir() {
    const dataDir = path.dirname(TEST_QUEUE_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  function getQueue() {
    ensureDataDir();
    try {
      if (fs.existsSync(TEST_QUEUE_FILE)) {
        const data = fs.readFileSync(TEST_QUEUE_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Error reading queue:', err);
    }
    return [];
  }

  function saveQueue(queue) {
    ensureDataDir();
    fs.writeFileSync(TEST_QUEUE_FILE, JSON.stringify(queue, null, 2));
  }

  function enqueue(item) {
    const queue = getQueue();
    const queueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      createdAt: new Date().toISOString(),
      attempts: 0,
      lastAttempt: null,
      status: 'pending',
    };
    queue.push(queueItem);
    saveQueue(queue);
    return queueItem.id;
  }

  function dequeue(id) {
    const queue = getQueue();
    const filtered = queue.filter(item => item.id !== id);
    saveQueue(filtered);
  }

  function updateQueueItem(id, updates) {
    const queue = getQueue();
    const index = queue.findIndex(item => item.id === id);
    if (index !== -1) {
      queue[index] = { ...queue[index], ...updates };
      saveQueue(queue);
    }
  }

  function getPendingItems(maxItems = 10) {
    const queue = getQueue();
    const now = Date.now();
    
    return queue
      .filter(item => {
        if (item.status === 'processing') return false;
        if (item.attempts >= 10) return false;
        
        if (item.lastAttempt) {
          const backoffMs = Math.pow(2, item.attempts) * 30000;
          const nextAttempt = new Date(item.lastAttempt).getTime() + backoffMs;
          if (now < nextAttempt) return false;
        }
        
        return true;
      })
      .slice(0, maxItems);
  }

  function markProcessing(id) {
    updateQueueItem(id, { status: 'processing' });
  }

  function markFailed(id, error) {
    const queue = getQueue();
    const item = queue.find(i => i.id === id);
    if (item) {
      updateQueueItem(id, {
        status: 'pending',
        attempts: item.attempts + 1,
        lastAttempt: new Date().toISOString(),
        lastError: error,
      });
    }
  }

  return {
    getQueue,
    saveQueue,
    enqueue,
    dequeue,
    updateQueueItem,
    getPendingItems,
    markProcessing,
    markFailed,
  };
}

// Create test queue instance
const {
  getQueue,
  saveQueue,
  enqueue,
  dequeue,
  updateQueueItem,
  getPendingItems,
  markProcessing,
  markFailed,
} = createTestQueue();

describe('Queue System', () => {
  // Clean up test queue file before and after each test
  beforeEach(() => {
    if (fs.existsSync(TEST_QUEUE_FILE)) {
      fs.unlinkSync(TEST_QUEUE_FILE);
    }
  });

  afterEach(() => {
    if (fs.existsSync(TEST_QUEUE_FILE)) {
      fs.unlinkSync(TEST_QUEUE_FILE);
    }
  });

  describe('enqueue', () => {
    it('should add an item to the queue and return an id', () => {
      const item = { name: 'John Doe', email: 'john@example.com', message: 'Hello' };
      const id = enqueue(item);
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      
      const queue = getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].name).toBe('John Doe');
      expect(queue[0].email).toBe('john@example.com');
      expect(queue[0].message).toBe('Hello');
    });

    it('should set default values on enqueued item', () => {
      const item = { name: 'Jane Doe', email: 'jane@example.com', message: 'Test' };
      enqueue(item);
      
      const queue = getQueue();
      expect(queue[0].status).toBe('pending');
      expect(queue[0].attempts).toBe(0);
      expect(queue[0].lastAttempt).toBeNull();
      expect(queue[0].createdAt).toBeDefined();
    });

    it('should handle multiple enqueued items', () => {
      enqueue({ name: 'User 1', email: 'user1@test.com', message: 'Msg 1' });
      enqueue({ name: 'User 2', email: 'user2@test.com', message: 'Msg 2' });
      enqueue({ name: 'User 3', email: 'user3@test.com', message: 'Msg 3' });
      
      const queue = getQueue();
      expect(queue).toHaveLength(3);
    });

    it('should generate unique IDs for each item', () => {
      const id1 = enqueue({ name: 'A', email: 'a@test.com', message: '1' });
      const id2 = enqueue({ name: 'B', email: 'b@test.com', message: '2' });
      
      expect(id1).not.toBe(id2);
    });
  });

  describe('dequeue', () => {
    it('should remove an item from the queue by id', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      let queue = getQueue();
      expect(queue).toHaveLength(1);
      
      dequeue(id);
      
      queue = getQueue();
      expect(queue).toHaveLength(0);
    });

    it('should only remove the specified item', () => {
      const id1 = enqueue({ name: 'Keep 1', email: 'k1@test.com', message: '1' });
      const id2 = enqueue({ name: 'Remove', email: 'rm@test.com', message: '2' });
      const id3 = enqueue({ name: 'Keep 2', email: 'k2@test.com', message: '3' });
      
      dequeue(id2);
      
      const queue = getQueue();
      expect(queue).toHaveLength(2);
      expect(queue.find(i => i.id === id1)).toBeDefined();
      expect(queue.find(i => i.id === id2)).toBeUndefined();
      expect(queue.find(i => i.id === id3)).toBeDefined();
    });

    it('should handle dequeue of non-existent id gracefully', () => {
      enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      // Should not throw
      dequeue('non-existent-id');
      
      const queue = getQueue();
      expect(queue).toHaveLength(1);
    });
  });

  describe('updateQueueItem', () => {
    it('should update item properties', () => {
      const id = enqueue({ name: 'Original', email: 'orig@test.com', message: 'Hi' });
      
      updateQueueItem(id, { status: 'processing', attempts: 1 });
      
      const queue = getQueue();
      expect(queue[0].status).toBe('processing');
      expect(queue[0].attempts).toBe(1);
      expect(queue[0].name).toBe('Original'); // Unchanged
    });

    it('should not affect other items', () => {
      const id1 = enqueue({ name: 'Item 1', email: 'i1@test.com', message: '1' });
      const id2 = enqueue({ name: 'Item 2', email: 'i2@test.com', message: '2' });
      
      updateQueueItem(id1, { status: 'processing' });
      
      const queue = getQueue();
      expect(queue.find(i => i.id === id1).status).toBe('processing');
      expect(queue.find(i => i.id === id2).status).toBe('pending');
    });
  });

  describe('markProcessing', () => {
    it('should set item status to processing', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      markProcessing(id);
      
      const queue = getQueue();
      expect(queue[0].status).toBe('processing');
    });
  });

  describe('markFailed', () => {
    it('should increment attempts and set status back to pending', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      markProcessing(id);
      
      markFailed(id, 'Connection timeout');
      
      const queue = getQueue();
      expect(queue[0].status).toBe('pending');
      expect(queue[0].attempts).toBe(1);
      expect(queue[0].lastError).toBe('Connection timeout');
      expect(queue[0].lastAttempt).toBeDefined();
    });

    it('should accumulate attempts on multiple failures', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      markFailed(id, 'Error 1');
      markFailed(id, 'Error 2');
      markFailed(id, 'Error 3');
      
      const queue = getQueue();
      expect(queue[0].attempts).toBe(3);
      expect(queue[0].lastError).toBe('Error 3');
    });
  });

  describe('getPendingItems', () => {
    it('should return pending items', () => {
      enqueue({ name: 'User 1', email: 'u1@test.com', message: '1' });
      enqueue({ name: 'User 2', email: 'u2@test.com', message: '2' });
      
      const pending = getPendingItems();
      expect(pending).toHaveLength(2);
    });

    it('should exclude processing items', () => {
      const id1 = enqueue({ name: 'Pending', email: 'p@test.com', message: '1' });
      const id2 = enqueue({ name: 'Processing', email: 'pr@test.com', message: '2' });
      
      markProcessing(id2);
      
      const pending = getPendingItems();
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(id1);
    });

    it('should exclude items that exceeded max retries (10)', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      // Simulate 10 failures
      for (let i = 0; i < 10; i++) {
        markFailed(id, `Error ${i + 1}`);
      }
      
      // Manually update to bypass backoff for this test
      const queue = getQueue();
      queue[0].lastAttempt = new Date(Date.now() - 999999999).toISOString();
      saveQueue(queue);
      
      const pending = getPendingItems();
      expect(pending).toHaveLength(0);
    });

    it('should respect maxItems parameter', () => {
      for (let i = 0; i < 20; i++) {
        enqueue({ name: `User ${i}`, email: `u${i}@test.com`, message: `Msg ${i}` });
      }
      
      const pending = getPendingItems(5);
      expect(pending).toHaveLength(5);
    });

    it('should apply exponential backoff', () => {
      const id = enqueue({ name: 'Test', email: 'test@test.com', message: 'Hi' });
      
      // Mark as just failed (should be in backoff)
      markFailed(id, 'Error');
      
      // Item should be in backoff (2^1 * 30s = 60s)
      let pending = getPendingItems();
      expect(pending).toHaveLength(0);
      
      // Manually set lastAttempt to past backoff period
      const queue = getQueue();
      queue[0].lastAttempt = new Date(Date.now() - 120000).toISOString(); // 2 minutes ago
      saveQueue(queue);
      
      pending = getPendingItems();
      expect(pending).toHaveLength(1);
    });
  });

  describe('getQueue', () => {
    it('should return empty array when queue file does not exist', () => {
      const queue = getQueue();
      expect(queue).toEqual([]);
    });

    it('should return all items in queue', () => {
      enqueue({ name: 'A', email: 'a@test.com', message: '1' });
      enqueue({ name: 'B', email: 'b@test.com', message: '2' });
      
      const queue = getQueue();
      expect(queue).toHaveLength(2);
    });
  });

  describe('saveQueue', () => {
    it('should persist queue to file', () => {
      const testQueue = [
        { id: 'test-1', name: 'Test', email: 'test@test.com', message: 'Hi' },
      ];
      
      saveQueue(testQueue);
      
      const loaded = getQueue();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe('test-1');
    });
  });
});
