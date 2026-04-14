import { AuthenticatedRequest, withAuth } from '../../lib/auth';
import { VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { user } = req;

  if (req.method === 'GET') {
    try {
      const leads = await prisma.lead.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json({ success: true, count: leads.length, data: leads });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const lead = await prisma.lead.create({
        data: {
          ...req.body,
          userId: user.id,
          source: req.body.source || 'manual',
          status: req.body.status || 'new',
          priority: req.body.priority || 'medium'
        }
      });
      return res.status(201).json({ success: true, data: lead });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};

export default withAuth(handler);
