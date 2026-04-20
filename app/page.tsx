"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGame } from "@/lib/store";
import { isSupabaseEnabled } from "@/lib/auth";
import { VERSION_STRING } from "@/lib/version";

function HomeInner() {
  const router = useRouter();
  const search = useSearchParams();
  const loggedIn = useGame((s) => s.loggedIn);
  const [refKingdom, setRefKingdom] = useState<string | null>(null);

  // 處理 ?ref=INVITE_CODE — 情侶邀情侶連結
  useEffect(() => {
    const ref = search?.get("ref");
    if (ref && typeof window !== "undefined") {
      try {
        localStorage.setItem("loveempire.ref", ref);
        // 查推薦王國名字顯示（匿名 read via public_couples RLS）
        (async () => {
          try {
            const { getSupabase } = await import("@/lib/supabase");
            const sb = await getSupabase();
            if (!sb) return;
            const client: any = sb;
            const { data } = await client
              .from("couples")
              .select("name")
              .eq("invite_code", ref.toUpperCase())
              .maybeSingle();
            if (data?.name) setRefKingdom(data.name);
          } catch { /* ignore */ }
        })();
      } catch { /* ignore */ }
    }
  }, [search]);

  useEffect(() => {
    if (loggedIn) router.replace("/dashboard");
  }, [loggedIn, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full card p-8 text-center relative overflow-hidden">
        {/* 左右葉飾 */}
        <div className="absolute -left-4 -top-4 text-5xl opacity-60 select-none">🍃</div>
        <div className="absolute -right-3 top-6 text-3xl opacity-70 select-none animate-float-slow">🌼</div>
        <div className="absolute -right-6 -bottom-4 text-4xl opacity-60 select-none">🌿</div>

        <div className="w-48 h-48 mx-auto animate-bob">
          <img src="/art/hero-couple.svg" alt="愛的帝國" width={192} height={192}
               style={{ filter: "drop-shadow(0 8px 16px rgba(255,127,161,0.3))" }} />
        </div>

        <h1 className="mt-6 font-display text-4xl font-black text-empire-ink text-shadow-soft tracking-wider">
          愛的帝國
        </h1>
        <p className="text-xs tracking-[0.4em] text-empire-berry/80 font-bold mt-1">LOVE EMPIRE</p>
        <p className="mt-5 text-sm text-empire-mute leading-relaxed">
          阿紅牽起阿藍，月老紅線纏上天上雙星<br />
          只屬於你們兩個人的量化戀愛
        </p>

        {/* 推薦來自其他情侶 banner */}
        {refKingdom && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-50 border-2 border-empire-berry/40">
            <div className="text-[11px] text-empire-berry font-bold">💌 被「{refKingdom}」王國邀請來</div>
            <div className="text-[10px] text-empire-mute mt-0.5">建立你們的王國後會有新手禮包獎勵 🎁</div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link href="/login" className="btn-primary block py-3.5 text-base">
            ✨ 我有王國鑰匙
          </Link>
          <Link href="/register" className="btn-pink block py-3.5 text-base">
            👑 建立新王國
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-empire-cloud/60 text-xs text-empire-mute">
          <div className="flex items-center justify-center gap-2">
            <span className="sprout-dot" /> {VERSION_STRING} · {isSupabaseEnabled() ? "已連雲端" : "資料存於你的瀏覽器"}
          </div>
          <div className="mt-3 flex justify-center gap-4">
            <Link href="/about" className="hover:underline">關於</Link>
            <Link href="/privacy" className="hover:underline">隱私</Link>
            <Link href="/terms" className="hover:underline">條款</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-empire-mute">載入中…</div>}>
      <HomeInner />
    </Suspense>
  );
}
