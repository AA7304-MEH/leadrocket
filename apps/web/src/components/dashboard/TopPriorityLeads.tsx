
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Sparkles } from 'lucide-react';

interface PriorityLead {
    _id: string;
    companyName: string;
    contactName: string;
    predictive: {
        score: number;
        reason: string;
        probability: 'Low' | 'Medium' | 'High';
    };
    enrichment: {
        funding: string;
    };
}

export const TopPriorityLeads: React.FC = () => {
    const [leads, setLeads] = useState<PriorityLead[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTopLeads = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/leads/predictive/top', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setLeads(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch priority leads', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopLeads();
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            Top Engagement Opportunities
                        </CardTitle>
                        <CardDescription>AI-ranked leads most likely to convert right now.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : leads.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">No analyzed leads yet. Enrich your leads to see rankings.</div>
                ) : (
                    <div className="space-y-4">
                        {leads.map((lead, i) => (
                            <div key={lead._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getScoreColor(lead.predictive?.score || 0)}`}>
                                        {lead.predictive?.score || 0}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{lead.companyName}</h4>
                                        <p className="text-xs text-muted-foreground">{lead.contactName} • {lead.enrichment?.funding || 'No Funding Data'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={lead.predictive?.probability === 'High' ? 'default' : 'secondary'}>
                                        {lead.predictive?.probability} Probability
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground mt-1 max-w-[150px] truncate" title={lead.predictive?.reason}>
                                        {lead.predictive?.reason}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
