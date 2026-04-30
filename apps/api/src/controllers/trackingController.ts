import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const trackOpen = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const { leadId } = req.query;

  try {
    if (leadId) {
      // Update lead outreach stats
      await prisma.lead.update({
        where: { id: String(leadId) },
        data: {
          outreach: {
            // This is complex for JSONB, in sqlite/prisma we'd normally fetch and update
            // For now, we'll just log or attempt update if schema allows
          }
        }
      });
    }

    // Return 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(pixel);
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).end();
  }
};

export const trackClick = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const { url, leadId } = req.query;

  try {
    // Log click logic here...
    
    // Redirect to target URL
    if (url) {
      return res.redirect(String(url));
    }
    res.status(400).send('Missing target URL');
  } catch (error) {
    res.status(500).send('Tracking error');
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { leadId } = req.params;

  try {
    await prisma.lead.update({
      where: { id: String(leadId) },
      data: { status: 'unsubscribed' }
    });

    return res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Unsubscribed</h1>
        <p>You have been successfully removed from our list.</p>
      </div>
    `);
  } catch (error) {
    res.status(500).send('Error unsubscribing');
  }
};
