
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  MoreHorizontal, 
  ExternalLink, 
  BarChart2, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const campaigns = [
  { id: 1, name: "Q1 Outreach - Fintech", status: "Active", score: 92, openRate: "64%", sentDate: "Mar 28, 2026" },
  { id: 2, name: "SEO Agency Promo", status: "Active", score: 78, openRate: "42%", sentDate: "Mar 25, 2026" },
  { id: 3, name: "Recruiter Networking", status: "Sent", score: 85, openRate: "58%", sentDate: "Mar 20, 2026" },
  { id: 4, name: "Enterprise Pilot Test", status: "Draft", score: 45, openRate: "0%", sentDate: "Mar 30, 2026" },
  { id: 5, name: "SaaS Influencer Campaign", status: "Active", score: 96, openRate: "72%", sentDate: "Mar 29, 2026" },
];

const RecentCampaignsTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-8 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Campaigns</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live performance tracking</p>
        </div>
        <Button variant="outline" className="text-xs font-black uppercase tracking-widest h-10 px-6 rounded-xl">View All</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-50 hover:bg-transparent">
            <TableHead className="px-8 text-xs font-black uppercase tracking-widest text-slate-400">Campaign Name</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Success Score</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Open Rate</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Sent Date</TableHead>
            <TableHead className="pr-8 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign, idx) => (
            <TableRow key={campaign.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <span className="font-black text-slate-900 tracking-tight">{campaign.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ring-4 shadow-sm",
                    campaign.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/5" :
                    campaign.status === 'Sent' ? "bg-indigo-500/10 text-indigo-600 ring-indigo-500/5" :
                    "bg-slate-100 text-slate-500 ring-slate-100/5"
                  )}
                >
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="w-32 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${campaign.score}%` }}
                      transition={{ delay: 0.8 + (idx * 0.1), duration: 0.8 }}
                      className={cn(
                        "h-full rounded-full",
                        campaign.score > 80 ? "bg-emerald-500" : 
                        campaign.score > 60 ? "bg-amber-500" : 
                        "bg-rose-500"
                      )}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-900">{campaign.score}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-black text-slate-600 text-sm">{campaign.openRate}</TableCell>
              <TableCell className="text-sm font-bold text-slate-400">{campaign.sentDate}</TableCell>
              <TableCell className="pr-8 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Showing top performing campaigns from the last 30 days</p>
      </div>
    </motion.div>
  );
};

export default RecentCampaignsTable;
