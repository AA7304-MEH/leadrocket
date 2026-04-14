import { AuthenticatedRequest, withAuth } from '../../../lib/auth';
import { VercelResponse } from '@vercel/node';
import prisma from '../../../lib/prisma';
import { EmailService } from '../../../lib/email';

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid ID' });
  }

  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: user.id },
      include: { list: true }
    });

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    if (!campaign.listId) {
      return res.status(400).json({ success: false, error: 'Campaign has no lead list attached' });
    }

    const leads = await prisma.lead.findMany({
      where: { listId: campaign.listId, userId: user.id }
    });

    if (leads.length === 0) {
      return res.status(400).json({ success: false, error: 'No leads found in the attached list' });
    }

    await prisma.campaign.update({
      where: { id },
      data: { status: 'sending' }
    });

    const result = await EmailService.sendBulkEmails(leads, campaign);

    const updated = await prisma.campaign.update({
      where: { id },
      data: { 
        status: 'sent',
        sentCount: result.sent,
        metrics: JSON.stringify({
          sent: result.sent,
          failed: result.failed,
          opened: 0,
          replied: 0,
          converted: 0
        })
      }
    });

    return res.status(200).json({ 
      success: true, 
      data: updated, 
      sent: result.sent, 
      failed: result.failed,
      message: `Campaign sent to ${result.sent} leads!` 
    });
  } catch (error: any) {
    console.error('Send error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default withAuth(handler);
