import type { Rarity, Attribute } from "./types";

export const RARITY_CLASS: Record<Rarity, string> = {
  N: "rarity-n",
  R: "rarity-r",
  SR: "rarity-sr",
  SSR: "rarity-ssr",
};

export const ATTR_LABEL: Record<Attribute, string> = {
  intimacy: "親密",
  communication: "溝通",
  romance: "浪漫",
  care: "照顧",
  surprise: "驚喜",
};

export const ATTR_COLOR: Record<Attribute, string> = {
  intimacy: "bg-rose-400",
  communication: "bg-sky-400",
  romance: "bg-fuchsia-400",
  care: "bg-emerald-400",
  surprise: "bg-amber-400",
};

export const CATEGORY_LABEL: Record<string, string> = {
  chore: "生活雜事類",
  romance: "浪漫時刻類",
  wellness: "健康管理類",
  surprise: "驚喜創意類",
  coop: "雙人合作類",
};

export const PET_STAGE_LABEL = ["蛋", "幼體", "成型", "傳說", "神話"] as const;
export const PET_STAGE_EMOJI = ["🥚", "🐣", "🐥", "🦄", "🌟"] as const;

export const TITLES = ["見習情人", "熱戀勇者", "愛的大師", "神話級靈魂伴侶"] as const;

export function titleByLevel(level: number) {
  if (level >= 30) return TITLES[3];
  if (level >= 15) return TITLES[2];
  if (level >= 5) return TITLES[1];
  return TITLES[0];
}

export function season(date = new Date()): "spring" | "summer" | "autumn" | "winter" {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

export const SEASON_LABEL = { spring: "🌸 春", summer: "☀️ 夏", autumn: "🍁 秋", winter: "❄️ 冬" } as const;
