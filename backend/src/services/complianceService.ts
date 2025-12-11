
interface RiskFactor {
    phrase: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    category: 'Spam Trigger' | 'GDPR' | 'False Promise' | 'Urgency';
    suggestion: string;
}

const RISK_DATABASE: RiskFactor[] = [
    { phrase: 'guaranteed', riskLevel: 'High', category: 'False Promise', suggestion: 'Use "proven" or "reliable" instead.' },
    { phrase: '100% free', riskLevel: 'High', category: 'Spam Trigger', suggestion: 'Use "complimentary access".' },
    { phrase: 'no risk', riskLevel: 'Medium', category: 'False Promise', suggestion: 'Clarify the terms instead.' },
    { phrase: 'urgent', riskLevel: 'Low', category: 'Urgency', suggestion: 'Use specific deadlines instead.' },
    { phrase: 'act now', riskLevel: 'Medium', category: 'Spam Trigger', suggestion: 'Use "limited availability".' },
    { phrase: 'winner', riskLevel: 'High', category: 'Spam Trigger', suggestion: 'avoid prize terminology.' }
];

export class ComplianceService {
    static analyzeContent(text: string): { score: number; riskLevel: string; warnings: any[] } {
        const lowerText = text.toLowerCase();
        const warnings = [];
        let score = 100;

        for (const factor of RISK_DATABASE) {
            if (lowerText.includes(factor.phrase)) {
                warnings.push({
                    detected: factor.phrase,
                    level: factor.riskLevel,
                    category: factor.category,
                    suggestion: factor.suggestion
                });

                if (factor.riskLevel === 'High') score -= 20;
                else if (factor.riskLevel === 'Medium') score -= 10;
                else score -= 5;
            }
        }

        // GDPR basic check
        if (!lowerText.includes('unsubscribe') && !lowerText.includes('opt-out')) {
            warnings.push({
                detected: 'Missing Unsubscribe',
                level: 'High',
                category: 'GDPR',
                suggestion: 'You must include an unsubscribe link.'
            });
            score -= 30;
        }

        score = Math.max(0, score);
        let riskLevel = 'Low';
        if (score < 60) riskLevel = 'High';
        else if (score < 85) riskLevel = 'Medium';

        return { score, riskLevel, warnings };
    }
}
