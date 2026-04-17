import { NextResponse } from "next/server";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";

/**
 * 週榜結算 — 每週一 00:00 UTC (台灣時間週一早上 8 點) 執行
 *
 * Vercel Cron header: authorization: Bearer <CRON_SECRET>
 * 本地測試用 curl -H "authorization: Bearer <secret>" /api/cron/weekly-leaderboard
 */
export async function GET(request: Request) {
  // 驗證 Vercel cron
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseEnabled()) {
    return NextResponse.json({
      skipped: "Supabase not configured; week leaderboard requires backend.",
      next: "add NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env",
    });
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
  }

  try {
    // 刷新 materialized view
    const sb: any = supabase;
    await sb.rpc("refresh_leaderboard_view").catch(() => {
      /* materialized view 可能沒設定，忽略 */
    });

    // 取 top 3 公開情侶
    const { data: top3, error } = await sb
      .from("leaderboard_view")
      .select("id, name, love_index, kingdom_level")
      .order("love_index", { ascending: false })
      .limit(3);

    if (error) throw error;

    // 發 SSR 卡給前三（透過 gift 系統）
    const ssrGift = (coupleId: string, rank: number) => ({
      from_couple_id: null, // 系統發送
      to_couple_id: coupleId,
      kind: "card",
      content: `🏆 週榜第 ${rank} 名 · 限定 SSR 記憶卡`,
      message: "恭喜！週榜結算獎勵",
    });

    for (let i = 0; i < (top3 ?? []).length; i++) {
      await sb.from("gifts").insert(ssrGift(top3[i].id, i + 1)).catch(() => null);
    }

    return NextResponse.json({
      ok: true,
      runAt: new Date().toISOString(),
      top3: top3 ?? [],
      rewarded: top3?.length ?? 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
