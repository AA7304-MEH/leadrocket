
import { Request, Response } from 'express';

export const analyzeReply = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;

        // Mock Analysis Delay
        await new Promise(resolve => setTimeout(resolve, 600));

        const lowerContent = content.toLowerCase();
        let category = "Neutral";
        let sentiment = 50;
        let suggestedReply = "Check this reply manually.";
        let nextSteps = ["Review manually"];

        // 1. Meeting Intent
        if (lowerContent.match(/schedule|calendar|time|meet|chat|call|zoom/)) {
            category = "Meeting Booked";
            sentiment = 90;
            suggestedReply = "Hi, I'm glad you're interested! Here is my calendar link to book a time: [Link]";
            nextSteps = ["Send Calendar Link", "Propose 3 Slots"];
        }
        // 2. Pricing Objection
        else if (lowerContent.match(/price|cost|budget|expensive/)) {
            category = "Objection: Pricing";
            sentiment = 40;
            suggestedReply = "I understand budget is a factor. We actually have a startup tier that might fit better. Would you be open to seeing that?";
            nextSteps = ["Send Pricing PDF", "Offer Discount"];
        }
        // 3. Competitor Objection
        else if (lowerContent.match(/competitor|using someone else|already have/)) {
            category = "Objection: Competitor";
            sentiment = 45;
            suggestedReply = "That's great. Many of our customers switched from them because of our AI features. Here's a comparison case study.";
            nextSteps = ["Send Comparison Case Study", "Ask about pain points"];
        }
        // 4. Positive/Interested
        else if (lowerContent.match(/interested|send more|info|details/)) {
            category = "Positive";
            sentiment = 80;
            suggestedReply = "Here is the information you requested. When would be a good time to discuss further?";
            nextSteps = ["Send One-Pager", "Follow up in 2 days"];
        }
        // 5. Unsubscribe
        else if (lowerContent.match(/unsubscribe|stop|remove/)) {
            category = "Unsubscribe";
            sentiment = 0;
            suggestedReply = "You have been removed from our list. Best of luck.";
            nextSteps = ["Mark as Do Not Contact"];
        }

        res.json({
            success: true,
            analysis: {
                category,
                sentiment,
                suggestedReply,
                nextSteps
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ success: false, message: 'Failed to analyze reply' });
    }
};
