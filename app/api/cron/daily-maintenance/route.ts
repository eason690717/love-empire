import { NextResponse } from "next/server";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";

/**
 * 每日維護 — 每日 01:00 UTC
 *  1. 斷連擊檢測：超過 2 天沒完成儀式的情侶，連擊歸零（保留 longest）
 *  2. 寵物飢餓狀態更新
 *  3. 清理 60 天前的通知
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseEnabled()) {
    return NextResponse.json({ skipped: "Supabase not configured" });
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
  }

  try {
    const sb: any = supabase;
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString();

    // 1. 斷連擊
    const { error: e1, count: resetCount } = await sb
      .from("streaks")
      .update({ current: 0 }, { count: "exact" })
      .lt("last_date", twoDaysAgo)
      .gt("current", 0);

    // 2. 清舊通知
    const { error: e2, count: deletedCount } = await sb
      .from("notifications")
      .delete({ count: "exact" })
      .lt("created_at", sixtyDaysAgo);

    return NextResponse.json({
      ok: true,
      runAt: new Date().toISOString(),
      streakReset: resetCount ?? 0,
      oldNotificationsDeleted: deletedCount ?? 0,
      errors: [e1, e2].filter(Boolean),
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
