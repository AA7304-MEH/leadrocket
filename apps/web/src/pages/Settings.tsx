import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  User, Link2, Bell, Key, Users, AlertTriangle, 
  Upload, Check, Shield, Globe, Mail, 
  ExternalLink, Zap, Info, ShieldCheck, ChevronRight,
  Sparkles
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
import { motion } from "framer-motion";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [geminiKey, setGeminiKey] = useState("sk-********************");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully! 🚀");
    }, 1500);
  };

  const testGemini = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Testing Gemini API connectivity...',
      success: 'API Key verified! Gemini 1.5 Flash is ready.',
      error: 'Invalid API Key. Please check and try again.',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter text-white">System Settings</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
              Configure your AI outreach infrastructure
            </p>
          </motion.div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="flex gap-12">
          {/* Settings Nav */}
          <TabsList className="flex flex-col h-auto bg-transparent border-none space-y-2 w-64 items-start shrink-0">
            <SettingsTab value="profile" icon={<User className="w-4 h-4" />} label="Profile & Account" />
            <SettingsTab value="integrations" icon={<Link2 className="w-4 h-4" />} label="Integrations" />
            <SettingsTab value="notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" />
            <SettingsTab value="api-keys" icon={<Key className="w-4 h-4" />} label="API Infrastructure" />
            <SettingsTab value="team" icon={<Users className="w-4 h-4" />} label="Team Workspace" />
            <SettingsTab value="danger" icon={<AlertTriangle className="w-4 h-4" />} label="Danger Zone" />
          </TabsList>

          <div className="flex-1 min-w-0">
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-8 bg-[#111111] p-10 rounded-3xl border border-white/5">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-white/5 ring-4 ring-blue-600/20 shadow-2xl">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-black text-2xl">U</AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Upload Profile Image</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Recommended size 400x400. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <SettingsField label="Full Name" placeholder="Alex Rivera" />
                  <SettingsField label="Email Address" placeholder="alex@company.com" disabled />
                  <SettingsField label="Company Name" placeholder="Acme SaaS" />
                  <SettingsField label="Role" placeholder="Head of Growth" />
                  <SettingsField label="Timezone" placeholder="(GMT-08:00) Pacific Time" />
                </div>
              </section>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="mt-0 space-y-6">
              <IntegrationCard 
                name="HubSpot" 
                desc="Sync your outreach data directly with HubSpot CRM." 
                icon="https://cdn.worldvectorlogo.com/logos/hubspot.svg" 
                connected={true} 
              />
              <IntegrationCard 
                name="Gmail SMTP" 
                desc="Send high-performance campaigns using your personal Gmail address." 
                icon="https://cdn.worldvectorlogo.com/logos/gmail-icon.svg" 
                connected={false} 
              />
              <div className="grid grid-cols-2 gap-6 opacity-40">
                <Card className="bg-[#111111] border-dashed border-white/10 rounded-3xl p-8 cursor-not-allowed">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-100">Zapier Connection</h4>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-blue-500 border-blue-500/20">Coming Soon</Badge>
                    </div>
                  </div>
                </Card>
                <Card className="bg-[#111111] border-dashed border-white/10 rounded-3xl p-8 cursor-not-allowed">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-100">Webhooks</h4>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-blue-500 border-blue-500/20">Coming Soon</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0 space-y-6">
              <Card className="bg-[#111111] border-white/5 rounded-3xl p-10">
                <div className="space-y-8">
                  <NotificationToggle label="Campaign Performance" desc="Receive daily summaries of your campaign open and click rates." defaultChecked />
                  <NotificationToggle label="System Alerts" desc="Critical notifications about your API keys and monthly credit limits." defaultChecked />
                  <NotificationToggle label="Lead Import Status" desc="Get notified when your CSV files are successfully parsed and ready." />
                  <NotificationToggle label="Marketing Updates" desc="New features, template marketplace drops, and product announcements." />
                </div>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="mt-0 space-y-6">
              <section className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/10 rounded-3xl overflow-hidden">
                  <div className="p-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight">Gemini AI Infrastructure</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-xl">
                      LeadRockets uses Google Gemini 1.5 Flash to provide real-time campaign scoring and content remixing. Ensure your API key has "Generative Language Client" enabled.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Input 
                          type="password"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          className="bg-black/50 border-white/5 h-16 rounded-2xl px-6 font-bold text-lg focus:border-blue-500"
                        />
                        <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      </div>
                      <Button onClick={testGemini} className="h-16 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-slate-100">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-[#111111] border-white/5 rounded-3xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Stripe Live Key</h4>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0 h-4 text-[8px]">Active</Badge>
                      </div>
                      <Input value="pk_live*****************" disabled className="bg-white/3 border-none h-12 rounded-xl text-xs font-bold text-slate-600" />
                    </div>
                  </Card>
                  <Card className="bg-[#111111] border-white/5 rounded-3xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Analytics API</h4>
                        <Badge className="bg-slate-500/10 text-slate-500 border-none px-2 py-0 h-4 text-[8px]">Inactive</Badge>
                      </div>
                      <Button variant="outline" className="w-full h-12 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Keys</Button>
                    </div>
                  </Card>
                </div>
              </section>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="mt-0 space-y-6">
              <section className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-10 flex items-center justify-between border-b border-white/5">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Team Members</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Management of your collaborative engine</p>
                  </div>
                  <Button className="bg-blue-600 h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest">
                    Invite Member
                  </Button>
                </div>
                <div className="p-10 space-y-6">
                  <TeamMember name="Alex Rivera" email="alex@company.com" role="Admin" />
                  <TeamMember name="Sarah Chen" email="sarah@company.com" role="Member" />
                  <TeamMember name="Jordan Smith" email="jordan@company.com" role="Analyst" />
                </div>
              </section>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="mt-0 space-y-8">
              <Card className="bg-[#111111] border-red-500/20 rounded-3xl p-10 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Delete Account</h3>
                  <p className="text-sm font-bold text-slate-400">Once your account is deleted, all campaigns, lead lists, and AI history will be permanently erased. This action cannot be undone.</p>
                </div>
                <div className="flex items-center justify-between p-8 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-red-500">Security Requirement</p>
                    <p className="text-xs font-bold text-slate-500">Type "DELETE-MY-DATA" below to finalize.</p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-600/20">
                    Delete Permanently
                  </Button>
                </div>
              </Card>

              <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-white tracking-tight">Export Workspace Data</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1">Download all your campaigns and lead data as a secure ZIP archive.</p>
                </div>
                <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
                  Generate Export
                </Button>
              </div>
            </TabsContent>
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
      className="w-full justify-start gap-4 px-6 py-4 rounded-2xl text-slate-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 group"
    >
      <div className="transition-transform group-hover:scale-110 group-data-[state=active]:scale-110">
        {icon}
      </div>
      <span className="text-[12px] font-black uppercase tracking-widest leading-none">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
    </TabsTrigger>
  );
}

function SettingsField({ label, placeholder, disabled = false }: { label: string, placeholder: string, disabled?: boolean }) {
  return (
    <div className="space-y-2.5">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">{label}</Label>
      <Input 
        placeholder={placeholder}
        disabled={disabled}
        className="bg-[#111111] border-white/5 h-16 rounded-2xl px-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed text-white focus:border-blue-500 transition-all"
      />
    </div>
  );
}

function IntegrationCard({ name, desc, icon, connected }: { name: string, desc: string, icon: string, connected: boolean }) {
  return (
    <Card className="bg-[#111111] border-white/5 rounded-[2rem] p-10 hover:border-blue-600/30 transition-all group shadow-2xl">
      <div className="flex items-center justify-between cursor-default">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center border border-white/5 p-4">
            <img src={icon} alt={name} className="w-full h-full object-contain filter brightness-110 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white tracking-tighter">{name}</h3>
              {connected ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Connected</Badge>
              ) : (
                <Badge variant="outline" className="text-slate-500 border-white/10 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Not Connected</Badge>
              )}
            </div>
            <p className="text-sm font-bold text-slate-400 max-w-md leading-relaxed">{desc}</p>
          </div>
        </div>
        <Button className={connected ? "bg-white/5 hover:bg-white/10 text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20"}>
          {connected ? "Manage" : "Connect Setup"}
        </Button>
      </div>
    </Card>
  );
}

function NotificationToggle({ label, desc, defaultChecked = false }: { label: string, desc: string, defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-white/5 last:border-0 hover:bg-white/1 transition-colors px-4 rounded-xl -mx-4 group">
      <div className="space-y-1.5">
        <h4 className="text-sm font-black text-white tracking-widest uppercase">{label}</h4>
        <p className="text-xs font-bold text-slate-500 max-w-lg">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} className="data-[state=checked]:bg-blue-600" />
    </div>
  );
}

function TeamMember({ name, email, role }: { name: string, email: string, role: string }) {
  return (
    <div className="flex items-center justify-between group py-3 px-4 rounded-2xl hover:bg-white/2 transition-all">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border border-white/10 shadow-lg">
          <AvatarFallback className="bg-slate-800 text-slate-300 font-bold">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-black text-white">{name}</p>
          <p className="text-xs font-bold text-slate-600">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-white/3 border-none">
          {role}
        </Badge>
        <button className="text-slate-700 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">Remove</button>
      </div>
    </div>
  );
}