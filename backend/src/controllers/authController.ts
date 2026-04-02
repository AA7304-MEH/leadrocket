import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import mockUserStore from '../utils/mockUserStore';

// Helper to sign JWT
const getSignedJwtToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as any
  });
};

// Helper to get refresh token
const getRefreshToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE || '30d') as any
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create tokens
  const accessToken = getSignedJwtToken(user.id, user.email);
  const refreshToken = getRefreshToken(user.id, user.email);

  const cookieOptions: any = {
    exp: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: {
            plan: user.subscriptionPlan,
            status: user.subscriptionStatus
          },
          usage: {
            leadsGenerated: user.leadsGenerated,
            leadsThisMonth: user.leadsThisMonth,
            monthlyLimit: user.monthlyLimit
          },
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
};

// Register user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await mockUserStore.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await mockUserStore.create({ name, email, password });

    // Update last login
    await mockUserStore.updateLastLogin(user.id);

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await mockUserStore.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await mockUserStore.verifyPassword(user, password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await mockUserStore.updateLastLogin(user.id);

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    let token = req.body.refreshToken;

    if (!token && req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    // Get user
    const user = await mockUserStore.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = getSignedJwtToken(user.id, user.email);

    const cookieOptions: any = {
      exp: new Date(
        Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }

    res.status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .json({
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
    res
      .cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      })
      .cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      })
      .status(200)
      .json({
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
    const user = await mockUserStore.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: {
          plan: user.subscriptionPlan,
          status: user.subscriptionStatus
        },
        profile: {},
        settings: {
          emailNotifications: true,
          weeklyReports: true,
          timezone: 'UTC'
        },
        usage: {
          leadsGenerated: user.leadsGenerated,
          leadsThisMonth: user.leadsThisMonth,
          monthlyLimit: user.monthlyLimit
        },
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};