
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  Building2, 
  Users, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Check, 
  AlertCircle,
  Briefcase,
  Target,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const Onboarding: React.FC = () => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: profile?.company_name || '',
    industry: '',
    teamSize: '',
    goal: '',
  });

  const [leads, setLeads] = useState<any[]>([]);
  const [importMethod, setImportMethod] = useState<'csv' | 'manual' | null>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleCompanySubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: formData.companyName,
          industry: formData.industry,
          team_size: formData.teamSize,
          primary_goal: formData.goal
        })
        .eq('id', user?.id);

      if (error) throw error;
      nextStep();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const lead: any = {};
        headers.forEach((header, i) => {
           lead[header.trim().toLowerCase()] = row[i]?.trim();
        });
        return lead;
      }).filter(l => l.email);
      
      setLeads(data);
      toast.success(`${data.length} leads parsed from CSV`);
    };
    reader.readAsText(file);
  };

  const finalizeOnboarding = async () => {
    setLoading(true);
    try {
      // Save leads to database if any
      if (leads.length > 0) {
        const formattedLeads = leads.map(l => ({
          user_id: user?.id,
          name: l.name || l.full_name || 'Prospect',
          email: l.email,
          company: l.company || '',
          role: l.role || l.title || '',
          source: 'onboarding'
        }));
        
        const { error: leadsError } = await supabase
          .from('leads')
          .insert(formattedLeads);
        
        if (leadsError) throw leadsError;
      }

      // Mark onboarding as completed
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user?.id);

      if (error) throw error;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#10B981']
      });

      toast.success('Onboarding complete! Rocket launched.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-50">
         <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
         />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-[#111111] border border-white/5 rounded-[40px] p-8 sm:p-16 relative z-10 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-600/20 shadow-2xl">
                   <Rocket className="w-10 h-10 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tighter">
                    Welcome to LeadRockets, <span className="text-blue-600">{profile?.full_name?.split(' ')[0] || 'Explorer'}</span> 🚀
                  </h1>
                  <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                    We'll get your company set up and your first campaign ready in less than 2 minutes. Let's build your growth engine.
                  </p>
                </div>
                <Button 
                  onClick={nextStep}
                  className="h-16 px-12 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-xl"
                >
                  Let's go →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black tracking-tighter">Tell us about your company</h2>
                  <p className="text-slate-500 font-medium">This helps our AI tailor your outreach strategies.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company Name</Label>
                    <Input 
                      className="bg-[#0F0F0F] border-white/10 h-14 rounded-xl"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Industry</Label>
                    <select 
                      className="w-full bg-[#0F0F0F] border border-white/10 h-14 rounded-xl px-4 text-sm font-bold appearance-none outline-none focus:border-blue-600 transition-all"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="">Select Industry</option>
                      <option value="saas">SaaS</option>
                      <option value="agency">Marketing Agency</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="fintech">Fintech</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Growth Goal</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['More leads', 'Better conversions', 'Automate outreach', 'All of the above'].map(goal => (
                      <button
                        key={goal}
                        onClick={() => setFormData({...formData, goal})}
                        className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${formData.goal === goal ? 'bg-blue-600/10 border-blue-600 text-white' : 'bg-[#0F0F0F] border-white/5 text-slate-500 hover:border-white/20'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <Button variant="ghost" onClick={prevStep} className="h-14 flex-1 text-slate-500 font-black uppercase tracking-widest text-xs">Back</Button>
                   <Button 
                    onClick={handleCompanySubmit}
                    disabled={!formData.companyName || !formData.industry || !formData.goal || loading}
                    className="h-14 flex-[2] bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl"
                   >
                     Next Step →
                   </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black tracking-tighter">Add your first leads</h2>
                  <p className="text-slate-500 font-medium">Start building your reach list immediately.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <button 
                    onClick={() => setImportMethod('csv')}
                    className={`p-8 rounded-[40px] border flex flex-col items-center justify-center gap-4 transition-all ${importMethod === 'csv' ? 'bg-blue-600/10 border-blue-600' : 'bg-[#0F0F0F] border-white/5 hover:bg-white/5'}`}
                   >
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                        <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black uppercase tracking-widest">Import CSV</p>
                        <p className="text-[10px] font-medium text-slate-600 mt-1">Bulk upload leads</p>
                      </div>
                   </button>

                   <button 
                    onClick={() => setImportMethod('manual')}
                    className={`p-8 rounded-[40px] border flex flex-col items-center justify-center gap-4 transition-all ${importMethod === 'manual' ? 'bg-blue-600/10 border-blue-600' : 'bg-[#0F0F0F] border-white/5 hover:bg-white/5'}`}
                   >
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Plus className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black uppercase tracking-widest">Add Manually</p>
                        <p className="text-[10px] font-medium text-slate-600 mt-1">Add 3 quick leads</p>
                      </div>
                   </button>
                </div>

                {importMethod === 'csv' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 text-center relative"
                  >
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCSVImport}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400 capitalize">Drop your CSV here or <span className="text-blue-500">browse</span></p>
                    {leads.length > 0 && <p className="mt-4 text-emerald-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 animate-pulse"><Check className="w-4 h-4" /> {leads.length} leads ready</p>}
                  </motion.div>
                )}

                {importMethod === 'manual' && (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Add Quick Sample Leads</p>
                    <div className="space-y-2">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex gap-2">
                           <Input className="bg-[#0F0F0F] border-white/5 h-12 rounded-xl text-xs" placeholder="Full Name" />
                           <Input className="bg-[#0F0F0F] border-white/5 h-12 rounded-xl text-xs" placeholder="email@company.com" />
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                   <Button variant="ghost" onClick={prevStep} className="h-14 flex-1 text-slate-500 font-black uppercase tracking-widest text-xs">Back</Button>
                   <Button 
                    onClick={nextStep}
                    disabled={!importMethod}
                    className="h-14 flex-[2] bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl"
                   >
                     Skip / Next Step →
                   </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter">You're ready to launch 🚀</h2>
                  <p className="text-slate-500 font-medium">We've prepared your first campaign template.</p>
                </div>

                <div className="bg-[#0F0F0F] border border-white/5 rounded-[40px] p-8 space-y-8 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6">
                      <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-500" />
                   </div>
                   
                   <div className="flex flex-col items-center gap-6">
                      <div className="relative w-40 h-40">
                         <svg className="w-full h-full transform -rotate-90">
                           <circle cx="50%" cy="50%" r="45%" className="stroke-slate-800 fill-none stroke-[6px]" />
                           <motion.circle 
                            cx="50%" cy="50%" r="45%" 
                            className="stroke-emerald-500 fill-none stroke-[6px]" 
                            strokeDasharray="100" 
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 18 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                           />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">82%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">AI Score</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-sm font-black tracking-tight text-white capitalize">{formData.industry || 'Growth'} Outreach Template</p>
                         <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto italic">"Hi %7bname%7d, I noticed your work at %7bcompany%7d and thought..."</p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <Button 
                    onClick={finalizeOnboarding}
                    disabled={loading}
                    className="h-16 bg-blue-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                   >
                     Launch My First Campaign →
                   </Button>
                   <Button 
                    variant="ghost" 
                    onClick={finalizeOnboarding}
                    className="h-12 text-slate-500 font-black uppercase tracking-widest text-[10px]"
                   >
                     Skip for now, show dashboard
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;