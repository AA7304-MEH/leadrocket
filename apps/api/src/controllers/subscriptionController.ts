import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get all subscriptions (Admin only)
export const getSubscriptions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// Get single subscription
export const getSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscriptionId = String(req.params.id); // Usually subscription ID, but if not provided, we look up by user

    let subscription;
    if (subscriptionId) {
      subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { user: { select: { name: true, email: true } } }
      });
    } else {
      // Fallback or explicit route to "my subscription"
      subscription = await prisma.subscription.findUnique({
        where: { userId: req.user.id },
        include: { user: { select: { name: true, email: true } } }
      });
    }

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this subscription'
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// Create new subscription
export const createSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({ where: { userId: req.user.id } });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: 'User already has an active subscription'
      });
    }

    const subscriptionData: any = {
      user: { connect: { id: req.user.id } },
      plan: req.body.plan,
      stripeCustomerId: req.body.stripeCustomerId || 'pending',
      billingAmount: req.body.billing?.amount || 0,
      billingInterval: req.body.billing?.interval || 'month',
      status: 'active'
    };

    const subscription = await prisma.subscription.create({
      data: subscriptionData
    });

    res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// Update subscription
export const updateSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id: String(req.params.id) } });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this subscription'
      });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: String(req.params.id) },
      data: req.body // Caution: Validate body in production
    });

    res.status(200).json({
      success: true,
      data: updatedSubscription
    });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id: String(req.params.id) } });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this subscription'
      });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelAtPeriodEnd: true
      }
    });

    res.status(200).json({
      success: true,
      data: updatedSubscription,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};