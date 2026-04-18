"use client";

/**
 * AuthResume — 在 root layout 掛一次，負責把 Supabase session 橋接到 Zustand loggedIn。
 *
 * 流程：
 *  1. 讀 Supabase session（persistSession=true 存 localStorage）
 *  2. 查 users 表是否有這個 auth.uid() 對應的 row
 *     - 有 → setLogin(role)，Zustand loggedIn=true，其他頁就不會把人踢回 /login
 *     - 沒有 → 孤兒 session（通常是 DB 被清但 localStorage 還留 token）→ signOut 清乾淨
 *  3. 無 session → no-op
 *
 * 這個元件解決的核心問題：
 *   「login 頁 if session → push /dashboard，但 dashboard layout if !loggedIn → push /login」互踢迴圈
 *   現在改成：有 session + row 就直接在進入 app 時把 loggedIn 拉起來，各頁不用各自處理。
 */

import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { getSession, signOut, isSupabaseEnabled } from "@/lib/auth";

export function AuthResume() {
  const login = useGame((s) => s.login);

  useEffect(() => {
    if (!isSupabaseEnabled()) return;
    let cancelled = false;
    (async () => {
      const u = await getSession();
      if (cancelled || !u) return;
      try {
        const { getSupabase } = await import("@/lib/supabase");
        const sb = await getSupabase();
        if (!sb || cancelled) return;
        const client: any = sb;
        const { data: urow } = await client
          .from("users")
          .select("id, role")
          .eq("id", u.id)
          .maybeSingle();
        if (cancelled) return;
        if (!urow) {
          // 孤兒 session — token 指向已不存在的 user（通常是 DB 被清）
          await signOut();
          return;
        }
        login((urow.role as "queen" | "prince") ?? "queen");
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, [login]);

  return null;
}
