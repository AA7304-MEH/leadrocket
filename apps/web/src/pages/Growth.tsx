import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Rocket, 
    Share2, 
    Copy, 
    Twitter, 
    Linkedin, 
    MessageCircle, 
    Trophy,
    CheckCircle2,
    Star,
    Zap,
    TrendingUp,
    Users,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api';
import confetti from 'canvas-confetti';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';

const Growth: React.FC = () => {
    const { user } = useAuth();
    
    const { data: statsData, isLoading, refetch } = useQuery({
        queryKey: ['referral-stats'],
        queryFn: async () => {
            const res = await referralsApi.getStats();
            return res.data.data;
        },
        enabled: !!user
    });

    const { data: leaderboardData } = useQuery({
        queryKey: ['referral-leaderboard'],
        queryFn: async () => {
            const res = await referralsApi.getLeaderboard();
            return res.data.data;
        },
        enabled: !!user
    });

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('referral-updates')
            .on(
                'postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'referrals',
                    filter: `referrerId=eq.${user.id}` 
                }, 
                (payload) => {
                    refetch();
                    if (payload.eventType === 'UPDATE' && (payload.new as any).status === 'converted') {
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, refetch]);

    const copyToClipboard = () => {
        if (!statsData?.referralLink) return;
        navigator.clipboard.writeText(statsData.referralLink);
        toast.success('Referral link copied!');
        confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 }
        });
    };

    const shareSocial = (platform: string) => {
        const link = statsData?.referralLink;
        if (!link) return;
        
        let url = '';
        switch(platform) {
            case 'twitter': 
                url = `https://twitter.com/intent/tweet?text=I'm using LeadRockets for AI-powered sales outreach. Join me:&url=${encodeURIComponent(link)}`; 
                break;
            case 'linkedin': 
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`; 
                break;
            case 'whatsapp': 
                url = `https://wa.me/?text=Check out LeadRockets: ${encodeURIComponent(link)}`; 
                break;
        }
        window.open(url, '_blank');
    };

    if (isLoading) return <div className="p-12 text-center text-white">Loading Growth Engine...</div>;

    const stats = statsData || {
        totalReferrals: 0,
        convertedReferrals: 0,
        totalCreditsEarned: 0,
        currentCredits: 0,
        referralLink: '',
        referrals: [],
        recentTransactions: []
    };

    const tiers = [
        { referrals: 1,  reward: '500 AI Credits',           color: 'from-amber-700 to-amber-900', label: 'Bronze' },
        { referrals: 3,  reward: '1,000 Bonus Credits',       color: 'from-slate-400 to-slate-600', label: 'Silver' },
        { referrals: 5,  reward: '2,500 Credits + Pro Badge',  color: 'from-amber-400 to-amber-600', label: 'Gold'   },
        { referrals: 10, reward: 'Founding Member + 5,000 Credits', color: 'from-blue-500 to-indigo-600', label: 'Diamond' }
    ];

    const currentTierIndex = tiers.findLastIndex(t => stats.convertedReferrals >= t.referrals);
    const nextTier = tiers.find(t => stats.convertedReferrals < t.referrals);
    const progress = nextTier 
        ? ((stats.convertedReferrals - (currentTierIndex >= 0 ? tiers[currentTierIndex].referrals : 0)) / (nextTier.referrals - (currentTierIndex >= 0 ? tiers[currentTierIndex].referrals : 0))) * 100
        : 100;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 pt-8">
            {/* SECTION 1 — Hero referral widget */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20"
            >
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-6 flex-1 w-full">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                            Growth Engine 🚀
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                            Your Growth Engine
                        </h1>
                        <p className="text-xl text-blue-100 font-medium max-w-md">
                            Invite your friends and earn massive AI credits for every conversion.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex-1 relative group">
                                <Input 
                                    readOnly 
                                    value={stats.referralLink}
                                    className="h-14 bg-white/10 border-white/20 text-white font-bold pl-4 pr-12 rounded-2xl backdrop-blur-md"
                                />
                                <Button 
                                    size="icon" 
                                    className="absolute right-2 top-2 h-10 w-10 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-transform active:scale-95"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => shareSocial('linkedin')} className="h-14 w-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md">
                                    <Linkedin className="w-6 h-6" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => shareSocial('twitter')} className="h-14 w-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md">
                                    <Twitter className="w-6 h-6" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => shareSocial('whatsapp')} className="h-14 w-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md">
                                    <MessageCircle className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <StatCard icon={<Users className="text-blue-200"/>} label="Total Referrals" value={stats.totalReferrals} />
                        <StatCard icon={<CheckCircle2 className="text-green-300"/>} label="Converted" value={stats.convertedReferrals} />
                        <StatCard icon={<TrendingUp className="text-purple-300"/>} label="Credits Earned" value={stats.totalCreditsEarned.toLocaleString()} />
                        <StatCard icon={<Zap className="text-amber-300"/>} label="Current Balance" value={stats.currentCredits.toLocaleString()} />
                    </div>
                </div>
            </motion.div>

            {/* SECTION 2 — Rewards ladder */}
            <Card className="border-none bg-[#0D0D0D] shadow-xl p-8">
                <CardHeader className="px-0">
                    <CardTitle className="text-3xl font-black tracking-tight flex items-center gap-2 text-white">
                        <Trophy className="w-8 h-8 text-amber-500" />
                        Rewards Ladder
                    </CardTitle>
                    <CardDescription>Climb the ranks and unlock premium rewards.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pt-8">
                    <div className="space-y-12">
                        {tiers.map((tier, i) => (
                            <motion.div 
                                key={tier.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${
                                    stats.convertedReferrals >= tier.referrals 
                                        ? 'border-blue-600 bg-blue-600/10' 
                                        : i === currentTierIndex + 1 ? 'border-slate-800 bg-white/5' : 'border-white/5 opacity-50'
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.color} shadow-lg shrink-0`}>
                                    {stats.convertedReferrals >= tier.referrals ? <CheckCircle2 className="w-8 h-8 text-white" /> : <Star className="w-8 h-8 text-white/50" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-xl font-black text-white">{tier.label} Tier</h4>
                                        <span className="text-sm font-bold text-slate-500">{tier.referrals} Referrals</span>
                                    </div>
                                    <p className="text-slate-400 font-medium">{tier.reward}</p>
                                    {i === currentTierIndex + 1 && (
                                        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-blue-600"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 3 — Activity + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none bg-[#0D0D0D] shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black flex items-center gap-2 text-white">
                            <Clock className="w-6 h-6 text-blue-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stats.recentTransactions.length > 0 ? stats.recentTransactions.map((t: any) => (
                            <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {t.amount > 0 ? <Zap className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">{t.description}</p>
                                    <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}</p>
                                </div>
                                <div className={`text-sm font-black ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.amount > 0 ? '+' : ''}{t.amount}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-slate-500">No recent activity.</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none bg-[#0D0D0D] shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black flex items-center gap-2 text-white">
                            <Trophy className="w-6 h-6 text-amber-500" />
                            Top Referrers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-2xl overflow-hidden border border-white/5">
                            <table className="w-full">
                                <thead className="bg-white/5 text-slate-500 text-xs font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Rank</th>
                                        <th className="px-6 py-4 text-left">User</th>
                                        <th className="px-6 py-4 text-right">Referrals</th>
                                        <th className="px-6 py-4 text-right">Credits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leaderboardData?.map((user: any, i: number) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-500">#{i + 1}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-sm font-black text-blue-500 text-right">{user._count.referrals}</td>
                                            <td className="px-6 py-4 text-sm font-black text-amber-500 text-right">{user.aiCredits.toLocaleString()}</td>
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

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 backdrop-blur-md">
        <div className="mb-4">{icon}</div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">{label}</div>
    </div>
);

export default Growth;