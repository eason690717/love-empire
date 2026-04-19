-- Love Empire · 0008 · 擴 pets 表加 species + rarity + gene + mintCount + isFounder
-- 配合 C1 批次：5 系 × 5 稀有度 + 吉伊卡哇視覺 + Founder 升級

-- ============================================================
-- pets：加 species / rarity / gene_* / mint_count / is_founder
-- ============================================================
alter table pets
  add column if not exists species varchar(20) default 'nuzzle',
  add column if not exists rarity varchar(20) default 'common',
  add column if not exists gene_color varchar(20),
  add column if not exists gene_pattern varchar(20),
  add column if not exists gene_face varchar(20),
  add column if not exists gene_accessory varchar(20),
  add column if not exists mint_count int default 0,
  add column if not exists is_founder boolean default false;

-- pet_instances 也要支援 'mythic' 稀有度（原 check 只 4 階）
-- 但 0007 用的是 varchar 不是 enum，實際沒 check — 這裡僅示意，不動
