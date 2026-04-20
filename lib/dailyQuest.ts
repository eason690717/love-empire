/**
 * 每日任務系統 — 每天 06:00 reset，系統派發 3 個主線 quest
 *
 * 目的：給使用者明確「今天該做什麼」的 guiding rail，提升 Day 7 留存。
 * 區別於 `tasks`（使用者自訂 + 模板庫）：daily quest 是系統每日分派、強制性、有 boss 獎勵。
 *
 * 設計：
 *  - 每日 3 個 quest（簡單 / 中等 / 挑戰）
 *  - 完成有即時獎勵 + 3 個都完成有 combo 獎勵（記憶卡碎片 / 金幣 bonus）
 *  - 不同「情侶類型」抽到不同池子（同居派家事、遠距派視訊）
 */

import type { RelationshipType, Attribute } from "./types";

export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestCompletion = "manual" | "auto"; // auto = 系統偵測其他 action 完成

export interface DailyQuest {
  id: string;                     // 穩定 id（每日 3 個 quest 依 couple + date seed 生成）
  title: string;
  emoji: string;
  difficulty: QuestDifficulty;
  reward: {
    coins: number;
    loveXp: number;
    petXp: number;
  };
  attribute?: Attribute;           // 完成後餵寵物的屬性
  completion: QuestCompletion;
  desc?: string;
  relationshipType?: RelationshipType | "any";
  unlockLevel?: number;
}

// ============================================================
// Quest pool — 分難度，系統每日挑 3 個（1 easy + 1 medium + 1 hard）
// ============================================================

const POOL: DailyQuest[] = [
  // === Easy（10 coins / 5 love / 3 pet XP）===
  { id: "dq_hug",        title: "給對方一個擁抱", emoji: "🤗", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, attribute: "intimacy", completion: "manual", relationshipType: "any" },
  { id: "dq_compliment", title: "稱讚對方一個優點", emoji: "💐", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, attribute: "romance", completion: "manual", relationshipType: "any" },
  { id: "dq_morning",    title: "主動說早安", emoji: "🌅", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, attribute: "romance", completion: "manual", relationshipType: "any" },
  { id: "dq_goodnight",  title: "主動說晚安", emoji: "🌙", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, attribute: "romance", completion: "manual", relationshipType: "any" },
  { id: "dq_photo",      title: "傳今天的一張照片", emoji: "📸", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, attribute: "communication", completion: "manual", relationshipType: "longdistance" },
  { id: "dq_feedPet",    title: "餵寵物 1 次", emoji: "🍼", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, completion: "auto", relationshipType: "any" },
  { id: "dq_ritual",     title: "完成 1 個每日儀式", emoji: "🌅", difficulty: "easy", reward: { coins: 10, loveXp: 5, petXp: 3 }, completion: "auto", relationshipType: "any" },

  // === Medium（30 coins / 10 love / 8 pet XP）===
  { id: "dq_q1",          title: "一起做一題深度問答", emoji: "💬", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, attribute: "communication", completion: "auto", relationshipType: "any" },
  { id: "dq_approve2",    title: "審核伴侶 2 個任務", emoji: "✅", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, completion: "auto", relationshipType: "any" },
  { id: "dq_chore",       title: "完成一件家事任務", emoji: "🧹", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, attribute: "care", completion: "auto", relationshipType: "cohabit" },
  { id: "dq_video",       title: "視訊 15 分鐘不做別的", emoji: "📱", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, attribute: "intimacy", completion: "manual", relationshipType: "longdistance" },
  { id: "dq_walk",        title: "和對方一起散步 20 分鐘", emoji: "🚶", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, attribute: "intimacy", completion: "manual", relationshipType: "cohabit" },
  { id: "dq_meal",        title: "一起吃一餐飯（不滑手機）", emoji: "🍽️", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, attribute: "intimacy", completion: "manual", relationshipType: "any" },
  { id: "dq_bucket",      title: "勾一件人生清單", emoji: "💞", difficulty: "medium", reward: { coins: 30, loveXp: 10, petXp: 8 }, completion: "auto", relationshipType: "any" },

  // === Hard（80 coins / 25 love / 15 pet XP）===
  { id: "dq_massage",     title: "幫對方按摩 15 分鐘", emoji: "💆", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "intimacy", completion: "manual", relationshipType: "any" },
  { id: "dq_surprise",    title: "準備一個小驚喜", emoji: "🎁", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "surprise", completion: "manual", relationshipType: "any" },
  { id: "dq_deep_talk",   title: "深聊 30 分鐘", emoji: "💭", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "communication", completion: "manual", relationshipType: "any" },
  { id: "dq_letter",      title: "寫一封 300 字以上的信給對方", emoji: "💌", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "romance", completion: "manual", relationshipType: "any" },
  { id: "dq_date",        title: "正式約一次會（≥3 小時）", emoji: "💑", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "romance", completion: "manual", relationshipType: "cohabit", unlockLevel: 5 },
  { id: "dq_recall",      title: "一起回憶一件開心的事", emoji: "📖", difficulty: "hard", reward: { coins: 80, loveXp: 25, petXp: 15 }, attribute: "communication", completion: "manual", relationshipType: "any" },
];

/** 今日 seed（以日期 + couple id 組合，保證兩人看到同 3 個 quest） */
function seedFor(dateStr: string, coupleId: string): number {
  let h = 0;
  const input = dateStr + coupleId;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 依日期 + couple id + 情侶類型 生成當日 3 個 quest */
export function generateDailyQuests(
  dateStr: string,
  coupleId: string,
  relationshipType: RelationshipType = "any",
  kingdomLevel: number = 1,
): DailyQuest[] {
  const seed = seedFor(dateStr, coupleId);
  const rand = mulberry32(seed);

  const filterAvailable = (q: DailyQuest) => {
    if (q.unlockLevel && kingdomLevel < q.unlockLevel) return false;
    if (!q.relationshipType || q.relationshipType === "any") return true;
    return q.relationshipType === relationshipType;
  };

  const easy = POOL.filter((q) => q.difficulty === "easy" && filterAvailable(q));
  const medium = POOL.filter((q) => q.difficulty === "medium" && filterAvailable(q));
  const hard = POOL.filter((q) => q.difficulty === "hard" && filterAvailable(q));

  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)] ?? arr[0];

  return [pick(easy), pick(medium), pick(hard)].filter(Boolean);
}

/** 全 3 quest 完成的 combo 獎勵 */
export const COMBO_REWARD = {
  coins: 100,
  loveXp: 30,
  petXp: 20,
  memoryCardChance: 0.3, // 30% 掉 N/R 記憶卡
};

/** 取今日 date key（跟 walk.ts 一致，06:00 分界）*/
export function todayKey(): string {
  const now = new Date();
  if (now.getHours() < 6) now.setDate(now.getDate() - 1);
  return now.toISOString().slice(0, 10);
}
