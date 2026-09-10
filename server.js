import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environmental parameters safely
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware stack config 
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main structural presentation stream
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'index.html'));
});

// Post processing route for form submissions
app.post('/api/consultation', async (req, res) => {
    const { fullName, phone, email, service, location, message, _honey } = req.body;

    // Fast-fail pipeline against automated bot vectors
    if (_honey) {
        return res.status(400).json({ success: false, message: 'Spam vector flagged.' });
    }

    // Validation sequence for essential criteria
    if (!fullName || !phone || !service || !message) {
        return res.status(422).json({ success: false, message: 'Required validation inputs missing.' });
    }

    try {
        // Core configuration for dispatch pipeline using safe credential stores
       const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

        // HTML presentation template matching brand identity values
        const emailBody = `
            <div style="font-family: sans-serif; padding: 24px; max-width: 600px; border: 1px solid #E5E0DB; color: #0D0D0D;">
                <h2 style="color: #C8862A; border-bottom: 2px solid #C8862A; padding-bottom: 8px; margin-top: 0;">
                    New Consultation Inquiry
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                    <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Client Name:</td><td>${fullName}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${phone}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Email Address:</td><td>${email || 'Not Provided'}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Target Service:</td><td style="text-transform: capitalize;">${service}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Site Location:</td><td>${location || 'Not Specified'}</td></tr>
                </table>
                <div style="margin-top: 20px; padding: 16px; background: #F2EDE8; border-radius: 4px;">
                    <strong style="display: block; margin-bottom: 6px;">Project Context & Details:</strong>
                    <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Savanaf Forge Platform" <${process.env.MAIL_USER}>`,
            to: process.env.ADMIN_RECEIVER || 'info@savanafforge.co.ke',
            replyTo: email || undefined,
            subject: `[Project Request] ${service.toUpperCase()} - ${location || 'Nairobi'}`,
            html: emailBody,
        });

        return res.status(200).json({ success: true, message: 'Inquiry successfully processed.' });

    } catch (error) {
        console.error('System mail-dispatch malfunction details:', error);
        return res.status(500).json({ success: false, message: 'Internal systems failure during processing loop.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server executing operations at http://localhost:${PORT}`);
});