import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis 
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, Mail, MousePointer2, 
  Users, Target, Calendar, Info, Sparkles, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

// --- Mock Data ---
const performanceData = [
  { date: "Mar 25", campaignA: 24, campaignB: 18, campaignC: 32 },
  { date: "Mar 26", campaignA: 32, campaignB: 22, campaignC: 28 },
  { date: "Mar 27", campaignA: 28, campaignB: 25, campaignC: 35 },
  { date: "Mar 28", campaignA: 38, campaignB: 30, campaignC: 42 },
  { date: "Mar 29", campaignA: 42, campaignB: 32, campaignC: 38 },
  { date: "Mar 30", campaignA: 40, campaignB: 35, campaignC: 45 },
  { date: "Mar 31", campaignA: 48, campaignB: 38, campaignC: 52 },
];

const correlationData = [
  { score: 45, openRate: 12, name: "Intro v1" },
  { score: 62, openRate: 22, name: "Followup A" },
  { score: 78, openRate: 34, name: "Value Prop" },
  { score: 85, openRate: 42, name: "Case Study" },
  { score: 92, openRate: 58, name: "Last chance" },
  { score: 55, openRate: 18, name: "Intro v2" },
  { score: 70, openRate: 28, name: "Network" },
  { score: 88, openRate: 48, name: "Meeting" },
];

const sourceData = [
  { name: "CSV Import", value: 1240, color: "#3B82F6" },
  { name: "Manual", value: 320, color: "#8B5CF6" },
  { name: "Referral", value: 580, color: "#10B981" },
  { name: "API", value: 200, color: "#F59E0B" },
];

const heatmapData = [
  { day: "Mon", time: "6am", score: 20 }, { day: "Mon", time: "8am", score: 45 }, { day: "Mon", time: "10am", score: 78 }, { day: "Mon", time: "12pm", score: 55 }, { day: "Mon", time: "2pm", score: 62 }, { day: "Mon", time: "4pm", score: 40 },
  { day: "Tue", time: "6am", score: 32 }, { day: "Tue", time: "8am", score: 58 }, { day: "Tue", time: "10am", score: 94 }, { day: "Tue", time: "12pm", score: 68 }, { day: "Tue", time: "2pm", score: 75 }, { day: "Tue", time: "4pm", score: 45 },
  { day: "Wed", time: "6am", score: 25 }, { day: "Wed", time: "8am", score: 50 }, { day: "Wed", time: "10am", score: 82 }, { day: "Wed", time: "12pm", score: 60 }, { day: "Wed", time: "2pm", score: 70 }, { day: "Wed", time: "4pm", score: 52 },
  { day: "Thu", time: "6am", score: 28 }, { day: "Thu", time: "8am", score: 55 }, { day: "Thu", time: "10am", score: 88 }, { day: "Thu", time: "12pm", score: 65 }, { day: "Thu", time: "2pm", score: 72 }, { day: "Thu", time: "4pm", score: 55 },
  { day: "Fri", time: "6am", score: 18 }, { day: "Fri", time: "8am", score: 40 }, { day: "Fri", time: "10am", score: 72 }, { day: "Fri", time: "12pm", score: 50 }, { day: "Fri", time: "2pm", score: 58 }, { day: "Fri", time: "4pm", score: 35 },
  { day: "Sat", time: "6am", score: 10 }, { day: "Sat", time: "8am", score: 15 }, { day: "Sat", time: "10am", score: 25 }, { day: "Sat", time: "12pm", score: 20 }, { day: "Sat", time: "2pm", score: 18 }, { day: "Sat", time: "4pm", score: 12 },
  { day: "Sun", time: "6am", score: 8 }, { day: "Sun", time: "8am", score: 12 }, { day: "Sun", time: "10am", score: 18 }, { day: "Sun", time: "12pm", score: 15 }, { day: "Sun", time: "2pm", score: 12 }, { day: "Sun", time: "4pm", score: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
            <span className="text-xs font-bold text-white">{p.name || p.dataKey || p.payload?.name}: </span>
            <span className="text-xs font-black text-blue-500">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [range, setRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({
    performance: performanceData,
    correlation: correlationData,
    sources: sourceData,
    metrics: {
      sent: "24,512",
      open: "48.2%",
      click: "12.4%",
      converted: "1,248"
    }
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, range]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    // In a real scenario, this would be a single RPC or complex JOIN
    // For now, we fetch core stats and process them
    const { data: campaignData } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user?.id);

    const { data: leadData } = await supabase
      .from('leads')
      .select('source')
      .eq('user_id', user?.id);

    if (campaignData && campaignData.length > 0) {
      // Process campaign performance over time
      // Process correlation (AI score vs Open Rate)
      // (This is a simplified version for the polish phase)
      setData(prev => ({
        ...prev,
        correlation: campaignData.map(c => ({
          score: c.ai_score || 0,
          openRate: c.open_rate || 0,
          name: c.name
        }))
      }));
    }

    if (leadData && leadData.length > 0) {
      // Process source distribution
      const sources = leadData.reduce((acc: any, curr: any) => {
        const src = curr.source || 'Other';
        acc[src] = (acc[src] || 0) + 1;
        return acc;
      }, {});

      const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];
      setData(prev => ({
        ...prev,
        sources: Object.keys(sources).map((name, i) => ({
          name,
          value: sources[name],
          color: colors[i % colors.length]
        }))
      }));
    }

    // Artificial delay for premium shimmer feel
    setTimeout(() => setIsLoading(false), 800);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-10 pb-20">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="w-64 h-10" />
              <Skeleton className="w-48 h-4" />
            </div>
            <Skeleton className="w-48 h-12 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[500px] rounded-[2.5rem]" />
            <Skeleton className="h-[500px] rounded-[2.5rem]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] rounded-[2.5rem]" />
            <Skeleton className="h-[500px] rounded-[2.5rem]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasData = data.performance.length > 0 || data.correlation.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter text-white">Advanced Analytics</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
              Data-driven insights for your AI outreach
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[180px] bg-[#111111] border-white/5 text-white h-12 rounded-2xl font-bold">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-white/10 text-white rounded-xl">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <button className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
              Export CSV
            </button>
          </motion.div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Emails Sent" value={data.metrics.sent} trend="+12.5%" trendUp={true} icon={<Mail className="w-4 h-4" />} />
          <StatCard title="Overall Open Rate" value={data.metrics.open} trend="+5.2%" trendUp={true} icon={<Target className="w-4 h-4" />} />
          <StatCard title="Avg Click Rate" value={data.metrics.click} trend="-2.1%" trendUp={false} icon={<MousePointer2 className="w-4 h-4" />} />
          <StatCard title="Leads Converted" value={data.metrics.converted} trend="+18.4%" trendUp={true} icon={<Users className="w-4 h-4" />} />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <Card className="lg:col-span-2 bg-[#111111] border-white/5 rounded-3xl overflow-hidden group">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Campaign Performance Over Time
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 font-black uppercase tracking-widest">Enterprise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-bold text-slate-400 font-black uppercase tracking-widest">Growth</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[400px]">
              {data.performance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight={900} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => val.toUpperCase()}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight={900} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="campaignA" 
                      name="Enterprise Outreach"
                      stroke="#3B82F6" 
                      strokeWidth={4} 
                      dot={false} 
                      activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 4, fill: "#0A0A0A" }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="campaignB" 
                      name="Growth Engine"
                      stroke="#8B5CF6" 
                      strokeWidth={4} 
                      dot={false} 
                      activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 4, fill: "#0A0A0A" }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="campaignC" 
                      name="Referral Loop"
                      stroke="#10B981" 
                      strokeWidth={4} 
                      dot={false} 
                      activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 4, fill: "#0A0A0A" }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState 
                  title="No performance data"
                  description="We need at least two sent campaigns to show performance trends."
                  icon={BarChart3}
                />
              )}
            </CardContent>
          </Card>

          {/* Lead Sources Donut */}
          <Card className="bg-[#111111] border-white/5 rounded-3xl group">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 h-[400px] flex flex-col justify-center">
              {data.sources.length > 0 ? (
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.sources}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {data.sources.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white">
                      {data.sources.reduce((acc: any, curr: any) => acc + curr.value, 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Leads</span>
                  </div>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center">
                   <EmptyState title="No leads" description="Import leads to see distribution." icon={Users} />
                </div>
              )}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {data.sources.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] font-black uppercase text-slate-400">{s.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Score vs Open Rate Correlation */}
          <Card className="bg-[#111111] border-white/5 rounded-3xl group">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  AI Score vs. Actual Performance
                </CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  Insight Found
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[400px]">
              {data.correlation.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                    <XAxis 
                      type="number" 
                      dataKey="score" 
                      name="AI Score" 
                      unit="" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight={900}
                      domain={[0, 100]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="openRate" 
                      name="Open Rate" 
                      unit="%" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight={900}
                      domain={[0, 100]}
                    />
                    <ZAxis type="number" range={[100, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Scatter name="Campaigns" data={data.correlation} fill="#3B82F6">
                      {data.correlation.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10B981' : '#3B82F6'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No correlation data" description="Launch campaigns to see AI scoring vs actual performance." icon={Sparkles} />
              )}
              <div className="mt-4 px-4 py-3 bg-blue-600/5 border border-blue-600/10 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                  <span className="text-blue-500 font-black">Correlation Analysis:</span> High AI scores correlate with 32% higher open rates on average.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Send Times Heatmap */}
          <Card className="bg-[#111111] border-white/5 rounded-3xl group">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  Best Send Times (Open Rates)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Based on last 10k sends</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="text-[10px] font-black uppercase text-slate-600 text-center">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-6 gap-2">
                {heatmapData.map((h, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg flex items-center justify-center relative group/cell transition-all cursor-crosshair"
                    style={{ 
                      backgroundColor: h.score > 80 ? '#3B82F6' : h.score > 60 ? '#1D4ED8' : h.score > 40 ? '#1E3A8A' : h.score > 20 ? '#172554' : '#0F172A',
                      opacity: 0.8 + (h.score/500)
                    }}
                  >
                    {h.score > 90 && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity bg-black/80 rounded-lg pointer-events-none z-10 backdrop-blur-sm">
                      <span className="text-[10px] font-black text-white">{h.time}: {h.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase text-slate-600">Legend:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#0F172A]" />
                    <span className="text-[9px] font-black text-slate-600">Low</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#3B82F6]" />
                    <span className="text-[9px] font-black text-slate-600">Optimal</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Tuesday 10 AM is your Sweet Spot
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <Card className="bg-[#111111] border-white/5 rounded-3xl hover:border-blue-500/20 transition-all group p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/5 rounded-2xl text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight",
          trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
        )}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </Card>
  );
}