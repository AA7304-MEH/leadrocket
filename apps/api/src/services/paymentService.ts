import { prisma } from '../utils/prisma';
import { User } from '@prisma/client';

export interface PaymentData {
  amount: number;
  currency: string;
  plan: 'pro' | 'enterprise';
  interval: 'month' | 'year';
}

export class PaymentService {
  // Process payment (free simulation - in production, integrate with payment processor)
  static async processPayment(user: User, paymentData: PaymentData): Promise<any> {
    try {
      // Simulate payment processing
      const paymentId = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate subscription dates
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
      const currentPeriodEnd = paymentData.interval === 'year'
        ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Create or update subscription
      // Check for existing subscription by userId since it's unique
      const existingSub = await prisma.subscription.findUnique({
        where: { userId: user.id }
      });

      let subscription;

      if (existingSub) {
        // Update existing subscription
        subscription = await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: paymentData.plan === 'enterprise' ? 'enterprise' : 'pro',
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: currentPeriodEnd,
            trialEnd: trialEnd,
            billingInterval: paymentData.interval,
            billingAmount: paymentData.amount,
            billingCurrency: paymentData.currency,
            stripeSubscriptionId: subscriptionId
          }
        });
      } else {
        // Create new subscription
        subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: paymentData.plan === 'enterprise' ? 'enterprise' : 'pro',
            status: 'trial',
            currentPeriodStart: now,
            currentPeriodEnd: currentPeriodEnd,
            trialStart: now,
            trialEnd: trialEnd,
            cancelAtPeriodEnd: false,
            billingInterval: paymentData.interval,
            billingAmount: paymentData.amount,
            billingCurrency: paymentData.currency,
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: `cus_${Date.now()}`
          }
        });
      }

      // Update user subscription info (flattened fields)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: paymentData.plan === 'enterprise' ? 'enterprise' : 'pro',
          subscriptionStatus: 'trial',
          stripeCustomerId: subscription.stripeCustomerId,
          trialEndsAt: trialEnd
        }
      });

      return {
        success: true,
        paymentId,
        subscriptionId,
        subscription,
        clientSecret: `pi_${paymentId}_secret_${Math.random().toString(36).substr(2, 16)}`,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      throw new Error(`Payment processing failed: ${(error as Error).message}`);
    }
  }

  // Cancel subscription
  static async cancelSubscription(user: User, subscriptionId: string): Promise<any> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          stripeSubscriptionId: subscriptionId
        }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const updatedSub = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelAtPeriodEnd: true
        }
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'cancelled' }
      });

      return {
        success: true,
        subscription: updatedSub,
        message: 'Subscription cancelled successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Get payment history (simulated)
  static async getPaymentHistory(user: User): Promise<any[]> {
    try {
      const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

      if (!subscription) {
        return [];
      }

      // Simulate payment history
      const payments = [
        {
          id: `pm_${Date.now()}_1`,
          amount: subscription.billingAmount,
          currency: subscription.billingCurrency,
          status: 'succeeded',
          created: subscription.createdAt,
          description: `${subscription.plan} plan - ${subscription.billingInterval}ly`
        }
      ];

      return payments;
    } catch (error) {
      throw error;
    }
  }

  // Create payment intent (for frontend integration)
  static async createPaymentIntent(user: User, paymentData: PaymentData): Promise<any> {
    try {
      const amount = paymentData.plan === 'enterprise' ? 2497 : 997;
      const finalAmount = paymentData.interval === 'year' ? amount * 10 : amount; // 2 months free for yearly

      return {
        success: true,
        clientSecret: `pi_demo_secret_${Math.random().toString(36).substr(2, 16)}`,
        paymentIntentId: `pi_${Date.now()}`,
        amount: finalAmount,
        currency: paymentData.currency,
        plan: paymentData.plan,
        interval: paymentData.interval,
        message: 'Payment intent created successfully'
      };
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${(error as Error).message}`);
    }
  }

  // Webhook handler for payment events (simulated)
  static async handleWebhook(event: any): Promise<any> {
    try {
      console.log('Processing webhook event:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          return { success: true, message: 'Payment succeeded' };

        case 'payment_intent.payment_failed':
          // Handle failed payment
          return { success: false, message: 'Payment failed' };

        case 'customer.subscription.updated':
          // Handle subscription updates
          return { success: true, message: 'Subscription updated' };

        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          return { success: true, message: 'Subscription cancelled' };

        default:
          return { success: true, message: 'Event processed' };
      }
    } catch (error) {
      throw error;
    }
  }
}