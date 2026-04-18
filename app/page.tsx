"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSupabaseEnabled } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseEnabled()) { setChecking(false); return; }
    (async () => {
      const u = await getSession();
      if (u) { router.replace("/dashboard"); return; }
      setChecking(false);
    })();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center text-empire-mute">
        載入中…
      </main>
    );
  }

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
            <span className="sprout-dot" /> v0.1 alpha · {isSupabaseEnabled() ? "已連雲端" : "資料存於你的瀏覽器"}
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
