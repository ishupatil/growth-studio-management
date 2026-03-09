create extension if not exists "uuid-ossp";

create table if not exists influencer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  followers integer not null,
  avg_likes integer not null,
  avg_comments integer not null,
  posting_frequency integer not null,
  content_type text not null,
  brand_tone text not null,
  goal text not null,
  target_followers integer not null,
  created_at timestamptz default now()
);

create table if not exists weekly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  profile_id uuid references influencer_profiles(id) on delete set null,
  instagram_username text not null,
  audit_report text not null,
  growth_strategy text not null,
  content_calendar text not null,
  captions_hashtags text not null,
  extra_tips text,
  created_at timestamptz default now()
);

alter table influencer_profiles enable row level security;
alter table weekly_plans enable row level security;

create policy "users_own_profiles" on influencer_profiles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_own_plans" on weekly_plans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
