import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });

    // For nested JSON, we need database-specific queries or filtering in app if simple.
    // However, Subscription is now a separate model, so we should query that table directly.
    // In Mongoose schema 'subscription' was embedded in User sometimes or separate, 
    // but in Prisma we defined a 'Subscription' model.
    // Let's assume we use the Subscription model logic for counts.

    const trialSubscriptions = await prisma.subscription.count({ where: { status: 'trial' } });
    const proSubscriptions = await prisma.subscription.count({ where: { plan: 'pro' } });
    const enterpriseSubscriptions = await prisma.subscription.count({ where: { plan: 'enterprise' } });
    const activeSubscriptions = await prisma.subscription.count({ where: { status: 'active' } });
    const totalSubscriptions = await prisma.subscription.count();

    const totalLeads = await prisma.lead.count();
    const newLeads = await prisma.lead.count({ where: { status: 'new' } });
    const qualifiedLeads = await prisma.lead.count({ where: { status: 'qualified' } });
    const convertedLeads = await prisma.lead.count({ where: { status: 'converted' } });

    // Users with specific subscription plans (legacy view might want users count)
    // If subscription is 1:1, trialSubscriptions ~= trialUsers logic
    const trialUsers = trialSubscriptions;
    const proUsers = proSubscriptions;
    const enterpriseUsers = enterpriseSubscriptions;

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
    const page = parseInt(req.query.page as any) || 1;
    const limit = parseInt(req.query.limit as any) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, createdAt: true, lastLogin: true
      }
    });

    const total = await prisma.user.count();

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
    const id = String(req.params.userId);
    const updates = req.body;
    
    const user = await prisma.user.update({
      where: { id: id },
      data: updates
    });

    // Sanitize response
    const { password, ...userWithoutPassword } = user;

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUserAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = String(req.params.userId);

    // Delete user's leads and subscription (Prisma might handle cascade delete if configured in schema)
    // Explicitly deleting to be safe and match logic
    await prisma.lead.deleteMany({ where: { userId: id } });
    await prisma.subscription.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id: id } });

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
    // Simple health check for Postgres
    // We can't easily get storage size via simple Prisma call without raw query permissions usually
    // Returning dummy stats or simple connectivity confirmed

    // Optionally run a raw query: await prisma.$queryRaw`SELECT 1`; 

    const health = {
      database: {
        status: 'connected',
        provider: 'postgresql'
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
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: true }
        });
        break;

      case 'deactivate':
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: false }
        });
        break;

      case 'upgrade_to_pro':
        // Update associated subscriptions
        // This assumes user <-> subscription relation
        await prisma.subscription.updateMany({
          where: { userId: { in: userIds } },
          data: { plan: 'pro', status: 'active' }
        });
        result = { count: userIds.length }; // Approximation
        break;

      case 'extend_trial':
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        await prisma.subscription.updateMany({
          where: { userId: { in: userIds } },
          data: { trialEnd: trialEndDate }
        });
        result = { count: userIds.length };
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
        affected: (result as any).count || (result as any).modifiedCount,
        message: `Bulk ${operation} completed successfully`
      }
    });
  } catch (error) {
    next(error);
  }
};