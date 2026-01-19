// LibreDesk API helper for direct message sending

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

export async function sendToLibreDesk(name, email, message) {
  const config = getConfig();

  if (!config.LIBREDESK_API_URL || !config.LIBREDESK_API_KEY || !config.LIBREDESK_API_SECRET) {
    throw new Error('LibreDesk not configured');
  }

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
