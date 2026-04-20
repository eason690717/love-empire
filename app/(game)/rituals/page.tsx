"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { isSpecialDay, SPECIAL_DAY_LABEL } from "@/lib/passive";
import { PageBanner } from "@/components/PageBanner";

const DEFAULT_RITUALS = {
  morning: { label: "晨間簽到", desc: "第一件事，對彼此說聲早安", emoji: "🌅" },
  night:   { label: "睡前話語", desc: "睡前一句情話，一個擁抱",       emoji: "🌙" },
};

function campfireForStreak(days: number): { emoji: string; glow: string; label: string } {
  if (days >= 100) return { emoji: "🌋", glow: "from-rose-300 via-amber-200 to-rose-200", label: "神話之炎" };
  if (days >= 30)  return { emoji: "🎆", glow: "from-amber-200 via-rose-100 to-amber-100", label: "盛典焰火" };
  if (days >= 14)  return { emoji: "🔥🔥", glow: "from-orange-200 via-amber-100 to-rose-100", label: "熱戀營火" };
  if (days >= 7)   return { emoji: "🔥", glow: "from-amber-100 to-rose-100", label: "持續燃燒" };
  if (days >= 1)   return { emoji: "🪵🔥", glow: "from-amber-50 to-empire-cream", label: "剛點燃" };
  return { emoji: "🪵", glow: "from-empire-cloud to-white", label: "等你點火" };
}

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
  const customRituals = useGame((s) => s.customRituals);
  const setCustomRitual = useGame((s) => s.setCustomRitual);
  const today = new Date().toISOString().slice(0, 10);
  const active = ritual.date === today ? ritual : { morning: false, night: false };
  const [editing, setEditing] = useState<"morning" | "night" | null>(null);
  const fire = campfireForStreak(streak.current);

  // 本週進度
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);
  const thisWeekApproved = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d >= oneWeekAgo;
  }).length;

  const morningContent = customRituals.morning ?? DEFAULT_RITUALS.morning;
  const nightContent = customRituals.night ?? DEFAULT_RITUALS.night;
  const steps = [
    { id: "morning" as const, icon: morningContent.emoji, label: morningContent.label, desc: morningContent.desc, done: active.morning, isCustom: !!customRituals.morning },
    { id: "night" as const,   icon: nightContent.emoji,   label: nightContent.label,   desc: nightContent.desc,   done: active.night,   isCustom: !!customRituals.night },
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

      {/* 7 日日曆視覺化 — 最近 7 天連擊狀態 */}
      <StreakCalendar current={streak.current} lastDate={streak.lastDate} />

      <div className={`card p-6 text-center bg-gradient-to-br ${fire.glow}`}>
        <div className="text-sm text-slate-500">連續互動天數 · {fire.label}</div>
        <div className="text-7xl mt-2 leading-none" style={{ filter: "drop-shadow(0 4px 8px rgba(255,120,50,0.35))" }}>
          {fire.emoji}
        </div>
        <div className="text-5xl font-black text-empire-ink mt-2 font-display">{streak.current}<span className="text-xl text-empire-mute ml-1">天</span></div>
        <div className="text-sm text-slate-500 mt-1">
          歷史最長 {streak.longest} 天
          {(streak.knightShields ?? 0) > 0 && ` · 🛡 騎士盾 ×${streak.knightShields}`}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">今日儀式</h3>
          <span className="text-[10px] text-empire-mute">點 ✎ 可以改成你們自己的儀式</span>
        </div>
        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.id} className="relative">
              <button
                onClick={() => toggle(s.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition ${
                  s.done ? "border-empire-sky bg-empire-cloud" : "border-empire-cloud hover:border-empire-sky/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-1">
                      {s.label}
                      {s.isCustom && <span className="text-[10px] text-empire-berry">自訂</span>}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{s.desc}</div>
                  </div>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    s.done ? "bg-empire-sky border-empire-sky text-white" : "border-empire-cloud"
                  }`}>
                    {s.done && "✓"}
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(s.id); }}
                className="absolute top-2 right-12 text-xs text-empire-mute hover:text-empire-ink px-2 py-1"
                title="編輯儀式內容"
              >✎</button>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <RitualEditor
          kind={editing}
          current={(editing === "morning" ? customRituals.morning : customRituals.night) ?? DEFAULT_RITUALS[editing]}
          isCustom={!!(editing === "morning" ? customRituals.morning : customRituals.night)}
          onSave={(v) => { setCustomRitual(editing, v); setEditing(null); }}
          onReset={() => { setCustomRitual(editing, null); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}

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
        <h3 className="font-bold mb-3">🔥 連擊獎勵階梯</h3>
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

function StreakCalendar({ current, lastDate }: { current: number; lastDate: string }) {
  const today = new Date();
  const days: Array<{ dateLabel: string; iso: string; done: boolean; isToday: boolean }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const isToday = i === 0;
    const lastD = lastDate ? new Date(lastDate) : null;
    const daysSinceLast = lastD ? Math.floor((today.getTime() - lastD.getTime()) / 86400000) : 999;
    const dayIndex = 6 - i;
    const doneForThis = dayIndex >= (7 - current) && daysSinceLast <= i;
    days.push({
      dateLabel: `${d.getMonth() + 1}/${d.getDate()}`,
      iso,
      done: doneForThis,
      isToday,
    });
  }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-empire-ink text-sm">📅 最近 7 天連擊</h3>
        <div className="text-[10px] text-empire-mute">🔥 完成 / 👀 今日 / · 未完成</div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-lg transition ${
              d.done
                ? d.isToday
                  ? "bg-gradient-to-br from-amber-300 via-rose-300 to-fuchsia-300 text-white shadow-md scale-110"
                  : "bg-gradient-to-br from-rose-200 to-pink-200"
                : d.isToday
                  ? "bg-white border-2 border-dashed border-empire-gold"
                  : "bg-empire-mist"
            }`}>
              {d.done ? "🔥" : d.isToday ? "👀" : "·"}
            </div>
            <div className={`text-[9px] ${d.isToday ? "font-black text-empire-berry" : "text-empire-mute"}`}>
              {d.isToday ? "今天" : d.dateLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RitualEditor({
  kind, current, isCustom, onSave, onReset, onClose,
}: {
  kind: "morning" | "night";
  current: { label: string; desc: string; emoji: string };
  isCustom: boolean;
  onSave: (v: { label: string; desc: string; emoji: string }) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(current.label);
  const [desc, setDesc] = useState(current.desc);
  const [emoji, setEmoji] = useState(current.emoji);
  const emojiChoices = kind === "morning"
    ? ["🌅", "☕", "🌞", "🥐", "🧘", "💌", "🐣"]
    : ["🌙", "🕯️", "🛁", "📖", "🫂", "🌠", "🍵"];

  const canSave = label.trim().length > 0 && desc.trim().length > 0;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="card max-w-sm w-full p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">編輯{kind === "morning" ? "晨間" : "睡前"}儀式</h3>
        <div>
          <div className="text-xs text-empire-mute mb-1">圖示</div>
          <div className="flex gap-2 flex-wrap">
            {emojiChoices.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl w-10 h-10 rounded-xl border-2 ${emoji === e ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-empire-mute mb-1">儀式名稱</div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.slice(0, 20))}
            className="w-full border-2 border-empire-cloud rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-empire-sky"
            maxLength={20}
            placeholder="例：一起煮早餐"
          />
        </div>
        <div>
          <div className="text-xs text-empire-mute mb-1">描述</div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value.slice(0, 60))}
            rows={2}
            className="w-full border-2 border-empire-cloud rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
            maxLength={60}
            placeholder="例：煮兩杯咖啡，一起看窗外"
          />
          <div className="text-[10px] text-right text-empire-mute">{desc.length}/60</div>
        </div>
        <div className="flex gap-2 pt-2">
          {isCustom && (
            <button onClick={onReset} className="btn-ghost py-2 px-3 text-xs">重設為預設</button>
          )}
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-sm">取消</button>
          <button
            onClick={() => onSave({ label: label.trim(), desc: desc.trim(), emoji })}
            disabled={!canSave}
            className="btn-primary flex-1 py-2 font-semibold disabled:opacity-40"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}
