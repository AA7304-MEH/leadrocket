import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const HealthScoreWidget = () => {
    const [score, setScore] = useState(0);
    const [insight, setInsight] = useState("Analyzing...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/score`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setScore(data.data.score);
                        setInsight(data.data.insight);
                    }
                }
            } catch (error) {
                console.error("Failed to get score");
            } finally {
                setLoading(false);
            }
        };
        fetchScore();
    }, []);

    let color = "text-green-500";
    if (score < 80) color = "text-yellow-500";
    if (score < 60) color = "text-red-500";

    if (loading) return <div className="h-full flex items-center justify-center p-6"><Activity className="animate-pulse text-gray-300" /></div>;

    return (
        <Card className="glass-card h-full overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full ${score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                    <span>Predictive Health Score</span>
                    <Activity className="w-4 h-4" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2 mb-2">
                    <span className={`text-4xl font-bold ${color} count-up`}>{score}</span>
                    <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                    {score >= 80 ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                    <p className="leading-tight">{insight}</p>
                </div>
            </CardContent>
        </Card>
    );
};
