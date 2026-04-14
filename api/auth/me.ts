import { AuthenticatedRequest, withAuth } from '../../lib/auth';
import { VercelResponse } from '@vercel/node';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user } = req;
  
  return res.status(200).json({
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
      usage: {
        leadsGenerated: user.leadsGenerated,
        leadsThisMonth: user.leadsThisMonth,
        monthlyLimit: user.monthlyLimit
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
};

export default withAuth(handler);
