import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Medal, Lock, CheckCircle2 } from 'lucide-react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    xp: number;
    unlocked: boolean;
    unlockedAt?: string;
}

interface Stats {
    level: number;
    xp: number;
    streakCurrent: number;
}

export const AchievementsDashboard = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/gamification/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setAchievements(data.data.achievements);
                    setStats(data.data.stats);
                }
            } catch (error) {
                console.error("Failed to load achievements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading Achievements...</div>;

    const nextLevelXp = (stats?.level || 1) * 1000;
    const progress = stats ? (stats.xp / nextLevelXp) * 100 : 0;

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-2xl font-bold">Level {stats?.level || 1}</h3>
                            <p className="text-indigo-100">Growth Hacker</p>
                        </div>
                        <Trophy className="w-12 h-12 text-yellow-300 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>{stats?.xp || 0} XP</span>
                            <span>{nextLevelXp} XP</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-white/20" />
                        <p className="text-xs text-indigo-200 mt-2">
                            {nextLevelXp - (stats?.xp || 0)} XP to next level
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((ach) => (
                    <Card key={ach.id} className={`${ach.unlocked ? 'border-green-200 bg-green-50/30' : 'opacity-70 border-dashed'}`}>
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${ach.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {ach.unlocked ? <Medal className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{ach.name}</h4>
                                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                                </div>
                            </div>
                            <Badge variant={ach.unlocked ? "default" : "outline"}>
                                +{ach.xp} XP
                            </Badge>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};
