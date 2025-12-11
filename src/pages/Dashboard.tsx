
import HealthScore from "@/components/dashboard/HealthScore";
import ReplyRateChart from "@/components/dashboard/ReplyRateChart";
import TopTemplates from "@/components/dashboard/TopTemplates";
import LeadOfDay from "@/components/dashboard/LeadOfDay";
import QuickActions from "@/components/dashboard/QuickActions";
import { TopPriorityLeads } from "@/components/dashboard/TopPriorityLeads";
import { CompetitorAlert } from "@/components/dashboard/CompetitorAlert";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Founder 👋</h1>
          <p className="text-gray-500">Here's what's happening with your campaigns today.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button>+ New Campaign</Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1 */}
        <HealthScore score={92} />
        <ReplyRateChart />
        <div className="space-y-6">
          <TopPriorityLeads />
          <LeadOfDay />
          <QuickActions />
        </div>

        {/* Row 2 (if any, or expanding previous col) */}
        <div className="md:col-span-2 lg:col-span-1">
          <TopTemplates />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <CompetitorAlert />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;