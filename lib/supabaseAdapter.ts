"use client";

/**
 * Supabase 實時同步 adapter — 真實多情侶後端整合
 *
 * 啟用條件：NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY 同時存在。
 * 未啟用時：所有函式 no-op，store 用 localStorage。
 */

import { getSupabase, isSupabaseEnabled } from "./supabase";
import type {
  Couple, Submission, MemoryCard, Pet, IslandItem,
  Ritual, Streak, Redemption, Task, Moment, QuestionAnswer,
} from "./types";

function uid6(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

// =============================================================
// Auth & Couple 建立
// =============================================================

export async function getCurrentUser() {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data } = await (sb as any).auth.getUser();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

/** 建立新王國（或回既有的）。呼叫前須已有 auth session（anonymous 即可） */
export async function ensureCoupleForUser(
  userId: string,
  options: { kingdomName?: string; nickname?: string } = {},
): Promise<{ coupleId: string | null; inviteCode: string | null; error?: string }> {
  const sb = await getSupabase();
  if (!sb) return { coupleId: null, inviteCode: null, error: "Supabase 未啟用" };

  const client: any = sb;

  try {
    // 先看這個 user 是否已有 couple
    const { data: existing } = await client
      .from("users")
      .select("couple_id, nickname")
      .eq("id", userId)
      .maybeSingle();
    if (existing?.couple_id) {
      const { data: c } = await client.from("couples").select("invite_code").eq("id", existing.couple_id).maybeSingle();
      return { coupleId: existing.couple_id, inviteCode: c?.invite_code ?? null };
    }

    // 建 couple
    const inviteCode = uid6();
    const { data: couple, error: cErr } = await client
      .from("couples")
      .insert({
        name: options.kingdomName ?? "新手小窩",
        invite_code: inviteCode,
        kingdom_level: 1,
        love_index: 0,
        coins: 0,
        title: "見習情人",
        privacy: "public",
      })
      .select("id")
      .single();
    if (cErr) {
      console.warn("[sb] create couple failed", cErr);
      return { coupleId: null, inviteCode: null, error: cErr.message };
    }

    // 建 user row
    const { error: uErr } = await client.from("users").upsert({
      id: userId,
      couple_id: couple.id,
      role: "queen",
      nickname: options.nickname ?? "阿紅",
    });
    if (uErr) console.warn("[sb] create user failed", uErr);

    // 建寵物 + streak (用 service 層邏輯; 失敗不阻塞)
    await client.from("pets").insert({ couple_id: couple.id }).then(() => null, () => null);
    await client.from("streaks").insert({ couple_id: couple.id }).then(() => null, () => null);

    return { coupleId: couple.id, inviteCode };
  } catch (e: any) {
    console.warn("[sb] ensureCoupleForUser", e);
    return { coupleId: null, inviteCode: null, error: String(e) };
  }
}

/** 透過配對碼加入既有王國（以 prince 身份） */
export async function joinCoupleByCode(userId: string, inviteCode: string, nickname?: string): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data: couple } = await client
      .from("couples")
      .select("id")
      .eq("invite_code", inviteCode.toUpperCase())
      .maybeSingle();
    if (!couple) return null;
    await client.from("users").upsert({
      id: userId,
      couple_id: couple.id,
      role: "prince",
      nickname: nickname ?? "阿藍",
    });
    await client.from("couples").update({ paired_at: new Date().toISOString() }).eq("id", couple.id);
    return couple.id;
  } catch (e) {
    console.warn("[sb] joinCoupleByCode", e);
    return null;
  }
}

// =============================================================
// Pull — 拉取完整情侶狀態到 Zustand
// =============================================================

export interface FullCoupleState {
  couple: any;
  users: any[];
  submissions: any[];
  pet: any;
  codex: any[];
  island: any[];
  rituals: any;
  streak: any;
  redemptions: any[];
  moments: any[];
  gifts: any[];
  questionAnswers: any[];
  publicCouples: any[];
  alliances: any[];
  allianceMembers: any[];
  friendships: any[];
}

export async function pullCoupleState(coupleId: string): Promise<FullCoupleState | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const today = new Date().toISOString().slice(0, 10);

    const [
      coupleRes, usersRes, subsRes, petRes, cardsRes, itemsRes,
      ritualRes, streakRes, redRes, momentsRes, giftsRes, qaRes,
      publicCouplesRes, alliancesRes, allianceMembersRes, friendshipsRes,
    ] = await Promise.all([
      client.from("couples").select("*").eq("id", coupleId).maybeSingle(),
      client.from("users").select("*").eq("couple_id", coupleId),
      client.from("submissions").select("*").eq("couple_id", coupleId).order("created_at", { ascending: false }).limit(100),
      client.from("pets").select("*").eq("couple_id", coupleId).maybeSingle(),
      client.from("memory_cards").select("*").eq("couple_id", coupleId),
      client.from("island_items").select("*").eq("couple_id", coupleId),
      client.from("rituals").select("*").eq("couple_id", coupleId).eq("date", today).maybeSingle(),
      client.from("streaks").select("*").eq("couple_id", coupleId).maybeSingle(),
      client.from("redemptions").select("*").eq("couple_id", coupleId).order("created_at", { ascending: false }),
      client.from("moments").select("*").order("created_at", { ascending: false }).limit(50),
      client.from("gifts").select("*").eq("to_couple_id", coupleId).order("created_at", { ascending: false }).limit(50),
      client.from("question_answers").select("*").eq("couple_id", coupleId).order("created_at", { ascending: false }),
      client.from("couples").select("id, name, kingdom_level, love_index, title, privacy").in("privacy", ["public", "friends"]).order("love_index", { ascending: false }).limit(100),
      client.from("alliances").select("*").limit(50),
      client.from("alliance_members").select("*"),
      client.from("friendships").select("*").or(`couple_a_id.eq.${coupleId},couple_b_id.eq.${coupleId}`).eq("status", "accepted"),
    ]);

    return {
      couple: coupleRes.data,
      users: usersRes.data ?? [],
      submissions: subsRes.data ?? [],
      pet: petRes.data,
      codex: cardsRes.data ?? [],
      island: itemsRes.data ?? [],
      rituals: ritualRes.data,
      streak: streakRes.data,
      redemptions: redRes.data ?? [],
      moments: momentsRes.data ?? [],
      gifts: giftsRes.data ?? [],
      questionAnswers: qaRes.data ?? [],
      publicCouples: publicCouplesRes.data ?? [],
      alliances: alliancesRes.data ?? [],
      allianceMembers: allianceMembersRes.data ?? [],
      friendships: friendshipsRes.data ?? [],
    };
  } catch (e) {
    console.warn("[sb] pullCoupleState", e);
    return null;
  }
}

// =============================================================
// Push — 從 Zustand 寫入 Supabase
// =============================================================

export async function updateUserMood(userId: string, mood: string): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("users").update({
      mood,
      mood_updated_at: new Date().toISOString(),
    }).eq("id", userId);
  } catch (e) { console.warn("[sb] updateUserMood", e); }
}

export async function updateCoupleFields(coupleId: string, fields: Partial<Couple>): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    const map: any = {};
    if (fields.name) map.name = fields.name;
    if (typeof fields.coins === "number") map.coins = fields.coins;
    if (typeof fields.loveIndex === "number") map.love_index = fields.loveIndex;
    if (typeof fields.kingdomLevel === "number") map.kingdom_level = fields.kingdomLevel;
    if (fields.title) map.title = fields.title;
    if (fields.bio !== undefined) map.bio = fields.bio;
    if (fields.privacy) map.privacy = fields.privacy;
    await client.from("couples").update(map).eq("id", coupleId);
  } catch (e) { console.warn("[sb] updateCouple", e); }
}

export async function insertSubmission(
  coupleId: string,
  userId: string,
  submission: { taskId: string; taskTitle: string; reward: number },
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data, error } = await client.from("submissions").insert({
      couple_id: coupleId,
      task_id: submission.taskId,
      task_title: submission.taskTitle,
      reward: submission.reward,
      submitted_by: userId,
      status: "pending",
    }).select("id").single();
    if (error) { console.warn("[sb] insertSubmission", error); return null; }
    return data.id;
  } catch (e) { console.warn("[sb] insertSubmission", e); return null; }
}

export async function reviewSubmissionRemote(
  submissionId: string, approve: boolean, reviewerId: string, note?: string,
): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("submissions").update({
      status: approve ? "approved" : "rejected",
      reviewer_id: reviewerId,
      reviewed_at: new Date().toISOString(),
      note,
    }).eq("id", submissionId);
  } catch (e) { console.warn("[sb] review", e); }
}

export async function upsertPet(coupleId: string, pet: Partial<Pet>): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    const row: any = {
      couple_id: coupleId,
      name: pet.name,
      stage: pet.stage,
      attrs: pet.attrs,
      last_fed_at: pet.lastFedAt ?? new Date().toISOString(),
    };
    if (pet.bondQueen !== undefined)       row.bond_queen = pet.bondQueen;
    if (pet.bondPrince !== undefined)      row.bond_prince = pet.bondPrince;
    if (pet.feedCountQueen !== undefined)  row.feed_count_queen = pet.feedCountQueen;
    if (pet.feedCountPrince !== undefined) row.feed_count_prince = pet.feedCountPrince;
    if (pet.lastFedBy !== undefined)       row.last_fed_by = pet.lastFedBy;
    const { error } = await client.from("pets").upsert(row, { onConflict: "couple_id" });
    if (error) console.warn("[sb] upsertPet", error);
  } catch (e) { console.warn("[sb] upsertPet", e); }
}

export async function addMemoryCardRemote(coupleId: string, cardId: string): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("memory_cards").insert({
      couple_id: coupleId,
      card_id: cardId,
    });
  } catch (e) { console.warn("[sb] addCard", e); }
}

export async function addIslandItemRemote(coupleId: string, catalogId: string, x: number, y: number): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data, error } = await client.from("island_items").insert({
      couple_id: coupleId, catalog_id: catalogId, x, y,
    }).select("id").single();
    if (error) return null;
    return data.id;
  } catch { return null; }
}

export async function moveIslandItemRemote(itemId: string, x: number, y: number): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("island_items").update({ x, y }).eq("id", itemId);
  } catch { /* ignore */ }
}

export async function removeIslandItemRemote(itemId: string): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("island_items").delete().eq("id", itemId);
  } catch { /* ignore */ }
}

export async function upsertRitual(coupleId: string, morning: boolean, night: boolean): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("rituals").upsert({
      couple_id: coupleId,
      date: new Date().toISOString().slice(0, 10),
      morning, night,
    });
  } catch { /* ignore */ }
}

export async function updateStreak(coupleId: string, current: number, longest: number): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("streaks").upsert({
      couple_id: coupleId,
      current, longest,
      last_date: new Date().toISOString().slice(0, 10),
    });
  } catch { /* ignore */ }
}

export async function insertRedemption(
  coupleId: string, userId: string, rewardId: string, title: string, cost: number,
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data } = await client.from("redemptions").insert({
      couple_id: coupleId, reward_id: rewardId,
      reward_title: title, cost, redeemed_by: userId,
      status: "unused",
    }).select("id").single();
    return data?.id ?? null;
  } catch { return null; }
}

export async function insertMomentRemote(
  coupleId: string, coupleName: string, m: { type: string; title: string; subtitle?: string; emoji: string },
): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("moments").insert({
      couple_id: coupleId, couple_name: coupleName,
      type: m.type, title: m.title, subtitle: m.subtitle, emoji: m.emoji,
    });
  } catch { /* ignore */ }
}

export async function insertQuestionAnswerRemote(
  coupleId: string, userId: string, questionId: string, text: string,
): Promise<string | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    const { data } = await client.from("question_answers").insert({
      couple_id: coupleId, question_id: questionId,
      answered_by: userId, text,
    }).select("id").single();
    return data?.id ?? null;
  } catch { return null; }
}

export async function rateQuestionAnswerRemote(
  answerId: string, rating: number, comment?: string,
): Promise<void> {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    const client: any = sb;
    await client.from("question_answers").update({
      rating, rating_comment: comment, rated_at: new Date().toISOString(),
    }).eq("id", answerId);
  } catch { /* ignore */ }
}

// =============================================================
// Realtime subscribe
// =============================================================

export function subscribeCouple(
  coupleId: string,
  onChange: (table: string, payload: unknown) => void,
): () => void {
  let channel: any = null;
  let cancelled = false;
  (async () => {
    const sb = await getSupabase();
    if (!sb || cancelled) return;
    const client: any = sb;
    const tables = ["submissions", "pets", "memory_cards", "island_items", "rituals", "streaks", "redemptions", "moments", "gifts", "question_answers"];
    channel = client.channel(`couple:${coupleId}`);
    tables.forEach((t) => {
      channel.on("postgres_changes",
        { event: "*", schema: "public", table: t, filter: `couple_id=eq.${coupleId}` },
        (payload: unknown) => onChange(t, payload),
      );
    });
    channel.subscribe();
  })();
  return () => {
    cancelled = true;
    if (channel) {
      (async () => {
        const sb = await getSupabase();
        if (!sb) return;
        try { (sb as any).removeChannel(channel); } catch { /* ignore */ }
      })();
    }
  };
}

// =============================================================
// Leaderboard (唯讀)
// =============================================================

export async function fetchLeaderboard(metric: "love_index" | "kingdom_level" = "love_index"): Promise<any[] | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const client: any = sb;
    // 先試 materialized view
    const viewQuery = await client
      .from("leaderboard_view")
      .select("*")
      .order(metric, { ascending: false })
      .limit(100);
    if (!viewQuery.error && viewQuery.data) return viewQuery.data;
    // Fallback: 直接從 couples 取
    const { data } = await client
      .from("couples")
      .select("id, name, kingdom_level, love_index, title")
      .eq("privacy", "public")
      .order(metric, { ascending: false })
      .limit(100);
    return data ?? [];
  } catch { return null; }
}

export { isSupabaseEnabled };
