import { AuthenticatedRequest, withAuth } from '../../../lib/auth';
import { VercelResponse } from '@vercel/node';
import prisma from '../../../lib/prisma';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { user } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid ID' });
  }

  // Verify ownership
  const existing = await prisma.campaign.findFirst({
    where: { id, userId: user.id }
  });

  if (!existing) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: existing });
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const campaign = await prisma.campaign.update({
        where: { id },
        data: req.body
      });
      return res.status(200).json({ success: true, data: campaign });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.campaign.delete({ where: { id } });
      return res.status(200).json({ success: true, message: 'Campaign deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};

export default withAuth(handler);
