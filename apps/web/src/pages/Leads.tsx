import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, UserPlus, Upload, Search, Filter, 
  MoreHorizontal, Download, Sparkles, Trash2,
  CheckCircle2, Tags, Mail, Building2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import LeadImportModal from "@/components/leads/LeadImportModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

// Mock data
const MOCK_LEADS = [
  { id: "1", name: "Sarah Chen", email: "sarah@techflow.ai", company: "TechFlow", role: "CTO", status: "active", ai_score: 94 },
  { id: "2", name: "Marcus Wright", email: "m.wright@nexus.co", company: "Nexus Corp", role: "Head of Growth", status: "active", ai_score: 82 },
  { id: "3", name: "Elena Rodriguez", email: "elena@bolt.design", company: "Bolt Design", role: "Founder", status: "active", ai_score: 88 },
  { id: "4", name: "David Kim", email: "david@streak.io", company: "Streak", role: "Sales VP", status: "unsubscribed", ai_score: 42 },
  { id: "5", name: "Julian Voss", email: "julian@voss.de", company: "Voss Media", role: "Marketing Director", status: "active", ai_score: 76 },
];

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setLeads(data);
    setIsLoading(false);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredLeads = leads.filter(l => 
    l.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto px-4 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white">Leads</h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Manage your audience and enrich profiles with AI
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              className="h-14 px-8 border-white/5 bg-white/2 hover:bg-white/5 text-white rounded-2xl gap-3 transition-all"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Import CSV</span>
            </Button>
            <Button 
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 gap-3 group transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add Lead</span>
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 p-3 bg-[#111111] border border-white/5 rounded-[2.5rem]">
          <div className="flex items-center gap-2 w-full lg:w-auto flex-1">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search by name, email, or company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-14 bg-transparent border-none focus-visible:ring-0 text-sm font-bold tracking-tight text-white placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-12 px-6 flex items-center gap-3 bg-white/2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Filter className="w-3 h-3" />
              Filtered by: <span className="text-white">Active</span>
            </div>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedLeads.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8 p-4 bg-blue-600 rounded-[2rem] flex items-center justify-between px-8 shadow-2xl shadow-blue-600/20"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-white uppercase tracking-tighter">
                  {selectedLeads.length} Leads Selected
                </span>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2">
                  <ActionButton icon={<Sparkles className="w-3.5 h-3.5" />} label="AI Enrich" />
                  <ActionButton icon={<Tags className="w-3.5 h-3.5" />} label="Add Tags" />
                  <ActionButton icon={<Mail className="w-3.5 h-3.5" />} label="Assign to Campaign" />
                </div>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leads Table */}
        <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 w-12">
                  <Checkbox 
                    checked={selectedLeads.length > 0 && selectedLeads.length === leads.length}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Lead Info</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Company</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Score</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-6"><Skeleton className="w-4 h-4 rounded-md" /></td>
                      <td className="p-6 text-sm"><Skeleton className="w-48 h-8 rounded-lg" /></td>
                      <td className="p-6 text-sm"><Skeleton className="w-32 h-8 rounded-lg" /></td>
                      <td className="p-6 text-sm"><Skeleton className="w-24 h-6 rounded-full" /></td>
                      <td className="p-6 text-sm"><Skeleton className="w-32 h-4 rounded-full" /></td>
                      <td className="p-6 text-sm"><Skeleton className="w-10 h-10 rounded-xl" /></td>
                    </tr>
                  ))}
                </>
              ) : filteredLeads.length > 0 ? (
                <>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleSelect(lead.id)}
                          className="border-white/10 group-hover:border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold">
                            {lead.full_name?.charAt(0) || lead.email?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{lead.full_name}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-600" />
                          <div>
                            <div className="text-[11px] font-black text-slate-300 uppercase tracking-tight">{lead.company}</div>
                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{lead.role || 'Prospect'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          lead.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                          <CheckCircle2 className="w-3 h-3" />
                          {lead.status}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[80px]">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${lead.ai_score || 0}%` }}
                              className={cn(
                                "h-full rounded-full",
                                (lead.ai_score || 0) > 80 ? "bg-emerald-500" : (lead.ai_score || 0) > 50 ? "bg-amber-500" : "bg-red-500"
                              )}
                            />
                          </div>
                          <span className="text-xs font-black text-white">{lead.ai_score || 0}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all outline-none">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/5 rounded-2xl p-2 shadow-2xl">
                            <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                              View Activity
                            </DropdownMenuItem>
                            <div className="h-px bg-white/5 my-1" />
                            <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-red-400 hover:text-red-300 focus:bg-red-500/5">
                              Archive Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState 
                      icon={Upload}
                      title="Your database is empty"
                      description="Import your first lead list or add contacts manually to start scaling your outreach engine."
                      ctaText="Import Leads"
                      onCtaClick={() => setIsImportModalOpen(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing 5 of 1,240 leads</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-30" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-10 border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>

        <LeadImportModal 
        open={isImportModalOpen} 
        onOpenChange={setIsImportModalOpen}
        onImportComplete={(count) => {
          setIsImportModalOpen(false);
          toast.success(`Successfully imported ${count} leads! 🚀`);
          fetchLeads();
        }}
      />
    </DashboardLayout>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
      {icon}
      {label}
    </button>
  );
}