import { Request, Response } from 'express';

// In-memory storage for demo (use database in production)
const abTests: Record<string, any> = {};

interface ABTestVariant {
    id: string;
    name: string;
    subject: string;
    content: string;
    sends: number;
    opens: number;
    clicks: number;
    replies: number;
}

interface ABTest {
    id: string;
    campaignId: string;
    name: string;
    testType: 'subject' | 'content' | 'full';
    variants: ABTestVariant[];
    sampleSize: number;
    winnerCriteria: 'opens' | 'clicks' | 'replies';
    status: 'draft' | 'running' | 'completed';
    winnerId?: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    userId: string;
}

/**
 * Create a new A/B test
 */
export const createABTest = async (req: Request, res: Response) => {
    try {
        const { campaignId, name, testType, variants, sampleSize, winnerCriteria } = req.body;
        const userId = (req as any).user?.id;

        const testId = `abtest_${Date.now()}`;

        const test: ABTest = {
            id: testId,
            campaignId,
            name,
            testType,
            variants: variants.map((v: any, i: number) => ({
                id: `var_${i + 1}`,
                name: v.name || `Variant ${String.fromCharCode(65 + i)}`,
                subject: v.subject,
                content: v.content,
                sends: 0,
                opens: 0,
                clicks: 0,
                replies: 0
            })),
            sampleSize: sampleSize || 20,
            winnerCriteria: winnerCriteria || 'opens',
            status: 'draft',
            createdAt: new Date(),
            userId
        };

        abTests[testId] = test;

        res.status(201).json({ success: true, test });
    } catch (error: any) {
        console.error('Create A/B test error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get all A/B tests for user
 */
export const getABTests = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { campaignId } = req.query;

        let tests = Object.values(abTests).filter((t: any) => t.userId === userId);

        if (campaignId) {
            tests = tests.filter((t: any) => t.campaignId === campaignId);
        }

        res.json({ success: true, tests });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get single A/B test
 */
export const getABTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = abTests[id];

        if (!test) {
            return res.status(404).json({ success: false, error: 'A/B test not found' });
        }

        res.json({ success: true, test });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Start A/B test
 */
export const startABTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = abTests[id];

        if (!test) {
            return res.status(404).json({ success: false, error: 'A/B test not found' });
        }

        test.status = 'running';
        test.startedAt = new Date();

        // Simulate initial sends
        test.variants.forEach((v: ABTestVariant) => {
            v.sends = Math.floor(Math.random() * 50) + 10;
            v.opens = Math.floor(v.sends * (Math.random() * 0.4 + 0.1));
            v.clicks = Math.floor(v.opens * (Math.random() * 0.3 + 0.05));
            v.replies = Math.floor(v.clicks * (Math.random() * 0.2 + 0.02));
        });

        res.json({ success: true, test });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Stop A/B test and declare winner
 */
export const stopABTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = abTests[id];

        if (!test) {
            return res.status(404).json({ success: false, error: 'A/B test not found' });
        }

        // Determine winner based on criteria
        const criteria = test.winnerCriteria as keyof Pick<ABTestVariant, 'opens' | 'clicks' | 'replies'>;
        let winner = test.variants[0] as ABTestVariant;

        test.variants.forEach((v: ABTestVariant) => {
            const rate = v.sends > 0 ? v[criteria] / v.sends : 0;
            const winnerRate = winner.sends > 0 ? winner[criteria] / winner.sends : 0;
            if (rate > winnerRate) {
                winner = v;
            }
        });

        test.status = 'completed';
        test.winnerId = winner.id;
        test.completedAt = new Date();

        res.json({
            success: true,
            test,
            winner: {
                id: winner.id,
                name: winner.name,
                [criteria]: winner[criteria],
                rate: winner.sends > 0 ? ((winner[criteria] / winner.sends) * 100).toFixed(1) : 0
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get A/B test results
 */
export const getABTestResults = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = abTests[id];

        if (!test) {
            return res.status(404).json({ success: false, error: 'A/B test not found' });
        }

        const results = test.variants.map((v: ABTestVariant) => ({
            id: v.id,
            name: v.name,
            sends: v.sends,
            opens: v.opens,
            clicks: v.clicks,
            replies: v.replies,
            openRate: v.sends > 0 ? ((v.opens / v.sends) * 100).toFixed(1) : 0,
            clickRate: v.opens > 0 ? ((v.clicks / v.opens) * 100).toFixed(1) : 0,
            replyRate: v.sends > 0 ? ((v.replies / v.sends) * 100).toFixed(1) : 0,
            isWinner: v.id === test.winnerId
        }));

        res.json({
            success: true,
            testId: id,
            status: test.status,
            winnerCriteria: test.winnerCriteria,
            results
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Delete A/B test
 */
export const deleteABTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!abTests[id]) {
            return res.status(404).json({ success: false, error: 'A/B test not found' });
        }

        delete abTests[id];
        res.json({ success: true, message: 'A/B test deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
