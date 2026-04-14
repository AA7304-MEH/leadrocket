import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionApi } from '@/lib/api';

declare global {
  interface Window {
    paypal: any;
  }
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export const usePayPal = () => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayPalScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.paypal) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initPayPal = useCallback(async (amount: number, currency: string, planName: string) => {
    setIsLoading(true);
    setError(null);
    
    const isLoaded = await loadPayPalScript();
    
    if (!isLoaded) {
      setError('Failed to load PayPal SDK');
      setIsLoading(false);
      return;
    }

    if (!window.paypal) {
        setIsLoading(false);
        return;
    }

    // Clear previous buttons if any
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: `LeadRockets ${planName} Plan`,
            amount: {
              currency_code: currency,
              value: amount.toString()
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        setIsLoading(true);
        try {
          // data.orderID contains the order ID
          // Call backend to capture
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/paypal/capture`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ orderID: data.orderID, plan: planName.toLowerCase() })
          });

          const result = await response.json();

          if (result.success) {
            toast({
              title: "Payment Successful! 🎉",
              description: `You are now on the ${planName} plan.`,
            });
            await refreshProfile();
          } else {
            throw new Error(result.message || 'Payment capture failed');
          }
        } catch (err: any) {
          toast({
            title: "Payment Error",
            description: err.message,
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal Error:', err);
        setError(err.message);
        toast({
          title: "PayPal Error",
          description: "An error occurred with the PayPal checkout.",
          variant: "destructive"
        });
      }
    }).render('#paypal-button-container');

    setIsLoading(false);
  }, [loadPayPalScript, toast, refreshProfile]);

  return { initPayPal, isLoading, error };
};
