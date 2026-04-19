-- Love Empire · 0009 · 防禦性補 pets 表欄位
-- 若 0004/0008 migration 沒跑到或遺漏，這個 migration 會把所有 pet 相關欄位補齊（idempotent）

alter table pets
  add column if not exists bond_queen int not null default 0,
  add column if not exists bond_prince int not null default 0,
  add column if not exists feed_count_queen int not null default 0,
  add column if not exists feed_count_prince int not null default 0,
  add column if not exists last_fed_by varchar(10),
  add column if not exists species varchar(20) default 'nuzzle',
  add column if not exists rarity varchar(20) default 'common',
  add column if not exists gene_color varchar(20),
  add column if not exists gene_pattern varchar(20),
  add column if not exists gene_face varchar(20),
  add column if not exists gene_accessory varchar(20),
  add column if not exists mint_count int default 0,
  add column if not exists is_founder boolean default false;
