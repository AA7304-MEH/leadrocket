
interface TeamMember {
    id: string;
    name: string;
    role: string;
    metrics: {
        emailsSent: number;
        openRate: number;
        replyRate: number;
        meetingsBooked: number;
    };
    avatar: string; // Initials or URL
}

interface CoachingTip {
    category: 'Subject Line' | 'Content' | 'Call to Action' | 'Follow-up';
    severity: 'Low' | 'Medium' | 'High';
    suggestion: string;
    impact: string; // e.g. "+15% Reply Rate"
}

export class CoachingService {
    static getTeamStats(userId: string): TeamMember[] {
        // Mocking a team for the user
        return [
            {
                id: userId, // The current user
                name: 'You',
                role: 'Account Executive',
                metrics: {
                    emailsSent: 145,
                    openRate: 42,
                    replyRate: 8.5,
                    meetingsBooked: 12
                },
                avatar: 'YOU'
            },
            {
                id: 'mock-1',
                name: 'Alice Cooper',
                role: 'Top Performer',
                metrics: {
                    emailsSent: 320,
                    openRate: 65,
                    replyRate: 14.2,
                    meetingsBooked: 28
                },
                avatar: 'AC'
            },
            {
                id: 'mock-2',
                name: 'Bob Miller',
                role: 'Sales Rep',
                metrics: {
                    emailsSent: 210,
                    openRate: 48,
                    replyRate: 9.1,
                    meetingsBooked: 15
                },
                avatar: 'BM'
            },
            {
                id: 'mock-3',
                name: 'Sarah Jenkins',
                role: 'SDR',
                metrics: {
                    emailsSent: 180,
                    openRate: 38,
                    replyRate: 6.5,
                    meetingsBooked: 8
                },
                avatar: 'SJ'
            }
        ];
    }

    static getCoachingTips(userId: string): CoachingTip[] {
        // Mock AI analysis of user's recent performance
        return [
            {
                category: 'Subject Line',
                severity: 'High',
                suggestion: 'Your subject lines average 9 words. Top performers use 3-5 words.',
                impact: '+15% Open Rate'
            },
            {
                category: 'Call to Action',
                severity: 'Medium',
                suggestion: 'You are using "Let me know" too often. Try specific time proposals.',
                impact: '+22% Reply Rate'
            },
            {
                category: 'Content',
                severity: 'Low',
                suggestion: 'Your emails score 90% on readability. Great job!',
                impact: 'Maintain Trust'
            }
        ];
    }
}
