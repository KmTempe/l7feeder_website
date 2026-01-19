// Cron job to process contact queue and send to LibreDesk
// Runs at 00:00 and 12:00 UTC daily

import { getPendingItems, markProcessing, markFailed, dequeue, getQueue } from '../lib/kv-queue.js';

function getConfig() {
  return {
    LIBREDESK_API_URL: process.env.LIBREDESK_API_URL,
    LIBREDESK_API_KEY: process.env.LIBREDESK_API_KEY,
    LIBREDESK_API_SECRET: process.env.LIBREDESK_API_SECRET,
    LIBREDESK_INBOX_ID: process.env.LIBREDESK_INBOX_ID,
    LIBREDESK_AGENT_ID: process.env.LIBREDESK_AGENT_ID,
    LIBREDESK_TEAM_ID: process.env.LIBREDESK_TEAM_ID,
    LIBREDESK_PRIORITY: process.env.LIBREDESK_PRIORITY || 'Low',
    LIBREDESK_TAGS: process.env.LIBREDESK_TAGS || 'l7f',
  };
}

function getAuthHeader(config) {
  const credentials = `${config.LIBREDESK_API_KEY}:${config.LIBREDESK_API_SECRET}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
}

async function createConversation(name, email, message, config) {
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || name;
  const lastName = nameParts.slice(1).join(' ') || '';

  // Step 1: Create conversation
  const res = await fetch(`${config.LIBREDESK_API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(config),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inbox_id: parseInt(config.LIBREDESK_INBOX_ID, 10),
      subject: `[Contact Form] New message from ${name}`,
      content: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      contact_email: email,
      first_name: firstName,
      last_name: lastName,
      initiator: 'contact',
      agent_id: config.LIBREDESK_AGENT_ID ? parseInt(config.LIBREDESK_AGENT_ID, 10) : null,
      team_id: config.LIBREDESK_TEAM_ID ? parseInt(config.LIBREDESK_TEAM_ID, 10) : null,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create conversation: ${res.status} - ${errText}`);
  }

  const result = await res.json();
  const conversationId = result.data?.uuid || result.data?.id;

  // Step 2: Set priority
  if (conversationId && config.LIBREDESK_PRIORITY) {
    await fetch(`${config.LIBREDESK_API_URL}/conversations/${conversationId}/priority`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priority: config.LIBREDESK_PRIORITY }),
    });
  }

  // Step 3: Set tags
  if (conversationId && config.LIBREDESK_TAGS) {
    const tagNames = config.LIBREDESK_TAGS.split(',').map(t => t.trim());
    await fetch(`${config.LIBREDESK_API_URL}/conversations/${conversationId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: tagNames }),
    });
  }

  return result;
}

async function processItem(item, config) {
  console.log(`Processing: ${item.id} (attempt ${item.attempts + 1})`);
  await markProcessing(item.id);

  try {
    await createConversation(item.name, item.email, item.message, config);
    await dequeue(item.id);
    console.log(`✓ Success: ${item.id}`);
    return { id: item.id, success: true };
  } catch (err) {
    console.error(`✗ Failed: ${item.id} - ${err.message}`);
    await markFailed(item.id, err.message);
    return { id: item.id, success: false, error: err.message };
  }
}

export default async function handler(req, res) {
  // Verify cron secret (security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('=== Cron: Process Contact Queue ===');
  console.log(`Time: ${new Date().toISOString()}`);

  // Get config at runtime
  const config = getConfig();

  // Check LibreDesk config
  if (!config.LIBREDESK_API_URL || !config.LIBREDESK_API_KEY || !config.LIBREDESK_API_SECRET) {
    console.error('LibreDesk not configured');
    return res.status(500).json({ error: 'LibreDesk not configured' });
  }

  try {
    const queue = await getQueue();
    console.log(`Queue size: ${queue.length}`);

    if (queue.length === 0) {
      return res.status(200).json({ message: 'Queue empty', processed: 0 });
    }

    const pending = await getPendingItems(50);
    console.log(`Pending items: ${pending.length}`);

    if (pending.length === 0) {
      return res.status(200).json({ message: 'No items ready', processed: 0 });
    }

    const results = [];
    for (const item of pending) {
      const result = await processItem(item, config);
      results.push(result);
      // Small delay between items to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Processed: ${successful} success, ${failed} failed`);

    return res.status(200).json({
      message: 'Queue processed',
      processed: results.length,
      successful,
      failed,
      results,
    });
  } catch (err) {
    console.error('Cron error:', err);
    return res.status(500).json({ error: err.message });
  }
}
