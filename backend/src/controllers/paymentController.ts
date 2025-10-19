import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PaymentService, PaymentData } from '../services/paymentService';

// Create payment intent
export const createPaymentIntent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { plan, interval }: { plan: 'pro' | 'enterprise'; interval: 'month' | 'year' } = req.body;

    if (!plan || !interval) {
      return res.status(400).json({
        success: false,
        error: 'Plan and interval are required'
      });
    }

    const paymentData: PaymentData = {
      plan,
      interval,
      amount: plan === 'enterprise' ? 2497 : 997,
      currency: 'usd'
    };

    const result = await PaymentService.createPaymentIntent(req.user, paymentData);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Process payment
export const processPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { plan, interval }: { plan: 'pro' | 'enterprise'; interval: 'month' | 'year' } = req.body;

    if (!plan || !interval) {
      return res.status(400).json({
        success: false,
        error: 'Plan and interval are required'
      });
    }

    const paymentData: PaymentData = {
      plan,
      interval,
      amount: plan === 'enterprise' ? 2497 : 997,
      currency: 'usd'
    };

    const result = await PaymentService.processPayment(req.user, paymentData);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { subscriptionId } = req.params;

    const result = await PaymentService.cancelSubscription(req.user, subscriptionId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get payment history
export const getPaymentHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const payments = await PaymentService.getPaymentHistory(req.user);

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    next(error);
  }
};

// Handle payment webhook
export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const event = req.body;

    const result = await PaymentService.handleWebhook(event);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get subscription status
export const getSubscriptionStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscription = await require('../models/Subscription').default.findOne({ user: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'No subscription found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        subscription,
        status: subscription.status,
        plan: subscription.plan,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        usage: subscription.usage
      }
    });
  } catch (error) {
    next(error);
  }
};