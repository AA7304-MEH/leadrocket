import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Remix a campaign content using AI (Mocked for now)
 * POST /api/ai/remix
 */
export const remixContent = async (req: AuthRequest, res: Response) => {
    try {
        const { content, tone, intention } = req.body;

        // In a real app, we would call OpenAI/Gemini here.
        // For the demo, we simulate AI processing.

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

        let remixed = content;

        if (tone === 'witty') {
            remixed = `Hey there! 🚀\n\n${content}\n\nP.S. I promise I'm not a robot, just a fan of efficiency!`;
        } else if (tone === 'urgent') {
            remixed = `Urgent: ${content}\n\nLet's move fast on this.`;
        } else if (tone === 'empathic') {
            remixed = `Hi,\n\nI noticed you might be struggling with ${intention || 'growth'}.\n\n${content}\n\nHere to help,`;
        }

        res.json({
            success: true,
            data: {
                original: content,
                remixed: remixed,
                toneUsed: tone
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'AI Remix failed' });
    }
};

/**
 * Calculate Predictive Health Score
 * GET /api/ai/score
 */
export const getPredictiveScore = async (req: AuthRequest, res: Response) => {
    try {
        // Mock score calculation based on "historical data"
        const score = Math.floor(Math.random() * (98 - 75 + 1) + 75); // Random between 75 and 98

        let insight = "Good health";
        if (score > 90) insight = "Excellent! You're viral ready.";
        else if (score < 80) insight = "Improve your subject lines for better open rates.";

        res.json({
            success: true,
            data: {
                score,
                insight,
                trends: [
                    { day: 'Mon', value: 82 },
                    { day: 'Tue', value: 85 },
                    { day: 'Wed', value: 88 },
                    { day: 'Thu', value: score },
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Scoring failed' });
    }
};
