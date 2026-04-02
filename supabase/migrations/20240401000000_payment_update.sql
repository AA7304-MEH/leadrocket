-- Add payment related columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_gateway TEXT CHECK (payment_gateway IN ('razorpay', 'paypal'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_interval TEXT CHECK (plan_interval IN ('monthly', 'annual'));

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'paypal')),
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL,
    plan TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'refunded')),
    payment_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own invoices
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service role can manage all invoices
CREATE POLICY "Service role can manage all invoices" ON invoices
    FOR ALL USING (auth.role() = 'service_role');
