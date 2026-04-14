import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get all users (Admin only)
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId = String(req.params.id) || req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Exclude password from response manually if needed, or use a select
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId = String(req.params.id) || req.user.id;

    // In strict Prisma, we update specific fields. 
    // Mongoose allowed loose objects for updates if schema matched.
    // We'll trust the body for now but typically should validate.

    // Flatten updates or handle appropriately based on schema
    const dataToUpdate: any = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.profile?.company,
      website: req.body.profile?.website,
      industry: req.body.profile?.industry,
      phone: req.body.profile?.phone,
      avatar: req.body.profile?.avatar,
      emailNotifications: req.body.settings?.emailNotifications,
      weeklyReports: req.body.settings?.weeklyReports,
      timezone: req.body.settings?.timezone,
      openaiKey: req.body.apiKeys?.openai,
      hubspotKey: req.body.apiKeys?.hubspot,
      salesforceKey: req.body.apiKeys?.salesforce
    };

    // Remove undefined keys
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: { subscription: true }
    });

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    // Handle record not found
    next(error);
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    await prisma.user.delete({
      where: { id: String(req.params.id) }
    });

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};