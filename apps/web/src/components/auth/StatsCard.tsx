
import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
      className={`px-6 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 group transition-all ${className}`}
    >
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tighter leading-none mb-1 group-hover:scale-110 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all origin-left">
          {value}
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none group-hover:text-slate-300 transition-colors">
          {label}
        </div>
      </div>
      
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

export default StatsCard;
