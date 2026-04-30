
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

import { leadsApi } from '../../lib/api';
import type { CompetitorLead } from '../../lib/api';

export const CompetitorAlert: React.FC = () => {
    const [alerts, setAlerts] = useState<CompetitorLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadAlerts() {
            try {
                setLoading(true);
                setError(null);
                const data = await leadsApi.getCompetitorAlerts();
                if (!cancelled) setAlerts(data);
            } catch (err: any) {
                if (!cancelled) setError(err.message ?? 'Failed to load alerts');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAlerts();
        const interval = setInterval(loadAlerts, 60000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    if (loading) {
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
                <CardContent className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/50 animate-pulse rounded-lg border border-red-100" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full border-red-200 bg-red-50/10">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-red-600 font-medium mb-2">Failed to load alerts</p>
                    <p className="text-xs text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (alerts.length === 0) {
        return (
            <Card className="h-full border-gray-200 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                    <div className="text-3xl mb-2">🛡️</div>
                    <p className="font-medium text-gray-700">No competitor mentions detected</p>
                    <p className="text-xs mt-1 max-w-[200px]">
                        Alerts appear here when HubSpot, Salesforce, or Outreach.io
                        are detected in your lead conversations
                    </p>
                </CardContent>
            </Card>
        );
    }

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
                        <div key={alert.id} className="flex flex-col p-3 border border-red-100 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm">{alert.contactName} at {alert.companyName}</h4>
                                <Badge variant="destructive" className="text-[10px]">
                                    {alert.competitorInsights?.detectedCompetitors?.[0]}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-red-600 mb-2">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Detected: {alert.competitorInsights?.mentionContext}</span>
                            </div>
                            <div className="bg-red-50 p-2 rounded text-xs text-red-800">
                                <strong>Counter:</strong> {alert.competitorInsights?.counterStrategies?.[0]}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
