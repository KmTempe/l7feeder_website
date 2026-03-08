// THIS SERVER IS FOR LOCAL DEVELOPMENT ONLY.
// IT IS NOT USED IN PRODUCTION (VERCEL).
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import contactHandler from './api/contact.js';
import sendOtpHandler from './api/send-otp.js';
import verifyOtpHandler from './api/verify-otp.js';
import processQueueHandler from './api/process-queue.js';
import cronProcessQueueHandler from './api/cron/process-queue.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (limit to 16kb to prevent abuse)
app.use(express.json({ limit: '16kb' }));

// Use CORS middleware (optional, but good for local dev if ports differ)
// Note: api/contact.js also sets CORS headers, so we might not strictly need this if calling from same origin or if handler handles it.
// But since Vite proxies, it looks like same origin to the browser.
app.use(cors());

// Route for contact API (kept for backwards compatibility)
app.all('/api/contact', async (req, res) => {
    try {
        await contactHandler(req, res);
    } catch (error) {
        console.error('API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// 2FA contact form routes
app.all('/api/send-otp', async (req, res) => {
    try {
        await sendOtpHandler(req, res);
    } catch (error) {
        console.error('Send OTP Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.all('/api/verify-otp', async (req, res) => {
    try {
        await verifyOtpHandler(req, res);
    } catch (error) {
        console.error('Verify OTP Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Route for processing queue (can be called by cron or manually)
app.all('/api/process-queue', async (req, res) => {
    try {
        await processQueueHandler(req, res);
    } catch (error) {
        console.error('Queue API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Cron route for processing queue via LibreDesk (mirrors Vercel cron)
app.all('/api/cron/process-queue', async (req, res) => {
    try {
        await cronProcessQueueHandler(req, res);
    } catch (error) {
        console.error('Cron Queue Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Local API server running at http://localhost:${PORT}`);
});
