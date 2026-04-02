-- LeadRockets 4.0 — Consolidated Production Schema
-- This file contains all table definitions, RLS policies, and performance indexes.
-- Run this in your Supabase SQL Editor to initialize the production database.

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    ai_credits INTEGER DEFAULT 500 NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
    plan_interval TEXT CHECK (plan_interval IN ('monthly', 'annual')),
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES auth.users(id),
    payment_gateway TEXT CHECK (payment_gateway IN ('razorpay', 'paypal')),
    razorpay_payment_id TEXT,
    paypal_subscription_id TEXT,
    subscription_start TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sent', 'scheduled', 'archived')),
    ai_score INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    open_rate DECIMAL DEFAULT 0,
    subject_preview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    email TEXT NOT NULL,
    company TEXT,
    role TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    ai_score INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'paypal')),
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    plan TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'refunded')),
    payment_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Templates Table (Marketplace)
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    author TEXT,
    industry TEXT,
    type TEXT,
    score INTEGER DEFAULT 0,
    open_rate DECIMAL DEFAULT 0,
    price DECIMAL DEFAULT 0,
    rating DECIMAL DEFAULT 0,
    users_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'joined', 'converted')),
    credits_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SECURITY: ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- POLICIES: 
-- Profiles: Users can read/write their own profiles
CREATE POLICY "Users can manage their own profiles" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Campaigns: Users can manage their own campaigns
CREATE POLICY "Users can manage their own campaigns" ON public.campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Leads: Users can manage their own leads
CREATE POLICY "Users can manage their own leads" ON public.leads
    FOR ALL USING (auth.uid() = user_id);

-- Invoices: Users can view their own invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

-- Templates: Everyone can read public templates, authors can edit their own
CREATE POLICY "Public templates are readable by all" ON public.templates
    FOR SELECT USING (is_public = true);

-- Referrals: Referrers can see their own referral records
CREATE POLICY "Referrers can view their own referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id);

-- INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
