import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Rocket, Shield, Zap, BarChart3, Users, Globe, 
  ArrowRight, Play, CheckCircle2, Star, Menu, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-600/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">LEADROCKETS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <Button variant="ghost" onClick={() => navigate('/login')} className="hover:bg-white/5">Login</Button>
            <Button onClick={() => navigate('/register')} className="bg-white text-black hover:bg-gray-200 px-6 rounded-xl">Get Started</Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030712] pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-2xl font-black">
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <Button onClick={() => navigate('/register')} className="h-16 text-xl">Start Free</Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              <Star className="w-3 h-3 fill-current" />
              v4.0 is now live with AI Scoring
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Outreach that <br />Actually Converts.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Drive exponential growth with AI-powered email campaigns, automated lead enrichment, and predictive sales analytics. Built for modern growth teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => navigate('/register')} 
                className="h-16 px-10 text-lg font-black bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-2xl shadow-blue-600/20 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="h-16 px-10 text-lg font-bold border-white/10 hover:bg-white/5 rounded-2xl gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                See Demo
              </Button>
            </div>

            {/* Hero Image / Mockup Placeholder */}
            <div className="mt-20 relative px-4">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full scale-75" />
              <div className="relative rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden aspect-video max-w-5xl mx-auto">
                <div className="w-full h-full bg-[#0A0A0A] rounded-2xl border border-white/5 flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" alt="Dashboard Preview" className="w-full h-full object-cover opacity-60 rounded-xl" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 cursor-pointer hover:scale-110 transition-transform">
                       <Play className="w-8 h-8 fill-current ml-1" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Everything you need to scale.</h2>
            <p className="text-gray-400">Powering high-performance sales teams across the globe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="AI Campaign Builder"
              description="Generate highly personalized sequences that pass every spam filter with our Gemini-powered engine."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-blue-500" />}
              title="Lead Manager"
              description="Centralize your prospecting with smart lists, automated enrichment, and real-time verification."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
              title="Predictive Analytics"
              description="Know which campaigns will win before you hit send. AI-driven open and reply rate predictions."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-emerald-500" />}
              title="Growth Engine"
              description="Built-in viral referral loops and gamification to turn your users into your best sales force."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-red-500" />}
              title="Compliance Guard"
              description="Stay safe with automated CAN-SPAM, GDPR, and CCPA compliance. Built-in opt-out management."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-indigo-500" />}
              title="Multi-Gateway"
              description="Global billing support with Stripe, PayPal, and Razorpay integrations out of the box."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Simple, transparent pricing.</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Choose the engine that fits your speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PriceCard 
              plan="Free"
              price="$0"
              description="For solo founders starting their journey."
              features={['100 Leads / month', '3 Campaigns / month', 'Basic Analytics', 'Community Support']}
            />
            <PriceCard 
              plan="Pro"
              price="$97"
              popular
              description="Ideal for growing sales teams."
              features={['5,000 Leads / month', '50 Campaigns / month', 'AI Optimization', 'Priority Support', 'Custom Domain']}
            />
            <PriceCard 
              plan="Business"
              price="$247"
              description="For large-scale outreach operations."
              features={['50,000 Leads / month', '500 Campaigns / month', 'Full API Access', 'Dedicated Account Manager', 'SLA Guarantee']}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter">LEADROCKETS</span>
          </div>
          
          <div className="flex gap-10 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>

          <p className="text-sm text-gray-600 font-medium">
            © 2026 LeadRockets Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

function PriceCard({ plan, price, description, features, popular }: { plan: string, price: string, description: string, features: string[], popular?: boolean }) {
  return (
    <div className={`relative p-10 rounded-[32px] border ${popular ? 'border-blue-600 bg-blue-600/5' : 'border-white/5 bg-[#0A0A0A]'} flex flex-col`}>
      {popular && (
        <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-black mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black">{price}</span>
        <span className="text-gray-500 font-bold">/mo</span>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-10">{description}</p>
      
      <div className="space-y-4 mb-10 flex-grow">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle2 className={`w-5 h-5 ${popular ? 'text-blue-500' : 'text-gray-600'}`} />
            <span className="text-sm font-bold text-gray-400">{f}</span>
          </div>
        ))}
      </div>

      <Button className={`h-14 rounded-2xl font-black uppercase tracking-widest text-xs ${popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-black hover:bg-gray-200'}`}>
        Get Started
      </Button>
    </div>
  );
}