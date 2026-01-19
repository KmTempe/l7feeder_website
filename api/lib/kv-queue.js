// Queue operations using Redis (Upstash/Vercel)
// For local development, uses DEV_REDIS_URL (localhost)

import { createClient } from 'redis';

const isVercel = process.env.VERCEL === '1';

// Get the appropriate Redis URL based on environment
function getRedisUrl() {
  // In production (Vercel), use REDIS_URL
  if (isVercel) {
    return process.env.REDIS_URL;
  }
  // In development, prefer DEV_REDIS_URL, fallback to REDIS_URL
  return process.env.DEV_REDIS_URL || process.env.REDIS_URL;
}

// Check if Redis is configured
export function isKVConfigured() {
  return !!getRedisUrl();
}

// Redis client singleton
let redisClient = null;

async function getRedis() {
  if (redisClient && redisClient.isOpen) return redisClient;
  
  const redisUrl = getRedisUrl();
  if (redisUrl) {
    try {
      redisClient = createClient({ url: redisUrl });
      redisClient.on('error', (err) => console.error('Redis error:', err));
      await redisClient.connect();
      console.log(`Connected to Redis: ${isVercel ? 'production' : 'local dev'}`);
      return redisClient;
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      return null;
    }
  }
  return null;
}

const QUEUE_KEY = 'contact-queue';

// Get all items from queue
export async function getQueue() {
  const redis = await getRedis();
  
  if (redis) {
    try {
      const data = await redis.get(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Redis getQueue error:', err);
      return [];
    }
  }
  
  // Fallback to file queue for local dev
  const { getQueue: fileGetQueue } = await import('./queue.js');
  return fileGetQueue();
}

// Save queue
export async function saveQueue(queue) {
  const redis = await getRedis();
  
  if (redis) {
    try {
      await redis.set(QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (err) {
      console.error('Redis saveQueue error:', err);
      return false;
    }
  }
  
  // Fallback to file queue for local dev
  const { saveQueue: fileSaveQueue } = await import('./queue.js');
  return fileSaveQueue(queue);
}

// Add item to queue
export async function enqueue(item) {
  const queue = await getQueue();
  const queueItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...item,
    createdAt: new Date().toISOString(),
    attempts: 0,
    lastAttempt: null,
    status: 'pending',
  };
  queue.push(queueItem);
  await saveQueue(queue);
  return queueItem.id;
}

// Remove item from queue by id
export async function dequeue(id) {
  const queue = await getQueue();
  const filtered = queue.filter(item => item.id !== id);
  await saveQueue(filtered);
}

// Update item in queue
export async function updateQueueItem(id, updates) {
  const queue = await getQueue();
  const index = queue.findIndex(item => item.id === id);
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    await saveQueue(queue);
  }
}

// Get pending items ready for processing
export async function getPendingItems(maxItems = 50) {
  const queue = await getQueue();
  const now = Date.now();
  
  return queue
    .filter(item => {
      if (item.status === 'processing') return false;
      if (item.attempts >= 5) return false; // Max 5 retries (will retry over 2.5 days)
      return true;
    })
    .slice(0, maxItems);
}

// Mark item as processing
export async function markProcessing(id) {
  await updateQueueItem(id, { status: 'processing' });
}

// Mark item as failed
export async function markFailed(id, error) {
  const queue = await getQueue();
  const item = queue.find(i => i.id === id);
  if (item) {
    await updateQueueItem(id, {
      status: 'pending',
      attempts: item.attempts + 1,
      lastAttempt: new Date().toISOString(),
      lastError: error,
    });
  }
}
