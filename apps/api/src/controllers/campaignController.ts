import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get all campaigns for user
export const getCampaigns = async (req: AuthRequest, res: Response) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: { userId: req.user?.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: campaigns });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
    }
};

// Get single campaign
export const getCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const campaign = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.json({ success: true, data: campaign });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch campaign' });
    }
};

// Create new campaign
export const createCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const campaign = await prisma.campaign.create({
            data: {
                name: req.body.name,
                type: req.body.type,
                status: req.body.status || 'draft',
                userId: req.user!.id,
                metrics: JSON.stringify({ sent: 0, opened: 0, replied: 0, converted: 0 }),
                sequenceFlow: req.body.sequenceFlow ? JSON.stringify(req.body.sequenceFlow) : null
            }
        });
        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to create campaign' });
    }
};

// Update campaign
export const updateCampaign = async (req: AuthRequest, res: Response) => {
    try {
        // First check existence and ownership
        const existing = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        const campaign = await prisma.campaign.update({
            where: { id: String(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: campaign });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to update campaign' });
    }
};

// Delete campaign
export const deleteCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        await prisma.campaign.delete({
            where: { id: String(req.params.id) }
        });
        res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete campaign' });
    }
};

// Launch campaign
export const launchCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });
        if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found' });

        const campaign = await prisma.campaign.update({
            where: { id: String(req.params.id) },
            data: { status: 'active' }
        });
        res.json({ success: true, data: campaign, message: 'Campaign launched!' });
    } catch (error) {
        console.error('Launch campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to launch campaign' });
    }
};

// Pause campaign
export const pauseCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });
        if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found' });

        const campaign = await prisma.campaign.update({
            where: { id: String(req.params.id) },
            data: { status: 'paused' }
        });
        res.json({ success: true, data: campaign, message: 'Campaign paused' });
    } catch (error) {
        console.error('Pause campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to pause campaign' });
    }
};

// Resume campaign
export const resumeCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.campaign.findFirst({
            where: { id: String(req.params.id), userId: req.user?.id }
        });
        if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found' });

        const campaign = await prisma.campaign.update({
            where: { id: String(req.params.id) },
            data: { status: 'active' }
        });
        res.json({ success: true, data: campaign, message: 'Campaign resumed' });
    } catch (error) {
        console.error('Resume campaign error:', error);
        res.status(500).json({ success: false, message: 'Failed to resume campaign' });
    }
};

// Get campaign stats
export const getCampaignStats = async (req: AuthRequest, res: Response) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: { userId: req.user?.id }
        });

        // Manual aggregation since Prisma aggregation on JSONB fields is limited
        const stats = {
            total: campaigns.length,
            active: campaigns.filter(c => c.status === 'active').length,
            sent: campaigns.reduce((acc, c) => acc + (c.metrics as any)?.sent || 0, 0),
            avgReplyRate: campaigns.length > 0
                ? campaigns.reduce((acc, c) => {
                    const metrics = c.metrics as any;
                    const sent = metrics?.sent || 0;
                    const replied = metrics?.replied || 0;
                    return sent > 0 ? acc + (replied / sent * 100) : acc;
                }, 0) / campaigns.filter(c => ((c.metrics as any)?.sent || 0) > 0).length || 0
                : 0
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
};

// Clone campaign
export const cloneCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const { campaignId, newName } = req.body;
        const original = await prisma.campaign.findFirst({
            where: { id: campaignId, userId: req.user?.id }
        });
        if (!original) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        const clone = await prisma.campaign.create({
            data: {
                userId: req.user!.id,
                name: newName || `${original.name} (Copy)`,
                status: 'draft',
                type: original.type,
                metrics: JSON.stringify({ sent: 0, opened: 0, replied: 0, converted: 0 }),
                sequenceFlow: original.sequenceFlow || undefined
            }
        });
        res.json({ success: true, data: clone, message: 'Campaign cloned successfully' });
    } catch (error) {
        console.error('Clone error:', error);
        res.status(500).json({ success: false, message: 'Failed to clone campaign' });
    }
};

// Save sequence (React Flow data)
export const saveSequence = async (req: AuthRequest, res: Response) => {
    try {
        const { campaignId, nodes, edges, name } = req.body;

        if (campaignId) {
            // Verify ownership first
            const existing = await prisma.campaign.findFirst({
                where: { id: campaignId, userId: req.user?.id }
            });

            if (!existing) {
                return res.status(404).json({ success: false, message: 'Campaign not found' });
            }

            const campaign = await prisma.campaign.update({
                where: { id: campaignId },
                data: {
                    sequenceFlow: JSON.stringify({ nodes, edges }),
                    name: name || undefined
                }
            });
            return res.json({ success: true, data: campaign, message: 'Sequence saved' });
        }

        // Create new campaign with sequence
        if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const campaign = await prisma.campaign.create({
            data: {
                userId: req.user.id,
                name: name || 'New Sequence',
                sequenceFlow: JSON.stringify({ nodes, edges }),
                status: 'draft',
                metrics: JSON.stringify({ sent: 0, opened: 0, replied: 0, converted: 0 })
            }
        });

        res.json({ success: true, data: campaign, message: 'Sequence created' });
    } catch (error) {
        console.error('Save sequence error:', error);
        res.status(500).json({ success: false, message: 'Failed to save sequence' });
    }
};
