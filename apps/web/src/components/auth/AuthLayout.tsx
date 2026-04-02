
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Users, Target } from 'lucide-react';
import StatsCard from './StatsCard';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Left Panel - Hero & Stats (60%) */}
      <div className="hidden md:flex md:w-[60%] bg-[#0a0a0b] relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full" 
          />
        </div>

        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">LeadRockets</span>
        </motion.div>

        {/* Content Section */}
        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6"
          >
            AI-powered growth. <br />
            <span className="text-slate-500">Built for ambitious teams.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 font-medium"
          >
            Automate your outreach, scale your pipeline, and close more deals with the world's most advanced viral growth engine.
          </motion.p>
        </div>

        {/* Stats Section - Floating Glassmorphism Cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <StatsCard 
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            value="127"
            label="Campaigns launched today"
            delay={0.4}
          />
          <StatsCard 
            icon={<TrendingUp className="w-5 h-5 text-indigo-400" />}
            value="94%"
            label="Avg. success score"
            delay={0.5}
          />
          <StatsCard 
            icon={<Users className="w-5 h-5 text-purple-400" />}
            value="2,340"
            label="Leads converted this week"
            delay={0.6}
            className="sm:col-span-2"
          />
        </div>

        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="relative z-10 text-xs text-slate-500 font-bold tracking-widest uppercase"
        >
          © 2026 LeadRockets Inc. • Security Certified
        </motion.div>
      </div>

      {/* Right Panel - Auth Forms (40%) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 relative bg-white">
        
        {/* Mobile Logo */}
        <div className="md:hidden absolute top-8 left-8 flex items-center gap-2">
          <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600" />
          <span className="text-xl font-black tracking-tighter">LeadRockets</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium">{subtitle}</p>
          </div>

          {children}
        </motion.div>

        {/* Mobile Footer */}
        <div className="mt-12 text-center md:hidden">
           <p className="text-xs text-slate-400 font-medium tracking-tight">AI-powered growth. Built for ambitious teams.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
