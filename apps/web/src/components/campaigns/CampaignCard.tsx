import React from "react";
import { motion } from "framer-motion";
import { MoreVertical, Send, Target, BarChart3, Clock, Copy, Trash2, Archive, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    ai_score: number;
    sent_count: number;
    open_rate: number;
    created_at: string;
    subject_preview?: string;
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const getScoreColor = (score: number) => {
    if (score > 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (score > 60) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-red-500 border-red-500/20 bg-red-500/5";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -20px rgba(59, 130, 246, 0.15)" }}
      className="group relative p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-blue-500/30 transition-all overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
              campaign.status === "active" ? "bg-blue-500/10 text-blue-500" :
              campaign.status === "sent" ? "bg-emerald-500/10 text-emerald-500" :
              "bg-amber-500/10 text-amber-500"
            )}>
              {campaign.status}
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {new Date(campaign.created_at).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">
            {campaign.name}
          </h3>

          <p className="text-sm font-bold text-slate-400 line-clamp-1 italic">
            "{campaign.subject_preview || "No subject line defined yet..."}"
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Total Sent</span>
              <div className="text-lg font-black text-white">{campaign.sent_count.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Open Rate</span>
              <div className="text-lg font-black text-white">{campaign.open_rate}%</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-6 h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/5 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                <FileText className="w-4 h-4" /> Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                <BarChart3 className="w-4 h-4" /> View Report
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                <Copy className="w-4 h-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-slate-400 hover:text-white focus:bg-white/5">
                <Archive className="w-4 h-4" /> Archive
              </DropdownMenuItem>
              <div className="h-px bg-white/5 my-1" />
              <DropdownMenuItem className="rounded-xl gap-2 font-bold text-[11px] uppercase tracking-widest cursor-pointer text-red-400 hover:text-red-300 focus:bg-red-500/5">
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className={cn(
            "w-16 h-16 rounded-2xl border flex flex-col items-center justify-center",
            getScoreColor(campaign.ai_score)
          )}>
            <span className="text-xl font-black tracking-tighter">{campaign.ai_score}</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">AI Score</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -right-4 -bottom-4 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        <Send className="w-32 h-32 rotate-12" />
      </div>
    </motion.div>
  );
}
