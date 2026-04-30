import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Chrome, Loader2, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const generateCode = () => Math.random().toString(36).substring(2,10).toUpperCase();

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const isReset = searchParams.get('reset') === 'true';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (authError) throw authError;

        if (authData.user) {
          // Check onboarding status
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', authData.user.id)
            .single();

          const from = (location.state as any)?.from?.pathname ?? '/dashboard';

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            navigate('/onboarding');
            return;
          }

          if (profile?.onboarding_completed) {
            navigate(from, { replace: true });
          } else {
            navigate('/onboarding');
          }
        }
      } else {
        // Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              company_name: formData.companyName
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile row
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: authData.user.id, 
                full_name: formData.fullName, 
                company_name: formData.companyName,
                plan: 'starter',
                ai_credits: 100,
                referral_code: generateCode()
              }
            ]);

          if (profileError) throw profileError;

          toast.success('Account created! Let\'s get you started.');
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: window.location.origin + '/auth?reset=true',
      });
      if (error) throw error;
      toast.success('Reset link sent! Check your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row overflow-hidden relative font-sans">
      {/* Left Panel - 60% */}
      <div className="hidden md:flex md:w-[60%] relative bg-[#080808] border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -mr-40 -mt-40" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full -ml-20 -mb-20" />
        </div>

        <div className="relative z-10 max-w-xl text-center space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Zap className="w-7 h-7 text-white fill-white" />
               </div>
               <span className="text-3xl font-black tracking-tighter uppercase text-white">LeadRockets</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-[1.1] text-white">
              AI-powered growth. <br />
              <span className="text-slate-500">Built for ambitious teams.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <StatsCard title="1,247" subtitle="Campaigns launched today" icon={<Sparkles className="w-5 h-5 text-blue-500" />} />
             <StatsCard title="94%" subtitle="Average AI success score" icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
             <StatsCard title="12,840" subtitle="Leads converted this week" icon={<Users className="w-5 h-5 text-purple-500" />} />
          </div>
        </div>
      </div>

      {/* Right Panel - 40% */}
      <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center relative bg-[#0A0A0A]">
        <Link to="/" className="md:hidden flex items-center gap-2 mb-12">
           <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
           <span className="text-xl font-black tracking-tighter">LEADROCKETS</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              {isReset ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Join the new era of autonomous sales outreach.
            </p>
          </div>

          {/* Toggle Tabs */}
          {!isReset && (
            <div className="flex p-1 bg-[#111111] border border-white/5 rounded-xl">
               <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
               >
                 Log In
               </button>
               <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
               >
                 Sign Up
               </button>
            </div>
          )}

          <div className="space-y-6">
            {!isReset && (
              <>
                <Button 
                  onClick={signInWithGoogle}
                  variant="outline" 
                  className="w-full h-12 bg-[#111111] border-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3"
                >
                  <Chrome className="w-4 h-4 text-white" /> Continue with Google
                </Button>

                <div className="flex items-center gap-4">
                   <div className="h-px flex-1 bg-white/5" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">or use email</span>
                   <div className="h-px flex-1 bg-white/5" />
                </div>
              </>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && !isReset && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                      <Input
                        required={!isLogin}
                        className="bg-[#0F0F0F] border-white/10 focus:border-blue-600 h-12 rounded-xl text-white placeholder:text-slate-700"
                        placeholder="Elon Musk"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company Name</Label>
                      <Input
                        required={!isLogin}
                        className="bg-[#0F0F0F] border-white/10 focus:border-blue-600 h-12 rounded-xl text-white placeholder:text-slate-700"
                        placeholder="SpaceX"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</Label>
                <Input
                  required
                  type="email"
                  className="bg-[#0F0F0F] border-white/10 focus:border-blue-600 h-12 rounded-xl text-white placeholder:text-slate-700"
                  placeholder="elon@mars.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!isReset && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</Label>
                    {isLogin && (
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <Input
                    required
                    type="password"
                    className="bg-[#0F0F0F] border-white/10 focus:border-blue-600 h-12 rounded-xl text-white placeholder:text-slate-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  
                  {!isLogin && (
                    <div className="px-1 pt-1 space-y-2">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div 
                            key={step} 
                            className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= (step * 25) ? 'bg-blue-600' : 'bg-white/5'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                         {passwordStrength < 50 ? 'Weak' : passwordStrength < 100 ? 'Strong' : 'Very Secure'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">
                    {error}
                  </p>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isReset ? 'Send Reset Link' : isLogin ? 'Sign In →' : 'Create Account →'}
              </Button>

              {isReset && (
                <button 
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Back to Log In
                </button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, subtitle, icon }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-6 group text-left cursor-default transition-all hover:bg-white/10"
  >
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors shadow-2xl">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-2xl font-black text-white tracking-tighter leading-none">{title}</h4>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
  </motion.div>
);

export default Auth;