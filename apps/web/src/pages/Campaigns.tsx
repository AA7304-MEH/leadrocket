import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Filter, 
  ChevronDown, LayoutGrid, List as ListIcon, 
  Sparkles, Rocket
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for initial UI build
const MOCK_CAMPAIGNS = [
  {
    id: "1",
    name: "Q4 Enterprise Outreach",
    status: "active",
    ai_score: 92,
    sent_count: 1240,
    open_rate: 68,
    created_at: "2024-11-15T10:00:00Z",
    subject_preview: "Scaling your team's output with LeadRockets AI"
  },
  {
    id: "2",
    name: "Product Hunt Follow-up",
    status: "sent",
    ai_score: 87,
    sent_count: 850,
    open_rate: 74,
    created_at: "2024-11-20T14:30:00Z",
    subject_preview: "Thanks for the support on PH! 🚀"
  },
  {
    id: "3",
    name: "Inbound Lead Nurture",
    status: "draft",
    ai_score: 45,
    sent_count: 0,
    open_rate: 0,
    created_at: "2024-12-01T09:15:00Z",
    subject_preview: "Welcome to LeadRockets — here's your guide"
  }
];

export default function Campaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setCampaigns(data);
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto px-4 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                <Rocket className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white">Campaigns</h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Manage your high-performance scale-up engines
            </p>
          </div>

          <Button 
            onClick={() => navigate("/campaigns/new")}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 gap-3 group transition-all"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Create New Campaign</span>
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 p-2 bg-[#111111] border border-white/5 rounded-[2rem]">
          <div className="flex items-center gap-2 w-full lg:w-auto flex-1">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search campaigns..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-14 bg-transparent border-none focus-visible:ring-0 text-sm font-bold tracking-tight text-white placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="h-12 px-4 flex items-center gap-2 bg-white/2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Filter className="w-3 h-3" />
              Status: <span className="text-white">All</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="h-12 px-4 flex items-center gap-2 bg-white/2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
              Sort: <span className="text-white">Newest</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="h-12 px-2 flex items-center bg-white/5 rounded-2xl">
              <button className="p-2 rounded-xl bg-blue-600 text-white shadow-lg">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl text-slate-500 hover:text-white">
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40 rounded-[2.5rem]" />
              ))}
            </>
          ) : campaigns.length > 0 ? (
            <>
              {campaigns
                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </>
          ) : (
            <div className="col-span-full">
              <EmptyState 
                icon={Rocket}
                title="Your first campaign is waiting"
                description="Your high-performance scale-up engine is ready for takeoff. Let's build your first blast."
                ctaText="Create Campaign"
                onCtaClick={() => {
                  toast.info("Initializing new campaign builder...");
                  navigate("/campaigns/new");
                }}
              />
            </div>
          )}

          {/* Add New Placeholder - always show if not empty */}
          {!isLoading && campaigns.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate("/campaigns/new")}
              className="group h-[320px] border-2 border-dashed border-white/5 hover:border-blue-500/30 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all bg-white/[0.01] hover:bg-white/[0.03]"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                <Plus className="w-8 h-8 text-slate-600 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-black tracking-widest uppercase text-slate-600 group-hover:text-slate-400 mb-1">Create Campaign</span>
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Start your next engine</span>
              </div>
            </motion.button>
          )}
        </div>

        {/* AI Insight Footer */}
        <div className="mt-20 p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600/5 to-purple-600/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tighter text-white">Scale-up Tip</h4>
              <p className="text-sm font-bold text-slate-400 mt-1 max-w-xl italic">
                Your subject lines with emojis have a <span className="text-blue-400">22% higher open rate</span> on average. Try adding one to your next campaign!
              </p>
            </div>
          </div>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] gap-2">
            View Analytics
            <Plus className="w-3 h-3 rotate-45" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}