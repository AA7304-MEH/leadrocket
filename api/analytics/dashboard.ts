import { AuthenticatedRequest, withAuth } from '../../lib/auth';
import { VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user } = req;

  try {
    const campaigns = await prisma.campaign.findMany({
        where: { userId: user.id }
    });

    const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        sentCount: campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0),
        leadsGenerated: user.leadsGenerated,
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default withAuth(handler);
