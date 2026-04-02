import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Define available achievements
const ACHIEVEMENTS = [
    { id: 'first_campaign', name: 'First Launch', description: 'Send your first campaign', xp: 100 },
    { id: 'reply_master', name: 'Conversation Starter', description: 'Get 50+ replies', xp: 500 },
    { id: 'growth_starter', name: 'Growth Starter', description: 'Invite 5 friends', xp: 250 },
    { id: 'pro_user', name: 'Pro User', description: 'Upgrade to Pro plan', xp: 1000 }
];

/**
 * Get user's game stats and achievements
 */
export const getGameStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        let stats = await prisma.gameStats.findUnique({ where: { userId } });

        if (!stats) {
            stats = await prisma.gameStats.create({
                data: { userId }
            });
        }

        const unlockedIds = stats.achievements ? JSON.parse(stats.achievements) : [];

        const achievementsStatus = ACHIEVEMENTS.map(ach => ({
            ...ach,
            unlocked: unlockedIds.includes(ach.id),
            unlockedAt: unlockedIds.includes(ach.id) ? new Date() : null // Simplified
        }));

        res.json({
            success: true,
            data: {
                stats,
                achievements: achievementsStatus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch game stats' });
    }
};

/**
 * Get Global Leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        // Fetch top users by XP (GameStats) or Referrals
        // This is a simplified mock-ish implementation since we don't have full real user data
        const topGrowthUsers = await prisma.referralCode.findMany({
            orderBy: { invites: 'desc' },
            take: 10,
            include: { user: { select: { name: true, avatar: true } } }
        });

        const leaderboard = topGrowthUsers.map((code, index) => ({
            rank: index + 1,
            name: code.user.name,
            avatar: code.user.avatar,
            score: code.invites, // Score based on invites for now
            metric: 'invites'
        }));

        res.json({ success: true, data: leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
    }
};

/**
 * Check and Unlock Achievement (Internal or Endpoint)
 */
export const checkAchievement = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { type } = req.body; // event type: 'campaign_sent', 'referral', etc.

        let stats = await prisma.gameStats.findUnique({ where: { userId } });
        if (!stats) stats = await prisma.gameStats.create({ data: { userId } });

        let unlockedIds: string[] = stats.achievements ? JSON.parse(stats.achievements) : [];
        let newUnlock = null;

        // Simple logic for demo
        if (type === 'first_campaign' && !unlockedIds.includes('first_campaign')) {
            unlockedIds.push('first_campaign');
            newUnlock = ACHIEVEMENTS.find(a => a.id === 'first_campaign');
        }

        if (newUnlock) {
            await prisma.gameStats.update({
                where: { userId },
                data: {
                    achievements: JSON.stringify(unlockedIds),
                    xp: { increment: newUnlock.xp },
                    level: { increment: 1 } // Simple level up
                }
            });
        }

        res.json({ success: true, newUnlock });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
