"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";

type Metric = "loveIndex" | "kingdomLevel" | "streak" | "codexCompletion" | "weeklyTasks";

const METRICS: { id: Metric; label: string; icon: string; suffix: string }[] = [
  { id: "loveIndex",       label: "愛意指數",   icon: "💞", suffix: "" },
  { id: "kingdomLevel",    label: "王國等級",   icon: "👑", suffix: "" },
  { id: "streak",          label: "連擊天數",   icon: "🔥", suffix: " 天" },
  { id: "codexCompletion", label: "圖鑑完成度", icon: "🖼️", suffix: " %" },
  { id: "weeklyTasks",     label: "本週任務",   icon: "📜", suffix: " 個" },
];

const GROUPS = [
  { id: "all",      label: "全部" },
  { id: "novice",   label: "新手榜 Lv<10" },
  { id: "mid",      label: "進階榜 10-30" },
  { id: "master",   label: "大師榜 30+" },
];

export default function LeaderboardPage() {
  const leaderboard = useGame((s) => s.leaderboard);
  const couple = useGame((s) => s.couple);
  const [metric, setMetric] = useState<Metric>("loveIndex");
  const [group, setGroup] = useState("all");

  const filtered = leaderboard
    .filter((c) => {
      // 私人情侶不上榜；自己如果設為 private 則顯示「你選擇不上榜」
      if (c.isSelf && couple.privacy === "private") return false;
      if (group === "novice") return c.kingdomLevel < 10;
      if (group === "mid") return c.kingdomLevel >= 10 && c.kingdomLevel < 30;
      if (group === "master") return c.kingdomLevel >= 30;
      return true;
    })
    .slice()
    .sort((a, b) => b[metric] - a[metric]);

  const m = METRICS.find((x) => x.id === metric)!;

  const myRank = leaderboard.findIndex((c) => c.isSelf) + 1;

  return (
    <div className="space-y-4">
      <PageBanner
        title="情侶排行榜"
        subtitle="每週一結算 · 前三名獎勵 SSR 限定記憶卡"
        emoji="🏆"
        gradient="sunshine"
        stats={[
          { label: "我的名次", value: myRank > 0 ? `第 ${myRank} 名` : "未上榜" },
          { label: "愛意", value: couple.loveIndex.toLocaleString() },
        ]}
      />

      <div className="card p-4 bg-gradient-to-br from-empire-cream/80 to-white">
        <div className="flex gap-1 overflow-x-auto">
          {METRICS.map((x) => (
            <button
              key={x.id}
              onClick={() => setMetric(x.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
                metric === x.id ? "bg-empire-sky text-white" : "bg-white text-slate-600 hover:bg-empire-cloud"
              }`}
            >
              {x.icon} {x.label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-1 overflow-x-auto">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroup(g.id)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs ${
                group === g.id ? "bg-empire-pink/60 text-white" : "text-slate-500 hover:bg-empire-cloud"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {couple.privacy === "private" && (
        <div className="card p-3 bg-empire-cream/60 text-xs text-empire-ink flex items-center gap-2">
          🔒 <span>你在設定中選了「完全不公開」，不會出現在排行榜。可到 <a className="text-empire-sky underline" href="/settings">設定</a> 改</span>
        </div>
      )}

      {/* 冠軍 spotlight (只在排第 1 時顯示) */}
      {filtered[0] && (
        <div
          className="relative card p-5 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ffd447, #ff9052, #ff4f7e)" }}
        >
          <div className="absolute top-2 right-3 text-4xl animate-sparkle opacity-80">✨</div>
          <div className="absolute bottom-2 left-4 text-3xl animate-sparkle opacity-70" style={{ animationDelay: "0.6s" }}>💫</div>
          <div className="flex items-center gap-4 relative">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center text-5xl shadow-lg animate-bob">
              {filtered[0].emoji}
            </div>
            <div className="flex-1 min-w-0 text-white">
              <div className="text-[10px] font-black tracking-widest opacity-90">👑 CHAMPION</div>
              <div className="font-display font-black text-xl truncate">{filtered[0].name}</div>
              <div className="text-xs opacity-90">{filtered[0].title} · Lv.{filtered[0].kingdomLevel}</div>
              <div className="mt-1 text-lg font-black">
                {filtered[0][metric].toLocaleString()}{m.suffix}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((c, i) => {
          const isTopThree = i < 3;
          const isChampion = i === 0;
          return (
            <div
              key={c.id}
              className={`card p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 ${
                c.isSelf ? "ring-2 ring-empire-pink/60 bg-gradient-to-r from-rose-50 to-white" : ""
              } ${isChampion ? "ring-2 ring-empire-gold/80 shadow-lg" : ""}`}
              style={{ animationDelay: `${i * 50}ms`, animation: "fadeInUp 0.4s ease-out backwards" }}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0 relative ${
                i === 0 ? "bg-gradient-to-br from-empire-gold to-empire-sunshine text-white text-xl shadow-md animate-pulse"
                : i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white text-lg shadow-sm"
                : i === 2 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg shadow-sm"
                : "bg-empire-cloud text-slate-600"
              }`}>
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                {isTopThree && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-empire-sunshine animate-sparkle" />
                )}
              </div>
              <div className="text-3xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate flex items-center gap-1">
                  {c.name}
                  {c.isSelf && <span className="text-[10px] px-1.5 py-0.5 bg-empire-pink text-white rounded-full">(我們)</span>}
                  {isChampion && <span className="text-[10px] px-1.5 py-0.5 bg-empire-gold text-white rounded-full animate-pulse">👑</span>}
                </div>
                <div className="text-xs text-slate-500">{c.title} · Lv.{c.kingdomLevel}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`font-black ${isChampion ? "text-empire-gold text-lg" : "text-empire-sky"}`}>
                  {c[metric].toLocaleString()}{m.suffix}
                </div>
                <div className="text-xs text-slate-400">{m.icon} {m.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
