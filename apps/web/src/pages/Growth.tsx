import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Rocket, 
    Users, 
    Zap, 
    Share2, 
    Copy, 
    Twitter, 
    Linkedin, 
    MessageCircle, 
    Mail, 
    TrendingUp, 
    Trophy,
    CheckCircle2,
    ArrowRight,
    Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import RewardsLadder from '@/components/growth/RewardsLadder';
import ReferralFeed from '@/components/growth/ReferralFeed';
import confetti from 'canvas-confetti';

const Growth: React.FC = () => {
    const { user, profile } = useAuth();
    const [referralCode, setReferralCode] = useState('');
    const [stats, setStats] = useState({
        totalReferrals: 0,
        convertedFriends: 0,
        creditsEarned: 0,
        estimatedSaved: 0
    });

    useEffect(() => {
        if (profile) {
            setReferralCode(profile.referral_code || '');
            fetchStats();
        }
    }, [profile]);

    const fetchStats = async () => {
        if (!user) return;
        
        // Fetch total referrals from the referrals table
        const { data: referrals, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('referrer_id', user.id);

        if (referrals) {
            const total = referrals.length;
            const converted = referrals.filter(r => r.status === 'converted').length;
            const credits = referrals.reduce((acc, curr) => acc + (curr.credits_awarded || 0), 0);
            
            setStats({
                totalReferrals: total,
                convertedFriends: converted,
                creditsEarned: credits,
                estimatedSaved: Math.round(credits * 0.15) // $0.15 per credit saved
            });
        }
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}/auth?ref=${referralCode}`;
        navigator.clipboard.writeText(link);
        toast.success("Referral link copied!", {
            description: "Share it with your network to earn credits."
        });
        confetti({
            particleCount: 20,
            spread: 30,
            origin: { y: 0.8 },
            colors: ['#3B82F6', '#8B5CF6']
        });
    };

    const shareSocial = (platform: string) => {
        const link = encodeURIComponent(`${window.location.origin}/auth?ref=${referralCode}`);
        const text = encodeURIComponent("I'm using LeadRockets to automate my sales with AI. Join me and get free credits! 🚀");
        
        let url = '';
        switch(platform) {
            case 'twitter': url = `https://twitter.com/intent/tweet?url=${link}&text=${text}`; break;
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`; break;
            case 'whatsapp': url = `https://wa.me/?text=${text}%20${link}`; break;
        }
        window.open(url, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white shadow-2xl shadow-blue-500/20"
            >
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                            Growth Engine 🚀
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                            Turn your network <br /> into <span className="text-white/80">AI Credits</span>
                        </h1>
                        <p className="text-xl text-blue-100 font-medium max-w-md">
                            Help your friends grow with LeadRockets and unlock premium features for yourself.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex-1 relative group">
                                <Input 
                                    readOnly 
                                    value={`${window.location.host}/auth?ref=${referralCode}`}
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
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 backdrop-blur-md">
                            <Users className="w-8 h-8 mb-4 text-blue-200" />
                            <div className="text-4xl font-black">{stats.totalReferrals}</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Referrals Made</div>
                        </div>
                        <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 backdrop-blur-md">
                            <Zap className="w-8 h-8 mb-4 text-amber-300" />
                            <div className="text-4xl font-black">{stats.creditsEarned.toLocaleString()}</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Credits Earned</div>
                        </div>
                        <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 backdrop-blur-md">
                            <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                            <div className="text-4xl font-black">{stats.convertedFriends}</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Friends Converted</div>
                        </div>
                        <div className="p-6 rounded-[24px] bg-white/10 border border-white/10 backdrop-blur-md">
                            <TrendingUp className="w-8 h-8 mb-4 text-purple-300" />
                            <div className="text-4xl font-black">${stats.estimatedSaved}</div>
                            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Est. $ Saved</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-400/20 blur-[80px] rounded-full" />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rewards Ladder */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-none bg-[#0D0D0D] shadow-xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                        Rewards Ladder
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium pt-1">
                                        Refer more friends to climb the tiers and unlock lifetime perks.
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-primary">{stats.convertedFriends}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Conversions</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-12">
                            <RewardsLadder currentConversions={stats.convertedFriends} />
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-none bg-[#0D0D0D] shadow-xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Growth Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <ReferralFeed userId={user?.id} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Founding Member Banner (Conditional) */}
            {stats.convertedFriends >= 10 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/20 flex items-center justify-between"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Star className="w-10 h-10 text-white fill-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-amber-500 tracking-tighter">Founding Member Badge Unlocked!</h3>
                            <p className="text-slate-400 font-medium">You have achieved legend status. Your pricing is now locked in for life.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 font-bold px-8 h-12 rounded-xl uppercase tracking-widest text-xs">
                        View Certificate
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default Growth;