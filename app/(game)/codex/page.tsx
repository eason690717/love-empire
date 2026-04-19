"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { RARITY_CLASS } from "@/lib/utils";
import type { Rarity, MemoryCard } from "@/lib/types";
import { inFestivalWindow, daysToFestival } from "@/lib/festival";
import { CardFrame } from "@/components/art/CardFrame";
import { PageBanner } from "@/components/PageBanner";

const RARITY_COLOR: Record<Rarity, string> = {
  N:   "from-slate-200 to-slate-300",
  R:   "from-sky-200 to-sky-400",
  SR:  "from-purple-300 to-pink-400",
  SSR: "from-amber-300 via-pink-300 to-indigo-300",
};
const RARITY_DROP_HINT: Record<Rarity, string> = {
  N:   "任何任務完成都可能掉落",
  R:   "需准奏的任務，~30% 機率掉落",
  SR:  "難度高/價值高的任務，~10% 機率",
  SSR: "連擊達 7/14/30 天里程碑、或 5 星問答回饋掉落",
};
const THEME_LABEL: Record<MemoryCard["theme"], string> = {
  daily: "生活", romance: "浪漫", travel: "旅行", festival: "節日限定",
};

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
  const [detail, setDetail] = useState<MemoryCard | null>(null);
  const [sortMode, setSortMode] = useState<"rarity" | "obtained" | "theme">("rarity");

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

      {/* 稀有度進度四格總覽 */}
      <div className="grid grid-cols-4 gap-2">
        {RARITY_ORDER.map((r) => {
          const total = codex.filter((c) => c.rarity === r).length;
          const got = codex.filter((c) => c.rarity === r && c.obtainedAt).length;
          const pct = total ? Math.round((got / total) * 100) : 0;
          return (
            <div key={r} className={`p-2.5 rounded-xl bg-gradient-to-br ${RARITY_COLOR[r]} text-center text-white shadow-sm`}>
              <div className="text-[10px] font-black opacity-90">{r}</div>
              <div className="font-display font-black text-lg leading-none mt-0.5">{got}/{total}</div>
              <div className="text-[9px] opacity-80 mt-0.5">{pct}%</div>
            </div>
          );
        })}
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

      <div className="space-y-2">
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
        <div className="flex gap-1 overflow-x-auto">
          <span className="text-[10px] text-empire-mute py-1.5 pr-1">排序：</span>
          {([
            { id: "rarity", label: "依稀有度" },
            { id: "obtained", label: "依收集時間" },
            { id: "theme", label: "依主題" },
          ] as const).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortMode(s.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                sortMode === s.id ? "bg-empire-berry text-white" : "bg-white text-empire-mute border border-empire-cloud"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 依排序模式顯示 */}
      {sortMode === "rarity" && RARITY_ORDER.map((r) => (
        byRarity[r].length > 0 && (
          <CardGroup
            key={r}
            title={r}
            count={{ owned: byRarity[r].filter((c) => c.obtainedAt).length, total: byRarity[r].length }}
            rarityClass={RARITY_CLASS[r]}
            cards={byRarity[r]}
            onPick={setDetail}
          />
        )
      ))}

      {sortMode === "obtained" && (
        <CardGroup
          title="收集時間倒序"
          count={{ owned: filtered.filter((c) => c.obtainedAt).length, total: filtered.length }}
          rarityClass="rarity-n"
          cards={[...filtered].sort((a, b) => {
            const ao = a.obtainedAt ?? ""; const bo = b.obtainedAt ?? "";
            if (!ao && !bo) return 0;
            if (!ao) return 1; if (!bo) return -1;
            return bo.localeCompare(ao);
          })}
          onPick={setDetail}
        />
      )}

      {sortMode === "theme" && (["daily", "romance", "travel", "festival"] as const).map((t) => {
        const items = filtered.filter((c) => c.theme === t);
        if (items.length === 0) return null;
        return (
          <CardGroup
            key={t}
            title={THEME_LABEL[t]}
            count={{ owned: items.filter((c) => c.obtainedAt).length, total: items.length }}
            rarityClass="rarity-n"
            cards={items}
            onPick={setDetail}
          />
        );
      })}

      <p className="text-xs text-empire-mute text-center mt-6">
        完成任務有機率掉落記憶卡 · 節日限定卡只在節日前後開放 · 點卡查看詳情
      </p>

      {detail && <CardDetailModal card={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function CardGroup({
  title, count, rarityClass, cards, onPick,
}: {
  title: string;
  count: { owned: number; total: number };
  rarityClass: string;
  cards: MemoryCard[];
  onPick: (c: MemoryCard) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`tag ${rarityClass} font-bold px-2 py-0.5`}>{title}</span>
        <span className="text-xs text-slate-500">{count.owned} / {count.total}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((c) => {
          const owned = !!c.obtainedAt;
          const inWindow = inFestivalWindow(c);
          const locked = !owned && c.festival && !inWindow;
          return (
            <button
              key={c.id}
              onClick={() => onPick(c)}
              className="text-left"
            >
              <CardFrame rarity={c.rarity} owned={owned} className="text-center transition hover:-translate-y-0.5 cursor-pointer">
                {locked && (
                  <div className="absolute top-2 left-2 text-xs">🔒</div>
                )}
                <div className={`text-5xl ${owned ? "" : "blur-[1.5px]"} ${owned && c.rarity === "SSR" ? "animate-float-slow" : ""}`}>
                  {owned ? c.emoji : "❓"}
                </div>
                <div className="mt-2 font-bold text-sm">{owned ? c.name : "？？？"}</div>
                {c.festival && (
                  <div className="text-[10px] text-empire-mute mt-1">🎊 {c.festival.label}</div>
                )}
                {owned && <div className="text-xs text-empire-mute mt-1">{c.obtainedAt}</div>}
              </CardFrame>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardDetailModal({ card, onClose }: { card: MemoryCard; onClose: () => void }) {
  const owned = !!card.obtainedAt;
  const inWindow = inFestivalWindow(card);
  const days = card.festival ? daysToFestival(card) : null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="max-w-sm w-full card p-6 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, ${
            card.rarity === "SSR" ? "#fff1c4, #ffb8de, #b8d8ff" :
            card.rarity === "SR" ? "#e9d5ff, #fbcfe8" :
            card.rarity === "R" ? "#bae6fd, #dbeafe" :
            "#e5e7eb, #f3f4f6"
          })`,
        }}
      >
        <button onClick={onClose} className="absolute top-3 right-4 text-empire-mute hover:text-empire-ink">✕</button>

        <div className={`tag ${RARITY_CLASS[card.rarity]} font-black text-sm mb-3`}>{card.rarity}</div>

        <div className={`text-8xl my-4 ${owned ? "" : "blur-[3px] opacity-60"} ${owned && card.rarity === "SSR" ? "animate-float-slow" : ""}`}>
          {owned ? card.emoji : "❓"}
        </div>

        <div className="font-display font-black text-2xl text-empire-ink">
          {owned ? card.name : "？？？"}
        </div>
        <div className="text-xs text-empire-mute mt-1">{THEME_LABEL[card.theme]}</div>

        {card.festival && (
          <div className="mt-3 p-2 rounded-xl bg-white/60 text-xs">
            🎊 <b>{card.festival.label}</b> · {card.festival.month}/{card.festival.day}（前後 {card.festival.window} 天）
            {!owned && (
              inWindow ? <div className="text-empire-berry font-bold mt-1">✨ 目前開放中</div>
              : <div className="text-empire-mute mt-1">距離開放 {days} 天</div>
            )}
          </div>
        )}

        {owned ? (
          <div className="mt-4 p-3 rounded-xl bg-white/80">
            <div className="text-[10px] text-empire-mute">收集於</div>
            <div className="font-bold text-sm">{card.obtainedAt}</div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-white/80 text-xs text-left">
            <div className="font-bold mb-1">💡 如何取得</div>
            <div className="text-empire-mute">{RARITY_DROP_HINT[card.rarity]}</div>
          </div>
        )}

        <button onClick={onClose} className="mt-5 btn-primary w-full py-2.5 font-bold">
          關閉
        </button>
      </div>
    </div>
  );
}
