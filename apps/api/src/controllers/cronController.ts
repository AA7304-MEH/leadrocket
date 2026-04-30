import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { EmailService } from '../services/emailService';

export const runCampaignCron = async (req: Request, res: Response) => {
  // Security Check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'scheduled',
        // Note: Prisma sqlite provider might need date string comparison depending on storage
        // but here we assume DateTime is handled correctly.
      },
    });

    // In a real scenario, we'd also check scheduledAt <= now
    // But since the current schema doesn't have scheduledAt, we'll process 'scheduled' ones
    // and assume they are ready. 

    console.log(`[Cron] Found ${campaigns.length} campaigns to send.`);

    for (const campaign of campaigns) {
      try {
        // Fetch leads for the user who owns this campaign
        const leads = await prisma.lead.findMany({
          where: { userId: campaign.userId, status: 'new' }
        });

        if (leads.length === 0) {
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: { status: 'completed', metrics: JSON.stringify({ error: 'No leads found' }) }
          });
          continue;
        }

        // Mark as sending
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'active' }
        });

        // Send emails
        const result = await EmailService.sendBulkEmails(leads, campaign);

        // Update status to completed
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { 
            status: 'completed',
            metrics: JSON.stringify({
              sent: result.sent,
              failed: result.failed,
              opened: 0,
              replied: 0
            })
          }
        });

        console.log(`[Cron] Successfully processed campaign ${campaign.id}`);
      } catch (campaignError) {
        console.error(`[Cron] Error processing campaign ${campaign.id}:`, campaignError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      processed: campaigns.length 
    });
  } catch (error: any) {
    console.error('[Cron] Execution error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
