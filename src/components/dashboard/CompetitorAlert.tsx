
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface CompetitorLead {
    _id: string;
    companyName: string;
    competitorInsights: {
        detectedCompetitor: string;
        lastActivity: string;
        detectedTemplate: string;
        counterStrategy: string;
    };
}

export const CompetitorAlert: React.FC = () => {
    // In a real app we'd fetch this from an API endpoint like /api/leads/competitors/recent
    // For now we will mock it or fetch leads and filter client side for the demo
    const [alerts, setAlerts] = useState<CompetitorLead[]>([]);

    useEffect(() => {
        // Mock data for the visual widget until we have enough real data
        setAlerts([
            {
                _id: '1',
                companyName: 'Acme Corp',
                competitorInsights: {
                    detectedCompetitor: 'HubSpot',
                    lastActivity: new Date().toISOString(),
                    detectedTemplate: 'meeting link',
                    counterStrategy: 'Emphasize personalized AI features.'
                }
            },
            {
                _id: '2',
                companyName: 'Global Tech',
                competitorInsights: {
                    detectedCompetitor: 'Salesforce',
                    lastActivity: new Date().toISOString(),
                    detectedTemplate: 'customer 360',
                    counterStrategy: 'Focus on ease of use and speed.'
                }
            }
        ]);
    }, []);

    return (
        <Card className="h-full border-red-200 bg-red-50/10">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <ShieldAlert className="h-5 w-5" />
                            Competitor Activity
                        </CardTitle>
                        <CardDescription>Recent competitive threats detected.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div key={alert._id} className="flex flex-col p-3 border border-red-100 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm">{alert.companyName}</h4>
                                <Badge variant="destructive" className="text-[10px]">
                                    {alert.competitorInsights.detectedCompetitor}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-red-600 mb-2">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Detected {alert.competitorInsights.detectedTemplate}</span>
                            </div>
                            <div className="bg-red-50 p-2 rounded text-xs text-red-800">
                                <strong>Counter:</strong> {alert.competitorInsights.counterStrategy}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
