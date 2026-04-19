-- Love Empire · 0004 launch security + new fields
-- 公測前必跑：補新欄位 + 收緊 RLS + 公開資料白名單 view

-- ============================================================
-- A. 新欄位（前端已有，schema 補齊）
-- ============================================================

-- couples 加：暫停/封存/情侶類型
alter table couples
  add column if not exists relationship_type varchar(20),
  add column if not exists paused_at timestamptz,
  add column if not exists pause_reason text,
  add column if not exists pause_initiator varchar(10),
  add column if not exists archived_at timestamptz;

-- pets 加：雙主人 bond
alter table pets
  add column if not exists bond_queen int not null default 0,
  add column if not exists bond_prince int not null default 0,
  add column if not exists feed_count_queen int not null default 0,
  add column if not exists feed_count_prince int not null default 0,
  add column if not exists last_fed_by varchar(10);

-- redemptions 加：使用紀錄
alter table redemptions
  add column if not exists used_note text,
  add column if not exists category varchar(20),
  add column if not exists icon varchar(10),
  add column if not exists adult boolean default false;

-- 人生清單記錄表
create table if not exists bucket_records (
  id varchar(10) not null,
  couple_id uuid not null references couples(id) on delete cascade,
  done_at date not null,
  note text,
  photo_url text,
  primary key (couple_id, id)
);
create index if not exists idx_bucket_couple on bucket_records (couple_id);
alter table bucket_records enable row level security;
drop policy if exists "bucket_records: couple only" on bucket_records;
create policy "bucket_records: couple only" on bucket_records
  for all using (in_couple(couple_id));

-- 自訂儀式
create table if not exists custom_rituals (
  couple_id uuid not null references couples(id) on delete cascade,
  kind varchar(10) not null check (kind in ('morning','night')),
  label varchar(40) not null,
  description varchar(120),
  emoji varchar(10),
  primary key (couple_id, kind)
);
alter table custom_rituals enable row level security;
drop policy if exists "custom_rituals: couple only" on custom_rituals;
create policy "custom_rituals: couple only" on custom_rituals
  for all using (in_couple(couple_id));

-- 紀念日表
create table if not exists anniversaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  label varchar(40) not null,
  date date not null,
  recurring boolean default true,
  emoji varchar(10),
  created_at timestamptz not null default now()
);
create index if not exists idx_anniv_couple on anniversaries (couple_id);
alter table anniversaries enable row level security;
drop policy if exists "anniversaries: couple only" on anniversaries;
create policy "anniversaries: couple only" on anniversaries
  for all using (in_couple(couple_id));

-- ============================================================
-- B. 安全收緊：couples 公開 SELECT 改用白名單 view
-- ============================================================

-- 撤銷舊的寬鬆 policy
drop policy if exists "couples: read own or public" on couples;

-- 新政策：只有自己 couple 內可讀完整資料
create policy "couples: read own only (full)" on couples for select
  using (in_couple(id));

-- 公開資料用安全 view（只暴露白名單欄位 — 不含 invite_code/coins/bio 等敏感）
create or replace view public_couples as
  select
    id,
    name,
    kingdom_level,
    love_index,
    title
  from couples
  where privacy in ('public', 'friends')
    and archived_at is null
    and paused_at is null;

-- 對 anon + authenticated 開放這個 view 讀取
grant select on public_couples to anon, authenticated;

-- leaderboard view 也要排除暫停/封存
drop materialized view if exists leaderboard_view;
create materialized view leaderboard_view as
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
    and c.archived_at is null
    and c.paused_at is null
  order by c.love_index desc;
create unique index on leaderboard_view (id);

-- ============================================================
-- C. moments 公開 select 限制：不公開的 couple 不顯示 moments
-- ============================================================
drop policy if exists "moments: public read" on moments;
create policy "moments: public read for non-private" on moments for select
  using (
    in_couple(couple_id) -- 自己 couple 永遠可看
    or exists (
      select 1 from couples c
      where c.id = moments.couple_id
        and c.privacy in ('public','friends')
        and c.archived_at is null
        and c.paused_at is null
    )
  );

-- ============================================================
-- D. push_subscription 安全：只能自己讀寫自己的
-- ============================================================
-- users 的 push_subscription 已經受 in_couple 保護
-- 但確保 auth.users.email 不外洩 — Supabase 預設 auth schema 不開放查
