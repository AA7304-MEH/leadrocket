import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    static async sendBulkEmails(leads: any[], campaign: any) {
        let sent = 0;
        let failed = 0;

        for (const lead of leads) {
            try {
                const personalizedBody = this.personalize(campaign.body || campaign.sequenceFlow || '', lead);
                const personalizedSubject = this.personalize(campaign.subject_line || '', lead);

                await this.transporter.sendMail({
                    from: `"LeadRockets" <${process.env.SMTP_USER}>`,
                    to: lead.email,
                    subject: personalizedSubject,
                    text: personalizedBody,
                    html: personalizedBody.replace(/\n/g, '<br>'),
                });
                sent++;
            } catch (error) {
                console.error(`Failed to send to ${lead.email}:`, error);
                failed++;
            }
        }

        return { sent, failed };
    }

    private static personalize(text: string, lead: any): string {
        return text
            .replace(/{{name}}/g, lead.name || 'there')
            .replace(/{{company}}/g, lead.company || 'your company');
    }

    static async sendPasswordReset(email: string, token: string) {
        const resetUrl = `${process.env.VITE_APP_URL}/auth/reset-password?token=${token}`;
        
        return this.transporter.sendMail({
            from: `"LeadRockets Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset your LeadRockets Password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3B82F6;">Password Reset Request</h2>
                    <p>You requested a password reset for your LeadRockets account. Click the button below to proceed:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });
    }
}
