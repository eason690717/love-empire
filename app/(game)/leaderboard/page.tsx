"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";

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

  return (
    <div className="space-y-4">
      <div className="card p-5 bg-gradient-to-br from-empire-cream/80 to-white">
        <h2 className="font-bold text-lg">🏆 情侶排行榜</h2>
        <p className="text-xs text-slate-500 mt-1">週榜每週一結算 · 前三名獎勵 SSR 限定記憶卡</p>

        <div className="mt-4 flex gap-1 overflow-x-auto">
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

      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className={`card p-4 flex items-center gap-3 ${
              c.isSelf ? "ring-2 ring-empire-pink/60" : ""
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
              i === 0 ? "bg-empire-gold/30 text-empire-gold text-lg"
              : i === 1 ? "bg-slate-300 text-slate-700"
              : i === 2 ? "bg-amber-200 text-amber-700"
              : "bg-empire-cloud text-slate-500"
            }`}>
              {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
            </div>
            <div className="text-3xl">{c.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">
                {c.name}
                {c.isSelf && <span className="ml-2 text-xs text-empire-pink">(我們)</span>}
              </div>
              <div className="text-xs text-slate-500">{c.title} · Lv.{c.kingdomLevel}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-empire-sky">
                {c[metric].toLocaleString()}{m.suffix}
              </div>
              <div className="text-xs text-slate-400">{m.icon} {m.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
