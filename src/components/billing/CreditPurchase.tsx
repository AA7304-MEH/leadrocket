import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useRazorpay, { formatINR, CREDIT_PACKAGES_INR } from '@/hooks/useRazorpay';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sparkles,
    Zap,
    Plus,
    Minus,
    CreditCard,
    Check,
    Gift,
    TrendingUp,
    Clock,
    Loader2,
    IndianRupee,
    Shield
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CreditPackage {
    id: string;
    credits: number;
    price: number;
    bonus?: number;
    popular?: boolean;
}

const creditPackages: CreditPackage[] = [
    { id: 'starter', credits: 100, price: 750 },
    { id: 'growth', credits: 500, price: 3200, bonus: 50, popular: true },
    { id: 'scale', credits: 1000, price: 5700, bonus: 150 },
    { id: 'enterprise', credits: 5000, price: 24700, bonus: 1000 },
];

interface CreditPurchaseProps {
    currentCredits?: number;
    onPurchase?: (credits: number) => void;
}

const CreditPurchase: React.FC<CreditPurchaseProps> = ({
    currentCredits = 150,
    onPurchase
}) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const { initiatePayment } = useRazorpay();
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [customAmount, setCustomAmount] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const recentTransactions = [
        { date: '2 hours ago', amount: -25, description: 'AI Personalization - 25 leads' },
        { date: 'Yesterday', amount: 500, description: 'Purchased Growth Package' },
        { date: '3 days ago', amount: -100, description: 'AI Personalization - 100 leads' },
        { date: '1 week ago', amount: 50, description: 'Welcome Bonus' },
    ];

    const handlePackageSelect = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setShowCheckout(true);
    };

    const handleCustomPurchase = () => {
        if (customAmount < 50) {
            toast({ title: 'Minimum 50 credits', description: 'Please enter at least 50 credits' });
            return;
        }
        setSelectedPackage({
            id: 'custom',
            credits: customAmount,
            price: Math.round(customAmount * 7.5) // ₹7.5 per credit
        });
        setShowCheckout(true);
    };

    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === 'LAUNCH20') {
            setDiscount(20);
            toast({ title: 'Promo Applied! 🎉', description: '20% discount activated' });
        } else if (promoCode.toUpperCase() === 'FIRST10') {
            setDiscount(10);
            toast({ title: 'Promo Applied!', description: '10% discount activated' });
        } else {
            toast({ title: 'Invalid Code', description: 'This promo code is not valid' });
        }
    };

    const getDiscountedPrice = (price: number) => {
        return Math.round((price * (100 - discount)) / 100);
    };

    const processPayment = async () => {
        if (!selectedPackage) return;

        setIsProcessing(true);

        const finalPrice = getDiscountedPrice(selectedPackage.price);

        await initiatePayment({
            amount: finalPrice * 100, // Convert to paise
            description: `${selectedPackage.credits} AI Credits`,
            prefill: {
                name: user?.name || '',
                email: user?.email || '',
            },
            onSuccess: (response) => {
                const totalCredits = selectedPackage.credits + (selectedPackage.bonus || 0);
                toast({
                    title: `${totalCredits} Credits Added! ✨`,
                    description: `Payment ID: ${response.razorpay_payment_id}`
                });
                onPurchase?.(totalCredits);
                setShowCheckout(false);
                setDiscount(0);
                setPromoCode('');
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
            }
        });

        setIsProcessing(false);
    };

    return (
        <div className="space-y-6">
            {/* Current Balance */}
            <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-primary/10">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">AI Credits Balance</p>
                                <p className="text-4xl font-bold">{currentCredits}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Estimated Remaining</p>
                            <p className="text-lg font-semibold text-gray-700">
                                ~{Math.floor(currentCredits / 5)} bulk personalizations
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Packages */}
            <div>
                <h2 className="text-xl font-bold mb-4">Buy Credits</h2>
                <div className="grid grid-cols-4 gap-4">
                    {creditPackages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${pkg.popular ? 'border-2 border-primary relative' : ''
                                }`}
                            onClick={() => handlePackageSelect(pkg)}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-white">Best Value</Badge>
                                </div>
                            )}
                            <CardContent className="pt-6 text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-2xl font-bold">{pkg.credits.toLocaleString('en-IN')}</p>
                                <p className="text-sm text-gray-500 mb-2">credits</p>
                                {pkg.bonus && (
                                    <Badge className="bg-green-100 text-green-700 mb-3">
                                        <Gift className="w-3 h-3 mr-1" />
                                        +{pkg.bonus} bonus
                                    </Badge>
                                )}
                                <p className="text-xl font-bold text-primary">{formatINR(pkg.price)}</p>
                                <p className="text-xs text-gray-400">
                                    {formatINR(Math.round(pkg.price / (pkg.credits + (pkg.bonus || 0))))}/credit
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Custom Amount */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Custom Amount</CardTitle>
                    <CardDescription>Buy exactly what you need (min. 50 credits)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(Math.max(50, parseInt(e.target.value) || 50))}
                                className="w-24 text-center"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCustomAmount(customAmount + 50)}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 text-gray-500">
                            = <span className="font-semibold text-gray-900">{formatINR(customAmount * 7.5)}</span>
                            <span className="text-sm ml-1">(₹7.5/credit)</span>
                        </div>
                        <Button onClick={handleCustomPurchase}>Buy Credits</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Credit Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentTransactions.map((tx, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        {tx.amount > 0 ? (
                                            <Plus className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Sparkles className="w-4 h-4 text-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.description}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {tx.date}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
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
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">
                                        {selectedPackage.credits.toLocaleString('en-IN')} Credits
                                    </span>
                                    <span className={discount > 0 ? 'line-through text-gray-400' : 'font-bold'}>
                                        {formatINR(selectedPackage.price)}
                                    </span>
                                </div>
                                {selectedPackage.bonus && (
                                    <div className="flex items-center justify-between text-sm text-green-600 mb-2">
                                        <span>Bonus Credits</span>
                                        <span>+{selectedPackage.bonus}</span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-primary">
                                        <span>Discount ({discount}%)</span>
                                        <span className="font-bold">{formatINR(getDiscountedPrice(selectedPackage.price))}</span>
                                    </div>
                                )}
                            </div>

                            {/* Promo Code */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <Button variant="outline" onClick={applyPromoCode}>
                                    Apply
                                </Button>
                            </div>

                            {/* Payment Info */}
                            <div className="p-4 border rounded-lg bg-blue-50">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">Secure payment via Razorpay</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-1">
                                    UPI, Cards, Net Banking, Wallets accepted
                                </p>
                            </div>

                            <div className="p-3 bg-green-50 rounded-lg flex items-start gap-2 text-sm text-green-700">
                                <Check className="w-4 h-4 mt-0.5" />
                                <span>
                                    Total: <strong>{(selectedPackage.credits + (selectedPackage.bonus || 0)).toLocaleString('en-IN')}</strong> credits
                                    for <strong>{formatINR(getDiscountedPrice(selectedPackage.price))}</strong>
                                </span>
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
                                        <IndianRupee className="w-4 h-4" />
                                        Pay {formatINR(getDiscountedPrice(selectedPackage.price))}
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

export default CreditPurchase;
