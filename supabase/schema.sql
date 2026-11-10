-- Free-tier shape for a later Supabase project. The site runs on this machine without it.

create table if not exists profiles (
  id uuid primary key,
  name text not null,
  rank text default 'Member',
  inner boolean default false
);

create table if not exists tuffies (
  id uuid primary key,
  profile_id uuid references profiles(id),
  stage text not null,
  genes jsonb,
  stats jsonb,
  level int default 0
);

create table if not exists wall_posts (
  id uuid primary key,
  author_id uuid references profiles(id),
  body text not null,
  target text not null,
  created_at timestamptz default now()
);

create table if not exists inbox (
  id uuid primary key,
  profile_id uuid references profiles(id),
  title text not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists wishlists (
  profile_id uuid references profiles(id),
  game_id text not null,
  primary key (profile_id, game_id)
);

alter table profiles enable row level security;
alter table tuffies enable row level security;
alter table wall_posts enable row level security;
alter table inbox enable row level security;
alter table wishlists enable row level security;
