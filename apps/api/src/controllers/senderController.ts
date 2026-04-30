import { Request, Response } from 'express';

// In-memory storage for demo
const senders: Record<string, any> = {};
const warmupProgress: Record<string, any> = {};

interface Sender {
    id: string;
    userId: string;
    email: string;
    name: string;
    provider: 'gmail' | 'outlook' | 'smtp';
    status: 'active' | 'paused' | 'warming' | 'disconnected';
    reputation: number;
    dailyLimit: number;
    sentToday: number;
    warmupDay: number;
    authenticated: boolean;
    createdAt: Date;
}

/**
 * Connect a new email sender
 */
export const connectSender = async (req: Request, res: Response) => {
    try {
        const { email, name, provider, accessToken } = req.body;
        const userId = (req as any).user?.id;

        const senderId = `sender_${Date.now()}`;

        const sender: Sender = {
            id: senderId,
            userId,
            email,
            name: name || email.split('@')[0],
            provider,
            status: 'warming',
            reputation: 75,
            dailyLimit: 20, // Start with low limit during warmup
            sentToday: 0,
            warmupDay: 1,
            authenticated: true,
            createdAt: new Date()
        };

        senders[senderId] = sender;

        // Initialize warmup tracking
        warmupProgress[senderId] = {
            day: 1,
            targetDay: 14,
            schedule: [20, 25, 35, 45, 60, 80, 100, 130, 170, 220, 280, 350, 430, 500]
        };

        res.status(201).json({ success: true, sender });
    } catch (error: any) {
        console.error('Connect sender error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get all senders for user
 */
export const getSenders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const userSenders = Object.values(senders)
            .filter((s: any) => s.userId === userId);

        res.json({ success: true, senders: userSenders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get single sender
 */
export const getSender = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const sender = (senders as any)[id];

        if (!sender) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }

        // Include warmup progress
        const warmup = warmupProgress[id];

        res.json({
            success: true,
            sender,
            warmup: warmup ? {
                currentDay: warmup.day,
                targetDays: warmup.targetDay,
                progress: (warmup.day / warmup.targetDay) * 100,
                currentLimit: warmup.schedule[warmup.day - 1] || 500
            } : null
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Pause sender
 */
export const pauseSender = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const sender = (senders as any)[id];

        if (!sender) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }

        sender.status = 'paused';
        res.json({ success: true, sender });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Resume sender
 */
export const resumeSender = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const sender = (senders as any)[id];

        if (!sender) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }

        sender.status = sender.warmupDay < 14 ? 'warming' : 'active';
        res.json({ success: true, sender });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Disconnect sender
 */
export const disconnectSender = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);

        if (!(senders as any)[id]) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }

        delete (senders as any)[id];
        delete (warmupProgress as any)[id];

        res.json({ success: true, message: 'Sender disconnected' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get sender stats
 */
export const getSenderStats = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const sender = (senders as any)[id];

        if (!sender) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }

        // Simulated stats
        const stats = {
            senderId: id,
            totalSent: Math.floor(Math.random() * 1000) + 100,
            delivered: Math.floor(Math.random() * 950) + 90,
            opened: Math.floor(Math.random() * 400) + 50,
            clicked: Math.floor(Math.random() * 100) + 10,
            bounced: Math.floor(Math.random() * 20),
            complaints: Math.floor(Math.random() * 5),
            openRate: (Math.random() * 30 + 20).toFixed(1),
            clickRate: (Math.random() * 10 + 5).toFixed(1),
            bounceRate: (Math.random() * 3).toFixed(2),
            spamRate: (Math.random() * 0.5).toFixed(3)
        };

        res.json({ success: true, stats });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get deliverability score
 */
export const getDeliverability = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        // Aggregate score across all senders
        const score = {
            overall: 87,
            factors: {
                senderReputation: 92,
                authentication: 100,
                contentQuality: 85,
                listHygiene: 78,
                engagement: 80
            },
            recommendations: [
                'Remove 12 invalid emails from your list',
                'Add more personalization to improve engagement',
                'Consider reducing send volume during warmup'
            ],
            recentIssues: [
                { type: 'bounce', count: 3, lastOccurred: '2 hours ago' },
                { type: 'complaint', count: 1, lastOccurred: '1 day ago' }
            ]
        };

        res.json({ success: true, deliverability: score });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Run inbox placement test
 */
export const runInboxTest = async (req: Request, res: Response) => {
    try {
        const { senderId, testEmails } = req.body;

        // Simulate instant test results
        const results = {
            testId: `test_${Date.now()}`,
            senderId,
            status: 'completed',
            results: [
                { provider: 'Gmail', inbox: true, folder: 'Primary', score: 95 },
                { provider: 'Outlook', inbox: true, folder: 'Focused', score: 88 },
                { provider: 'Yahoo', inbox: true, folder: 'Inbox', score: 92 },
                { provider: 'Apple Mail', inbox: true, folder: 'Inbox', score: 90 }
            ],
            overallScore: 91,
            testedAt: new Date()
        };

        res.json({ success: true, test: results });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
