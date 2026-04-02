import { motion } from "framer-motion";
import { Gift, Copy, Share2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReferralWidget() {
  const referralCode = "ROCKET-99-AI";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/10 rounded-3xl p-8 relative overflow-hidden group"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Rocket className="w-24 h-24 rotate-45" />
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
          <Gift className="w-6 h-6 text-indigo-400" />
        </div>

        <h3 className="text-xl font-black tracking-tighter text-white">Give $50, Get $50</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
          Invite your friends to LeadRockets. When they upgrade to a Pro plan, you both get $50 in credits.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between group/code">
              <span className="text-xs font-black text-slate-300 tracking-widest uppercase">{referralCode}</span>
              <button 
                onClick={copyToClipboard}
                className="text-indigo-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <Button className="h-[46px] w-[46px] bg-white text-black hover:bg-slate-200 rounded-xl flex items-center justify-center p-0">
               <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Referral Progress</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">2 / 5 referrals</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "40%" }}
                 className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
               />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
