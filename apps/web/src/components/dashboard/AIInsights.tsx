import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Target, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    icon: Zap,
    text: "Your Tuesday 9am sends have 34% higher open rates.",
    cta: "Adjust Schedule",
  },
  {
    icon: Target,
    text: "Add 2 more leads to 'Campaign X' to hit optimal list size.",
    cta: "Import Leads",
  },
  {
    icon: Mail,
    text: "Subject line 'Quick Question' is outperforming others by 12%.",
    cta: "Apply Globally",
  }
];

export default function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#111111] border border-white/5 rounded-3xl p-8 sticky top-24"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tighter text-white">AI Insights</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Smart optimizations</p>
        </div>
      </div>

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="mt-1">
                <insight.icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-sm font-bold text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                  {insight.text}
                </p>
                <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest">{insight.cta}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            {index !== insights.length - 1 && (
              <div className="h-px w-full bg-white/5 mt-6" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <p className="text-xs font-black text-white uppercase tracking-widest mb-2">AI Predictive Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">87</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Average</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed mt-2 uppercase tracking-widest">
            Your content quality is in the top 5% of your industry.
          </p>
          <Button className="w-full mt-4 h-10 bg-white text-black hover:bg-slate-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl">
             Explore Benchmarks
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
