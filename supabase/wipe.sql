-- 清空所有使用者資料 — 保留 schema、RLS、三張 catalog 種子表
-- 到 Supabase Dashboard → SQL Editor 貼上執行

-- 1. 先刪有外鍵引用的子表，避免 cascade 誤刪順序問題
truncate table
  submissions,
  memory_cards,
  island_items,
  rituals,
  streaks,
  redemptions,
  moments,
  moment_likes,
  gifts,
  friendships,
  alliance_members,
  alliances,
  pets,
  question_answers
restart identity cascade;

-- 2. 再刪 users 與 couples
truncate table users cascade;
truncate table couples cascade;

-- 3. 刪 auth.users（包含 email 舊帳號 + 所有 anonymous users）
delete from auth.users;

-- 4. 驗證
select
  (select count(*) from auth.users)           as auth_users,
  (select count(*) from couples)              as couples,
  (select count(*) from users)                as users,
  (select count(*) from submissions)          as submissions,
  (select count(*) from memory_cards)         as memory_cards,
  (select count(*) from task_catalog)         as task_catalog_kept,
  (select count(*) from card_catalog)         as card_catalog_kept,
  (select count(*) from reward_catalog)       as reward_catalog_kept;
-- 前 5 欄應該都是 0，後 3 欄應該 > 0（catalog 種子保留）
