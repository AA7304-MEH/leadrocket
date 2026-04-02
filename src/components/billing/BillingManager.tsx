import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import useRazorpay, { formatINR, PLAN_PRICES_INR } from '@/hooks/useRazorpay';
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
    RefreshCw,
    IndianRupee
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Plan {
    id: string;
    name: string;
    priceINR: { monthly: number; yearly: number };
    features: string[];
    limits: {
        emails: number;
        leads: number;
        campaigns: number;
        teamMembers: number;
    };
    popular?: boolean;
    icon: React.ReactNode;
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        priceINR: { monthly: 0, yearly: 0 },
        icon: <Zap className="w-6 h-6 text-gray-500" />,
        features: [
            'Up to 100 emails/month',
            '50 leads storage',
            '1 active campaign',
            'Basic templates',
            'Email support'
        ],
        limits: { emails: 100, leads: 50, campaigns: 1, teamMembers: 1 }
    },
    {
        id: 'pro',
        name: 'Pro',
        priceINR: PLAN_PRICES_INR.pro,
        icon: <Crown className="w-6 h-6 text-amber-500" />,
        popular: true,
        features: [
            'Up to 5,000 emails/month',
            '2,500 leads storage',
            'Unlimited campaigns',
            'AI personalization',
            'A/B testing',
            'Analytics dashboard',
            'Priority support'
        ],
        limits: { emails: 5000, leads: 2500, campaigns: -1, teamMembers: 3 }
    },
    {
        id: 'scale',
        name: 'Scale',
        priceINR: PLAN_PRICES_INR.scale,
        icon: <Building className="w-6 h-6 text-blue-500" />,
        features: [
            'Up to 25,000 emails/month',
            '10,000 leads storage',
            'Unlimited everything',
            'Team collaboration',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantee'
        ],
        limits: { emails: 25000, leads: 10000, campaigns: -1, teamMembers: 10 }
    }
];

interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
}

const mockInvoices: Invoice[] = [
    { id: 'inv_001', date: '2026-02-01', amount: 4000, status: 'paid', description: 'Pro Plan - February 2026' },
    { id: 'inv_002', date: '2026-01-01', amount: 4000, status: 'paid', description: 'Pro Plan - January 2026' },
    { id: 'inv_003', date: '2025-12-01', amount: 4000, status: 'paid', description: 'Pro Plan - December 2025' },
];

const BillingManager: React.FC = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const { initiatePayment } = useRazorpay();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    const currentPlan = plans.find(p => p.id === (user?.plan || 'free')) || plans[0];

    const usage = {
        emails: user?.usage?.leadsThisMonth || 0,
        leads: 245,
        campaigns: 3
    };

    const handleUpgrade = (plan: Plan) => {
        setSelectedPlan(plan);
        setShowCheckout(true);
    };

    const processPayment = async () => {
        if (!selectedPlan) return;

        setIsProcessing(true);

        const amount = selectedPlan.priceINR[billingInterval] * 100; // Convert to paise

        await initiatePayment({
            amount,
            description: `${selectedPlan.name} Plan - ${billingInterval === 'yearly' ? 'Annual' : 'Monthly'}`,
            prefill: {
                name: user?.name || '',
                email: user?.email || '',
            },
            onSuccess: (response) => {
                toast({
                    title: "Upgrade Successful! 🎉",
                    description: `You're now on the ${selectedPlan.name} plan. Payment ID: ${response.razorpay_payment_id}`
                });
                setShowCheckout(false);
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
            }
        });

        setIsProcessing(false);
    };

    return (
        <div className="space-y-8">
            {/* Current Plan Overview */}
            <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                {currentPlan.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold">{currentPlan.name} Plan</h3>
                                    {currentPlan.id !== 'free' && (
                                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                                    )}
                                </div>
                                <p className="text-gray-500">
                                    {currentPlan.priceINR.monthly === 0
                                        ? 'Free forever'
                                        : `${formatINR(currentPlan.priceINR.monthly)}/month • Renews Feb 15, 2026`}
                                </p>
                            </div>
                        </div>
                        {currentPlan.id === 'free' && (
                            <Button onClick={() => handleUpgrade(plans[1])} className="gap-2">
                                <Zap className="w-4 h-4" />
                                Upgrade to Pro
                            </Button>
                        )}
                        {currentPlan.id !== 'free' && (
                            <Button variant="outline" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Manage Subscription
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage This Month</CardTitle>
                    <CardDescription>Your current usage against plan limits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Emails Sent</span>
                                <span className="font-medium">
                                    {usage.emails} / {currentPlan.limits.emails === -1 ? '∞' : currentPlan.limits.emails}
                                </span>
                            </div>
                            <Progress
                                value={currentPlan.limits.emails === -1 ? 0 : (usage.emails / currentPlan.limits.emails) * 100}
                                className="h-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Leads Stored</span>
                                <span className="font-medium">
                                    {usage.leads} / {currentPlan.limits.leads === -1 ? '∞' : currentPlan.limits.leads}
                                </span>
                            </div>
                            <Progress
                                value={currentPlan.limits.leads === -1 ? 0 : (usage.leads / currentPlan.limits.leads) * 100}
                                className="h-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Active Campaigns</span>
                                <span className="font-medium">
                                    {usage.campaigns} / {currentPlan.limits.campaigns === -1 ? '∞' : currentPlan.limits.campaigns}
                                </span>
                            </div>
                            <Progress
                                value={currentPlan.limits.campaigns === -1 ? 0 : (usage.campaigns / currentPlan.limits.campaigns) * 100}
                                className="h-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Plans Comparison */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Available Plans</h2>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${billingInterval === 'monthly' ? 'bg-white shadow' : 'text-gray-600'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('yearly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${billingInterval === 'yearly' ? 'bg-white shadow' : 'text-gray-600'
                                }`}
                        >
                            Yearly
                            <Badge className="ml-2 bg-green-100 text-green-700">Save 20%</Badge>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-white">Most Popular</Badge>
                                </div>
                            )}
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {plan.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <div className="mt-2 flex items-center justify-center gap-1">
                                        <IndianRupee className="w-5 h-5" />
                                        <span className="text-3xl font-bold">
                                            {billingInterval === 'yearly' && plan.priceINR.monthly > 0
                                                ? Math.round(plan.priceINR.yearly / 12).toLocaleString('en-IN')
                                                : plan.priceINR.monthly.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    {billingInterval === 'yearly' && plan.priceINR.monthly > 0 && (
                                        <p className="text-sm text-green-600 mt-1">
                                            {formatINR(plan.priceINR.yearly)}/year
                                            (Save {formatINR(plan.priceINR.monthly * 12 - plan.priceINR.yearly)})
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={plan.id === currentPlan.id ? 'outline' : plan.popular ? 'default' : 'outline'}
                                    disabled={plan.id === currentPlan.id || (currentPlan.id !== 'free' && plan.id === 'free')}
                                    onClick={() => handleUpgrade(plan)}
                                >
                                    {plan.id === currentPlan.id
                                        ? 'Current Plan'
                                        : plan.priceINR.monthly > currentPlan.priceINR.monthly
                                            ? 'Upgrade'
                                            : 'Downgrade'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockInvoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{invoice.description}</p>
                                        <p className="text-sm text-gray-500">{invoice.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={
                                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                    }>
                                        {invoice.status}
                                    </Badge>
                                    <span className="font-semibold">{formatINR(invoice.amount)}</span>
                                    <Button variant="ghost" size="sm">Download</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-gray-500">Expires 12/2027</p>
                            </div>
                        </div>
                        <Button variant="outline">Update</Button>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>Payments are securely processed by Razorpay</span>
                    </div>
                </CardContent>
            </Card>

            {/* Checkout Dialog */}
            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedPlan && (
                        <div className="space-y-6 pt-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium">{selectedPlan.name} Plan</span>
                                    <span className="font-bold">
                                        {formatINR(selectedPlan.priceINR[billingInterval])}/{billingInterval === 'yearly' ? 'year' : 'month'}
                                    </span>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {selectedPlan.limits.emails.toLocaleString()} emails/month
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {selectedPlan.limits.leads.toLocaleString()} leads storage
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        All premium features
                                    </li>
                                </ul>
                            </div>

                            <div className="p-4 border rounded-lg bg-blue-50">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">Secure payment via Razorpay</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-1">
                                    UPI, Cards, Net Banking, Wallets accepted
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Cancel anytime, no questions asked</span>
                            </div>

                            <Button
                                className="w-full gap-2"
                                onClick={processPayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay {formatINR(selectedPlan.priceINR[billingInterval])}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BillingManager;
