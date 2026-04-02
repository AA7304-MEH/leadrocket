
interface CompetitorInfo {
    name: string;
    keywords: string[];
    templates: string[];
    counterStrategy: string;
}

const COMPETITORS: CompetitorInfo[] = [
    {
        name: 'HubSpot',
        keywords: ['hubspot', 'orange sprout', 'inbound marketing platform'],
        templates: ['let\'s grow better', 'hubspot crm', 'meeting link: meetings.hubspot.com'],
        counterStrategy: 'Emphasize our dedicated AI features and lower cost. HubSpot is great but expensive and generalist. Highlight our specialized "Reply to Close" assistant.'
    },
    {
        name: 'Salesforce',
        keywords: ['salesforce', 'sfmc', 'force.com'],
        templates: ['customer 360', 'trailhead', 'no software'],
        counterStrategy: 'Focus on simplicity and ease of use. Salesforce is complex and requires implementation partners. We can go live in minutes.'
    },
    {
        name: 'Outreach.io',
        keywords: ['outreach.io', 'sales execution platform'],
        templates: ['book a meeting', 'sales engagement'],
        counterStrategy: 'Highlight our all-in-one approach. Outreach focuses heavily on enterprise sales teams. We empower the founder/growth hacker directly.'
    }
];

export class CompetitiveService {

    static detectCompetitor(text: string): { name: string; strategy: string; template: string } | null {
        const lowerText = text.toLowerCase();

        for (const competitor of COMPETITORS) {
            // Check keywords
            const foundKeyword = competitor.keywords.some(k => lowerText.includes(k));
            // Check templates (simple substring match for now)
            const foundTemplate = competitor.templates.find(t => lowerText.includes(t));

            if (foundKeyword || foundTemplate) {
                return {
                    name: competitor.name,
                    strategy: competitor.counterStrategy,
                    template: foundTemplate || 'General Keyword Match'
                };
            }
        }

        return null;
    }
}
