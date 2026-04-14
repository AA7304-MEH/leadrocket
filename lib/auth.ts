import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export interface AuthenticatedRequest extends VercelRequest {
  user?: any;
}

export type Handler = (
  req: AuthenticatedRequest,
  res: VercelResponse
) => Promise<void | VercelResponse>;

export const withAuth = (handler: Handler) => async (
  req: AuthenticatedRequest,
  res: VercelResponse
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    return handler(req, res);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};
