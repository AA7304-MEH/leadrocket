import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, UserPlus, Gift, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import confetti from 'canvas-confetti';

interface Activity {
    id: string;
    referred_email: string;
    status: 'pending' | 'converted';
    credits_awarded: number;
    created_at: string;
}

const ReferralFeed: React.FC<{ userId?: string }> = ({ userId }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        // Initial Fetch
        fetchActivities();

        // Supabase Realtime Subscription
        const channel = supabase
            .channel('referral-updates')
            .on(
                'postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'referrals',
                    filter: `referrer_id=eq.${userId}` 
                }, 
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newActivity = payload.new as Activity;
                        setActivities(prev => [newActivity, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as Activity;
                        setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
                        
                        // If converted, trigger celebrate
                        if (updated.status === 'converted') {
                            triggerCelebrate();
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const fetchActivities = async () => {
        const { data, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('referrer_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) setActivities(data);
        setLoading(false);
    };

    const triggerCelebrate = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3B82F6', '#10B981', '#F59E0B']
        });
    };

    if (loading) {
        return (
            <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-center animate-pulse">
                        <div className="w-10 h-10 bg-white/5 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/2 bg-white/5 rounded" />
                            <div className="h-2 w-1/4 bg-white/5 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-hide py-4 px-6 space-y-1">
            <AnimatePresence initial={false}>
                {activities.length > 0 ? activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                    >
                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            activity.status === 'converted' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                            {activity.status === 'converted' ? <CheckCircle2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className="text-sm font-bold text-white truncate">
                                    {activity.referred_email.split('@')[0]} joined
                                </p>
                                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {activity.status === 'converted' 
                                    ? <span className="text-green-500/80 font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Friends status: CONVERTED · +{activity.credits_awarded} credits</span>
                                    : "Joined via link · Pending conversion"
                                }
                            </p>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-medium text-sm">No growth activity yet.</p>
                        <p className="text-xs text-slate-600 max-w-[200px] mx-auto">Share your link to see live updates!</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper for empty state in activity feed
function Users({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

export default ReferralFeed;
