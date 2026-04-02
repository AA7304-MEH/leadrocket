import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    metric: string;
    avatar?: string;
}

export const LeaderboardWidget = () => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // Mock data for demo purposes if backend empty
            const mockData: LeaderboardEntry[] = [
                { rank: 1, name: "Sarah Chen", score: 42, metric: "invites", avatar: "" },
                { rank: 2, name: "Mike Ross", score: 38, metric: "invites", avatar: "" },
                { rank: 3, name: "Jessica P.", score: 31, metric: "invites", avatar: "" },
                { rank: 4, name: "Alex T.", score: 24, metric: "invites", avatar: "" },
                { rank: 5, name: "David K.", score: 18, metric: "invites", avatar: "" },
            ];

            // Try fetching real data
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/gamification/leaderboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.data.length > 0) {
                        setLeaders(data.data);
                    } else {
                        setLeaders(mockData);
                    }
                } else {
                    setLeaders(mockData);
                }
            } catch (error) {
                setLeaders(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="text-sm font-bold text-gray-500 w-5 text-center">{rank}</span>;
    };

    if (loading) return <div>Loading Leaderboard...</div>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" /> Global Growth Leaders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leaders.map((leader) => (
                        <div key={leader.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 flex justify-center">
                                    {getRankIcon(leader.rank)}
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={leader.avatar} />
                                    <AvatarFallback>{leader.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium text-sm">{leader.name}</div>
                            </div>
                            <div className="font-bold text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                {leader.score} Invites
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
