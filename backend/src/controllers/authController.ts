import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { MockUser } from '../models/MockUser';
import { isConnected } from '../utils/database';
import { AuthRequest } from '../middleware/auth';

// Register user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const UserModel: any = isConnected ? User : MockUser;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password
    });

    // Generate tokens
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Check for user
    let user;
    if (isConnected) {
      user = await User.findOne({ email }).select('+password');
    } else {
      user = await (MockUser as any).findOne({ email });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate tokens
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    await user.updateLastLogin();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

    // Get user
    const UserModel: any = isConnected ? User : MockUser;
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
};

// Logout user
export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      data: {},
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get current logged in user
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const UserModel: any = isConnected ? User : MockUser;
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};