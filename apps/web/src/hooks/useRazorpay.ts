import React, { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    amount: number; // in paise (INR cents)
    currency?: string;
    name?: string;
    description?: string;
    orderId?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    onSuccess?: (response: RazorpayResponse) => void;
    onError?: (error: any) => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
}

// Razorpay Key - Replace with your actual key
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx';

export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const useRazorpay = () => {
    const { toast } = useToast();

    const initiatePayment = useCallback(async (options: RazorpayOptions) => {
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            toast({
                title: 'Payment Error',
                description: 'Unable to load payment gateway. Please try again.',
                variant: 'destructive'
            });
            return;
        }

        const razorpayOptions = {
            key: RAZORPAY_KEY_ID,
            amount: options.amount,
            currency: options.currency || 'INR',
            name: options.name || 'LeadRockets',
            description: options.description || 'Subscription Payment',
            order_id: options.orderId,
            prefill: {
                name: options.prefill?.name || '',
                email: options.prefill?.email || '',
                contact: options.prefill?.contact || '',
            },
            theme: {
                color: options.theme?.color || '#6366f1', // Primary color
            },
            handler: function (response: RazorpayResponse) {
                options.onSuccess?.(response);
            },
            modal: {
                ondismiss: function () {
                    toast({ title: 'Payment Cancelled', description: 'You can try again anytime' });
                }
            }
        };

        const razorpay = new window.Razorpay(razorpayOptions);

        razorpay.on('payment.failed', function (response: any) {
            options.onError?.(response.error);
            toast({
                title: 'Payment Failed',
                description: response.error.description || 'Please try again',
                variant: 'destructive'
            });
        });

        razorpay.open();
    }, [toast]);

    return { initiatePayment };
};

// Price conversion utilities
export const convertToINR = (usdPrice: number): number => {
    // Approximate USD to INR conversion (you can use real-time rates)
    const exchangeRate = 83;
    return Math.round(usdPrice * exchangeRate);
};

export const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Plan pricing in INR
export const PLAN_PRICES_INR = {
    free: 0,
    pro: {
        monthly: 4000, // ₹4,000/month
        yearly: 38400, // ₹38,400/year (20% discount)
    },
    scale: {
        monthly: 12000, // ₹12,000/month
        yearly: 115200, // ₹115,200/year (20% discount)
    }
};

// Credit package pricing in INR
export const CREDIT_PACKAGES_INR = [
    { id: 'starter', credits: 100, price: 750 },
    { id: 'growth', credits: 500, price: 3200, bonus: 50 },
    { id: 'scale', credits: 1000, price: 5700, bonus: 150 },
    { id: 'enterprise', credits: 5000, price: 24700, bonus: 1000 },
];

export default useRazorpay;
