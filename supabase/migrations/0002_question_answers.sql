-- Love Empire · schema migration 0002
-- 新增深度問答題表 (Batch K 需要)
-- 使用方式：在 Supabase SQL Editor 執行這整段

create table if not exists question_answers (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  question_id varchar(10) not null,
  answered_by uuid not null references users(id),
  text text not null,
  rating int check (rating between 1 and 5),
  rating_comment text,
  created_at timestamptz not null default now(),
  rated_at timestamptz
);

create index if not exists idx_qa_couple on question_answers (couple_id, created_at desc);

alter table question_answers enable row level security;

create policy "question_answers: couple only" on question_answers
  for all using (in_couple(couple_id));
