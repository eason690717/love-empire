"use client";

import { useGame } from "@/lib/store";

export default function RitualsPage() {
  const ritual = useGame((s) => s.ritual);
  const streak = useGame((s) => s.streak);
  const toggle = useGame((s) => s.toggleRitual);
  const today = new Date().toISOString().slice(0, 10);
  const active = ritual.date === today ? ritual : { morning: false, night: false };

  const steps = [
    { id: "morning" as const, icon: "🌅", label: "晨間簽到", desc: "第一件事，對彼此說聲早安", done: active.morning },
    { id: "night" as const, icon: "🌙", label: "睡前話語", desc: "睡前一句情話，一個擁抱", done: active.night },
  ];

  const rewardLadder = [
    { days: 3, reward: "+10 金幣", unlocked: streak.current >= 3 },
    { days: 7, reward: "R 記憶卡", unlocked: streak.current >= 7 },
    { days: 14, reward: "SR 記憶卡 + 50 金幣", unlocked: streak.current >= 14 },
    { days: 30, reward: "SSR 節日限定卡", unlocked: streak.current >= 30 },
    { days: 100, reward: "神話級稱號", unlocked: streak.current >= 100 },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center bg-gradient-to-br from-empire-pink/20 to-empire-sky/20">
        <div className="text-sm text-slate-500">連續互動天數</div>
        <div className="text-6xl font-bold text-empire-ink mt-2">🔥 {streak.current}</div>
        <div className="text-sm text-slate-500 mt-1">歷史最長 {streak.longest} 天</div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">今日儀式</h3>
        <div className="space-y-3">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition ${
                s.done
                  ? "border-empire-sky bg-empire-cloud"
                  : "border-empire-cloud hover:border-empire-sky/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{s.icon}</div>
                <div className="flex-1">
                  <div className="font-bold">{s.label}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  s.done ? "bg-empire-sky border-empire-sky text-white" : "border-empire-cloud"
                }`}>
                  {s.done && "✓"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">連擊獎勵階梯</h3>
        <div className="space-y-2">
          {rewardLadder.map((r) => (
            <div key={r.days} className={`p-3 rounded-xl flex items-center justify-between ${
              r.unlocked ? "bg-empire-cream" : "bg-empire-cloud/50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white">
                  {r.days}
                </div>
                <div className="text-sm">{r.reward}</div>
              </div>
              {r.unlocked ? (
                <span className="text-empire-gold text-sm font-semibold">已達成 ✓</span>
              ) : (
                <span className="text-xs text-slate-400">還差 {r.days - streak.current} 天</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
