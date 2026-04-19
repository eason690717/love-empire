-- Love Empire · 0007 · 多寵物系統 + 跨情侶交配（草案）
-- 階段 1：資料模型建立，UI 延後
-- 策略：pets 表保留作「首隻主寵物」backward compat；pet_instances 是第 2 隻以後

-- ============================================================
-- 防禦性：確保 couples 有 0004 需要的欄位（0004 若未跑或部分失敗時補齊）
-- ============================================================
alter table couples
  add column if not exists paused_at timestamptz,
  add column if not exists pause_reason text,
  add column if not exists pause_initiator varchar(10),
  add column if not exists archived_at timestamptz,
  add column if not exists relationship_type varchar(20);

-- ============================================================
-- pet_instances：每對情侶可多隻
-- ============================================================
create table if not exists pet_instances (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  name varchar(20) not null default '小寵物',
  species varchar(20) not null default 'basic',   -- 預留種族欄位
  generation int not null default 0,               -- 0 = 初代 (從蛋開始) / >0 = 後代

  -- 基因 (NFT-like 唯一 hash)
  gene_seed varchar(64),                           -- 32+ 字 hash 決定外觀
  gene_color varchar(20) default 'pink',           -- pink/blue/yellow/purple/green/rainbow
  gene_pattern varchar(20) default 'plain',        -- plain/spot/star/heart
  gene_face varchar(20) default 'smile',           -- smile/sleepy/shock/cool
  gene_accessory varchar(20) default 'none',       -- none/crown/ribbon/glasses/wings
  gene_rarity varchar(20) default 'common',        -- common/uncommon/rare/legendary

  -- 血統（後代才有值；初代全 null）
  parent_a_id uuid references pet_instances(id) on delete set null,
  parent_b_id uuid references pet_instances(id) on delete set null,
  parent_a_couple_id uuid references couples(id) on delete set null,
  parent_b_couple_id uuid references couples(id) on delete set null,

  -- 養成（同原 pets）
  stage int not null default 0 check (stage between 0 and 4),
  attrs jsonb not null default '{"intimacy":0,"communication":0,"romance":0,"care":0,"surprise":0}'::jsonb,
  bond_queen int not null default 0,
  bond_prince int not null default 0,
  feed_count_queen int not null default 0,
  feed_count_prince int not null default 0,
  last_fed_by varchar(10),
  last_fed_at timestamptz not null default now(),

  -- 交配 cooldown
  last_mated_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists idx_pet_instances_couple on pet_instances (couple_id);
create index if not exists idx_pet_instances_lineage on pet_instances (parent_a_id, parent_b_id);
create index if not exists idx_pet_instances_rarity on pet_instances (gene_rarity);

alter table pet_instances enable row level security;

drop policy if exists "pet_instances: read own or public" on pet_instances;
create policy "pet_instances: read own or public" on pet_instances for select
  using (
    in_couple(couple_id)
    OR exists (
      select 1 from couples c
      where c.id = pet_instances.couple_id
        and c.privacy in ('public', 'friends')
        and c.archived_at is null
        and c.paused_at is null
    )
  );

drop policy if exists "pet_instances: write own" on pet_instances;
create policy "pet_instances: write own" on pet_instances for all
  using (in_couple(couple_id));

-- ============================================================
-- pet_mating_requests：交配請求（雙方情侶各自雙簽）
-- ============================================================
create table if not exists pet_mating_requests (
  id uuid primary key default gen_random_uuid(),

  from_pet_id uuid not null references pet_instances(id) on delete cascade,
  from_couple_id uuid not null references couples(id) on delete cascade,
  to_pet_id uuid not null references pet_instances(id) on delete cascade,
  to_couple_id uuid not null references couples(id) on delete cascade,

  -- 雙簽（from couple 的 queen+prince / to couple 的 queen+prince）
  from_queen_approved boolean default false,
  from_prince_approved boolean default false,
  to_queen_approved boolean default false,
  to_prince_approved boolean default false,

  status varchar(20) not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'completed', 'expired')),
  offspring_id uuid references pet_instances(id) on delete set null,
  message text,

  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days')
);

create index if not exists idx_mating_from on pet_mating_requests (from_couple_id, status);
create index if not exists idx_mating_to on pet_mating_requests (to_couple_id, status);

alter table pet_mating_requests enable row level security;

drop policy if exists "mating: involved couples" on pet_mating_requests;
create policy "mating: involved couples" on pet_mating_requests for all
  using (in_couple(from_couple_id) or in_couple(to_couple_id));

-- ============================================================
-- 檢查函式：交配資格（cooldown + stage 4）
-- ============================================================
create or replace function can_mate(pet_id uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from pet_instances
    where id = pet_id
      and stage = 4  -- 神話才能交配
      and (last_mated_at is null or last_mated_at < now() - interval '7 days')
  );
$$;

-- ============================================================
-- 限制：每對情侶 max 3 隻
-- ============================================================
create or replace function check_pet_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from pet_instances where couple_id = NEW.couple_id) >= 3 then
    raise exception 'Each couple can have max 3 pets';
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_pet_limit on pet_instances;
create trigger trg_pet_limit
  before insert on pet_instances
  for each row
  execute function check_pet_limit();
