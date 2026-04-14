import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Camera, 
  User, 
  Mail, 
  Building, 
  Phone, 
  Crown, 
  Shield, 
  Globe, 
  Lock, 
  Save,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name || '',
        company: profile.company_name || '',
        phone: '' // Added placeholder as it's not in the base schema but often used
      });
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        toast.success('Preview updated. Save changes to finalize.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateProfile({
        full_name: formData.name,
        company_name: formData.company,
        avatar_url: avatarPreview || undefined
      });
      toast.success('Identity profile updated successfully! 🚀');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center gap-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <Avatar className="w-24 h-24 border-4 border-white/5 ring-4 ring-blue-600/10 shadow-2xl relative z-10">
                <AvatarImage src={avatarPreview || undefined} alt={formData.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-black">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                  {formData.name || 'Your Profile'}
                </h1>
                {profile?.plan === 'pro' && (
                  <Badge className="bg-blue-600 text-white border-none px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
                    <Crown className="w-3 h-3 mr-1" /> Pro
                  </Badge>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {user?.email} • Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Button 
                variant="outline" 
                onClick={() => navigate('/settings')}
                className="bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8"
             >
                System Settings
             </Button>
             <Button 
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-10 shadow-xl shadow-blue-600/20"
             >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Identity
             </Button>
          </div>
        </motion.div>

        {/* content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Identity Info (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >
            <section className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
               <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">Personal Details</h3>
               </div>
               
               <div className="space-y-6">
                 <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Display Name</Label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Rivera"
                      className="bg-[#0A0A0A] border-white/5 h-16 rounded-2xl px-6 font-bold text-lg text-white focus:border-blue-500 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Email Address</Label>
                      <div className="relative">
                        <Input 
                          value={user?.email}
                          disabled
                          className="bg-white/2 border-white/5 h-16 rounded-2xl px-6 pl-14 font-bold text-slate-500 cursor-not-allowed"
                        />
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                        <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" />
                      </div>
                   </div>

                   <div className="space-y-2.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Phone Number</Label>
                      <div className="relative">
                        <Input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-[#0A0A0A] border-white/5 h-16 rounded-2xl px-6 pl-14 font-bold text-white focus:border-blue-500"
                        />
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      </div>
                   </div>
                 </div>

                 <div className="space-y-2.5 pt-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Company / Organization</Label>
                    <div className="relative">
                      <Input 
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme SaaS"
                        className="bg-[#0A0A0A] border-white/5 h-16 rounded-2xl px-6 pl-14 font-bold text-white focus:border-blue-500"
                      />
                      <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    </div>
                 </div>
               </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-blue-500/10 rounded-[2.5rem] p-10 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white tracking-tight">LeadRockets Labs</h4>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">Get early access to Beta AI models</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </section>
          </motion.div>

          {/* Account Status (40%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <section className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-10 space-y-10">
               <div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase mb-6">Subscription Status</h3>
                  <div className="p-8 bg-blue-600 text-white rounded-[2rem] space-y-8 relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                      <div>
                        <Badge className="bg-white/20 text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[9px] mb-4">
                           {profile?.plan || 'Starter'} Engine
                        </Badge>
                        <h4 className="text-3xl font-black tracking-tighter capitalize">{profile?.plan || 'Starter'} Plan</h4>
                        <p className="text-blue-100/60 text-[11px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5" /> All AI features active
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => navigate('/billing')} className="self-start bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-[9px] h-10 px-8 rounded-xl shadow-xl mt-6">
                        Manage Plan
                      </Button>
                    </div>
                    <Crown className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                  </div>
               </div>

               <div className="space-y-6 pt-2">
                  <h3 className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Security Badges</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Badge variant="outline" className="border-white/5 bg-white/2 hover:bg-white/5 text-slate-400 py-3 px-4 justify-start gap-3 rounded-xl">
                      <ShieldCircle status="verified" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Email Verified</span>
                    </Badge>
                    <Badge variant="outline" className="border-white/5 bg-white/2 hover:bg-white/5 text-slate-400 py-3 px-4 justify-start gap-3 rounded-xl">
                      <ShieldCircle status="pending" />
                      <span className="text-[10px] font-black uppercase tracking-widest">2FA Inactive</span>
                    </Badge>
                  </div>
               </div>
            </section>

            <section className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight uppercase">Founding Member</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LeadRockets v4.0 Pilot</p>
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic balance-flat">
                  Thanks for being an early adopter. You have access to exclusive lifetime discounts and priority support.
               </p>
            </section>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function ShieldCircle({ status }: { status: 'verified' | 'pending' }) {
  return (
    <div className={cn(
      "w-3 h-3 rounded-full relative",
      status === 'verified' ? "bg-emerald-500" : "bg-amber-500"
    )}>
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-50",
        status === 'verified' ? "bg-emerald-500" : "bg-amber-500"
      )} />
    </div>
  );
}

export default Profile;