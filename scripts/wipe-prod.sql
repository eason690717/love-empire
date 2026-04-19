-- ════════════════════════════════════════════════════════════════
-- 🚨 公測前清空腳本 — 在 Supabase SQL Editor 執行
-- ════════════════════════════════════════════════════════════════
-- 影響：清空所有 couple / user / 任務 / 寵物 / 卡 / 紀念 等資料
-- 保留：catalog 表（task_catalog / card_catalog / item_catalog / reward_catalog）+ alliances
--
-- 執行前請確認你真的要清空所有測試資料！
-- 執行後新使用者進來會看到完全乾淨的環境。
-- ════════════════════════════════════════════════════════════════

begin;

-- 先清依賴的子表（外鍵 cascade 會處理大部分，但某些 view / mat-view 要手動 refresh）

truncate table
  bucket_records,
  custom_rituals,
  anniversaries,
  question_answers,
  moment_likes,
  moments,
  gifts,
  redemptions,
  rituals,
  streaks,
  island_items,
  memory_cards,
  pets,
  submissions,
  friendships,
  alliance_members,
  users,
  couples
restart identity cascade;

-- alliances 保留 seed 資料（公開資源），不清
-- 若連 alliances 都要清：
-- truncate table alliances restart identity cascade;

-- 清 Supabase auth.users（所有匿名帳號）
-- ⚠️ 以下 SQL 需要 service_role 權限 — Dashboard 的 SQL Editor 用 postgres 角色可以跑：
delete from auth.users;
-- 若上面跑不動（權限問題），改用 Dashboard 手動：
--   Authentication → Users → 全選 → Delete users

commit;

-- 重新整理 leaderboard view
refresh materialized view if exists leaderboard_view;

-- ════════════════════════════════════════════════════════════════
-- 後續步驟（在 Supabase Dashboard 操作）：
-- 1. Authentication → Users → 全選刪除（或保留你自己的測試帳號）
-- 2. Storage → 若有上傳檔案也清掉
-- 3. 確認 Realtime 開啟（Database → Replication → 勾選 submissions / question_answers / pets 等）
-- ════════════════════════════════════════════════════════════════
