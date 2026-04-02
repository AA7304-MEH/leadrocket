import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy, Lock, Star, Crown, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tier {
    id: string;
    threshold: number;
    reward: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const tiers: Tier[] = [
    { id: 'bronze', threshold: 1, reward: '500 AI credits', label: 'Bronze', icon: <Zap className="w-5 h-5" />, color: 'from-amber-700 to-amber-900' },
    { id: 'silver', threshold: 3, reward: '1 Month Free Pro', label: 'Silver', icon: <Star className="w-5 h-5 text-slate-300" />, color: 'from-slate-400 to-slate-600' },
    { id: 'gold', threshold: 5, reward: 'Agency Plan Upgrade', label: 'Gold', icon: <Crown className="w-5 h-5 text-amber-500" />, color: 'from-amber-400 to-amber-600' },
    { id: 'diamond', threshold: 10, reward: 'Lifetime Founding Member', label: 'Diamond', icon: <Trophy className="w-5 h-5 text-blue-400" />, color: 'from-blue-500 to-indigo-600' },
];

const RewardsLadder: React.FC<{ currentConversions: number }> = ({ currentConversions }) => {
    return (
        <div className="relative pt-8 pb-12 px-4">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2" />
            
            {/* Animated Progress Fill */}
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${Math.min((currentConversions / 10) * 100, 100)}%` }}
                className="absolute left-1/2 top-0 w-1 bg-blue-600 -translate-x-1/2 origin-top"
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <div className="space-y-24 relative z-10">
                {tiers.map((tier, index) => {
                    const isUnlocked = currentConversions >= tier.threshold;
                    const isNext = !isUnlocked && (index === 0 || currentConversions >= tiers[index - 1].threshold);

                    return (
                        <div key={tier.id} className={`flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            {/* Card Side */}
                            <div className="w-[42%]">
                                <motion.div
                                    initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`p-6 rounded-3xl border-2 transition-all ${
                                        isUnlocked ? 'border-blue-600 bg-blue-600/10 shadow-lg shadow-blue-600/10' : 
                                        isNext ? 'border-slate-700 bg-white/5 animate-pulse' : 'border-white/5 bg-transparent opacity-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className={`bg-gradient-to-br ${tier.color} border-none uppercase tracking-widest px-3 py-0.5 text-[10px] font-black`}>
                                            {tier.label}
                                        </Badge>
                                        <span className="text-xs font-bold text-slate-500">{tier.threshold} Friends</span>
                                    </div>
                                    <h4 className="text-xl font-black tracking-tight text-white mb-2">{tier.reward}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {isUnlocked ? "Unlocked & Awarded" : `Need ${tier.threshold - currentConversions} more for this reward.`}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Node Side */}
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                                        isUnlocked ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' : 
                                        'bg-[#080808] border-slate-800 text-slate-600'
                                    }`}
                                >
                                    {isUnlocked ? <Check className="w-6 h-6 stroke-[3px]" /> : tier.icon}
                                </motion.div>
                                {isNext && (
                                    <motion.div 
                                        animate={{ scale: [1, 1.4, 1], opacity: [0, 0.4, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-blue-500 rounded-full blur-md"
                                    />
                                )}
                            </div>

                            {/* Empty Side (for balance) */}
                            <div className="w-[42%]" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RewardsLadder;
