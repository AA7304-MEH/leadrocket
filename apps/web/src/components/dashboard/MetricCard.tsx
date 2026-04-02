import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  className
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-6 rounded-3xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all group overflow-hidden",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black tracking-tighter text-white">{value}</h3>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full",
                trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.value}%
              </div>
            )}
          </div>
          {description && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{description}</p>
          )}
        </div>
        
        <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
