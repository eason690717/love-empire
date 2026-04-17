"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { RARITY_CLASS } from "@/lib/utils";
import type { Rarity } from "@/lib/types";

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

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold">🖼️ 記憶圖鑑</h2>
            <p className="text-sm text-slate-500 mt-1">
              完成度 {collected} / {codex.length} · {Math.round(collected / codex.length * 100)}%
            </p>
          </div>
          <div className="text-3xl">📚</div>
        </div>
        <div className="mt-3 h-2 bg-empire-cloud rounded-full overflow-hidden">
          <div className="h-full bg-empire-pink rounded-full transition-all" style={{ width: `${collected / codex.length * 100}%` }} />
        </div>
      </div>

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
                const shineClass = owned
                  ? c.rarity === "SSR" ? "shine-ssr" : c.rarity === "SR" ? "shine-sr" : ""
                  : "";
                return (
                  <div key={c.id} className={`card p-4 text-center transition hover:-translate-y-0.5 ${shineClass} ${
                    owned ? "" : "opacity-55 grayscale"
                  }`}>
                    <div className={`text-5xl ${owned ? "" : "blur-[1.5px]"} ${owned && c.rarity === "SSR" ? "animate-float-slow" : ""}`}>
                      {owned ? c.emoji : "❓"}
                    </div>
                    <div className="mt-2 font-bold text-sm">{owned ? c.name : "？？？"}</div>
                    <div className={`inline-block mt-1 tag ${RARITY_CLASS[c.rarity]}`}>{c.rarity}</div>
                    {owned && <div className="text-xs text-empire-mute mt-1">{c.obtainedAt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      <p className="text-xs text-slate-400 text-center mt-6">
        完成任務有機率掉落記憶卡 · 節日限定卡過期不補
      </p>
    </div>
  );
}
