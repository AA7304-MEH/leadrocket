import { motion } from "framer-motion";
import { MoreVertical, Rocket, Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Campaign } from "@/hooks/useCampaigns";

interface CampaignsTableProps {
  campaigns: Campaign[];
  isLoading?: boolean;
}

export default function CampaignsTable({ campaigns, isLoading = false }: CampaignsTableProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden"
    >
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tighter text-white">Recent Campaigns</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time performance metrics</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/campaigns")}
          className="text-blue-500 hover:bg-blue-500/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl h-10 px-6"
        >
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 px-8">
              <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Campaign Name</th>
              <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI Score</th>
              <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Open Rate</th>
              <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Last Activity</th>
              <th className="py-6 px-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-8"><Skeleton className="w-48 h-8 rounded-lg" /></td>
                    <td className="py-6 px-4"><Skeleton className="w-24 h-6 rounded-full" /></td>
                    <td className="py-6 px-4"><Skeleton className="w-32 h-6 rounded-lg" /></td>
                    <td className="py-6 px-4"><Skeleton className="w-16 h-6 rounded-lg" /></td>
                    <td className="py-6 px-4"><Skeleton className="w-24 h-4 rounded-lg" /></td>
                    <td className="py-6 px-8 text-right"><Skeleton className="w-8 h-8 rounded-full ml-auto" /></td>
                  </tr>
                ))}
              </>
            ) : campaigns.length > 0 ? (
              <>
                {campaigns.map((campaign) => (
                  <motion.tr 
                    key={campaign.id}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    className="group"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
                          <Send className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{campaign.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        campaign.status === "active" ? "bg-blue-500/10 text-blue-500" : 
                        campaign.status === "sent" ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-amber-500/10 text-amber-500"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          campaign.status === "active" ? "bg-blue-500 animate-pulse" : 
                          campaign.status === "sent" ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {campaign.status}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="w-24 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white">{campaign.ai_score || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${campaign.ai_score || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full",
                              (campaign.ai_score || 0) > 80 ? "bg-emerald-500" :
                              (campaign.ai_score || 0) > 60 ? "bg-amber-500" : "bg-red-500"
                            )}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-sm font-bold text-slate-400 tracking-tight">
                      {campaign.open_rate || 0}%
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-white" onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    icon={Rocket}
                    title="No recent activity"
                    description="Launch your first campaign to see real-time performance analytics here."
                    ctaText="Create Campaign"
                    onCtaClick={() => navigate("/campaigns/new")}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
