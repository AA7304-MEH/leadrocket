import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  Check, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  BarChart3,
  Mail,
  Sparkles,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { usePayPal } from '@/hooks/usePayPal';

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    description: "Perfect for testing the waters",
    features: ["1,000 Emails/mo", "Basic AI Scoring", "3 Campaigns", "Standard Support"],
    color: "bg-slate-500"
  },
  {
    id: "pro",
    name: "Pro",
    price: 997,
    description: "Best for scaling founders",
    features: ["10,000 Emails/mo", "Advanced AI Hooks", "Unlimited Campaigns", "Priority Support"],
    color: "bg-blue-600",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 2497,
    description: "Institutional scale outreach",
    features: ["50,000 Emails/mo", "Full Gemini Integration", "Dedicated Account Manager", "Custom Training"],
    color: "bg-indigo-600"
  }
];

const invoices = [
  { id: "INV-001", date: "Oct 12, 2023", amount: "$129.00", status: "Paid" },
  { id: "INV-002", date: "Sep 12, 2023", amount: "$129.00", status: "Paid" },
  { id: "INV-003", date: "Aug 12, 2023", amount: "$49.00", status: "Paid" },
];

export default function Billing() {
  const { profile } = useProfile();
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'card' | 'paypal'>('card');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { initPayPal, isLoading: isPayPalLoading } = usePayPal();

  const handlePlanSelect = async (plan: any) => {
    setSelectedPlan(plan.id);
    if (paymentMode === 'paypal') {
      const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
      await initPayPal(price, 'USD', plan.name);
    } else {
      // Stripe logic would go here
      window.location.href = '/checkout-stripe'; // Placeholder
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter text-white">Billing & Performance</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
              Manage your engine power and subscriptions
            </p>
          </motion.div>
          
          <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
            <button 
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                !isAnnual ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative",
                isAnnual ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full ring-4 ring-[#0A0A0A]">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <UsageCard 
              title="Email Credits" 
              value="8,421" 
              total="10,000" 
              icon={<Mail className="w-4 h-4" />} 
              color="bg-blue-600"
            />
            <UsageCard 
              title="AI Generations" 
              value="412" 
              total="500" 
              icon={<Sparkles className="w-4 h-4" />} 
              color="bg-purple-600"
            />
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Subscription</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">Growth Plan</h3>
                  <p className="text-blue-200 text-sm font-bold mt-2">Next renewal: Nov 12, 2023</p>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl mt-8">
                  Update Plan
                </Button>
             </div>
             {/* Decorative Background Zap */}
             <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "bg-[#111] border rounded-[2.5rem] p-10 flex flex-col transition-all hover:scale-[1.02]",
                plan.popular ? "border-blue-600/50 shadow-2xl shadow-blue-600/5" : "border-white/5"
              )}
            >
              <div className="mb-8">
                <Badge className={cn("mb-4 px-3 py-1 font-black uppercase tracking-widest", plan.color)}>
                  {plan.name}
                </Badge>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${isAnnual ? Math.round(plan.price * 0.8) : plan.price}</span>
                  <span className="text-slate-500 text-xs font-bold font-black uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-slate-500 text-sm font-bold mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-blue-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-300 tracking-tight">{f}</span>
                  </div>
                ))}
              </div>

              {selectedPlan === plan.id && paymentMode === 'paypal' ? (
                <div id="paypal-button-container" className="min-h-[150px] mb-4" />
              ) : (
                <Button 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isPayPalLoading}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg",
                    plan.popular ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20" : "border-white/5 bg-white/2 hover:bg-white/5"
                  )}
                >
                  {profile?.subscriptionPlan === plan.id ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section: Invoices & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Billing History */}
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black tracking-tighter text-white">Billing History</h3>
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Invoice</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Amount</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="p-6">
                          <span className="text-sm font-black text-white">{inv.id}</span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-bold text-slate-400">{inv.date}</span>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-black text-white">{inv.amount}</span>
                        </td>
                        <td className="p-6 text-right">
                          <button className="text-slate-500 hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5 ml-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Payment Method */}
           <div className="space-y-6">
              <h3 className="text-xl font-black tracking-tighter text-white">Payment Method</h3>
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preferred Method</h4>
                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button 
                      onClick={() => setPaymentMode('card')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                        paymentMode === 'card' ? "bg-white/10 text-white" : "text-slate-500"
                      )}
                    >
                      Card
                    </button>
                    <button 
                      onClick={() => setPaymentMode('paypal')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                        paymentMode === 'paypal' ? "bg-blue-600 text-white" : "text-slate-500"
                      )}
                    >
                      PayPal
                    </button>
                  </div>
                </div>

                {paymentMode === 'card' ? (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                         <span className="text-black font-black italic text-xs">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">•••• 4242</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expires 12/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 text-[9px] font-black uppercase p-0 h-auto">
                      Edit
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <div className="w-10 h-10 bg-[#003087] rounded-xl flex items-center justify-center">
                      <span className="text-white font-black italic text-[10px]">PP</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">PayPal Wallet</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Linked to Account</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Auto-renew active</span>
                  </div>
                  <Button className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl">
                    Manage Methods
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-[2rem] p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 balance-flat">
                  Running low? Upgrade early and get a one-time 15% discount on your next month.
                </p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function UsageCard({ title, value, total, icon, color }: { title: string, value: string, total: string, icon: React.ReactNode, color: string }) {
  const percentage = (parseInt(value.replace(',', '')) / parseInt(total.replace(',', ''))) * 100;

  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
          <span className="text-xs font-bold text-slate-500 leading-none">/ {total}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn("h-full rounded-full transition-all duration-1000", color)}
          />
        </div>
      </div>
    </div>
  );
}