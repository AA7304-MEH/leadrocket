
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';

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
    avatar: string;
}

interface CoachingTip {
    category: string;
    severity: 'Low' | 'Medium' | 'High';
    suggestion: string;
    impact: string;
}

const CoachingDashboard = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [tips, setTips] = useState<CoachingTip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [teamRes, tipsRes] = await Promise.all([
                    fetch('/api/coaching/team-stats', { headers }),
                    fetch('/api/coaching/tips', { headers })
                ]);

                if (teamRes.ok) setTeam((await teamRes.json()).data);
                if (tipsRes.ok) setTips((await tipsRes.json()).data);
            } catch (error) {
                console.error("Failed to fetch coaching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getSeverityColor = (severity: string) => {
        if (severity === 'High') return 'bg-red-100 text-red-800 border-red-200';
        if (severity === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Sales Coach</h1>
                    <p className="text-muted-foreground">Team intelligence and personalized performance coaching.</p>
                </div>
            </div>

            {/* Top Row: Personal Coach & Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Coach's Corner */}
                <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Coach's Corner
                        </CardTitle>
                        <CardDescription>Personalized AI feedback for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? <p>Loading insights...</p> : tips.map((tip, i) => (
                            <div key={i} className="p-3 bg-white rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={getSeverityColor(tip.severity)}>
                                        {tip.category}
                                    </Badge>
                                    <span className="text-xs font-bold text-green-600">{tip.impact}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {tip.suggestion}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 2. Team Leaderboard */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Team Leaderboard
                        </CardTitle>
                        <CardDescription>Benchmarking against top performers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">Rep</th>
                                        <th className="h-10 px-4 text-right font-medium text-muted-foreground">Emails</th>
                                        <th className="h-10 px-4 text-right font-medium text-muted-foreground">Open Rate</th>
                                        <th className="h-10 px-4 text-right font-medium text-muted-foreground">Reply Rate</th>
                                        <th className="h-10 px-4 text-right font-medium text-muted-foreground">Meetings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading team data...</td></tr> :
                                        team.sort((a, b) => b.metrics.meetingsBooked - a.metrics.meetingsBooked).map((member) => (
                                            <tr key={member.id} className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${member.name === 'You' ? 'bg-blue-50/50' : ''}`}>
                                                <td className="p-4 font-medium flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{member.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            {member.name}
                                                            {member.name === 'You' && <Badge variant="secondary" className="text-[10px] h-4">YOU</Badge>}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground font-normal block">{member.role}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">{member.metrics.emailsSent}</td>
                                                <td className="p-4 text-right">{member.metrics.openRate}%</td>
                                                <td className="p-4 text-right font-semibold text-green-600">{member.metrics.replyRate}%</td>
                                                <td className="p-4 text-right font-bold">{member.metrics.meetingsBooked}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CoachingDashboard;
