import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  ctaText,
  onCtaClick,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-20 text-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center shadow-2xl mb-8"
      >
        <Icon className="w-10 h-10 text-slate-400" />
      </motion.div>
      
      <div className="space-y-4 max-w-sm">
        <h3 className="text-3xl font-black tracking-tighter text-white">{title}</h3>
        <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic">{description}</p>
      </div>

      {ctaText && onCtaClick && (
        <Button 
          onClick={onCtaClick}
          className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-blue-600/20 uppercase tracking-[0.2em] text-[11px]"
        >
          {ctaText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
