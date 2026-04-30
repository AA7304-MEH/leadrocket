import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  User, Link2, Bell, Key, Users, AlertTriangle, 
  Upload, Check, Shield, Globe, Mail, 
  ExternalLink, Zap, Info, ShieldCheck, ChevronRight,
  Sparkles, Loader2, Save, Building, Lock, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Avatar, AvatarFallback, AvatarImage 
} from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [geminiKey, setGeminiKey] = useState("sk-********************");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Identity infrastructure updated! 🚀");
    }, 1500);
  };

  const testGemini = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Verifying AI engine connectivity...',
      success: 'API Key verified! Gemini 1.5 is active.',
      error: 'Invalid API Key. Please check and try again.',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter text-white">System Configuration</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
              Manage your high-performance outreach engine
            </p>
          </motion.div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Configuration
          </Button>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Settings Nav */}
          <TabsList className="flex lg:flex-col h-auto bg-transparent border-none space-y-2 w-full lg:w-64 items-start shrink-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            <SettingsTab value="profile" icon={<User className="w-4 h-4" />} label="Identity & Account" />
            <SettingsTab value="integrations" icon={<Link2 className="w-4 h-4" />} label="Data Bridges" />
            <SettingsTab value="notifications" icon={<Bell className="w-4 h-4" />} label="System Alerts" />
            <SettingsTab value="api-keys" icon={<Key className="w-4 h-4" />} label="AI Infrastructure" />
            <SettingsTab value="team" icon={<Users className="w-4 h-4" />} label="Collaboration" />
            <SettingsTab value="danger" icon={<AlertTriangle className="w-4 h-4" />} label="Danger Zone" />
          </TabsList>

          <div className="flex-1 min-w-0 w-full">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0 space-y-8 focus-visible:outline-none">
                <motion.section 
                  key="profile-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#111] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative group/avatar">
                      <Avatar className="w-24 h-24 border-4 border-white/5 ring-4 ring-blue-600/10 shadow-2xl">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-black text-2xl">U</AvatarFallback>
                      </Avatar>
                      <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                        <Upload className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Identity Image</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 max-w-[200px]">Update your visual presence in the engine. HQ resolution preferred.</p>
                      <Button variant="ghost" className="mt-4 h-10 px-6 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
                        Upload New
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111] p-10 rounded-[2.5rem] border border-white/5">
                    <SettingsField label="Legal Identity" placeholder="Alex Rivera" icon={<User className="w-4 h-4" />} />
                    <SettingsField label="Internal Email" placeholder="alex@company.com" disabled icon={<Mail className="w-4 h-4" />} />
                    <SettingsField label="Entity Name" placeholder="Acme SaaS" icon={<Building className="w-4 h-4" />} />
                    <SettingsField label="Core Designation" placeholder="Head of Growth" icon={<Zap className="w-4 h-4" />} />
                  </div>
                </motion.section>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="mt-0 space-y-6 focus-visible:outline-none">
                <motion.div
                  key="integrations-tab"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <IntegrationCard 
                    name="HubSpot Engine" 
                    desc="Bi-directional sync of lead intelligence and campaign engagement metrics." 
                    icon="https://cdn.worldvectorlogo.com/logos/hubspot.svg" 
                    connected={true} 
                  />
                  <IntegrationCard 
                    name="Gmail SMTP Bridge" 
                    desc="Direct high-deliverability connection to your workspace mailing infrastructure." 
                    icon="https://cdn.worldvectorlogo.com/logos/gmail-icon.svg" 
                    connected={false} 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30">
                    <Card className="bg-[#111111] border-dashed border-white/10 rounded-[2rem] p-10 cursor-not-allowed transition-all hover:scale-[1.01]">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-slate-600" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Zapier Mesh</h4>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-blue-500 border-blue-500/20 bg-blue-500/5">In Development</Badge>
                      </div>
                    </Card>
                    <Card className="bg-[#111111] border-dashed border-white/10 rounded-[2rem] p-10 cursor-not-allowed transition-all hover:scale-[1.01]">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-slate-600" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Custom Webhooks</h4>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-blue-500 border-blue-500/20 bg-blue-500/5">In Development</Badge>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0 space-y-6 focus-visible:outline-none">
                <motion.div
                  key="notifications-tab"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-[#111111] border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                    <div className="space-y-4 relative z-10">
                      <NotificationToggle label="Campaign Intelligence" desc="Daily briefings on open rates, AI sentiment scores, and engagement clusters." defaultChecked />
                      <NotificationToggle label="System Resilience" desc="Instant alerts for API outages, credit depletion, or delivery bottlenecks." defaultChecked />
                      <NotificationToggle label="Lead Syncing" desc="Notifications for CSV parsing completion and CRM reconciliation status." />
                      <NotificationToggle label="Engine Updates" desc="Early access notifications for new templates and AI model iterations." />
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* API Keys Tab */}
              <TabsContent value="api-keys" className="mt-0 space-y-8 focus-visible:outline-none">
                <motion.div
                  key="api-keys-tab"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <Card className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-10 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white tracking-tight">Gemini AI Engine</h3>
                            <Badge className="bg-blue-600/20 text-blue-500 border-none px-2 py-0 text-[8px] font-black uppercase tracking-widest mt-1">Tier: Enterprise</Badge>
                          </div>
                        </div>
                        <Button onClick={testGemini} variant="ghost" className="h-10 px-6 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
                          Status Check
                        </Button>
                      </div>
                      <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-2xl">
                        Universal infrastructure for remixing, scoring, and personalization. Ensure your Google Cloud Project has the "Generative Language API" activated for peak performance.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full relative group">
                          <Input 
                            type="password"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="bg-black/50 border-white/5 h-16 rounded-2xl px-6 pr-14 font-bold text-lg focus:border-blue-500 transition-all shadow-inner"
                          />
                          <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <Button className="h-16 px-10 w-full sm:w-auto rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 shadow-xl active:scale-95 transition-all">
                          Update Key
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-[#111111] border-white/5 rounded-[2.5rem] p-10 space-y-6 hover:border-white/10 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Stripe Live Production</h4>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest">Connected</Badge>
                      </div>
                      <Input value="pk_live_*******************************" disabled className="bg-white/2 border-white/5 h-12 rounded-xl text-xs font-bold text-slate-600" />
                    </Card>
                    <Card className="bg-[#111111] border-white/5 rounded-[2.5rem] p-10 space-y-6 hover:border-white/10 transition-colors opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Info className="w-4 h-4 text-slate-600" />
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-600">Analytics Infrastructure</h4>
                        </div>
                        <Badge className="bg-slate-500/10 text-slate-500 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest">Inactive</Badge>
                      </div>
                      <Button variant="outline" className="w-full h-12 border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5">Configure Mesh</Button>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="mt-0 space-y-8 focus-visible:outline-none">
                <motion.section 
                  key="team-tab"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                  <div className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 relative z-10">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Access Management</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Control your collective growth operations</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 h-12 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
                      Sync New Member
                    </Button>
                  </div>
                  <div className="p-10 space-y-4 relative z-10">
                    <TeamMember name="Alex Rivera" email="alex@company.com" role="Super Admin" />
                    <TeamMember name="Sarah Chen" email="sarah@company.com" role="Operator" />
                    <TeamMember name="Jordan Smith" email="jordan@company.com" role="Growth Analyst" />
                  </div>
                </motion.section>
              </TabsContent>

              {/* Danger Zone Tab */}
              <TabsContent value="danger" className="mt-0 focus-visible:outline-none">
                <motion.div
                  key="danger-tab"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="bg-[#111111] border border-red-500/20 rounded-[2.5rem] p-12 space-y-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-4 relative z-10">
                      <div className="p-4 bg-red-500/10 rounded-2xl w-fit">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">Decommission Entity</h3>
                      <p className="text-base font-bold text-slate-400 max-w-2xl leading-relaxed">
                        Initiating account deletion will permanently erase all campaign sequences, lead clusters, and AI-optimized datasets. This protocol is irreversible.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-10 bg-red-500/5 border border-red-500/10 rounded-3xl relative z-10">
                      <div className="space-y-1.5 text-center sm:text-left">
                        <p className="text-[11px] font-black uppercase tracking-widest text-red-500">Identity Verification</p>
                        <p className="text-xs font-bold text-slate-500">Security Phrase: <span className="text-white font-black italic">EXIT-PROTOCOL</span></p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 h-16 w-full sm:w-auto px-12 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-600/30 active:scale-95 transition-all">
                        Finalize Deletion
                      </Button>
                    </div>
                  </Card>

                  <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/2 transition-colors">
                    <div className="text-center sm:text-left">
                      <h4 className="text-lg font-black text-white tracking-tight">Intelligence Export</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">Generate a secure encrypted archive of all workspace activity.</p>
                    </div>
                    <Button variant="ghost" className="h-14 w-full sm:w-auto px-10 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[9px] hover:bg-white/10 tracking-widest">
                       Export Dataset
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function SettingsTab({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
  return (
    <TabsTrigger 
      value={value}
      className="w-full justify-start gap-5 px-8 py-4 rounded-[2rem] text-slate-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-500 group relative border border-transparent data-[state=active]:border-blue-400/20 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/10"
    >
      <div className="transition-transform duration-500 group-hover:scale-125 group-data-[state=active]:scale-110">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none whitespace-nowrap">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-data-[state=active]:opacity-100 transition-all transform group-data-[state=active]:translate-x-1" />
    </TabsTrigger>
  );
}

function SettingsField({ label, placeholder, disabled = false, icon }: { label: string, placeholder: string, disabled?: boolean, icon: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-1">{label}</Label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 transition-colors group-hover:text-blue-500">
          {icon}
        </div>
        <Input 
          placeholder={placeholder}
          disabled={disabled}
          className="bg-[#0A0A0A] border-white/5 h-16 rounded-2xl pl-14 pr-6 font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed text-white focus:border-blue-500 transition-all shadow-inner"
        />
        {disabled && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Lock className="w-4 h-4 text-slate-800" />
          </div>
        )}
      </div>
    </div>
  );
}

function IntegrationCard({ name, desc, icon, connected }: { name: string, desc: string, icon: string, connected: boolean }) {
  return (
    <Card className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-600/30 transition-all group shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-black/40 rounded-[2rem] flex items-center justify-center border border-white/5 p-6 relative group-hover:border-blue-600/20 transition-colors shadow-inner">
            <img src={icon} alt={name} className="w-full h-full object-contain filter brightness-110 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="space-y-2 max-w-lg">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <h3 className="text-3xl font-black text-white tracking-tighter">{name}</h3>
              {connected ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Active Link</Badge>
              ) : (
                <Badge variant="outline" className="text-slate-500 border-white/10 px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/2">Ready to Initialize</Badge>
              )}
            </div>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">{desc}</p>
          </div>
        </div>
        <Button className={cn(
          "w-full lg:w-48 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all",
          connected ? "bg-white/5 hover:bg-white/10 text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 active:scale-95"
        )}>
          {connected ? "Manage Bridge" : "Initialize Setup"}
          {!connected && <ArrowRight className="w-3.5 h-3.5 ml-2" />}
        </Button>
      </div>
    </Card>
  );
}

function NotificationToggle({ label, desc, defaultChecked = false }: { label: string, desc: string, defaultChecked?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors rounded-3xl group px-6 -mx-6">
      <div className="space-y-1.5 mb-4 sm:mb-0">
        <h4 className="text-sm font-black text-white tracking-[0.2em] uppercase transition-colors group-hover:text-blue-400">{label}</h4>
        <p className="text-xs font-bold text-slate-500 max-w-xl group-hover:text-slate-400 transition-colors">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} className="data-[state=checked]:bg-blue-600 data-[state=checked]:shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all" />
    </div>
  );
}

function TeamMember({ name, email, role }: { name: string, email: string, role: string }) {
  return (
    <div className="flex items-center justify-between group py-5 px-6 rounded-[1.5rem] bg-white/[0.01] border border-white/2 hover:bg-white/2 hover:border-white/5 transition-all">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-white/5 shadow-2xl">
            <AvatarFallback className="bg-slate-800 text-blue-400 font-black text-lg">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#111] rounded-full" />
        </div>
        <div>
          <p className="text-sm font-black text-white">{name}</p>
          <p className="text-xs font-bold text-slate-600">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-1.5 bg-white/2 border-white/5 rounded-lg transition-colors group-hover:bg-blue-600/10 group-hover:text-blue-400">
          {role}
        </Badge>
        <button className="text-slate-700 hover:text-red-500 transition-all font-black uppercase tracking-[0.2em] text-[9px] hover:translate-x-1">Terminate Access</button>
      </div>
    </div>
  );
}