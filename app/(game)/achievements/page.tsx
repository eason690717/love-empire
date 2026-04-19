"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { ACHIEVEMENTS, type AchievementCategory } from "@/lib/achievements";
import { TrophyMedal, tierForAchievement } from "@/components/art/TrophyMedal";
import { PageBanner } from "@/components/PageBanner";

const CATEGORIES: { id: "all" | AchievementCategory; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "growth", label: "成長" },
  { id: "collect", label: "收集" },
  { id: "social", label: "社交" },
  { id: "combat", label: "戰鬥" },
  { id: "special", label: "特殊" },
];

export default function AchievementsPage() {
  const achievements = useGame((s) => s.achievements);
  const checkAchievements = useGame((s) => s.checkAchievements);
  const [cat, setCat] = useState<"all" | AchievementCategory>("all");

  // 進頁面就做一次檢查（保險）
  if (typeof window !== "undefined" && achievements) {
    setTimeout(() => checkAchievements(), 0);
  }

  const filtered = cat === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.category === cat);
  const unlocked = filtered.filter((a) => achievements.includes(a.id));
  const locked = filtered.filter((a) => !achievements.includes(a.id));

  return (
    <div className="space-y-4">
      <PageBanner
        title="獎盃陳列"
        subtitle={`解鎖 ${Math.round(achievements.length / ACHIEVEMENTS.length * 100)}% · 收集所有徽章`}
        emoji="🏅"
        gradient="sunshine"
        stats={[
          { label: "已解鎖", value: `${achievements.length}/${ACHIEVEMENTS.length}` },
          { label: "彩虹級", value: ACHIEVEMENTS.filter((a) => achievements.includes(a.id) && a.category === "special").length },
        ]}
      />

      <div className="card p-3">
        <div className="flex justify-between items-center text-xs text-empire-mute mb-1">
          <span>🏆 收藏進度</span>
          <span className="font-bold">{achievements.length} / {ACHIEVEMENTS.length}</span>
        </div>
        <div className="bar-bg">
          <div className="bar-fill" style={{ width: `${achievements.length / ACHIEVEMENTS.length * 100}%` }} />
        </div>
      </div>

      <div className="card p-2 flex gap-1 overflow-x-auto">
        {CATEGORIES.map((c) => {
          const total = c.id === "all" ? ACHIEVEMENTS.length : ACHIEVEMENTS.filter((a) => a.category === c.id).length;
          const got = c.id === "all"
            ? achievements.length
            : ACHIEVEMENTS.filter((a) => a.category === c.id && achievements.includes(a.id)).length;
          const pct = total > 0 ? Math.round((got / total) * 100) : 0;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                cat === c.id ? "bg-empire-sky text-white" : "text-empire-mute hover:bg-empire-cloud"
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] font-black ${cat === c.id ? "text-white/80" : "text-empire-gold"}`}>
                {got}/{total}
              </span>
              {pct === 100 && <span className="text-[10px]">✨</span>}
            </button>
          );
        })}
      </div>

      {unlocked.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-empire-ink flex items-center gap-2">
            ✅ 已解鎖 <span className="text-empire-gold">({unlocked.length})</span>
            {unlocked.length === filtered.length && <span className="text-[10px] px-2 py-0.5 rounded-full bg-empire-gold text-white font-bold animate-pulse">本類全通 ✨</span>}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlocked.map((a, i) => (
              <div
                key={a.id}
                className="card p-4 text-center hover:shadow-lift transition"
                style={{ animationDelay: `${i * 30}ms`, animation: "fadeInUp 0.35s ease-out backwards" }}
              >
                <div className="flex justify-center animate-bob">
                  <TrophyMedal tier={tierForAchievement(a.category, a.id)} emoji={a.emoji} size={64} />
                </div>
                <div className="font-bold text-sm mt-2">{a.title}</div>
                <div className="text-xs text-empire-mute mt-0.5">{a.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-empire-ink mt-4 flex items-center gap-2">
            🔒 未解鎖 <span className="text-empire-mute">({locked.length})</span>
            {unlocked.length === 0 && <span className="text-[10px] text-empire-mute italic">· 完成任務 / 問答 / 儀式會自動解鎖</span>}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((a, i) => (
              <div
                key={a.id}
                className="card p-4 text-center opacity-50 grayscale"
                style={{ animationDelay: `${i * 20}ms`, animation: "fadeInUp 0.35s ease-out backwards" }}
              >
                <div className="flex justify-center blur-[1.5px]">
                  <TrophyMedal tier="bronze" emoji="❓" size={64} />
                </div>
                <div className="font-bold text-sm mt-2">{a.title}</div>
                <div className="text-xs text-empire-mute mt-0.5">{a.description}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
