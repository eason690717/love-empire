"use client";

/**
 * Auth adapter — 支援 Supabase (真實) 或 local demo (假)
 * getSupabase() 空時走本地 demo (Zustand state)
 */
import { getSupabase, isSupabaseEnabled } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

/** Supabase 原生錯誤 → 中文可讀訊息 */
function humanizeAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("email signups are disabled") || m.includes("email logins are disabled")) {
    return "Supabase 後台把 Email 登入關掉了。請到 Dashboard → Authentication → Providers → Email → 打開 Enable Email provider";
  }
  if (m.includes("invalid login credentials")) {
    return "email 或密碼錯誤（若你剛註冊，可能要先到 Supabase 關掉 Confirm email）";
  }
  if (m.includes("user already registered") || m.includes("already exists")) {
    return "這個 email 已經註冊過，請直接登入";
  }
  if (m.includes("weak password") || m.includes("password should")) {
    return "密碼太弱，請至少 6 碼";
  }
  if (m.includes("email rate limit") || m.includes("too many")) {
    return "短時間內嘗試太多次，請稍後再試";
  }
  if (m.includes("anonymous sign-ins are disabled")) {
    return "訪客模式尚未開啟 (Supabase 後台開 Allow anonymous sign-ins)";
  }
  return `Supabase 錯誤：${msg}`;
}

export async function signUp(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定，目前使用本地 demo 模式（資料存於瀏覽器）" };
  try {
    const { data, error } = await (client as any).auth.signUp({ email, password });
    if (error) return { error: humanizeAuthError(error.message) };
    return { user: data.user };
  } catch (e: any) {
    return { error: humanizeAuthError(String(e)) };
  }
}

export async function signIn(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定，目前使用本地 demo 模式（資料存於瀏覽器）" };
  try {
    const { data, error } = await (client as any).auth.signInWithPassword({ email, password });
    if (error) return { error: humanizeAuthError(error.message) };
    return { user: data.user };
  } catch (e: any) {
    return { error: humanizeAuthError(String(e)) };
  }
}

/** 匿名登入（訪客模式）— Supabase 後台需 enable anonymous sign-ins */
export async function signInAnonymous(): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定" };
  try {
    const { data, error } = await (client as any).auth.signInAnonymously();
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
