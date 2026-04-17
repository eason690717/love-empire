"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { ShareMomentButton } from "@/components/ShareMomentButton";
import type { MomentType } from "@/lib/types";

const FILTERS: { id: "all" | "self" | MomentType; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "self", label: "我們" },
  { id: "pet_evolve", label: "寵物進化" },
  { id: "ssr_card", label: "SSR 卡" },
  { id: "streak", label: "連擊" },
  { id: "level_up", label: "升等" },
  { id: "anniversary", label: "紀念日" },
  { id: "alliance_boss", label: "聯盟" },
];

const GRADIENTS: Record<string, string> = {
  pet_evolve: "from-fuchsia-100 via-white to-amber-100",
  ssr_card: "from-amber-100 via-pink-100 to-sky-100",
  sr_card: "from-fuchsia-100 via-white to-sky-100",
  streak: "from-rose-100 via-amber-100 to-orange-100",
  level_up: "from-sky-100 via-white to-emerald-100",
  title_up: "from-amber-100 via-white to-sky-100",
  anniversary: "from-rose-100 via-white to-fuchsia-100",
  alliance_boss: "from-slate-100 via-rose-100 to-amber-100",
  codex_complete: "from-sky-100 via-white to-fuchsia-100",
  custom: "from-empire-cloud via-white to-empire-leaf",
};

export default function PlazaPage() {
  const moments = useGame((s) => s.moments);
  const likeMoment = useGame((s) => s.likeMoment);
  const couple = useGame((s) => s.couple);
  const [filter, setFilter] = useState<string>("all");

  const filtered = moments.filter((m) => {
    if (filter === "all") return true;
    if (filter === "self") return m.isSelf;
    return m.type === filter;
  });

  return (
    <div className="space-y-4">
      <div className="card p-5 bg-gradient-to-br from-empire-cream/80 to-white">
        <h2 className="font-bold text-lg">🌸 帝國廣場</h2>
        <p className="text-xs text-empire-mute mt-1">
          全世界情侶的紀念時刻 · 可按讚、分享到自己的 LINE / 社群
        </p>
      </div>

      <div className="card p-2 flex gap-1 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === f.id ? "bg-empire-sky text-white" : "text-empire-mute hover:bg-empire-cloud"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`card p-5 bg-gradient-to-br ${GRADIENTS[m.type] ?? "from-empire-cloud via-white to-empire-leaf"} ${
              m.isSelf ? "ring-2 ring-empire-pink/60" : ""
            } ${m.type === "ssr_card" ? "shine-ssr" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl shrink-0">{m.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-empire-ink">{m.title}</div>
                {m.subtitle && <div className="text-sm text-empire-mute mt-0.5">{m.subtitle}</div>}
                <div className="mt-2 text-xs text-empire-mute flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <b className="text-empire-ink">{m.coupleName}</b>
                    {m.isSelf && <span className="tag rarity-r text-[10px] px-1.5 py-0">我們</span>}
                  </span>
                  <span>·</span>
                  <span>{m.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => likeMoment(m.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                  m.likedByMe ? "bg-empire-berry text-white" : "bg-white/70 text-empire-ink hover:bg-white"
                }`}
              >
                {m.likedByMe ? "❤️" : "🤍"} {m.likes}
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-white/70 text-empire-ink">
                💬 {m.comments}
              </button>
              <div className="flex-1" />
              <ShareMomentButton
                title={m.title}
                subtitle={m.subtitle}
                emoji={m.emoji}
                coupleName={m.coupleName}
                compact
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="card p-8 text-center text-empire-mute">這個分類還沒有動態～</p>
        )}
      </div>

      <div className="card p-5 border-2 border-dashed border-empire-sky/30 text-center">
        <div className="text-sm text-empire-mute">
          完成任務、餵寵物、連擊 7/14/30/100 天、抽到 SR/SSR 卡 ——<br />
          系統都會幫「{couple.name}」自動發動態到廣場 ✨
        </div>
      </div>
    </div>
  );
}
