import { motion } from "framer-motion";
import { Plus, Download, BarChart3, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRBAC } from "@/hooks/useRBAC";

export default function QuickActions() {
  const { can } = useRBAC();

  const actions = [
    {
      title: "New Campaign",
      description: "Create AI-powered sequence",
      icon: Plus,
      color: "blue",
      visible: true
    },
    {
      title: "Import Leads",
      description: "Upload CSV or sync CRM",
      icon: Download,
      color: "emerald",
      visible: true
    },
    {
      title: "View Analytics",
      description: "Deep dive into performance",
      icon: BarChart3,
      color: "amber",
      visible: true
    },
    {
      title: "Invite Team",
      description: "Collaborate with others",
      icon: UserPlus,
      color: "purple",
      visible: can('manager')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
      {actions.filter(a => a.visible).map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
        >
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110",
            action.color === "blue" ? "bg-blue-500/10 text-blue-500" :
            action.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" :
            action.color === "amber" ? "bg-amber-500/10 text-amber-500" :
            "bg-purple-500/10 text-purple-500"
          )}>
            <action.icon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{action.title}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{action.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
