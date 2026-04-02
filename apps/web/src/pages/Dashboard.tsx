import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import AIInsights from "@/components/dashboard/AIInsights";
import QuickActions from "@/components/dashboard/QuickActions";
import ReferralWidget from "@/components/dashboard/ReferralWidget";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Send, Users, BarChart3, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || "Growth Team";

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
            Here's what's happening with your campaigns today.
          </p>
        </motion.div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Campaigns"
            value="12"
            icon={<Send className="w-6 h-6" />}
            trend={{ value: 14, isUp: true }}
            description="Across all channels"
          />
          <MetricCard
            title="Total Leads"
            value="2,340"
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 8, isUp: true }}
            description="Synced this week"
          />
          <MetricCard
            title="Avg Success Score"
            value="84%"
            icon={<BarChart3 className="w-6 h-6" />}
            trend={{ value: 5, isUp: true }}
            description="AI Predictive Rating"
            className="border-emerald-500/20"
          />
          <MetricCard
            title="Monthly Revenue"
            value="$12,450"
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: 12, isUp: true }}
            description="Team plan earnings"
          />
        </div>

        {/* Middle Section: Campaigns & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <CampaignsTable />
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