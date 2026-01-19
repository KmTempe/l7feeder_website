import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, '../../data/contact-queue.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(QUEUE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read queue from file
export function getQueue() {
  ensureDataDir();
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      const data = fs.readFileSync(QUEUE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading queue:', err);
  }
  return [];
}

// Save queue to file
export function saveQueue(queue) {
  ensureDataDir();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// Add item to queue
export function enqueue(item) {
  const queue = getQueue();
  const queueItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...item,
    createdAt: new Date().toISOString(),
    attempts: 0,
    lastAttempt: null,
    status: 'pending', // pending, processing, failed
  };
  queue.push(queueItem);
  saveQueue(queue);
  return queueItem.id;
}

// Remove item from queue by id
export function dequeue(id) {
  const queue = getQueue();
  const filtered = queue.filter(item => item.id !== id);
  saveQueue(filtered);
}

// Update item in queue
export function updateQueueItem(id, updates) {
  const queue = getQueue();
  const index = queue.findIndex(item => item.id === id);
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    saveQueue(queue);
  }
}

// Get pending items (not processed recently, with backoff)
export function getPendingItems(maxItems = 10) {
  const queue = getQueue();
  const now = Date.now();
  
  return queue
    .filter(item => {
      if (item.status === 'processing') return false;
      if (item.attempts >= 10) return false; // Max 10 retries
      
      // Exponential backoff: wait 2^attempts * 30 seconds
      if (item.lastAttempt) {
        const backoffMs = Math.pow(2, item.attempts) * 30000;
        const nextAttempt = new Date(item.lastAttempt).getTime() + backoffMs;
        if (now < nextAttempt) return false;
      }
      
      return true;
    })
    .slice(0, maxItems);
}

// Mark item as processing
export function markProcessing(id) {
  updateQueueItem(id, { status: 'processing' });
}

// Mark item as failed (for retry)
export function markFailed(id, error) {
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
