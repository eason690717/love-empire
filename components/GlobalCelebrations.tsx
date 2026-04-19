"use client";

/**
 * 全域慶祝動畫管理器
 * 掛在 game layout，監聽 state 變化自動觸發 CelebrationOverlay：
 *   - 寵物進化 stage up
 *   - 王國升等 kingdomLevel up
 *   - 成就解鎖 achievements 增加
 *   - 連擊里程碑 (7/14/30/100 天)
 */

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { PET_STAGE_LABEL } from "@/lib/utils";
import { CelebrationOverlay, type CelebrationKind } from "./CelebrationOverlay";

interface QueueItem {
  id: string;
  kind: CelebrationKind;
  title: string;
  subtitle?: string;
  emoji: string;
  rarity?: "N" | "R" | "SR" | "SSR";
}

export function GlobalCelebrations() {
  const petStage = useGame((s) => s.pet.stage);
  const petName = useGame((s) => s.pet.name);
  const kingdomLevel = useGame((s) => s.couple.kingdomLevel);
  const achievements = useGame((s) => s.achievements);
  const streakCurrent = useGame((s) => s.streak.current);

  const prevPetStage = useRef(petStage);
  const prevLevel = useRef(kingdomLevel);
  const prevAchievements = useRef<Set<string>>(new Set(achievements));
  const prevStreak = useRef(streakCurrent);
  const initialized = useRef(false);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const enqueue = (item: Omit<QueueItem, "id">) =>
    setQueue((q) => [...q, { ...item, id: Math.random().toString(36).slice(2, 8) }]);

  // 首次 mount 不觸發（避免初始 hydrate 誤觸發）
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      prevPetStage.current = petStage;
      prevLevel.current = kingdomLevel;
      prevAchievements.current = new Set(achievements);
      prevStreak.current = streakCurrent;
      return;
    }
  }, [petStage, kingdomLevel, achievements, streakCurrent]);

  // 寵物進化
  useEffect(() => {
    if (!initialized.current) return;
    if (petStage > prevPetStage.current) {
      const stageEmoji = ["🥚", "🐣", "🐥", "🦄", "🌟"][petStage];
      enqueue({
        kind: "evolve",
        title: `${petName} 進化了！`,
        subtitle: `${PET_STAGE_LABEL[prevPetStage.current]} → ${PET_STAGE_LABEL[petStage]}`,
        emoji: stageEmoji,
      });
    }
    prevPetStage.current = petStage;
  }, [petStage, petName]);

  // 王國升等
  useEffect(() => {
    if (!initialized.current) return;
    if (kingdomLevel > prevLevel.current) {
      enqueue({
        kind: "level-up",
        title: `王國升等 Lv.${kingdomLevel}`,
        subtitle: `從 Lv.${prevLevel.current} → Lv.${kingdomLevel}`,
        emoji: "👑",
      });
    }
    prevLevel.current = kingdomLevel;
  }, [kingdomLevel]);

  // 成就解鎖
  useEffect(() => {
    if (!initialized.current) return;
    for (const id of achievements) {
      if (!prevAchievements.current.has(id)) {
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) {
          enqueue({
            kind: "achievement",
            title: ach.title,
            subtitle: ach.description,
            emoji: ach.emoji,
          });
        }
      }
    }
    prevAchievements.current = new Set(achievements);
  }, [achievements]);

  // 連擊里程碑
  useEffect(() => {
    if (!initialized.current) return;
    const MILESTONES = [7, 14, 30, 100, 365];
    if (streakCurrent > prevStreak.current && MILESTONES.includes(streakCurrent)) {
      enqueue({
        kind: "streak",
        title: `連擊 ${streakCurrent} 天！`,
        subtitle: streakCurrent >= 100 ? "神話級堅持" : streakCurrent >= 30 ? "本月全勤" : "連續一週",
        emoji: "🔥",
      });
    }
    prevStreak.current = streakCurrent;
  }, [streakCurrent]);

  if (queue.length === 0) return null;
  const current = queue[0];
  return (
    <CelebrationOverlay
      kind={current.kind}
      title={current.title}
      subtitle={current.subtitle}
      emoji={current.emoji}
      rarity={current.rarity}
      onClose={() => setQueue((q) => q.slice(1))}
    />
  );
}
