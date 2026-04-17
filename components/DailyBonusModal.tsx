"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { DAILY_BONUSES } from "@/lib/loginBonus";

export function DailyBonusModal() {
  const claim = useGame((s) => s.claimDailyBonus);
  const dailyLoginDay = useGame((s) => s.dailyLoginDay);
  const [result, setResult] = useState<{ day: number; reward: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 進 dashboard 自動嘗試領取
    const r = claim();
    if (r.claimed && r.day) {
      setResult({ day: r.day, reward: r.reward ?? "" });
      setOpen(true);
    }
  }, [claim]);

  if (!open || !result) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={() => setOpen(false)}
    >
      <div className="max-w-sm w-full card p-7 text-center animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs text-empire-mute">每日登入獎勵</div>
        <h2 className="mt-1 font-display font-black text-2xl text-empire-ink">
          Day {result.day} {result.day === 7 ? "🏆" : ""}
        </h2>

        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {DAILY_BONUSES.map((b, i) => (
            <div
              key={b.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-xl ${
                i + 1 < result.day ? "bg-empire-cloud"
                : i + 1 === result.day ? "bg-empire-berry text-white animate-pop shine-ssr"
                : "bg-empire-mist opacity-40"
              }`}
            >
              {b.emoji}
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-empire-cream text-sm">
          <div className="text-empire-mute text-xs">今日獎勵</div>
          <div className="font-bold text-base mt-1">{result.reward || "💝"}</div>
        </div>

        {result.day < 7 ? (
          <p className="mt-3 text-xs text-empire-mute">連續登入至 Day 7 拿 SSR 卡機會！</p>
        ) : (
          <p className="mt-3 text-xs text-empire-gold font-semibold">🌟 完成一週登入！明天重新開始</p>
        )}

        <button onClick={() => setOpen(false)} className="mt-5 btn-primary w-full py-3">
          領取 ✨
        </button>
      </div>
    </div>
  );
}
