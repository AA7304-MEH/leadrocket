import React, { useEffect, useState } from 'react';
import { ReferralStats } from '@/components/growth/ReferralStats';
import { ShareWidget } from '@/components/growth/ShareWidget';
import { RewardTierCard } from '@/components/growth/RewardTierCard';
import { AchievementsDashboard } from '@/components/growth/AchievementsDashboard';
import { LeaderboardWidget } from '@/components/growth/LeaderboardWidget';
import { Rocket, Trophy, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Growth() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        const fetchGrowth = async () => {
            try {
                // Check for token
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Get Code if not exists
                let codeRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/growth/referral-code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                let codeData = await codeRes.json();

                // 2. Get Stats
                const statsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/growth`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();

                if (statsData.success) {
                    setData(statsData.data);
                    if (codeData.data) {
                        setReferralLink(`${window.location.origin}/join/${codeData.data.code}`);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrowth();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Rocket className="mr-2 h-8 w-8 text-primary" /> Viral Growth Engine
                    </h1>
                    <p className="text-muted-foreground mt-2">Invite friends, earn ongoing commissions, and unlock exclusive rewards.</p>
                </div>
            </div>

            {data && <ReferralStats stats={data} />}

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                    <ShareWidget referralLink={referralLink || 'Loading...'} />
                    <LeaderboardWidget />
                </div>

                <div className="md:col-span-2 space-y-6">
                    <AchievementsDashboard />

                    <h2 className="text-xl font-semibold flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Reward Tiers
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <RewardTierCard
                            name="Growth Starter"
                            invitesRequired={5}
                            reward="Pro Features (1 Mo)"
                            currentInvites={data?.referralCode?.invites || 0}
                            benefits={['Unlock AI Writer', 'Remove Branding', 'Priority Support']}
                        />
                        <RewardTierCard
                            name="Growth Pro"
                            invitesRequired={20}
                            reward="Scale Plan (3 Mos)"
                            currentInvites={data?.referralCode?.invites || 0}
                            benefits={['Unlimited Leads', 'API Access', 'Dedicated Manager']}
                        />
                    </div>

                    <Card className="bg-gradient-to-r from-primary/10 to-transparent border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">Growth Legend Status</h3>
                                    <p className="text-sm text-muted-foreground">Reach 50 invites to get lifetime 20% discount on all plans.</p>
                                </div>
                                <div className="text-3xl font-bold text-primary">50</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
