"use client";

import { useGame } from "@/lib/store";
import { isSpecialDay, SPECIAL_DAY_LABEL } from "@/lib/passive";
import { PageBanner } from "@/components/PageBanner";

const WEEKLY_CHALLENGES = [
  { id: "w1", title: "本週完成 15 個任務", target: 15, reward: "📜 15 任務 → +50 金幣" },
  { id: "w2", title: "本週餵寵物 10 次", target: 10, reward: "🐣 10 次餵養 → +1 SR 卡機會" },
  { id: "w3", title: "本週連續 3 天早晚儀式", target: 3, reward: "🌅 3 天連擊 → +30 愛意" },
];

export default function RitualsPage() {
  const ritual = useGame((s) => s.ritual);
  const streak = useGame((s) => s.streak);
  const submissions = useGame((s) => s.submissions);
  const toggle = useGame((s) => s.toggleRitual);
  const today = new Date().toISOString().slice(0, 10);
  const active = ritual.date === today ? ritual : { morning: false, night: false };

  // 本週進度
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);
  const thisWeekApproved = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d >= oneWeekAgo;
  }).length;

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

  const weeklyProgress = [
    { challenge: WEEKLY_CHALLENGES[0], progress: thisWeekApproved },
    { challenge: WEEKLY_CHALLENGES[1], progress: Math.min(WEEKLY_CHALLENGES[1].target, Math.floor(thisWeekApproved * 0.7)) },
    { challenge: WEEKLY_CHALLENGES[2], progress: Math.min(3, streak.current) },
  ];

  return (
    <div className="space-y-4">
      <PageBanner
        title="每日儀式"
        subtitle="晨間 + 睡前完成 → 連擊 +1 · 不斷就能累積獎勵"
        emoji="🌅"
        gradient="rose"
        stats={[
          { label: "連擊", value: `${streak.current} 天` },
          { label: "最長", value: `${streak.longest} 天` },
        ]}
      />

      {isSpecialDay() && (
        <div className="card p-3 bg-gradient-to-r from-rose-100 to-amber-100 border-2 border-empire-berry/40 text-center">
          <span className="font-bold text-empire-ink">{SPECIAL_DAY_LABEL} · 愛意指數 ×2</span>
        </div>
      )}

      <div className="card p-6 text-center bg-gradient-to-br from-empire-pink/20 to-empire-sky/20">
        <div className="text-sm text-slate-500">連續互動天數</div>
        <div className="text-6xl font-bold text-empire-ink mt-2">🔥 {streak.current}</div>
        <div className="text-sm text-slate-500 mt-1">
          歷史最長 {streak.longest} 天
          {(streak.knightShields ?? 0) > 0 && ` · 🛡 騎士盾 ×${streak.knightShields}`}
        </div>
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
        <h3 className="font-bold mb-3">📆 本週挑戰</h3>
        <div className="space-y-3">
          {weeklyProgress.map(({ challenge, progress }) => {
            const pct = Math.min(100, (progress / challenge.target) * 100);
            const done = progress >= challenge.target;
            return (
              <div key={challenge.id} className={`p-3 rounded-xl ${done ? "bg-empire-cream" : "bg-empire-mist"}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{challenge.title}</span>
                  <span className={`text-xs ${done ? "text-empire-gold font-bold" : "text-empire-mute"}`}>
                    {progress} / {challenge.target}{done && " ✓"}
                  </span>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-empire-mute mt-1">{challenge.reward}</div>
              </div>
            );
          })}
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
