"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { ACHIEVEMENTS, type AchievementCategory } from "@/lib/achievements";
import { TrophyMedal, tierForAchievement } from "@/components/art/TrophyMedal";

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
      <div className="card p-5 bg-gradient-to-br from-empire-sunshine/15 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold">🏅 獎盃陳列室</h2>
            <p className="text-xs text-empire-mute mt-1">
              解鎖 {achievements.length} / {ACHIEVEMENTS.length} · {Math.round(achievements.length / ACHIEVEMENTS.length * 100)}%
            </p>
          </div>
          <div className="text-4xl">🏆</div>
        </div>
        <div className="mt-3 bar-bg">
          <div className="bar-fill" style={{ width: `${achievements.length / ACHIEVEMENTS.length * 100}%` }} />
        </div>
      </div>

      <div className="card p-2 flex gap-1 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium ${
              cat === c.id ? "bg-empire-sky text-white" : "text-empire-mute hover:bg-empire-cloud"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {unlocked.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-empire-ink">✅ 已解鎖 ({unlocked.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlocked.map((a) => (
              <div key={a.id} className="card p-4 text-center">
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
          <h3 className="text-sm font-bold text-empire-ink mt-4">🔒 未解鎖 ({locked.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((a) => (
              <div key={a.id} className="card p-4 text-center opacity-50 grayscale">
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
