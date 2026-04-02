
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';

interface PasswordScoreProps {
  score: number; // 0 to 4
  feedback?: string[];
}

const PasswordScore: React.FC<PasswordScoreProps> = ({ score, feedback = [] }) => {
  const getScoreColor = () => {
    switch (score) {
      case 0: return 'bg-slate-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-amber-500';
      case 3: return 'bg-emerald-500';
      case 4: return 'bg-indigo-600';
      default: return 'bg-slate-200';
    }
  };

  const getScoreLabel = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Average';
      case 3: return 'Strong';
      case 4: return 'Secure';
      default: return 'Too Short';
    }
  };

  const getScoreIcon = () => {
    if (score < 2) return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
    if (score < 4) return <Shield className="w-3.5 h-3.5 text-amber-500" />;
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
  };

  return (
    <div className="space-y-2.5 mt-2 transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {getScoreIcon()}
          <span className={`text-[10px] font-black uppercase tracking-widest ${score === 0 ? 'text-slate-400' : 'text-slate-900'}`}>
            Security: {getScoreLabel()}
          </span>
        </div>
        {score === 4 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-indigo-600 fill-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Excellent</span>
          </motion.div>
        )}
      </div>

      {/* Progress Bars */}
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="flex-1 bg-slate-100 rounded-full overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: i <= score ? "0%" : "-100%" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`w-full h-full ${getScoreColor()}`}
            />
          </div>
        ))}
      </div>

      {/* Inline Feedback */}
      <AnimatePresence mode="wait">
        {feedback.length > 0 && score < 4 && (
          <motion.p 
            key={feedback[0]}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-[10px] font-medium text-slate-400 italic leading-tight"
          >
            💡 {feedback[0]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordScore;
