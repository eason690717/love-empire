"use client";

/**
 * Auth adapter — 鑰匙制（kingdom key）
 *
 * 設計：使用者不再打 email + 密碼。Supabase 只用 anonymous session 當容器，
 * 真正的「身份」由 couple 的 invite_code（= 王國鑰匙）持有。
 *
 * - 首次開 app → signInAnon() 建匿名 session（persistSession=true 會寫 localStorage）
 * - 建國 → 產生 invite_code + 回傳給使用者保存
 * - 換裝置/重裝 → 打鑰匙 → signInAnon() + 把匿名 user 綁到既有 couple
 * - RLS 仍用 in_couple(auth.uid())，完全不變
 */
import { getSupabase, isSupabaseEnabled } from "./supabase";

export interface AuthUser {
  id: string;
  created_at?: string;
}

function humanizeAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("anonymous sign-ins are disabled") || m.includes("anonymous")) {
    return "Supabase 後台尚未開啟匿名登入。請到 Dashboard → Authentication → Providers → 打開 Allow anonymous sign-ins";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "短時間內嘗試太多次，請稍後再試";
  }
  return `Supabase 錯誤：${msg}`;
}

/** 若尚未有 session 就建匿名 session。有 session 就直接回。 */
export async function signInAnon(): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定，目前使用本地 demo 模式（資料存於瀏覽器）" };
  const c: any = client;
  try {
    const { data: s } = await c.auth.getSession();
    if (s?.session?.user) return { user: s.session.user };
    const { data, error } = await c.auth.signInAnonymously();
    if (error) return { error: humanizeAuthError(error.message) };
    return { user: data.user };
  } catch (e: any) {
    return { error: humanizeAuthError(String(e)) };
  }
}

export async function signOut(): Promise<void> {
  const client = await getSupabase();
  if (!client) return;
  try { await (client as any).auth.signOut(); } catch { /* ignore */ }
}

export async function getSession(): Promise<AuthUser | null> {
  const client = await getSupabase();
  if (!client) return null;
  try {
    const { data } = await (client as any).auth.getSession();
    return data.session?.user ?? null;
  } catch {
    return null;
  }
}

export { isSupabaseEnabled };
