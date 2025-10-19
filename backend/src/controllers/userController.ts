import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get all users (Admin only)
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const users = await User.find().select('-password');

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
    const user = await User.findById(req.params.id || req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      profile: req.body.profile,
      settings: req.body.settings,
      apiKeys: req.body.apiKeys
    };

    const user = await User.findByIdAndUpdate(
      req.params.id || req.user.id,
      fieldsToUpdate,
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
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};