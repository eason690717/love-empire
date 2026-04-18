"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { RARITY_CLASS } from "@/lib/utils";
import type { Rarity } from "@/lib/types";
import { inFestivalWindow, daysToFestival } from "@/lib/festival";
import { CardFrame } from "@/components/art/CardFrame";
import { PageBanner } from "@/components/PageBanner";

const THEMES = [
  { id: "all", label: "全部" },
  { id: "daily", label: "生活" },
  { id: "romance", label: "浪漫" },
  { id: "travel", label: "旅行" },
  { id: "festival", label: "節日" },
] as const;

const RARITY_ORDER: Rarity[] = ["SSR", "SR", "R", "N"];

export default function CodexPage() {
  const codex = useGame((s) => s.codex);
  const [theme, setTheme] = useState<string>("all");

  const filtered = codex.filter((c) => theme === "all" || c.theme === theme);
  const collected = codex.filter((c) => c.obtainedAt).length;

  const byRarity: Record<Rarity, typeof codex> = { N: [], R: [], SR: [], SSR: [] };
  for (const c of filtered) byRarity[c.rarity].push(c);

  // 即將到期的節日
  const upcomingFestivals = codex
    .filter((c) => c.festival && !c.obtainedAt)
    .map((c) => ({ card: c, days: daysToFestival(c) ?? 999 }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const completionPct = Math.round(collected / codex.length * 100);
  const ssrCount = codex.filter((c) => c.obtainedAt && c.rarity === "SSR").length;
  const srCount = codex.filter((c) => c.obtainedAt && c.rarity === "SR").length;

  return (
    <div className="space-y-4">
      <PageBanner
        title="記憶圖鑑"
        subtitle={`完成度 ${completionPct}% · 節日限定卡過期不補`}
        emoji="🎴"
        gradient="violet"
        stats={[
          { label: "已收集", value: `${collected}/${codex.length}` },
          { label: "SSR", value: ssrCount },
          { label: "SR", value: srCount },
        ]}
      />

      <div className="card p-3">
        <div className="flex justify-between items-center text-xs text-empire-mute mb-1">
          <span>📚 收藏進度</span>
          <span className="font-bold">{completionPct}%</span>
        </div>
        <div className="bar-bg">
          <div className="bar-fill" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {upcomingFestivals.length > 0 && (
        <div className="card p-4 bg-gradient-to-br from-empire-cream/60 to-white">
          <h3 className="font-bold text-sm mb-2">⏰ 即將到來的節日限定</h3>
          <div className="flex gap-2 overflow-x-auto">
            {upcomingFestivals.map(({ card, days }) => {
              const inWindow = inFestivalWindow(card);
              return (
                <div key={card.id} className="shrink-0 w-36 p-3 rounded-xl bg-white border border-empire-cloud">
                  <div className="text-3xl text-center">{card.emoji}</div>
                  <div className="text-xs font-bold mt-1 text-center truncate">{card.name}</div>
                  <div className="text-[10px] text-center text-empire-mute mt-0.5">
                    {inWindow ? (
                      <span className="text-empire-berry font-bold">✨ 開放中</span>
                    ) : (
                      `距離開放 ${days} 天`
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card p-2 flex gap-1 overflow-x-auto">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium ${
              theme === t.id ? "bg-empire-sky text-white" : "text-slate-600 hover:bg-empire-cloud"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {RARITY_ORDER.map((r) => (
        byRarity[r].length > 0 && (
          <div key={r}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`tag ${RARITY_CLASS[r]} font-bold px-2 py-0.5`}>{r}</span>
              <span className="text-xs text-slate-500">{byRarity[r].filter((c) => c.obtainedAt).length} / {byRarity[r].length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {byRarity[r].map((c) => {
                const owned = !!c.obtainedAt;
                const inWindow = inFestivalWindow(c);
                const locked = !owned && c.festival && !inWindow;
                return (
                  <CardFrame key={c.id} rarity={c.rarity} owned={owned} className="text-center transition hover:-translate-y-0.5">
                    {locked && (
                      <div className="absolute top-2 left-2 text-xs">🔒</div>
                    )}
                    <div className={`text-5xl ${owned ? "" : "blur-[1.5px]"} ${owned && c.rarity === "SSR" ? "animate-float-slow" : ""}`}>
                      {owned ? c.emoji : "❓"}
                    </div>
                    <div className="mt-2 font-bold text-sm">{owned ? c.name : "？？？"}</div>
                    {c.festival && (
                      <div className="text-[10px] text-empire-mute mt-1">
                        🎊 {c.festival.label}
                      </div>
                    )}
                    {owned && <div className="text-xs text-empire-mute mt-1">{c.obtainedAt}</div>}
                  </CardFrame>
                );
              })}
            </div>
          </div>
        )
      ))}

      <p className="text-xs text-empire-mute text-center mt-6">
        完成任務有機率掉落記憶卡 · 節日限定卡只在節日前後開放
      </p>
    </div>
  );
}
