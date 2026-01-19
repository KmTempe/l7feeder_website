/**
 * Local script to process the contact queue
 * Run with: node scripts/process-queue.js
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'redis';
import { sendToLibreDesk } from '../api/lib/libredesk.js';

const QUEUE_KEY = 'contact-queue';

// Use DEV_REDIS_URL for local, fallback to REDIS_URL
const redisUrl = process.env.DEV_REDIS_URL || process.env.REDIS_URL;

async function getRedis() {
  const client = createClient({ url: redisUrl });
  await client.connect();
  return client;
}

async function processQueue() {
  console.log('🔄 Processing contact queue...\n');
  console.log(`Using Redis: ${redisUrl.includes('localhost') ? 'local' : 'cloud'}\n`);
  
  const redis = await getRedis();
  
  try {
    // Get queue (stored as JSON string, not list)
    const data = await redis.get(QUEUE_KEY);
    const queue = data ? JSON.parse(data) : [];
    
    if (queue.length === 0) {
      console.log('📭 Queue is empty');
      return;
    }
    
    console.log(`📬 Found ${queue.length} item(s) in queue\n`);
    
    let processed = 0;
    let failed = 0;
    const remainingItems = [];
    
    for (const item of queue) {
      console.log(`Processing: ${item.name} <${item.email}>`);
      
      try {
        const result = await sendToLibreDesk(item.name, item.email, item.message);
        console.log(`  ✅ Created conversation #${result.data?.id || result.data?.uuid}\n`);
        processed++;
        
      } catch (err) {
        console.log(`  ❌ Failed: ${err.message}\n`);
        failed++;
        // Keep failed items in queue for retry (max 3 attempts)
        const attempts = (item.attempts || 0) + 1;
        if (attempts < 3) {
          remainingItems.push({ ...item, attempts });
        } else {
          console.log(`    (Dropped after ${attempts} attempts)\n`);
        }
      }
    }
    
    // Update queue with remaining (failed) items only
    await redis.set(QUEUE_KEY, JSON.stringify(remainingItems));
    
    console.log(`\n📊 Summary: ${processed} processed, ${failed} failed`);
    if (remainingItems.length > 0) {
      console.log(`   ${remainingItems.length} item(s) will be retried`);
    }
    
  } finally {
    await redis.disconnect();
  }
}

processQueue().catch(console.error);
