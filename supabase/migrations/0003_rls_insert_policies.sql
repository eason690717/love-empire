-- Love Empire · schema migration 0003
-- 補齊 couples + users INSERT RLS 政策 (0001 漏寫導致 ensureCoupleForUser 靜默失敗)

-- 任何登入使用者都可以 INSERT 新 couple (馬上會 INSERT users 建立關聯)
drop policy if exists "couples: insert by authenticated" on couples;
create policy "couples: insert by authenticated" on couples for insert
  to authenticated with check (true);

-- 使用者可以 INSERT 自己的 users row (id 必須對到 auth.uid())
drop policy if exists "users: insert self" on users for insert;
create policy "users: insert self" on users for insert
  to authenticated with check (id = auth.uid());

-- 補強：couples 的 delete (分手用)
drop policy if exists "couples: delete by member" on couples;
create policy "couples: delete by member" on couples for delete
  using (in_couple(id));
