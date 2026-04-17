/**
 * Supabase client — 目前處於 dormant 狀態，填入 env 變數後才會啟用。
 *
 * 要啟用：
 *  1. 在 Supabase Console 建立新專案，跑 supabase/migrations/0001_init.sql + seed.sql
 *  2. Vercel Settings 加：
 *      NEXT_PUBLIC_SUPABASE_URL
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY
 *  3. Redeploy
 *  4. 後續將 lib/store.ts 的 Zustand action 改為讀寫 Supabase
 */

let client: unknown = null;

export async function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const mod = await import("@supabase/supabase-js").catch(() => null);
    if (!mod) return null;
    client = mod.createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 5 } },
    });
    return client;
  } catch {
    return null;
  }
}

export function isSupabaseEnabled() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
