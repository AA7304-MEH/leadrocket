import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';

interface ReferralStatsProps {
    stats: {
        invites: number;
        clicks: number;
        earnings: number;
        tier: {
            current: string;
            next: string;
            progress: number;
        };
    };
}

export const ReferralStats: React.FC<ReferralStatsProps> = ({ stats }) => {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.invites}</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.clicks}</div>
                        <p className="text-xs text-muted-foreground">12% conversion rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.earnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Available for payout</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tier.current}</div>
                        <p className="text-xs text-muted-foreground">Next: {stats.tier.next}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Level Progress</CardTitle>
                        <span className="text-sm font-medium text-muted-foreground">
                            {Math.round(stats.tier.progress)}% to {stats.tier.next}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={stats.tier.progress} className="h-2 w-full" />
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                        <span>{stats.tier.current}</span>
                        <span>{stats.tier.next}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
