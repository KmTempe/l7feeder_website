import { enqueue, isKVConfigured } from './lib/kv-queue.js';
import { sendToLibreDesk } from './lib/libredesk.js';

export default async function handler(req, res) {
  // CORS support for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Check if KV is configured
  const kvAvailable = await isKVConfigured();

  if (kvAvailable) {
    // Add to queue for LibreDesk API (processed by cron job)
    try {
      const queueId = await enqueue({ name, email, message });
      console.log(`Contact queued for LibreDesk: ${queueId}`);
      return res.status(200).json({ success: true, queued: queueId });
    } catch (err) {
      console.error('Queue error:', err);
      // Fall through to direct send
    }
  }

  // No KV or queue failed - send directly to LibreDesk
  try {
    console.log('KV not available, sending directly to LibreDesk');
    await sendToLibreDesk(name, email, message);
    console.log('Contact sent directly to LibreDesk');
    return res.status(200).json({ success: true, direct: true });
  } catch (err) {
    console.error('LibreDesk error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}
