import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from 'https://esm.sh/razorpay@2.9.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planName, billingInterval, userId } = await req.json()

    const razorpay = new Razorpay({
      key_id: Deno.env.get('VITE_RAZORPAY_KEY_ID') || '',
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || '',
    });

    // Prices in INR
    const BASE_PRICES: Record<string, number> = {
      'Starter': 8299,
      'Pro': 16599,
      'Agency': 41499,
    };

    let amount = BASE_PRICES[planName] || 0;
    if (billingInterval === 'annual') {
      amount = Math.round(amount * 12 * 0.83); // 17% discount
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: { user_id: userId, plan: planName, interval: billingInterval }
    });

    return new Response(
      JSON.stringify({ 
        orderId: order.id, 
        amount: order.amount, 
        currency: order.currency,
        keyId: Deno.env.get('VITE_RAZORPAY_KEY_ID')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
