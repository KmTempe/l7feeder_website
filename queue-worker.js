import { getPendingItems, markProcessing, markFailed, dequeue, getQueue } from './api/lib/kv-queue.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const LIBREDESK_API_URL = process.env.LIBREDESK_API_URL;
const LIBREDESK_API_KEY = process.env.LIBREDESK_API_KEY;
const LIBREDESK_API_SECRET = process.env.LIBREDESK_API_SECRET;
const LIBREDESK_INBOX_ID = process.env.LIBREDESK_INBOX_ID;
const LIBREDESK_AGENT_ID = process.env.LIBREDESK_AGENT_ID;
const LIBREDESK_TEAM_ID = process.env.LIBREDESK_TEAM_ID;
const LIBREDESK_PRIORITY = process.env.LIBREDESK_PRIORITY;
const LIBREDESK_TAGS = process.env.LIBREDESK_TAGS;

// Build Basic Auth header (base64 encoded api_key:api_secret)
function getAuthHeader() {
  const credentials = `${LIBREDESK_API_KEY}:${LIBREDESK_API_SECRET}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
}

// Check if LibreDesk is available using /health endpoint
async function isLibredeskAvailable() {
  if (!LIBREDESK_API_URL || !LIBREDESK_API_KEY || !LIBREDESK_API_SECRET) {
    return false;
  }

  try {
    // Extract base URL (remove /api/v1 suffix)
    const baseUrl = LIBREDESK_API_URL.replace(/\/api\/v1\/?$/, '');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Create conversation (LibreDesk auto-creates contact from contact_email)
async function createConversation(name, email, message) {
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || name;
  const lastName = nameParts.slice(1).join(' ') || '';

  // Step 1: Create the conversation
  const res = await fetch(`${LIBREDESK_API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inbox_id: parseInt(LIBREDESK_INBOX_ID, 10),
      subject: `[Contact Form] New message from ${name}`,
      content: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      contact_email: email,
      first_name: firstName,
      last_name: lastName,
      initiator: 'contact',
      agent_id: LIBREDESK_AGENT_ID ? parseInt(LIBREDESK_AGENT_ID, 10) : null,
      team_id: LIBREDESK_TEAM_ID ? parseInt(LIBREDESK_TEAM_ID, 10) : null,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create conversation: ${res.status} - ${errText}`);
  }

  const result = await res.json();
  const conversationId = result.data?.uuid || result.data?.id;
  console.log('Created conversation:', conversationId, 'Full response:', JSON.stringify(result.data));

  // Step 2: Update priority via separate endpoint
  if (conversationId && LIBREDESK_PRIORITY) {
    const priorityRes = await fetch(`${LIBREDESK_API_URL}/conversations/${conversationId}/priority`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priority: LIBREDESK_PRIORITY }),
    });

    if (!priorityRes.ok) {
      const errBody = await priorityRes.text();
      console.warn(`Warning: Could not update priority: ${priorityRes.status} - ${errBody}`);
    } else {
      console.log('Priority set successfully');
    }
  }

  // Step 3: Update tags via separate endpoint
  if (conversationId && LIBREDESK_TAGS) {
    const tagNames = LIBREDESK_TAGS.split(',').map(t => t.trim());
    const tagsRes = await fetch(`${LIBREDESK_API_URL}/conversations/${conversationId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: tagNames }),
    });

    if (!tagsRes.ok) {
      const errBody = await tagsRes.text();
      console.warn(`Warning: Could not update tags: ${tagsRes.status} - ${errBody}`);
    } else {
      console.log('Tags set successfully');
    }
  }

  return result;
}

// Process single item
async function processItem(item) {
  console.log(`Processing: ${item.id} (attempt ${item.attempts + 1})`);
  await markProcessing(item.id);

  try {
    await createConversation(item.name, item.email, item.message);
    await dequeue(item.id);
    console.log(`✓ Success: ${item.id}`);
    return true;
  } catch (err) {
    console.error(`✗ Failed: ${item.id} - ${err.message}`);
    await markFailed(item.id, err.message);
    return false;
  }
}

// Main worker loop
async function runWorker() {
  console.log('\n=== Queue Worker Started ===');
  console.log(`LibreDesk URL: ${LIBREDESK_API_URL || 'NOT SET'}`);
  console.log(`Inbox ID: ${LIBREDESK_INBOX_ID || 'NOT SET'}`);

  const POLL_INTERVAL = 30000; // 30 seconds

  while (true) {
    try {
      const queue = await getQueue();
      console.log(`\n[${new Date().toISOString()}] Queue size: ${queue.length}`);

      if (queue.length === 0) {
        console.log('Queue empty, waiting...');
        await sleep(POLL_INTERVAL);
        continue;
      }

      // Check LibreDesk availability
      const available = await isLibredeskAvailable();
      if (!available) {
        console.log('LibreDesk not available, waiting...');
        await sleep(POLL_INTERVAL);
        continue;
      }

      console.log('LibreDesk available, processing queue...');

      // Get pending items
      const pending = await getPendingItems(5);
      if (pending.length === 0) {
        console.log('No items ready for processing (backoff)');
        await sleep(POLL_INTERVAL);
        continue;
      }

      // Process each item
      for (const item of pending) {
        await processItem(item);
        await sleep(1000); // Small delay between items
      }

    } catch (err) {
      console.error('Worker error:', err);
    }

    await sleep(POLL_INTERVAL);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the worker
runWorker().catch(console.error);
