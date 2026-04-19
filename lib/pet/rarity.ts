import type { PetGeneRarity } from "@/lib/types";

/**
 * 稀有度表 — 對應 N / R / SR / SSR / UR
 *
 * 決定：
 *  - 屬性 cap（每屬性最高可達數值）
 *  - 可 MIT 次數（生過幾次後就不能再繁殖）
 *  - 邊框主色 / 光暈 / 粒子特效
 *  - 初次取得機率（新生蛋或 MIT 升格機率）
 */
export interface RarityMeta {
  id: PetGeneRarity;
  label: string;         // 中文短 label
  tag: string;           // N/R/SR/SSR/UR
  attrCap: number;       // 屬性上限
  mintLimit: number;     // 可繁殖次數上限（Infinity 代表無限）
  primaryColor: string;  // 邊框 / 標籤主色
  glowColor: string;     // 光暈漸層
  accentColor: string;   // 標籤文字 / 粒子色
  /** 邊框樣式強度（0 = 無，3 = 彩虹流動） */
  frameIntensity: 0 | 1 | 2 | 3;
  /** 發光等級（0 = 無，3 = 強光暈+粒子） */
  auraIntensity: 0 | 1 | 2 | 3;
  emoji: string;
}

export const RARITY: Record<PetGeneRarity, RarityMeta> = {
  common: {
    id: "common",
    label: "普通",
    tag: "N",
    attrCap: 60,
    mintLimit: 2,
    primaryColor: "#b0b0c8",
    glowColor: "rgba(176,176,200,0.3)",
    accentColor: "#5c5c78",
    frameIntensity: 0,
    auraIntensity: 0,
    emoji: "🌱",
  },
  uncommon: {
    id: "uncommon",
    label: "稀有",
    tag: "R",
    attrCap: 75,
    mintLimit: 3,
    primaryColor: "#5aa4ff",
    glowColor: "rgba(90,164,255,0.4)",
    accentColor: "#2f6ec5",
    frameIntensity: 1,
    auraIntensity: 1,
    emoji: "✨",
  },
  rare: {
    id: "rare",
    label: "史詩",
    tag: "SR",
    attrCap: 85,
    mintLimit: 5,
    primaryColor: "#d280ff",
    glowColor: "rgba(210,128,255,0.5)",
    accentColor: "#8e3eca",
    frameIntensity: 2,
    auraIntensity: 2,
    emoji: "💎",
  },
  legendary: {
    id: "legendary",
    label: "傳說",
    tag: "SSR",
    attrCap: 95,
    mintLimit: 7,
    primaryColor: "#ffb947",
    glowColor: "rgba(255,185,71,0.6)",
    accentColor: "#c77a00",
    frameIntensity: 3,
    auraIntensity: 3,
    emoji: "🌟",
  },
  mythic: {
    id: "mythic",
    label: "神話",
    tag: "UR",
    attrCap: 100,
    mintLimit: Number.POSITIVE_INFINITY,
    primaryColor: "#ff8eae", // 底，疊漸層顯示彩虹
    glowColor: "rgba(255,255,255,0.8)",
    accentColor: "#ff4f88",
    frameIntensity: 3,
    auraIntensity: 3,
    emoji: "🌈",
  },
};

export const RARITY_ORDER: PetGeneRarity[] = ["common", "uncommon", "rare", "legendary", "mythic"];

/** 取稀有度的 index（0-4） */
export function rarityRank(r: PetGeneRarity | undefined): number {
  if (!r) return 0;
  return RARITY_ORDER.indexOf(r);
}

/** 對比兩隻寵物稀有度 */
export function compareRarity(a: PetGeneRarity | undefined, b: PetGeneRarity | undefined): number {
  return rarityRank(a) - rarityRank(b);
}

export function resolveRarity(r: PetGeneRarity | undefined): PetGeneRarity {
  return r ?? "common";
}
