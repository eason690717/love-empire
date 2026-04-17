"use client";

/**
 * Supabase 實時同步 adapter
 *
 * 目的：讓 Zustand store 在 Supabase 啟用時，自動把本地操作 mirror 到遠端，
 *      並透過 realtime 接收另一方的更新。
 *
 * 啟用條件：NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY 同時存在。
 *
 * 尚未啟用時：所有函式都 no-op，store 仍用 localStorage。
 */

import { getSupabase, isSupabaseEnabled } from "./supabase";
import type { Submission, MemoryCard, Couple, Pet } from "./types";

// =============================================================
// couple 同步
// =============================================================

export async function syncCouple(couple: Couple): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  try {
    const client: any = sb;
    const { error } = await client.from("couples").upsert({
      id: couple.id === "me" ? undefined : couple.id,
      name: couple.name,
      invite_code: couple.inviteCode,
      kingdom_level: couple.kingdomLevel,
      love_index: couple.loveIndex,
      coins: couple.coins,
      title: couple.title,
      bio: couple.bio,
      privacy: couple.privacy,
    });
    return !error;
  } catch {
    return false;
  }
}

// =============================================================
// submission 同步
// =============================================================

export async function insertSubmission(
  coupleId: string,
  submission: Omit<Submission, "id"> & { userId?: string },
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data, error } = await client
      .from("submissions")
      .insert({
        couple_id: coupleId,
        task_id: submission.taskId,
        task_title: submission.taskTitle,
        reward: submission.reward,
        submitted_by: submission.userId,
        status: submission.status,
        note: submission.note,
      })
      .select("id")
      .single();
    if (error) return null;
    return data?.id ?? null;
  } catch {
    return null;
  }
}

// =============================================================
// 訂閱 couple 的即時變化
// =============================================================

export function subscribeCouple(
  coupleId: string,
  onChange: (payload: unknown) => void,
): () => void {
  let channel: any = null;
  (async () => {
    const sb = await getSupabase();
    if (!sb) return;
    const client: any = sb;
    channel = client
      .channel(`couple:${coupleId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions", filter: `couple_id=eq.${coupleId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "pets", filter: `couple_id=eq.${coupleId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "memory_cards", filter: `couple_id=eq.${coupleId}` }, onChange)
      .subscribe();
  })();
  return () => {
    if (channel) {
      (async () => {
        const sb = await getSupabase();
        if (!sb) return;
        (sb as any).removeChannel(channel);
      })();
    }
  };
}

// =============================================================
// 排行榜 (唯讀)
// =============================================================

export async function fetchLeaderboard(metric: "love_index" | "kingdom_level" | "streak" = "love_index"): Promise<any[] | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data, error } = await client
      .from("leaderboard_view")
      .select("*")
      .order(metric, { ascending: false })
      .limit(100);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export { isSupabaseEnabled };
