import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import AIInsights from "@/components/dashboard/AIInsights";
import QuickActions from "@/components/dashboard/QuickActions";
import ReferralWidget from "@/components/dashboard/ReferralWidget";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useLeads } from "@/hooks/useLeads";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import { Send, Users, BarChart3, DollarSign, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { leads, isLoading: leadsLoading } = useLeads();
  const { totalSent, avgOpenRate, avgAiScore, isLoading: analyticsLoading } = useAnalytics();

  const isLoading = profileLoading || campaignsLoading || leadsLoading || analyticsLoading;
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Founders";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-12 pb-20">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 md:w-96" />
            <Skeleton className="h-4 w-48 md:w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <Skeleton className="h-[400px] rounded-[2.5rem]" />
              <Skeleton className="h-[200px] rounded-[2.5rem]" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-[300px] rounded-[2.5rem]" />
              <Skeleton className="h-[250px] rounded-[2.5rem]" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'scheduled').length;

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
            Good morning, <span className="text-blue-500">{firstName}</span> 👋
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Here's what's happening with your <span className="text-white">{profile?.plan || 'Starter'}</span> engine today.
          </p>
        </motion.div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Campaigns"
            value={activeCampaigns.toString()}
            icon={<Send className="w-6 h-6" />}
            trend={{ value: 14, isUp: true }}
            description="Currently in orbit"
          />
          <MetricCard
            title="Total Leads"
            value={leads.length.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 8, isUp: true }}
            description="Synced leads"
          />
          <MetricCard
            title="Avg Success Score"
            value={`${Math.round(avgAiScore)}%`}
            icon={<BarChart3 className="w-6 h-6" />}
            trend={{ value: 5, isUp: true }}
            description="AI Predictive Rating"
            className="border-blue-500/20 shadow-blue-500/5 shadow-2xl"
          />
          <MetricCard
            title="Emails Sent"
            value={totalSent.toLocaleString()}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: 12, isUp: true }}
            description="Total reach"
          />
        </div>

        {/* Middle Section: Campaigns & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <CampaignsTable campaigns={campaigns.slice(0, 5)} />
            <QuickActions />
          </div>
          <div className="space-y-8">
            <AIInsights />
            <ReferralWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}