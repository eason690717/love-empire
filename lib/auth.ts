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

export async function signUp(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定，目前使用本地 demo 模式（資料存於瀏覽器）" };
  try {
    const { data, error } = await (client as any).auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { user: data.user };
  } catch (e: any) {
    return { error: String(e) };
  }
}

export async function signIn(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  const client = await getSupabase();
  if (!client) return { error: "Supabase 未設定，目前使用本地 demo 模式（資料存於瀏覽器）" };
  try {
    const { data, error } = await (client as any).auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { user: data.user };
  } catch (e: any) {
    return { error: String(e) };
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
