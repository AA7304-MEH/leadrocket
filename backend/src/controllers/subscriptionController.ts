import { Response, NextFunction } from 'express';
import Subscription from '../models/Subscription';
import { AuthRequest } from '../middleware/auth';

// Get all subscriptions (Admin only)
export const getSubscriptions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');

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
    const subscription = await Subscription.findById(req.params.id || req.user.id).populate('user', 'name email');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
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
    const existingSubscription = await Subscription.findOne({ user: req.user.id });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: 'User already has an active subscription'
      });
    }

    const subscriptionData = {
      ...req.body,
      user: req.user.id,
      stripeCustomerId: req.body.stripeCustomerId
    };

    const subscription = await Subscription.create(subscriptionData);

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
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this subscription'
      });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Check if user owns the subscription or is admin
    if (subscription.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this subscription'
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelAtPeriodEnd = true;

    await subscription.save();

    res.status(200).json({
      success: true,
      data: subscription,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};