
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Play, CheckCircle2, Zap, Rocket, BarChart3, ChevronRight, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-blue-600/30 overflow-x-hidden" ref={scrollRef}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">LeadRockets</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-slate-400 hover:text-white tracking-widest uppercase hidden sm:block">Log In</Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-widest text-xs px-6 h-10 rounded-xl">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full" />
             <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-[72px] font-black tracking-tighter leading-[0.9] mb-8 font-heading">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">AI Sales Engine</span> <br /> 
                That Grows Itself
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12">
                Predictive campaign scoring, viral referral loops, and AI-powered outreach — built for teams obsessed with growth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/auth">
                  <Button className="h-14 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="ghost" className="h-14 px-10 text-slate-100 font-black uppercase tracking-widest text-sm hover:bg-white/5 flex items-center gap-3">
                  <Play className="w-5 h-5 fill-white" /> Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-24 relative"
            >
              <div className="mx-auto max-w-5xl rounded-[32px] p-2 bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl relative">
                <div className="bg-[#111111] rounded-[28px] overflow-hidden flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
                  <div className="flex flex-col items-center gap-8">
                     <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                       <svg className="w-full h-full transform -rotate-90">
                         <circle cx="50%" cy="50%" r="45%" className="stroke-slate-800 fill-none stroke-[8px]" />
                         <motion.circle 
                          cx="50%" cy="50%" r="45%" 
                          className="stroke-blue-500 fill-none stroke-[8px]" 
                          strokeDasharray="100" 
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 13 }}
                          transition={{ duration: 2, delay: 1 }}
                          style={{ strokeLinecap: 'round' }}
                         />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-5xl sm:text-7xl font-black tracking-tighter">87%</span>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-500">AI Success Score</span>
                       </div>
                       <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" 
                       />
                     </div>
                     <div className="text-center space-y-2">
                       <h3 className="text-xl font-bold">Campaign Status: Optimizing...</h3>
                       <p className="text-slate-500 text-sm max-w-xs mx-auto">AI is currently refining your subject lines based on open rate probability.</p>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Proof Bar */}
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              className="mt-32 pt-12 border-t border-white/5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-10">Trusted by 500+ growth teams</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Placeholders for logos */}
                 <div className="h-6 w-24 bg-slate-400 rounded-full" />
                 <div className="h-6 w-32 bg-slate-400 rounded-full" />
                 <div className="h-6 w-28 bg-slate-400 rounded-full" />
                 <div className="h-6 w-20 bg-slate-400 rounded-full" />
                 <div className="h-6 w-36 bg-slate-400 rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-blue-500" />}
                title="AI Predictive Scoring"
                desc="Know your campaign's success rate before you send. Our AI scores every campaign 0–100."
                delay={0}
              />
              <FeatureCard 
                icon={<Rocket className="w-6 h-6 text-green-500" />}
                title="Viral Growth Loop"
                desc="Built-in referral engine that rewards users with AI credits. Your product markets itself."
                delay={0.1}
              />
              <FeatureCard 
                icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
                title="Campaign Remixing"
                desc="Gemini AI remixes your top-performing campaigns across industries automatically."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-24 tracking-tighter font-heading">The 3-Step Growth Engine</h2>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-[60px] left-1/4 right-1/4 h-[2px] bg-white/5 -z-10" />

              <StepItem number="1" title="Import your leads" desc="Sync lists or bulk upload via CSV. Our AI cleans the data automatically." />
              <StepItem number="2" title="Build your AI-scored campaign" desc="Write as you normally would. Watch the AI score update in real-time." />
              <StepItem number="3" title="Launch, track, and grow" desc="Hit send and let the AI handle optimization and referral loops." />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-heading">Simple, Ambitious Pricing</h2>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400">Monthly</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                  </div>
                  <span className="text-sm font-bold text-white">Annual (Save 17%)</span>
                </div>
                <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Pricing:</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">🇮🇳 ₹ <span className="text-slate-500">/</span> 🌍 $</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <PricingCard tier="Starter" price={{ usd: "99", inr: "8,299" }} features={["1,000 leads/mo", "Basic AI Scoring", "Viral Growth Loop", "Standard Support"]} />
               <PricingCard tier="Pro" price={{ usd: "199", inr: "16,599" }} popular={true} features={["5,000 leads/mo", "Predictive AI Scoring+", "Campaign Remixing", "Priority Support"]} />
               <PricingCard tier="Agency" price={{ usd: "499", inr: "41,499" }} features={["Unlimited leads", "Full AI Studio Access", "API Marketplace", "Dedicated Manager"]} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
              <div className="col-span-1 md:col-span-1 space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
                   <span className="text-xl font-black tracking-tighter">LEADROCKETS</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">AI-powered sales automation for teams that iterate fast.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Product</h4>
                <ul className="text-sm text-slate-500 space-y-2 font-medium">
                   <li><a href="#" className="hover:text-white">Features</a></li>
                   <li><a href="#" className="hover:text-white">Pricing</a></li>
                   <li><a href="#" className="hover:text-white">Changelog</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Company</h4>
                <ul className="text-sm text-slate-500 space-y-2 font-medium">
                   <li><a href="#" className="hover:text-white">About</a></li>
                   <li><a href="#" className="hover:text-white">Privacy</a></li>
                   <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Social</h4>
                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500">
                    <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
                    <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
                    <Github className="w-5 h-5 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">© 2026 LeadRockets 4.0. All rights reserved.</p>
               <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Built with ❤️ for ambitious teams.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="p-10 rounded-3xl bg-[#111111] border border-white/5 hover:border-blue-500/30 transition-all cursor-default group"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
};

const StepItem = ({ number, title, desc }: any) => (
  <div className="flex-1 flex flex-col items-center gap-6 relative group">
    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-3xl font-black text-blue-500 shadow-xl relative z-10 group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const PricingCard = ({ tier, price, features, popular }: any) => (
  <div className={`p-10 rounded-[32px] bg-[#111111] border transition-all hover:scale-[1.02] flex flex-col items-stretch text-left relative ${popular ? 'border-blue-600 shadow-2xl shadow-blue-500/10' : 'border-white/5'}`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
        Most Popular
      </div>
    )}
    <div className="mb-8 space-y-4">
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">{tier}</h4>
      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-400">₹</span>
          <span className="text-5xl font-black tracking-tighter">{price.inr}</span>
          <span className="text-slate-500 text-sm font-bold">/mo</span>
        </div>
        <div className="flex items-baseline gap-1 opacity-70">
          <span className="text-xl font-black text-slate-400">$</span>
          <span className="text-3xl font-black tracking-tighter">{price.usd}</span>
          <span className="text-slate-500 text-xs font-bold">/mo</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-3 mb-10 flex-1">
      {features.map((f: string) => (
        <div key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {f}
        </div>
      ))}
    </div>

    <Link to="/auth" className="w-full">
      <Button className={`w-full h-12 font-black uppercase tracking-widest text-xs rounded-xl ${popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
        Choose {tier}
      </Button>
    </Link>
  </div>
);

export default Landing;