-- Profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text, company_name text, plan text default 'starter',
  ai_credits int default 100, referral_code text unique,
  referred_by uuid, onboarding_completed boolean default false,
  payment_gateway text, paypal_subscription_id text,
  razorpay_payment_id text, plan_interval text default 'monthly',
  avatar_url text, created_at timestamptz default now()
);

-- Campaigns
create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text not null, subject_line text, body text,
  status text default 'draft', ai_score int,
  predicted_open_rate float, send_time timestamptz,
  sent_count int default 0, open_count int default 0,
  click_count int default 0, created_at timestamptz default now()
);

-- Leads
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text, email text, company text, role text,
  status text default 'active', ai_score int,
  source text default 'manual', tags text[],
  last_contacted timestamptz, created_at timestamptz default now()
);

-- Lead Lists
create table if not exists lead_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text, description text,
  lead_count int default 0, created_at timestamptz default now()
);

-- Templates
create table if not exists templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text, description text, body text,
  industry text, campaign_type text, price float default 0,
  avg_open_rate float, use_count int default 0,
  rating float default 0, is_published boolean default false,
  created_at timestamptz default now()
);

-- Referrals
create table if not exists referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references profiles(id) on delete cascade,
  referred_email text, status text default 'pending',
  credits_awarded int default 0, created_at timestamptz default now()
);

-- Invoices
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  gateway text, amount float, currency text, plan text,
  status text default 'paid', payment_id text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table leads enable row level security;
alter table lead_lists enable row level security;
alter table templates enable row level security;
alter table referrals enable row level security;
alter table invoices enable row level security;

-- RLS Policies (users see only their own data)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their profile') THEN
        create policy "Users own their profile" on profiles for all using (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their campaigns') THEN
        create policy "Users own their campaigns" on campaigns for all using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their leads') THEN
        create policy "Users own their leads" on leads for all using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their lead_lists') THEN
        create policy "Users own their lead_lists" on lead_lists for all using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their templates') THEN
        create policy "Users own their templates" on templates for all using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their referrals') THEN
        create policy "Users own their referrals" on referrals for all using (auth.uid() = referrer_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own their invoices') THEN
        create policy "Users own their invoices" on invoices for all using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Published templates visible to all') THEN
        create policy "Published templates visible to all" on templates for select using (is_published = true);
    END IF;
END
$$;
