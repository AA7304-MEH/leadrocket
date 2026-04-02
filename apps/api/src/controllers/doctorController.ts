
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

// Analyze Campaign
export const analyzeCampaign = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { subject, body, type } = req.body;
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey || apiKey.startsWith('AIza_your')) {
            // Mock Response
            return res.status(200).json({
                success: true,
                data: {
                    score: 42,
                    issues: [
                        { id: 1, type: 'critical', text: 'Subject line is too generic ("Hello")', fix: 'Use a benefit-driven subject line like "Question about [Company] growth"' },
                        { id: 2, type: 'warning', text: 'No capitalization in greeting', fix: 'Capitalize "Hi [Name]"' },
                        { id: 3, type: 'warning', text: 'Body text is too long (200+ words)', fix: 'Shorten to under 100 words for mobile readability' }
                    ],
                    fixedContent: {
                        subject: 'Question about [Company] growth',
                        body: `Hi [Name],\n\nI saw you're leading [Department] at [Company].\n\nWe help teams like yours scale 2x faster.\n\nWorth a chat?\n\nBest,\n[Your Name]`
                    },
                    predictedImprovement: '28%'
                },
                message: 'Mock analysis generated (Add Google AI Key for Real Analysis)'
            });
        }

        const prompt = `
    Analyze this cold outreach campaign and provide a score, issues, and a rewriting.

    Campaign Type: ${type || 'Cold Email'}
    Subject: ${subject}
    Body: ${body}

    Evaluation Criteria:
    - Subject Line: Curiosity, brevity, relevance.
    - Personalization: Use of variables, specific references.
    - Length: Short, scannable (under 150 words).
    - Call to Action: Clear, low friction.
    - Tone: Professional but conversational, not salesy.

    Return ONLY a JSON object with this structure:
    {
      "score": number (0-100),
      "issues": [
         { "type": "critical" | "warning" | "info", "text": "Issue description", "fix": "Specific fix suggestion" }
      ],
      "fixedContent": {
        "subject": "Better subject line",
        "body": "Better body text"
      },
      "predictedImprovement": "Percentage string"
    }
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Google Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        let text = (data as any).candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch (e) {
            throw new Error('Failed to parse AI response');
        }

        res.status(200).json({
            success: true,
            data: analysis
        });

    } catch (error) {
        next(error);
    }
};
