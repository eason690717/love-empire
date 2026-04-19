import type { Attribute, PetSpecies } from "@/lib/types";

/**
 * 5 種寵物種系 — 吉伊卡哇（ちいかわ）風格融合
 *
 * 設計原則：
 *  - 橢圓頭身一體 + 黑豆大眼 + 雙頰粉腮紅 + 豆豆手短短
 *  - 每系獨有配色 + 標誌配件 + 屬性偏向（像 StepN 的 Walker/Jogger/Runner/Trainer）
 *  - Lumen 光光系為「稀有限定」— MIT 極低機率或 founder 才拿得到
 */
export interface SpeciesMeta {
  id: PetSpecies;
  /** 暱稱（日系擬聲風） */
  nickname: string;
  /** 繁中系名 */
  nameZh: string;
  /** 外型一句話（供 UI 顯示） */
  look: string;
  /** 主色（body / fill） */
  baseColor: string;
  /** 輔色（肚子 / 口鼻區） */
  bellyColor: string;
  /** 腮紅色 */
  blushColor: string;
  /** 標誌配件 emoji */
  signatureEmoji: string;
  /** 屬性偏向加成（養成時 +% 效率） */
  attrBonus: Partial<Record<Attribute, number>>;
  /** 招牌動作描述（寵物閒置動畫用） */
  idleMotion: string;
  /** 是否稀有限定（不可透過正常新生取得） */
  exclusive?: boolean;
}

export const SPECIES: Record<PetSpecies, SpeciesMeta> = {
  // legacy — 舊資料視為 nuzzle
  basic: {
    id: "basic",
    nickname: "Basic",
    nameZh: "初代寵",
    look: "尚未分化的神秘小生物",
    baseColor: "#f5d5e5",
    bellyColor: "#fff2f8",
    blushColor: "#ff9fbc",
    signatureEmoji: "🫧",
    attrBonus: {},
    idleMotion: "小幅度浮動",
  },
  nuzzle: {
    id: "nuzzle",
    nickname: "Nuzu 努努",
    nameZh: "偎偎系",
    look: "桃粉水獺球、扁扁尾巴，兩手併攏搓搓臉頰",
    baseColor: "#ffc2d4",
    bellyColor: "#fff0f5",
    blushColor: "#ff7fa1",
    signatureEmoji: "🐚",
    attrBonus: { intimacy: 30, care: 10 },
    idleMotion: "搓搓臉頰",
  },
  spark: {
    id: "spark",
    nickname: "Pichi 皮琪",
    nameZh: "閃閃系",
    look: "奶白小狐球、三角小耳、蓬蓬尾巴閃閃發光",
    baseColor: "#ffedc2",
    bellyColor: "#fffaf0",
    blushColor: "#ff9d5c",
    signatureEmoji: "⭐",
    attrBonus: { surprise: 30, romance: 10 },
    idleMotion: "尾巴搖搖閃星星",
  },
  sturdy: {
    id: "sturdy",
    nickname: "Mochi 麻糬",
    nameZh: "堅堅系",
    look: "抹茶麻糬熊、半圓耳、粉紅大鼻頭",
    baseColor: "#d9e8c2",
    bellyColor: "#f7fbef",
    blushColor: "#e89ac7",
    signatureEmoji: "🍁",
    attrBonus: { care: 30, communication: 10 },
    idleMotion: "原地微微彈跳",
  },
  glide: {
    id: "glide",
    nickname: "Pupu 撲撲",
    nameZh: "悠悠系",
    look: "水藍呆毛鴨、頭頂三根呆毛、脖子蝴蝶結",
    baseColor: "#c2e3ff",
    bellyColor: "#f2f9ff",
    blushColor: "#5aa4ff",
    signatureEmoji: "🎀",
    attrBonus: { communication: 25, romance: 15 },
    idleMotion: "呆毛隨風搖曳",
  },
  lumen: {
    id: "lumen",
    nickname: "Lumi 露米",
    nameZh: "光光系",
    look: "彩虹獨角獸球、半透明獨角、腳下一圈光暈、身邊飄星塵",
    baseColor: "#fff7ff",
    bellyColor: "#ffffff",
    blushColor: "#ffa7d6",
    signatureEmoji: "🦄",
    attrBonus: { intimacy: 15, communication: 15, romance: 15, care: 15, surprise: 15 },
    idleMotion: "周身光環緩慢旋轉 + 星塵飄落",
    exclusive: true,
  },
};

export const SPECIES_LIST: SpeciesMeta[] = ["nuzzle", "spark", "sturdy", "glide", "lumen"].map((k) => SPECIES[k as PetSpecies]);

/** 取得顯示用 species（basic → nuzzle，其他原樣） */
export function resolveSpecies(s: PetSpecies | undefined): PetSpecies {
  if (!s || s === "basic") return "nuzzle";
  return s;
}

/** 計算屬性 bonus 倍率（回傳 1.0 = 無加成，1.3 = +30%） */
export function attrBonusMultiplier(species: PetSpecies | undefined, attr: Attribute): number {
  const meta = SPECIES[resolveSpecies(species)];
  const bonus = meta.attrBonus[attr] ?? 0;
  return 1 + bonus / 100;
}
