import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { EmailService } from '../services/emailService';

// Send test email
export const sendTestEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const result = await EmailService.sendEmail({
      to: req.user.email,
      subject: 'Test Email from Lead Rockets',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Test Email</h1>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you received this, your email notifications are set up properly!</p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const result = await EmailService.sendWelcomeEmail(req.user.email, req.user.name);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Welcome email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send lead report email
export const sendLeadReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { leadCount, leads } = req.body;

    if (!leadCount || !leads) {
      return res.status(400).json({
        success: false,
        error: 'leadCount and leads are required'
      });
    }

    const result = await EmailService.sendLeadReportEmail(
      req.user.email,
      req.user.name,
      leadCount,
      leads
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Lead report email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { plan, amount } = req.body;

    if (!plan || !amount) {
      return res.status(400).json({
        success: false,
        error: 'plan and amount are required'
      });
    }

    const result = await EmailService.sendPaymentConfirmationEmail(
      req.user.email,
      req.user.name,
      plan,
      amount
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment confirmation email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send trial expiration reminder
export const sendTrialReminder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { daysLeft } = req.body;

    if (!daysLeft) {
      return res.status(400).json({
        success: false,
        error: 'daysLeft is required'
      });
    }

    const result = await EmailService.sendTrialExpirationReminder(
      req.user.email,
      req.user.name,
      daysLeft
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Trial reminder email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};