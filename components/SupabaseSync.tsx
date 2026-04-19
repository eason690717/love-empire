"use client";

/**
 * Supabase 整合同步層
 *
 * 掛在 game layout 內。當 Supabase 啟用 + 使用者登入時：
 *  1. 首次 mount：從 Supabase pull 全部 couple 狀態到 Zustand
 *  2. 訂閱 realtime：伴侶在另一裝置做任何動作 → 我這邊 state 自動更新
 *  3. 卸載時關閉訂閱
 *
 * 沒 Supabase env 時 → 整個組件 no-op，store 繼續用 localStorage。
 */

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/store";
import {
  isSupabaseEnabled, pullCoupleState, subscribeCouple, getCurrentUser,
} from "@/lib/supabaseAdapter";

export function SupabaseSync() {
  const loggedIn = useGame((s) => s.loggedIn);
  const couple = useGame((s) => s.couple);
  const applyRemoteState = useGame((s) => s.applyRemoteState);
  const subscribedRef = useRef<(() => void) | null>(null);
  const pollIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visibilityHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isSupabaseEnabled() || !loggedIn) return;

    let cancelled = false;

    (async () => {
      const user = await getCurrentUser();
      if (cancelled || !user) return;

      // 解析 couple_id (從 users table)
      const { getSupabase } = await import("@/lib/supabase");
      const sb = await getSupabase();
      if (!sb || cancelled) return;
      const client: any = sb;
      const { data: urow } = await client
        .from("users")
        .select("couple_id, role, nickname")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled || !urow?.couple_id) return;

      // Pull 全部狀態
      const state = await pullCoupleState(urow.couple_id);
      if (cancelled || !state) return;

      applyRemoteState(state);

      // 訂閱即時變化
      const unsub = subscribeCouple(urow.couple_id, async (_table, _payload) => {
        // 任何變化 → 重新 pull（簡單可靠；未來可做 delta）
        const next = await pullCoupleState(urow.couple_id);
        if (next) applyRemoteState(next);
      });
      subscribedRef.current = unsub;

      // Polling fallback — 每 30 秒 pull 一次，避免 realtime 斷線或 RLS 沒開時資料不更新
      const pollId = setInterval(async () => {
        if (cancelled) return;
        if (typeof document !== "undefined" && document.visibilityState !== "visible") return; // 背景不 polling
        const next = await pullCoupleState(urow.couple_id);
        if (next) applyRemoteState(next);
      }, 30_000);
      pollIdRef.current = pollId;

      // 切回視窗時立刻 pull 一次
      const onVis = async () => {
        if (cancelled || document.visibilityState !== "visible") return;
        const next = await pullCoupleState(urow.couple_id);
        if (next) applyRemoteState(next);
      };
      document.addEventListener("visibilitychange", onVis);
      visibilityHandlerRef.current = onVis;
    })();

    return () => {
      cancelled = true;
      if (subscribedRef.current) {
        subscribedRef.current();
        subscribedRef.current = null;
      }
      if (pollIdRef.current) {
        clearInterval(pollIdRef.current);
        pollIdRef.current = null;
      }
      if (visibilityHandlerRef.current && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
        visibilityHandlerRef.current = null;
      }
    };
  }, [loggedIn, applyRemoteState]);

  return null;
}
