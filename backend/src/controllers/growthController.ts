import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

/**
 * Generate specific referral code for user
 */
export const createReferralCode = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const baseCode = req.user!.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000);

        let code = baseCode;
        // Simple check for uniqueness could be improved loop

        const existing = await prisma.referralCode.findUnique({ where: { userId } });
        if (existing) {
            return res.json({ success: true, data: existing });
        }

        const newCode = await prisma.referralCode.create({
            data: {
                userId,
                code: code,
            }
        });

        res.status(201).json({ success: true, data: newCode });
    } catch (error: any) {
        console.error('Create referral code error:', error);
        res.status(500).json({ success: false, error: 'Failed to create code' });
    }
};

/**
 * Get growth stats for dashboard
 */
export const getGrowthStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const referralCode = await prisma.referralCode.findUnique({
            where: { userId }
        });

        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Determine tier based on invite count
        const invites = referralCode?.invites || 0;
        let currentTier = 'Explorer';
        let nextTier = 'Growth Starter';
        let progress = (invites / 5) * 100;

        if (invites >= 5) {
            currentTier = 'Growth Starter';
            nextTier = 'Growth Pro';
            progress = ((invites - 5) / 15) * 100;
        }
        if (invites >= 20) {
            currentTier = 'Growth Pro';
            nextTier = 'Growth Legend';
            progress = ((invites - 20) / 30) * 100;
        }

        res.json({
            success: true,
            data: {
                referralCode,
                recentReferrals: referrals,
                tier: {
                    current: currentTier,
                    next: nextTier,
                    progress: Math.min(progress, 100)
                },
                earnings: referralCode?.earnings || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};

/**
 * Public: Track click on referral link
 */
export const trackClick = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ success: false });

        await prisma.referralCode.update({
            where: { code },
            data: { clicks: { increment: 1 } }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}
