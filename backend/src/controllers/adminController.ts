import { Response, NextFunction } from 'express';
import User from '../models/User';
import Lead from '../models/Lead';
import Subscription from '../models/Subscription';
import { AuthRequest } from '../middleware/auth';

// Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const trialUsers = await User.countDocuments({ 'subscription.status': 'trial' });
    const proUsers = await User.countDocuments({ 'subscription.plan': 'pro' });
    const enterpriseUsers = await User.countDocuments({ 'subscription.plan': 'enterprise' });

    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });

    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const trialSubscriptions = await Subscription.countDocuments({ status: 'trial' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          trial: trialUsers,
          pro: proUsers,
          enterprise: enterpriseUsers
        },
        leads: {
          total: totalLeads,
          new: newLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
          conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          trial: trialSubscriptions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
export const updateUserAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly by admin
    delete updates.password;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUserAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user's leads and subscription
    await Lead.deleteMany({ user: userId });
    await Subscription.deleteMany({ user: userId });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get system health metrics
export const getSystemHealth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const dbStats = await require('mongoose').connection.db.stats();

    const health = {
      database: {
        collections: dbStats.collections,
        dataSize: `${Math.round(dbStats.dataSize / 1024 / 1024)}MB`,
        storageSize: `${Math.round(dbStats.storageSize / 1024 / 1024)}MB`,
        indexes: dbStats.indexes,
        objects: dbStats.objects
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    next(error);
  }
};

// Bulk operations for users
export const bulkUserOperations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { operation, userIds, data } = req.body;

    if (!operation || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        error: 'operation and userIds array are required'
      });
    }

    let result;

    switch (operation) {
      case 'activate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { isActive: true }
        );
        break;

      case 'deactivate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { isActive: false }
        );
        break;

      case 'upgrade_to_pro':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          {
            'subscription.plan': 'pro',
            'subscription.status': 'active',
            'usage.monthlyLimit': 200
          }
        );
        break;

      case 'extend_trial':
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        result = await User.updateMany(
          { _id: { $in: userIds } },
          {
            'subscription.trialEndsAt': trialEndDate
          }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation'
        });
    }

    res.status(200).json({
      success: true,
      data: {
        operation,
        affected: result.modifiedCount,
        message: `Bulk ${operation} completed successfully`
      }
    });
  } catch (error) {
    next(error);
  }
};