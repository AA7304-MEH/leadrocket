import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planName, billingInterval, amount } = await req.json()

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // Use Web Crypto API via Deno's global crypto for HMAC Verification
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keySecret);
    const bodyData = encoder.encode(body);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid signature');
    }

    // Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Update Profile
    const subscriptionStart = new Date();
    const nextBillingDate = new Date();
    if (billingInterval === 'annual') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        plan: planName,
        payment_gateway: 'razorpay',
        razorpay_payment_id: razorpay_payment_id,
        plan_interval: billingInterval,
        subscription_start: subscriptionStart.toISOString(),
        next_billing_date: nextBillingDate.toISOString()
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // Record Invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        gateway: 'razorpay',
        amount: amount / 100, // back to INR
        currency: 'INR',
        plan: planName,
        status: 'paid',
        payment_id: razorpay_payment_id
      })

    if (invoiceError) throw invoiceError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
