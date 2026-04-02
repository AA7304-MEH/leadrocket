import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatCurrency, formatINR, formatUSD, PLAN_PRICES } from '@/lib/currencyUtils';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '@/lib/supabase';
import {
    CreditCard,
    Check,
    Zap,
    Crown,
    Building,
    ArrowRight,
    Loader2,
    Shield,
    Clock,
    Globe,
    CheckCircle2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

interface Plan {
    id: string;
    name: string;
    price: { inr: number; usd: number };
    features: string[];
    limits: {
        emails: number;
        leads: number;
        campaigns: number;
        teamMembers: number;
    };
    paypalPlanId: { monthly: string; annual: string };
    popular?: boolean;
    icon: React.ReactNode;
}

const plans: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: { inr: 8299, usd: 99 },
        icon: <Zap className="w-6 h-6 text-primary" />,
        features: ['10k emails', '5k leads', '3 campaigns', 'Basic AI'],
        limits: { emails: 10000, leads: 5000, campaigns: 3, teamMembers: 1 },
        paypalPlanId: { 
            monthly: import.meta.env.VITE_PAYPAL_PLAN_STARTER_MONTHLY, 
            annual: import.meta.env.VITE_PAYPAL_PLAN_STARTER_ANNUAL 
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        price: { inr: 16599, usd: 199 },
        icon: <Crown className="w-6 h-6 text-amber-500" />,
        popular: true,
        features: ['50k emails', '25k leads', 'Unlimited campaigns', 'Advanced AI'],
        limits: { emails: 50000, leads: 25000, campaigns: -1, teamMembers: 5 },
        paypalPlanId: { 
            monthly: import.meta.env.VITE_PAYPAL_PLAN_PRO_MONTHLY, 
            annual: import.meta.env.VITE_PAYPAL_PLAN_PRO_ANNUAL 
        }
    },
    {
        id: 'agency',
        name: 'Agency',
        price: { inr: 41499, usd: 499 },
        icon: <Building className="w-6 h-6 text-blue-500" />,
        features: ['Unlimited everything', 'Team collab', 'Custom API', 'SLA Support'],
        limits: { emails: -1, leads: -1, campaigns: -1, teamMembers: 20 },
        paypalPlanId: { 
            monthly: import.meta.env.VITE_PAYPAL_PLAN_AGENCY_MONTHLY, 
            annual: import.meta.env.VITE_PAYPAL_PLAN_AGENCY_ANNUAL 
        }
    }
];

const BillingManager: React.FC = () => {
    const { user, profile } = useAuth();
    const [gateway, setGateway] = useState<'razorpay' | 'paypal'>('razorpay');
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [invoices, setInvoices] = useState<any[]>([]);

    const [usage, setUsage] = useState({
        leads: 0,
        campaigns: 0,
        credits: 0
    });
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchUsage();
    }, [user?.id]);

    const fetchInvoices = async () => {
        if (!user?.id) return;
        const { data } = await supabase
            .from('invoices')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setInvoices(data);
    };

    const fetchUsage = async () => {
        if (!user?.id) return;

        // Fetch leads count
        const { count: leadsCount } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Fetch campaigns count
        const { count: campaignsCount } = await supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        setUsage({
            leads: leadsCount || 0,
            campaigns: campaignsCount || 0,
            credits: user.ai_credits || 0
        });
    };

    const handleCancelSubscription = async () => {
        toast.info("Processing cancellation...");
        const { error } = await supabase.from('profiles').update({
            plan: 'starter',
            status: 'cancelled'
        }).eq('id', user?.id);

        if (!error) {
            toast.success("Subscription cancelled. You will remain on your current plan until the end of the period.");
            setShowCancelModal(false);
        }
    };

    const handleRazorpayPayment = async () => {
        if (!selectedPlan || !user) return;
        setIsProcessing(true);

        try {
            // 1. Create order via Edge Function
            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: { planName: selectedPlan.name, billingInterval, userId: user.id }
            });

            if (orderError) throw orderError;

            // 2. Open Razorpay Script
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: "INR",
                name: "LeadRockets",
                description: `${selectedPlan.name} Plan - ${billingInterval}`,
                order_id: orderData.orderId,
                prefill: {
                    name: user.full_name || '',
                    email: user.email || '',
                },
                theme: { color: "#3B82F6" },
                handler: async (response: any) => {
                    const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                        body: {
                            ...response,
                            userId: user.id,
                            planName: selectedPlan.name,
                            billingInterval,
                            amount: orderData.amount
                        }
                    });

                    if (verifyError) {
                        toast.error("Verification Failed", { description: verifyError.message });
                    } else {
                        toast.success("Upgrade Successful! 🎉", { description: `You're now on the ${selectedPlan.name} plan.` });
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                        setShowCheckout(false);
                        fetchInvoices();
                    }
                    setIsProcessing(false);
                },
                modal: { ondismiss: () => setIsProcessing(false) }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast.error("Payment Error", { description: err.message });
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Current Plan Card */}
            <Card className="overflow-hidden border-none bg-gradient-to-r from-[#0D0D0D] to-[#141414] shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary hover:bg-primary px-3 py-1 text-xs font-black uppercase tracking-widest">
                                {profile?.plan || 'Starter'} Plan
                            </Badge>
                            <span className="text-sm font-medium text-slate-500">
                                Renews on {new Date(profile?.subscription?.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter pt-2">
                            {profile?.plan === 'agency' ? formatINR(41499) : profile?.plan === 'pro' ? formatINR(16599) : formatINR(8299)}
                            <span className="text-sm font-normal text-slate-500 ml-1">/mo</span>
                        </CardTitle>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold" onClick={() => setShowCancelModal(true)}>
                            Modify Subscription
                        </Button>
                        {profile?.plan !== 'agency' && (
                            <Button className="bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                                Upgrade Plan
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-500">
                                <span>Leads Used</span>
                                <span className="text-white">{usage.leads} / {profile?.plan === 'agency' ? '50,000' : profile?.plan === 'pro' ? '5,000' : '500'}</span>
                            </div>
                            <Progress value={(usage.leads / (profile?.plan === 'agency' ? 50000 : profile?.plan === 'pro' ? 5000 : 500)) * 100} className="h-2 bg-white/5" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-500">
                                <span>Campaigns Sent</span>
                                <span className="text-white">{usage.campaigns} / {profile?.plan === 'agency' ? '∞' : profile?.plan === 'pro' ? '∞' : '5'}</span>
                            </div>
                            <Progress value={profile?.plan === 'starter' ? (usage.campaigns / 5) * 100 : 0} className="h-2 bg-white/5" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-slate-500">
                                <span>AI Credits</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white">{usage.credits.toLocaleString()}</span>
                                    <a href="#" className="text-[10px] text-primary hover:underline">Buy More</a>
                                </div>
                            </div>
                            <Progress value={(usage.credits / 10000) * 100} className="h-2 bg-blue-500/20" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
                <Card 
                    className={`cursor-pointer transition-all border-2 ${gateway === 'razorpay' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setGateway('razorpay')}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${gateway === 'razorpay' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            <IndianRupeeIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">Pay with Razorpay 🇮🇳</h3>
                                {gateway === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking — India</p>
                        </div>
                    </CardContent>
                </Card>

                <Card 
                    className={`cursor-pointer transition-all border-2 ${gateway === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setGateway('paypal')}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${gateway === 'paypal' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            <Globe className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">Pay with PayPal 🌍</h3>
                                {gateway === 'paypal' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground">International Cards & PayPal Balance</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interval Toggle */}
            <div className="flex justify-center">
                <div className="inline-flex p-1 bg-muted rounded-xl">
                    <button 
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition ${billingInterval === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                        onClick={() => setBillingInterval('monthly')}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${billingInterval === 'annual' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                        onClick={() => setBillingInterval('annual')}
                    >
                        Annual
                        <Badge className="bg-green-500/10 text-green-500 border-none">Save 17%</Badge>
                    </button>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`relative flex flex-col border-2 ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'}`}>
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Badge className="bg-primary hover:bg-primary px-4 py-1">MOST POPULAR</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                {plan.icon}
                                <CardTitle>{plan.name}</CardTitle>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold">
                                    {billingInterval === 'monthly' ? formatINR(plan.price.inr) : formatINR(Math.round(plan.price.inr * 12 * 0.83) / 12)}
                                    <span className="text-lg font-normal text-muted-foreground">/mo</span>
                                </div>
                                <div className="text-lg text-muted-foreground">
                                    {billingInterval === 'monthly' ? formatUSD(plan.price.usd) : formatUSD(Math.round(plan.price.usd * 12 * 0.83) / 12)}
                                    <span className="text-sm">/mo</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            <ul className="space-y-3">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-primary" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg font-bold">🇮🇳 Razorpay · 🌍 PayPal</span>
                                </div>
                                <Button 
                                    className="w-full h-12 text-lg font-bold" 
                                    variant={plan.popular ? 'default' : 'outline'}
                                    onClick={() => {
                                        setSelectedPlan(plan);
                                        setShowCheckout(true);
                                    }}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>View and track all your past payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">Plan</th>
                                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                                    <th className="px-4 py-3 text-left font-medium">Gateway</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {invoices.length > 0 ? invoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td className="px-4 py-3 font-medium">{new Date(inv.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{inv.plan}</td>
                                        <td className="px-4 py-3 font-bold">{inv.currency === 'INR' ? formatINR(inv.amount) : formatUSD(inv.amount)}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="gap-1">
                                                {inv.gateway === 'razorpay' ? '🇮🇳 Razorpay' : '🌍 PayPal'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="bg-green-500/10 text-green-500 border-none">Paid</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <a href="#" className="text-primary hover:underline font-medium">View Receipt</a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No invoices found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Checkout Dialog */}
            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogContent className="max-w-md bg-card border-border sm:rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Complete Subscription</DialogTitle>
                        <CardDescription>Securely upgrade to {selectedPlan?.name} {billingInterval}</CardDescription>
                    </DialogHeader>
                    
                    {selectedPlan && (
                        <div className="space-y-6 pt-4">
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">{selectedPlan.name} Plan ({billingInterval})</span>
                                    <span className="text-xl font-bold">
                                        {gateway === 'razorpay' 
                                            ? formatINR(billingInterval === 'monthly' ? selectedPlan.price.inr : selectedPlan.price.inr * 12 * 0.83)
                                            : formatUSD(billingInterval === 'monthly' ? selectedPlan.price.usd : selectedPlan.price.usd * 12 * 0.83)
                                        }
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">Automatic renewal every {billingInterval === 'monthly' ? 'month' : 'year'}</p>
                            </div>

                            <div className="space-y-4">
                                {gateway === 'razorpay' ? (
                                    <Button 
                                        className="w-full h-14 text-lg font-bold shadow-lg" 
                                        onClick={handleRazorpayPayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay via Razorpay 🇮🇳"}
                                    </Button>
                                ) : (
                                    <div className="min-h-[150px]">
                                        <PayPalButtons 
                                            style={{ layout: "vertical", shape: "rect" }}
                                            createSubscription={(data, actions) => {
                                                const planId = billingInterval === 'monthly' 
                                                    ? selectedPlan.paypalPlanId.monthly 
                                                    : selectedPlan.paypalPlanId.annual;
                                                return actions.subscription.create({ plan_id: planId });
                                            }}
                                            onApprove={async (data) => {
                                                const { error } = await supabase.from('profiles').update({
                                                    plan: selectedPlan.name,
                                                    payment_gateway: 'paypal',
                                                    paypal_subscription_id: data.subscriptionID,
                                                    subscription_start: new Date().toISOString()
                                                }).eq('id', user?.id);

                                                if (!error) {
                                                    await supabase.from('invoices').insert({
                                                        user_id: user?.id,
                                                        gateway: 'paypal',
                                                        amount: billingInterval === 'monthly' ? selectedPlan.price.usd : selectedPlan.price.usd * 12 * 0.83,
                                                        currency: 'USD',
                                                        plan: selectedPlan.name,
                                                        status: 'paid',
                                                        payment_id: data.subscriptionID
                                                    });
                                                    toast({ title: "PayPal Upgrade Successful! 🚀" });
                                                    confetti({ particleCount: 100, spread: 50 });
                                                    setShowCheckout(false);
                                                    fetchInvoices();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Shield className="w-3 h-3" />
                                Securely processed by {gateway === 'razorpay' ? 'Razorpay' : 'PayPal'}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* Cancel Subscription Dialog */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="max-w-md bg-[#0D0D0D] border-white/5 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Modify Subscription</DialogTitle>
                        <CardDescription className="text-slate-500">We're sorry to see you go. Would you like to pause your subscription instead?</CardDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-8">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <h4 className="font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Pause Subscription
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Keep your leads and templates saved. Resume anytime. You won't be charged during the pause.
                            </p>
                            <Button className="w-full mt-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 font-bold">
                                Pause for 1 Month
                            </Button>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-600 mb-4 text-center">
                                Cancelling will downgrade your account to the Free tier at the end of your billing cycle.
                            </p>
                            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 font-bold" onClick={handleCancelSubscription}>
                                Confirm Cancellation
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Custom Icon Components
function IndianRupeeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 3h12" />
            <path d="M6 8h12" />
            <path d="m6 13 8.5 8" />
            <path d="M6 13h3" />
            <path d="M9 13c6.667 0 6.667-10 0-10" />
        </svg>
    )
}

export default BillingManager;
