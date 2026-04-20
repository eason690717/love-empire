import type { Pet } from "@/lib/types";
import { RARITY, resolveRarity } from "./rarity";

/**
 * 寵物 Level 系統（stage 內細級 1-99）
 *
 * - stage 是五大進化關卡（蛋/幼/成/傳說/神話）
 * - level 是 stage 內的細級：1-99，隨 petXp 累積升級
 * - stage up 時 level reset 為 1，保留 totalXp
 *
 * XP 曲線：level N → N+1 需要 xpForLevel(N) XP
 *   用 `10 * level * 1.25^(level/10)` 讓前期快、後期慢
 */

export const MAX_LEVEL = 99;

export function xpForLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  // 10 / 13 / 17 / 22 / 29 / 37 / 48 / 62 ... 穩定 1.3x 成長
  return Math.round(10 * level * Math.pow(1.25, level / 10));
}

/** 累積 XP 到達某 level 需要的總 XP（方便畫進度條用） */
export function cumulativeXpForLevel(level: number): number {
  let sum = 0;
  for (let i = 1; i < level; i++) sum += xpForLevel(i);
  return sum;
}

export interface AddXpResult {
  pet: Pet;
  leveledUp: boolean;
  levelsGained: number;
  newLevel: number;
}

/** 給寵物加 XP，處理自動升級（可跨多級） */
export function addPetXp(pet: Pet, xp: number): AddXpResult {
  const startLevel = pet.level ?? 1;
  let curLevel = startLevel;
  let curXp = (pet.petXp ?? 0) + xp;
  const curTotal = (pet.totalXp ?? 0) + xp;

  while (curLevel < MAX_LEVEL && curXp >= xpForLevel(curLevel)) {
    curXp -= xpForLevel(curLevel);
    curLevel += 1;
  }

  return {
    pet: { ...pet, level: curLevel, petXp: curXp, totalXp: curTotal },
    leveledUp: curLevel > startLevel,
    levelsGained: curLevel - startLevel,
    newLevel: curLevel,
  };
}

/** Level 解鎖特技（使用者可看到清楚的 level reward） */
export interface LevelPerk {
  level: number;
  title: string;
  desc: string;
  emoji: string;
}

export const LEVEL_PERKS: LevelPerk[] = [
  { level: 5,  title: "初級散步", desc: "散步 XP +10%", emoji: "🚶" },
  { level: 10, title: "尋寶直覺", desc: "尋寶幸運 +1",   emoji: "🧭" },
  { level: 15, title: "情侶共鳴", desc: "雙人步數 ×1.7（原 ×1.5）", emoji: "💞" },
  { level: 25, title: "步數加成", desc: "每 1000 步 +1 XP（原 +3→+4）", emoji: "👣" },
  { level: 35, title: "寶箱達人", desc: "銀寶機率 +5%", emoji: "🎁" },
  { level: 50, title: "MIT 優先", desc: "MIT coin 成本 -15%", emoji: "✨" },
  { level: 70, title: "金寶守護", desc: "金寶機率 +3%",   emoji: "🪙" },
  { level: 99, title: "至高陪伴", desc: "當前階段終極，可進化", emoji: "👑" },
];

export function perksUnlocked(pet: Pet): LevelPerk[] {
  const lv = pet.level ?? 1;
  return LEVEL_PERKS.filter((p) => p.level <= lv);
}

export function nextPerk(pet: Pet): LevelPerk | undefined {
  const lv = pet.level ?? 1;
  return LEVEL_PERKS.find((p) => p.level > lv);
}

/** 依 level 計算實際屬性 cap（細微調整稀有度 cap）
 *  Level 1 完全對應 rarity cap
 *  Level 99 cap +5%（讓高 level 寵物稍微強）
 */
export function effectiveAttrCap(pet: Pet): number {
  const baseCap = RARITY[resolveRarity(pet.rarity)].attrCap;
  const lv = pet.level ?? 1;
  const bonus = Math.min(5, lv / 20); // 最多 +5
  return Math.min(100, Math.round(baseCap + bonus));
}
