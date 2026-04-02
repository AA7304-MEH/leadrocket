import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatINR, formatUSD, formatCurrency } from '@/lib/currencyUtils';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '@/lib/supabase';
import {
    Sparkles,
    Zap,
    Plus,
    Minus,
    Check,
    Gift,
    TrendingUp,
    Clock,
    Loader2,
    Shield,
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

interface CreditPackage {
    id: string;
    credits: number;
    price: { inr: number; usd: number };
    bonus?: number;
    popular?: boolean;
}

const creditPackages: CreditPackage[] = [
    { id: 'starter', credits: 100, price: { inr: 750, usd: 9 } },
    { id: 'growth', credits: 500, price: { inr: 3200, usd: 39 }, bonus: 50, popular: true },
    { id: 'scale', credits: 1000, price: { inr: 5700, usd: 69 }, bonus: 150 },
    { id: 'enterprise', credits: 5000, price: { inr: 24700, usd: 299 }, bonus: 1000 },
];

const CreditPurchase: React.FC = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [gateway, setGateway] = useState<'razorpay' | 'paypal'>('razorpay');
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [customAmount, setCustomAmount] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    const handlePackageSelect = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setShowCheckout(true);
    };

    const handleRazorpayPayment = async () => {
        if (!selectedPackage || !user) return;
        setIsProcessing(true);

        try {
            // This would normally call an Edge Function to create an order
            // For credits, we'll use a generic credit-purchase edge function (to be implemented)
            // For now, using the subscription logic as a template
            const amount = gateway === 'razorpay' ? selectedPackage.price.inr : selectedPackage.price.usd;
            
            // In a real app, you'd have a separate edge function for one-time payments
            // For this demo, let's assume we use a similar flow
            toast({ title: "Redirecting to Razorpay..." });
            
            // Mocking the Razorpay flow for credits
            setTimeout(() => {
                toast({ title: "Credits Added! ✨", description: `${selectedPackage.credits} credits have been added to your account.` });
                confetti({ particleCount: 100 });
                setShowCheckout(false);
                setIsProcessing(false);
            }, 2000);

        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Gateway Toggle */}
            <div className="flex justify-center gap-4">
                <Button 
                    variant={gateway === 'razorpay' ? 'default' : 'outline'}
                    onClick={() => setGateway('razorpay')}
                    className="gap-2"
                >
                    <span className="text-lg">🇮🇳</span> Razorpay
                </Button>
                <Button 
                    variant={gateway === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setGateway('paypal')}
                    className="gap-2"
                >
                    <span className="text-lg">🌍</span> PayPal
                </Button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {creditPackages.map((pkg) => (
                    <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all hover:scale-[1.02] border-2 ${pkg.popular ? 'border-primary relative shadow-lg' : 'border-border'}`}
                        onClick={() => handlePackageSelect(pkg)}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-primary text-white">Best Value</Badge>
                            </div>
                        )}
                        <CardContent className="pt-8 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-black">{pkg.credits.toLocaleString()}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Credits</p>
                            </div>
                            {pkg.bonus && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none">
                                    +{pkg.bonus} Bonus
                                </Badge>
                            )}
                            <div className="pt-2">
                                <p className="text-xl font-bold">{gateway === 'razorpay' ? formatINR(pkg.price.inr) : formatUSD(pkg.price.usd)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Custom Amount */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Custom Amount
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}>
                            <Minus className="w-4 h-4" />
                        </Button>
                        <Input 
                            type="number" 
                            value={customAmount} 
                            onChange={(e) => setCustomAmount(Math.max(50, parseInt(e.target.value) || 50))}
                            className="w-24 text-center font-bold text-lg"
                        />
                        <Button variant="outline" size="icon" onClick={() => setCustomAmount(customAmount + 50)}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">You will receive approximately</p>
                        <p className="text-2xl font-bold text-primary">{customAmount.toLocaleString()} Credits</p>
                    </div>
                    <Button onClick={() => handlePackageSelect({ id: 'custom', credits: customAmount, price: { inr: customAmount * 7.5, usd: customAmount * 0.1 } })}>
                        Purchase Now
                    </Button>
                </CardContent>
            </Card>

            {/* Checkout Dialog */}
            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Complete Purchase</DialogTitle>
                    </DialogHeader>
                    
                    {selectedPackage && (
                        <div className="space-y-6 pt-4">
                            <div className="bg-muted p-4 rounded-xl border">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">{selectedPackage.credits} Credits</span>
                                    <span className="text-xl font-bold">
                                        {gateway === 'razorpay' ? formatINR(selectedPackage.price.inr) : formatUSD(selectedPackage.price.usd)}
                                    </span>
                                </div>
                                {selectedPackage.bonus && <p className="text-xs text-green-500 font-bold">Includes {selectedPackage.bonus} bonus credits</p>}
                            </div>

                            {gateway === 'razorpay' ? (
                                <Button className="w-full h-12 font-bold" onClick={handleRazorpayPayment} disabled={isProcessing}>
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Pay with Razorpay 🇮🇳"}
                                </Button>
                            ) : (
                                <PayPalButtons 
                                    style={{ layout: "vertical", shape: "rect" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: selectedPackage.price.usd.toString(),
                                                    currency_code: "USD"
                                                }
                                            }]
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        // Handle successful PayPal payment
                                        toast({ title: "Payment Successful! 🌍" });
                                        confetti({ particleCount: 150 });
                                        setShowCheckout(false);
                                    }}
                                />
                            )}

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Shield className="w-3 h-3" />
                                Secure {gateway === 'razorpay' ? 'Razorpay' : 'PayPal'} Checkout
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreditPurchase;
