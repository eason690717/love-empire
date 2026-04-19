-- Love Empire · 0005 · 心情狀態欄位 (mood)
-- 放在 users 表（每人獨立，伴侶可看對方）

alter table users
  add column if not exists mood varchar(20),
  add column if not exists mood_updated_at timestamptz;

-- RLS: users 表已有「read own couple」— 對方也讀得到自己 couple 內的 mood
-- 不用加新 policy
