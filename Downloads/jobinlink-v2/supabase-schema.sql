-- ============================================================
-- SHARED DATABASE SCHEMA
-- One Supabase for: JobinLink + TrustBank + Hashpo + MyBik
-- Polygon (USDC) for all payments — direct to creator wallets
-- ============================================================

-- PLATFORMS ENUM
create type platform_id as enum ('jobinlink','trustbank','hashpo','mybik');

-- ─── USERS ───────────────────────────────────────────────────
create table profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users not null,
  slug            text unique,
  name            text,
  title           text,
  bio             text,
  location        text,
  skills          text[],
  user_type       text default 'seeker',   -- seeker | company
  photo_url       text,
  banner_url      text,
  is_published    boolean default false,
  credits         integer default 0,

  -- Blockchain
  wallet_address  text,                    -- external Polygon wallet
  smart_wallet    text,                    -- platform smart wallet (account abstraction)

  -- Contacts (locked until unlocked)
  contact_email   text,
  contact_phone   text,
  contact_linkedin text,
  contact_instagram text,
  contact_twitter text,
  contact_youtube text,

  -- Paywall
  paywall_enabled        boolean default false,
  paywall_mode           text default 'none',
  paywall_interval       text default 'monthly',
  paywall_price_cents    integer default 0,
  minisite_paid_until    timestamptz,
  minisite_plan          text default 'none',

  -- Mini-site
  site_customization     jsonb default '{}',

  -- Platform origin (which site the user signed up from)
  origin_platform  platform_id default 'jobinlink',

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── SLUGS (shared across all 4 platforms) ───────────────────
create table slugs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  owner_id    uuid references profiles(id),
  status      text default 'active',       -- active | for_sale | auction | expired
  price_usdc  numeric,                     -- fixed price in USDC
  min_bid     numeric,                     -- minimum auction bid
  category    text,                        -- tech | health | media | legal | etc
  active_on   platform_id[],              -- which platforms this slug is active on
  created_at  timestamptz default now()
);

create table slug_auctions (
  id          uuid primary key default gen_random_uuid(),
  slug_id     uuid references slugs(id),
  bidder_id   uuid references profiles(id),
  amount_usdc numeric not null,
  tx_hash     text,
  status      text default 'pending',     -- pending | winning | lost | settled
  created_at  timestamptz default now()
);

-- ─── CONTENT (articles, photos, videos, classifieds) ─────────
create table content_items (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid references profiles(id),
  type         text not null,              -- article | photo | video | classified | cv | nft
  title        text,
  body         text,
  preview      text,
  media_urls   text[],
  price_usdc   numeric,                   -- pay-per-view
  auction_min  numeric,                   -- minimum auction bid (journalism)
  is_free      boolean default false,
  platform     platform_id,
  category     text,
  status       text default 'draft',      -- draft | published | auctioned | sold
  created_at   timestamptz default now()
);

-- ─── UNLOCKS (CV contact, paid content) ─────────────────────
create table unlocks (
  id            uuid primary key default gen_random_uuid(),
  buyer_id      uuid references profiles(id),
  target_id     uuid references profiles(id),   -- CV profile unlocked
  content_id    uuid references content_items(id), -- or content unlocked
  type          text not null,             -- cv_contact | content | paywall
  amount_usdc   numeric,
  platform_fee  numeric,                   -- platform 20% or 50%
  creator_share numeric,                   -- creator 80% or 50%
  tx_hash       text,                      -- Polygon transaction hash
  created_at    timestamptz default now()
);

-- ─── WALLETS & TRANSACTIONS ───────────────────────────────────
create table wallet_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id),
  type          text,                      -- in | out | fee | yield
  amount_usdc   numeric,
  from_address  text,
  to_address    text,
  tx_hash       text unique,
  status        text default 'pending',   -- pending | confirmed | failed
  platform      platform_id,
  description   text,
  created_at    timestamptz default now()
);

-- ─── SUBSCRIPTIONS (paywall, company plans, mini-site) ───────
create table subscriptions (
  id            uuid primary key default gen_random_uuid(),
  subscriber_id uuid references profiles(id),
  target_id     uuid references profiles(id),    -- who they subscribed to
  plan          text,                       -- starter | pro | elite | company
  interval      text default 'monthly',
  price_usdc    numeric,
  active_until  timestamptz,
  tx_hash       text,
  platform      platform_id,
  created_at    timestamptz default now()
);

-- ─── CLASSIFIEDS ──────────────────────────────────────────────
create table classifieds (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid references profiles(id),
  type        text,                        -- real_estate | vehicle | service | product | job
  title       text,
  description text,
  price_usdc  numeric,
  images      text[],
  location    text,
  status      text default 'active',
  platform    platform_id,
  created_at  timestamptz default now()
);

-- ─── PLATFORM SETTINGS ────────────────────────────────────────
create table platform_settings (
  platform    platform_id not null,
  key         text not null,
  value       text,
  primary key (platform, key)
);

-- Insert defaults
insert into platform_settings values
  ('jobinlink', 'cv_unlock_price_cents', '999'),
  ('jobinlink', 'platform_fee_pct', '20'),
  ('jobinlink', 'cv_unlock_creator_pct', '50'),
  ('jobinlink', 'minisite_monthly_cents', '499'),
  ('trustbank', 'platform_fee_pct', '1'),
  ('trustbank', 'yield_apy_pct', '4.5'),
  ('hashpo',    'platform_fee_pct', '15'),
  ('mybik',     'platform_fee_pct', '10');

-- ─── INDEXES ──────────────────────────────────────────────────
create index on profiles(slug);
create index on profiles(user_id);
create index on slugs(owner_id);
create index on slugs(status);
create index on content_items(author_id);
create index on content_items(type);
create index on wallet_transactions(user_id);
create index on wallet_transactions(tx_hash);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
alter table profiles enable row level security;
alter table slugs enable row level security;
alter table unlocks enable row level security;
alter table wallet_transactions enable row level security;

-- Profiles: public read, owner write
create policy "Public profiles" on profiles for select using (is_published = true);
create policy "Own profile" on profiles for all using (auth.uid() = user_id);

-- Wallets: owner only
create policy "Own transactions" on wallet_transactions for all using (
  auth.uid() = (select user_id from profiles where id = user_id)
);
