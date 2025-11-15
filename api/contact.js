import nodemailer from 'nodemailer';

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

  // Setup SMTP transport using env variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px; border-radius: 12px; max-width: 480px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <h2 style="color: #0f0f0fff; margin-bottom: 16px; font-size: 1.5rem; font-weight: 700;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="font-weight: 600; color: #0f1f35; padding: 8px 0; width: 90px;">Name:</td>
              <td style="color: #222; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; color: #0f1f35; padding: 8px 0;">Email:</td>
              <td style="color: #222; padding: 8px 0;"><a href="mailto:${email}" style="color: #0f0f0fff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="font-weight: 600; color: #0f1f35; padding: 8px 0; vertical-align: top;">Message:</td>
              <td style="color: #222; padding: 8px 0;">${message.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <div style="font-size: 0.95rem; color: #888; text-align: right;">Sent from Portfolio Contact Form</div>
        </div>
      `
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}
