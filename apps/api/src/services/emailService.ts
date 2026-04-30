import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  // Initialize email transporter (using Gmail as free option)
  private static getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS // App password for Gmail
        }
      });
    }
    return this.transporter;
  }

  // Send email
  static async sendEmail(emailData: EmailData): Promise<any> {
    try {
      const transporter = this.getTransporter();

      const mailOptions = {
        from: `"Lead Rockets" <${process.env.SMTP_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      };

      const result = await transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      };
    } catch (error) {
      throw new Error(`Email sending failed: ${(error as Error).message}`);
    }
  }

  // Send bulk emails for a campaign
  static async sendBulkEmails(leads: any[], campaign: any): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const lead of leads) {
      try {
        const trackingPixel = `<img src="${process.env.VITE_API_URL}/api/track/open/${campaign.id}?leadId=${lead.id}" width="1" height="1" style="display:none" />`;
        const unsubscribeLink = `<div style="margin-top: 20px; font-size: 12px; color: #666;">
          <a href="${process.env.VITE_API_URL}/api/unsubscribe/${lead.id}">Unsubscribe</a>
        </div>`;

        // Simple template replacement (can be more complex)
        let html = campaign.content || '';
        html = html.replace(/{{name}}/g, lead.contactName || 'there');
        html = html.replace(/{{company}}/g, lead.companyName || 'your company');
        
        const fullHtml = `
          ${html}
          ${trackingPixel}
          ${unsubscribeLink}
        `;

        await this.sendEmail({
          to: lead.email,
          subject: campaign.subject || campaign.name,
          html: fullHtml
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send email to ${lead.email}:`, error);
        failed++;
      }
    }

    return { sent, failed };
  }

  // Welcome email template
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<any> {
    const subject = 'Welcome to Lead Rockets! 🚀';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Lead Rockets!</h1>
          <p style="color: #6b7280; font-size: 18px;">Your AI-powered lead generation journey starts now</p>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${userName}!</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Lead Rockets! You're now part of an exclusive community of founders
            who are scaling their businesses with AI-powered lead generation.
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #2563eb; margin-bottom: 15px;">🎯 What you can do now:</h3>
            <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
              <li>Generate up to 50 high-quality leads per week</li>
              <li>Export leads to your favorite CRM</li>
              <li>Track your lead generation performance</li>
              <li>Access our growing database of prospects</li>
            </ul>
          </div>

          <p style="color: #4b5563; margin-bottom: 20px;">
            Your 14-day free trial has started. No credit card required!
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Contact our support team or visit our help center.</p>
          <p>© 2024 Lead Rockets. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  // Lead generation report email
  static async sendLeadReportEmail(userEmail: string, userName: string, leadCount: number, newLeads: any[]): Promise<any> {
    const subject = `Your Weekly Lead Report: ${leadCount} New Leads Generated 📊`;

    const leadsHtml = newLeads.map(lead => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 15px; color: #1f2937; font-weight: 500;">${lead.companyName}</td>
        <td style="padding: 15px; color: #4b5563;">${lead.contactName || 'N/A'}</td>
        <td style="padding: 15px; color: #4b5563;">${lead.email || 'N/A'}</td>
        <td style="padding: 15px;">
          <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${lead.status}
          </span>
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin-bottom: 10px;">Weekly Lead Report</h1>
          <p style="color: #6b7280; font-size: 18px;">${leadCount} new leads generated this week</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #10b981;">
          <h2 style="color: #1f2937; margin-bottom: 10px;">Great job, ${userName}!</h2>
          <p style="color: #4b5563; margin-bottom: 0;">
            Your AI lead generation is working! Here are the latest prospects ready for your outreach.
          </p>
        </div>

        <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 30px;">
          <div style="background-color: #f9fafb; padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <h3 style="margin: 0; color: #1f2937;">New Leads This Week</h3>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 15px; text-align: left; color: #6b7280; font-weight: 500;">Company</th>
                <th style="padding: 15px; text-align: left; color: #6b7280; font-weight: 500;">Contact</th>
                <th style="padding: 15px; text-align: left; color: #6b7280; font-weight: 500;">Email</th>
                <th style="padding: 15px; text-align: left; color: #6b7280; font-weight: 500;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${leadsHtml}
            </tbody>
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
            View All Leads
          </a>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/lead-generation"
             style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Generate More Leads
          </a>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #92400e; margin-bottom: 10px;">💡 Pro Tip</h3>
          <p style="color: #78350f; margin-bottom: 0;">
            Connect your CRM to automatically sync these leads and start your outreach sequence immediately!
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p>You're receiving this because you have weekly reports enabled.</p>
          <p>You can change your email preferences in your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="color: #2563eb;">profile settings</a>.</p>
          <p>© 2024 Lead Rockets. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  // Payment confirmation email
  static async sendPaymentConfirmationEmail(userEmail: string, userName: string, plan: string, amount: number): Promise<any> {
    const subject = 'Payment Confirmed - Welcome to Lead Rockets Pro! 💳';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin-bottom: 10px;">Payment Confirmed!</h1>
          <p style="color: #6b7280; font-size: 18px;">Thank you for upgrading to ${plan}</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #10b981;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${userName}!</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Your payment has been successfully processed. Welcome to the Lead Rockets ${plan} plan!
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #4b5563;">Plan:</span>
              <span style="color: #1f2937; font-weight: 500;">${plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #4b5563;">Amount:</span>
              <span style="color: #1f2937; font-weight: 500;">$${amount}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #4b5563;">Status:</span>
              <span style="color: #059669; font-weight: 500;">Active</span>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Generating Leads
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help getting started? Check out our <a href="#" style="color: #2563eb;">quick start guide</a>.</p>
          <p>© 2024 Lead Rockets. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  // Trial expiration reminder
  static async sendTrialExpirationReminder(userEmail: string, userName: string, daysLeft: number): Promise<any> {
    const subject = `Your trial expires in ${daysLeft} days ⏰`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin-bottom: 10px;">Trial Expiring Soon</h1>
          <p style="color: #6b7280; font-size: 18px;">${daysLeft} days left in your free trial</p>
        </div>

        <div style="background-color: #fef2f2; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ef4444;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${userName}!</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Your 14-day free trial is ending soon. Don't lose access to your leads and AI generation features.
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #dc2626; margin-bottom: 15px;">What happens when your trial ends:</h3>
            <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
              <li>Lead generation will be paused</li>
              <li>You'll lose access to your dashboard</li>
              <li>Your leads will be archived</li>
              <li>CRM integrations will be disabled</li>
            </ul>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing"
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
            Upgrade Now
          </a>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Use Remaining Time
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Questions? Contact our support team for assistance.</p>
          <p>© 2024 Lead Rockets. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }
}