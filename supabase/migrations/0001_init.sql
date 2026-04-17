-- Love Empire · initial schema
-- Apply via: supabase db push (or paste into SQL editor)

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- couples
-- ============================================================
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  name varchar(40) not null default '新手小窩',
  invite_code varchar(8) unique not null,
  kingdom_level int not null default 1,
  love_index int not null default 0,
  coins int not null default 0,
  title varchar(20) not null default '見習情人',
  bio text,
  privacy varchar(10) not null default 'public' check (privacy in ('public','friends','private')),
  paired_at timestamptz,
  created_at timestamptz not null default now()
);

create index on couples (love_index desc);
create index on couples (kingdom_level desc);

-- ============================================================
-- users (linked to auth.users)
-- ============================================================
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  couple_id uuid references couples(id) on delete set null,
  role varchar(10) check (role in ('queen','prince')),
  nickname varchar(40) not null default '阿紅',
  avatar_url text,
  line_user_id text,
  push_subscription jsonb,
  created_at timestamptz not null default now()
);

create index on users (couple_id);
create index on users (line_user_id);

-- ============================================================
-- tasks (global template) + submissions (per couple)
-- ============================================================
create table if not exists task_catalog (
  id varchar(20) primary key,
  title varchar(60) not null,
  category varchar(20) not null,
  reward int not null,
  attribute varchar(20) not null,
  coop boolean default false
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  task_id varchar(20) not null,
  task_title varchar(60) not null,
  reward int not null,
  submitted_by uuid not null references users(id),
  reviewer_id uuid references users(id),
  status varchar(10) not null default 'pending' check (status in ('pending','approved','rejected')),
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index on submissions (couple_id, created_at desc);

-- ============================================================
-- pet
-- ============================================================
create table if not exists pets (
  couple_id uuid primary key references couples(id) on delete cascade,
  name varchar(20) not null default '小小蛋',
  stage int not null default 0 check (stage between 0 and 4),
  attrs jsonb not null default '{"intimacy":0,"communication":0,"romance":0,"care":0,"surprise":0}'::jsonb,
  last_fed_at timestamptz not null default now()
);

-- ============================================================
-- memory cards catalog + couple collection
-- ============================================================
create table if not exists card_catalog (
  id varchar(20) primary key,
  name varchar(40) not null,
  rarity varchar(5) not null check (rarity in ('N','R','SR','SSR')),
  theme varchar(20) not null,
  emoji varchar(10) not null
);

create table if not exists memory_cards (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  card_id varchar(20) not null references card_catalog(id),
  obtained_at timestamptz not null default now(),
  unique (couple_id, card_id)
);
create index on memory_cards (couple_id);

-- ============================================================
-- island + item catalog
-- ============================================================
create table if not exists item_catalog (
  id varchar(20) primary key,
  label varchar(20) not null,
  emoji varchar(10) not null,
  price int not null,
  season varchar(10)
);

create table if not exists island_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  catalog_id varchar(20) not null references item_catalog(id),
  x real not null,
  y real not null,
  created_at timestamptz not null default now()
);
create index on island_items (couple_id);

-- ============================================================
-- rituals + streaks
-- ============================================================
create table if not exists rituals (
  couple_id uuid not null references couples(id) on delete cascade,
  date date not null,
  morning boolean default false,
  night boolean default false,
  primary key (couple_id, date)
);

create table if not exists streaks (
  couple_id uuid primary key references couples(id) on delete cascade,
  current int not null default 0,
  longest int not null default 0,
  last_date date
);

-- ============================================================
-- rewards + redemptions
-- ============================================================
create table if not exists reward_catalog (
  id varchar(20) primary key,
  title varchar(60) not null,
  cost int not null,
  icon varchar(10)
);

create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  reward_id varchar(20) not null references reward_catalog(id),
  reward_title varchar(60) not null,
  cost int not null,
  redeemed_by uuid not null references users(id),
  status varchar(10) not null default 'unused' check (status in ('unused','used')),
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- ============================================================
-- moments (community feed)
-- ============================================================
create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  couple_name varchar(40) not null,
  type varchar(30) not null,
  title varchar(100) not null,
  subtitle varchar(200),
  emoji varchar(10),
  likes int not null default 0,
  comments int not null default 0,
  created_at timestamptz not null default now()
);
create index on moments (created_at desc);
create index on moments (couple_id, created_at desc);

create table if not exists moment_likes (
  moment_id uuid not null references moments(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  primary key (moment_id, user_id)
);

-- ============================================================
-- friendships + gifts
-- ============================================================
create table if not exists friendships (
  couple_a_id uuid not null references couples(id) on delete cascade,
  couple_b_id uuid not null references couples(id) on delete cascade,
  status varchar(10) not null default 'accepted' check (status in ('pending','accepted','blocked')),
  since timestamptz not null default now(),
  primary key (couple_a_id, couple_b_id),
  check (couple_a_id < couple_b_id)
);

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  from_couple_id uuid not null references couples(id) on delete cascade,
  to_couple_id uuid not null references couples(id) on delete cascade,
  kind varchar(10) not null check (kind in ('card','coins','item')),
  content varchar(100),
  message varchar(200),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on gifts (to_couple_id, created_at desc);

-- ============================================================
-- alliances
-- ============================================================
create table if not exists alliances (
  id uuid primary key default gen_random_uuid(),
  name varchar(40) not null,
  description text,
  leader_couple_id uuid references couples(id),
  weekly_progress int not null default 0,
  weekly_target int not null default 200,
  quest_title varchar(100),
  boss_name varchar(40),
  boss_hp int,
  boss_max_hp int,
  created_at timestamptz not null default now()
);

create table if not exists alliance_members (
  alliance_id uuid not null references alliances(id) on delete cascade,
  couple_id uuid not null references couples(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (alliance_id, couple_id)
);
create index on alliance_members (couple_id);

-- ============================================================
-- leaderboard materialized view (refreshed every 5 min)
-- ============================================================
create materialized view if not exists leaderboard_view as
  select
    c.id,
    c.name,
    c.kingdom_level,
    c.love_index,
    c.title,
    coalesce(s.current, 0) as streak,
    (
      select count(*)::int * 100 / greatest(1, (select count(*) from card_catalog))
      from memory_cards mc where mc.couple_id = c.id
    ) as codex_completion
  from couples c
  left join streaks s on s.couple_id = c.id
  where c.privacy in ('public', 'friends')
  order by c.love_index desc;

create unique index on leaderboard_view (id);

-- ============================================================
-- RLS (row level security)
-- ============================================================
alter table couples enable row level security;
alter table users enable row level security;
alter table submissions enable row level security;
alter table pets enable row level security;
alter table memory_cards enable row level security;
alter table island_items enable row level security;
alter table rituals enable row level security;
alter table streaks enable row level security;
alter table redemptions enable row level security;
alter table moments enable row level security;
alter table moment_likes enable row level security;
alter table friendships enable row level security;
alter table gifts enable row level security;
alter table alliances enable row level security;
alter table alliance_members enable row level security;

-- helper function: is current user in this couple?
create or replace function in_couple(target_couple_id uuid) returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from users u
    where u.id = auth.uid() and u.couple_id = target_couple_id
  );
$$;

-- couples: 可讀自己 + 公開 couples
create policy "couples: read own or public" on couples for select
  using (in_couple(id) or privacy in ('public', 'friends'));
create policy "couples: update own" on couples for update
  using (in_couple(id));

-- users: 可讀自己 couple 內的
create policy "users: read own couple" on users for select
  using (couple_id is null or in_couple(couple_id) or id = auth.uid());
create policy "users: update self" on users for update using (id = auth.uid());

-- private tables: 只能自己 couple 內讀寫
create policy "submissions: couple only" on submissions
  for all using (in_couple(couple_id));
create policy "pets: couple only" on pets
  for all using (in_couple(couple_id));
create policy "memory_cards: couple only" on memory_cards
  for all using (in_couple(couple_id));
create policy "island_items: couple only" on island_items
  for all using (in_couple(couple_id));
create policy "rituals: couple only" on rituals
  for all using (in_couple(couple_id));
create policy "streaks: couple only" on streaks
  for all using (in_couple(couple_id));
create policy "redemptions: couple only" on redemptions
  for all using (in_couple(couple_id));

-- moments: 公開讀，自己 couple 才能寫
create policy "moments: public read" on moments for select using (true);
create policy "moments: own couple write" on moments for insert
  with check (in_couple(couple_id));

-- moment_likes
create policy "moment_likes: self" on moment_likes for all
  using (user_id = auth.uid());

-- friendships: 雙方皆可讀寫
create policy "friendships: involved couples" on friendships for all
  using (in_couple(couple_a_id) or in_couple(couple_b_id));

-- gifts: 送禮雙方皆可讀
create policy "gifts: involved couples" on gifts for select
  using (in_couple(from_couple_id) or in_couple(to_couple_id));
create policy "gifts: send from own couple" on gifts for insert
  with check (in_couple(from_couple_id));

-- alliances: 公開讀，成員才能更新
create policy "alliances: public read" on alliances for select using (true);
create policy "alliance_members: own" on alliance_members for all
  using (in_couple(couple_id));
