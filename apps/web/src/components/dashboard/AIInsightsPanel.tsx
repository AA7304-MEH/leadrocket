
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, Clock, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const insights = [
  { 
    id: 1, 
    type: "Send Times", 
    text: "Your Tuesday 9am sends have 34% higher open rates.", 
    icon: <Clock className="w-4 h-4 text-indigo-400" />,
    action: "Schedule next batch"
  },
  { 
    id: 2, 
    type: "List Size", 
    text: "Add 2 more leads to Campaign X to hit optimal list size.", 
    icon: <Target className="w-4 h-4 text-emerald-400" />,
    action: "Add leads"
  },
  { 
    id: 3, 
    type: "A/B Test", 
    text: "Subject line variation 'B' is winning by 12.4% in current tests.", 
    icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
    action: "Adopt variation"
  }
];

const AIInsightsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="relative h-full min-h-[400px] bg-slate-900 rounded-[2.5rem] overflow-hidden group border border-slate-800 shadow-2xl"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-indigo-600/20 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-[10%] -left-[5%] w-[60%] h-[60%] bg-purple-600/20 blur-[80px] rounded-full" 
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">AI Insights</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Powered by Predictive AI</p>
            </div>
          </div>
          <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500 animate-pulse" />
        </div>

        <div className="space-y-4 flex-1">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + (idx * 0.1), duration: 0.5 }}
              whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 transition-all cursor-pointer group/item"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 font-black text-[9px] uppercase tracking-widest text-indigo-300">
                  {insight.type}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-300 leading-relaxed pr-4">
                {insight.text}
              </p>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white transition-opacity opacity-0 group-hover/item:opacity-100 flex items-center gap-2">
                  {insight.action} <ArrowRight className="w-3 h-3 text-indigo-500" />
                </span>
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center opacity-40 group-hover/item:opacity-100 transition-opacity">
                   {insight.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full h-12 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-600/20 transition-all">
          Explore All Suggestions
        </Button>
      </div>
    </motion.div>
  );
};

export default AIInsightsPanel;
