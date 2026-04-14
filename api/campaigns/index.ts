import { AuthenticatedRequest, withAuth } from '../../lib/auth';
import { VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { user } = req;

  if (req.method === 'GET') {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json({ success: true, data: campaigns });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          name: req.body.name,
          type: req.body.type || 'email',
          status: 'draft',
          userId: user.id,
          metrics: JSON.stringify({ sent: 0, opened: 0, replied: 0, converted: 0 }),
          sequenceFlow: req.body.sequenceFlow ? JSON.stringify(req.body.sequenceFlow) : null
        }
      });
      return res.status(201).json({ success: true, data: campaign });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};

export default withAuth(handler);
