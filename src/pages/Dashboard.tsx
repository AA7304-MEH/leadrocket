import DashboardLayout from "@/components/layout/DashboardLayout";

// Widget imports
import CampaignPerformance from "@/components/dashboard/CampaignPerformance";
import AICopilot from "@/components/dashboard/AICopilot";
import LeadIntelligenceHub from "@/components/dashboard/LeadIntelligenceHub";
import EngagementOpportunities from "@/components/dashboard/EngagementOpportunities";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TemplatesWidget from "@/components/dashboard/TemplatesWidget";
import QuickActions from "@/components/dashboard/QuickActions";
import PlanUsage from "@/components/dashboard/PlanUsage";
import PerformanceGoals from "@/components/dashboard/PerformanceGoals";
import { RemixWidget } from "@/components/ai/RemixWidget";
import { HealthScoreWidget } from "@/components/ai/HealthScoreWidget";

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your cold email performance.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column - Primary Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Campaign Performance - Full Width */}
          <CampaignPerformance />

          {/* Two Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadIntelligenceHub />
            <EngagementOpportunities />
          </div>

          {/* AI Tools Row */}
          <div className="grid grid-cols-1 gap-6">
            <RemixWidget />
          </div>

          {/* Templates & Activity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TemplatesWidget />
            <ActivityFeed />
          </div>
        </div>

        {/* Right Column - AI Copilot & Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AICopilot />
          <HealthScoreWidget />
          <QuickActions />
          <PlanUsage />
        </div>

        {/* Full Width Footer Row */}
        <div className="lg:col-span-12">
          <PerformanceGoals />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;