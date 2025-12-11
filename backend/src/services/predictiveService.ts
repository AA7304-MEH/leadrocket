
import { ILead } from '../models/Lead';

interface ScoringResult {
    score: number;
    reason: string;
    probability: 'Low' | 'Medium' | 'High';
}

export class PredictiveService {

    static scoreLead(lead: any): ScoringResult {
        let score = 50; // Base score
        const reasons: string[] = [];

        // 1. Funding Stage (Mock data source)
        const funding = lead.enrichment?.funding || lead.metadata?.funding || '';
        if (funding.match(/Series [B-E]/i) || funding.match(/IPO/i)) {
            score += 25;
            reasons.push('High Growth Funding (Series B+)');
        } else if (funding.match(/Seed/i) || funding.match(/Series A/i)) {
            score += 10;
            reasons.push('Early Stage Growth');
        }

        // 2. Company Size
        const size = lead.enrichment?.companySize || lead.companySize || '';
        if (size.match(/50-200|200-500|500\+/)) {
            score += 15;
            reasons.push('Optimal Company Size (50+)');
        }

        // 3. LinkedIn Activity (Mock)
        // In real app, we check if last post was < 7 days ago
        const activity = lead.enrichment?.linkedinActivity || 'Moderate';
        if (activity === 'High') {
            score += 20;
            reasons.push('Active on LinkedIn (Daily posts)');
        } else if (activity === 'Low') {
            score -= 10;
            reasons.push('Inactive on LinkedIn');
        }

        // 4. Web Traffic (Mock)
        const traffic = lead.enrichment?.webTraffic || 'Low';
        if (traffic === 'High') {
            score += 10;
            reasons.push('High Website Traffic');
        }

        // Cap score
        score = Math.min(100, Math.max(0, score));

        // Determine Probability
        let probability: 'Low' | 'Medium' | 'High' = 'Medium';
        if (score >= 80) probability = 'High';
        if (score < 40) probability = 'Low';

        return {
            score,
            reason: reasons.length > 0 ? `Score ${score}: ${reasons.join(', ')}` : `Score ${score}: Standard engagement profile`,
            probability
        };
    }
}
