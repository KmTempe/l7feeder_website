import { getPendingItems, markProcessing, markFailed, dequeue } from './lib/queue.js';

const LIBREDESK_API_URL = process.env.LIBREDESK_API_URL; // e.g., https://your-libredesk.com/api/v1
const LIBREDESK_API_KEY = process.env.LIBREDESK_API_KEY;
const LIBREDESK_API_SECRET = process.env.LIBREDESK_API_SECRET;
const LIBREDESK_INBOX_ID = process.env.LIBREDESK_INBOX_ID;
const LIBREDESK_AGENT_ID = process.env.LIBREDESK_AGENT_ID;
const LIBREDESK_TEAM_ID = process.env.LIBREDESK_TEAM_ID;
const LIBREDESK_PRIORITY = process.env.LIBREDESK_PRIORITY || 'low';
const LIBREDESK_TAG = process.env.LIBREDESK_TAG || 'l7f';

// Build Basic Auth header (base64 encoded api_key:api_secret)
function getAuthHeader() {
  const credentials = `${LIBREDESK_API_KEY}:${LIBREDESK_API_SECRET}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
}

// Check if LibreDesk is available using /health endpoint
async function isLibredeskAvailable() {
  if (!LIBREDESK_API_URL || !LIBREDESK_API_KEY || !LIBREDESK_API_SECRET) {
    console.log('LibreDesk not configured');
    return false;
  }
  
  try {
    // Extract base URL (remove /api/v1 suffix)
    const baseUrl = LIBREDESK_API_URL.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
      },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return res.ok;
  } catch (err) {
    console.log('LibreDesk not available:', err.message);
    return false;
  }
}

// Create conversation in LibreDesk (this also creates contact if needed)
async function createConversation(subject, message, email, name) {
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || name;
  const lastName = nameParts.slice(1).join(' ') || '';

  const res = await fetch(`${LIBREDESK_API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inbox_id: parseInt(LIBREDESK_INBOX_ID, 10),
      subject: subject,
      content: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      contact_email: email,
      first_name: firstName,
      last_name: lastName,
      initiator: 'contact',
      agent_id: LIBREDESK_AGENT_ID ? parseInt(LIBREDESK_AGENT_ID, 10) : null,
      team_id: LIBREDESK_TEAM_ID ? parseInt(LIBREDESK_TEAM_ID, 10) : null,
      priority: LIBREDESK_PRIORITY,
      tags: [LIBREDESK_TAG],
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create conversation: ${res.status} - ${errorText}`);
  }
  
  return await res.json();
}

// Process a single queue item
async function processQueueItem(item) {
  console.log(`Processing queue item: ${item.id}`);
  markProcessing(item.id);
  
  try {
    // Create conversation (LibreDesk auto-creates contact from contact_email)
    await createConversation(
      `[Contact Form] ${item.name} - New collaboration request`,
      item.message,
      item.email,
      item.name
    );
    
    // Success! Remove from queue
    dequeue(item.id);
    console.log(`Successfully processed and removed: ${item.id}`);
    return { success: true, id: item.id };
    
  } catch (err) {
    console.error(`Failed to process ${item.id}:`, err.message);
    markFailed(item.id, err.message);
    return { success: false, id: item.id, error: err.message };
  }
}

// Main handler - processes queue
export default async function handler(req, res) {
  // Allow GET for cron jobs, POST for manual trigger
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Optional: protect this endpoint with a secret
  const authHeader = req.headers['x-queue-secret'];
  if (process.env.QUEUE_SECRET && authHeader !== process.env.QUEUE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Check if LibreDesk is available
  const available = await isLibredeskAvailable();
  if (!available) {
    return res.status(503).json({ 
      message: 'LibreDesk not available, items remain in queue',
      processed: 0,
    });
  }
  
  // Get pending items
  const pendingItems = getPendingItems(5); // Process 5 at a time
  
  if (pendingItems.length === 0) {
    return res.status(200).json({ message: 'Queue empty', processed: 0 });
  }
  
  // Process items
  const results = [];
  for (const item of pendingItems) {
    const result = await processQueueItem(item);
    results.push(result);
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return res.status(200).json({
    message: `Processed ${results.length} items`,
    successful,
    failed,
    results,
  });
}
