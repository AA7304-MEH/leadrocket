
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SuccessMeterProps {
  score: number;
  label?: string;
}

const SuccessMeter = ({ score, label = "Predictive Success Score" }: SuccessMeterProps) => {
  // Color calculation based on score
  const getColor = (s: number) => {
    if (s < 40) return "text-red-500";
    if (s < 70) return "text-amber-500";
    return "text-emerald-500";
  };

  const currentScore = Math.min(100, Math.max(0, score));

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-40 h-24 overflow-hidden">
        {/* Semi-circle track */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Animated score arc */}
          <motion.path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${getColor(currentScore)} transition-colors duration-500`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentScore / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span 
            className="text-3xl font-black tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentScore}
          >
            {currentScore}%
          </motion.span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mt-2">
        <Sparkles className={`w-4 h-4 ${getColor(currentScore)}`} />
        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </span>
      </div>
      
      {/* Dynamic Feedback */}
      <motion.p 
        className="text-xs text-slate-400 mt-1 h-4 italic"
        animate={{ opacity: [0, 1] }}
        key={currentScore > 70 ? "high" : "low"}
      >
        {currentScore > 70 ? "Highly targeted & engaging!" : "Try adding more personalization"}
      </motion.p>
    </div>
  );
};

export default SuccessMeter;
