import type { MemoryCard, PikminHelper } from "./types";

/** 檢查今天是否在卡片的節日窗口內 */
export function inFestivalWindow(card: MemoryCard, date = new Date()): boolean {
  if (!card.festival) return true; // 非節日卡 → 隨時可掉
  const { month, day, window } = card.festival;
  const festivalThisYear = new Date(date.getFullYear(), month - 1, day);
  const diffDays = Math.abs((date.getTime() - festivalThisYear.getTime()) / 86400000);
  return diffDays <= window;
}

/** 回傳卡片到節日還有幾天（負數表示已過） */
export function daysToFestival(card: MemoryCard, date = new Date()): number | null {
  if (!card.festival) return null;
  const { month, day } = card.festival;
  let target = new Date(date.getFullYear(), month - 1, day);
  if (target.getTime() < date.getTime() - 86400000) {
    target = new Date(date.getFullYear() + 1, month - 1, day);
  }
  return Math.ceil((target.getTime() - date.getTime()) / 86400000);
}

/** 今日是否為任何節日 */
export function todaysFestival(date = new Date()): { label: string; emoji: string } | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 2 && d >= 7 && d <= 21) return { label: "情人節", emoji: "💝" };
  if (m === 12 && d >= 18 && d <= 31) return { label: "聖誕節", emoji: "🎄" };
  if (m === 1 && d >= 1 && d <= 4) return { label: "元旦", emoji: "🎆" };
  if (m === 9 && d >= 12 && d <= 22) return { label: "中秋節", emoji: "🥮" };
  if (m === 2 && d >= 1 && d <= 7) return { label: "春節", emoji: "🧧" };
  if (m === 4 && d >= 14 && d <= 20) return { label: "週年紀念", emoji: "💎" };
  return null;
}

// ============================================================
// NPC 訪客系統 — 月份輪替訪客
// ============================================================

export interface NpcVisitor {
  id: string;
  emoji: string;
  name: string;
  greeting: string;
  gift: { type: "coins" | "xp" | "card"; amount: number; label: string };
}

const SEASONAL_NPCS: Record<number, NpcVisitor> = {
  // 春 3-5
  3: { id: "sakura", emoji: "🌸", name: "櫻花仙子", greeting: "春天來了～送你幾瓣櫻花。", gift: { type: "coins", amount: 20, label: "20 金幣" } },
  4: { id: "sakura", emoji: "🌸", name: "櫻花仙子", greeting: "春天來了～送你幾瓣櫻花。", gift: { type: "coins", amount: 20, label: "20 金幣" } },
  5: { id: "bee", emoji: "🐝", name: "蜜蜂信差", greeting: "幫你傳遞一份甜甜的訊息。", gift: { type: "xp", amount: 10, label: "+10 愛意" } },
  // 夏 6-8
  6: { id: "turtle", emoji: "🐢", name: "海龜爺爺", greeting: "慢慢走不著急，愛情也是。", gift: { type: "xp", amount: 15, label: "+15 愛意" } },
  7: { id: "shaveice", emoji: "🍧", name: "冰沙大叔", greeting: "來碗消暑的～", gift: { type: "coins", amount: 30, label: "30 金幣" } },
  8: { id: "shaveice", emoji: "🍧", name: "冰沙大叔", greeting: "來碗消暑的～", gift: { type: "coins", amount: 30, label: "30 金幣" } },
  // 秋 9-11
  9: { id: "maple", emoji: "🍁", name: "楓葉客", greeting: "收藏最美的楓葉給你。", gift: { type: "coins", amount: 40, label: "40 金幣" } },
  10: { id: "ghost", emoji: "👻", name: "搞怪幽靈", greeting: "哇！嚇到你了嗎？拿去別生氣。", gift: { type: "xp", amount: 20, label: "+20 愛意" } },
  11: { id: "maple", emoji: "🍁", name: "楓葉客", greeting: "收藏最美的楓葉給你。", gift: { type: "coins", amount: 40, label: "40 金幣" } },
  // 冬 12, 1, 2
  12: { id: "santa", emoji: "🎅", name: "聖誕老人", greeting: "乖孩子才有禮物喔！", gift: { type: "coins", amount: 100, label: "100 金幣" } },
  1: { id: "snowman", emoji: "⛄", name: "雪人少年", greeting: "新年快樂！抱一抱祝你一年順利。", gift: { type: "xp", amount: 30, label: "+30 愛意" } },
  2: { id: "cupid", emoji: "💘", name: "邱比特", greeting: "愛情箭正中紅心～", gift: { type: "card", amount: 0, label: "解鎖節日卡" } },
};

/** 根據今日月份取得訪客 */
export function getTodayVisitor(date = new Date()): NpcVisitor {
  return SEASONAL_NPCS[date.getMonth() + 1] ?? SEASONAL_NPCS[4];
}

// ============================================================
// 小精靈助手 — 任務類別對應 5 色
// ============================================================

export const PIKMIN_BY_CATEGORY: Record<string, { color: PikminHelper["color"]; emoji: string; label: string }> = {
  chore:    { color: "blue",   emoji: "🔵", label: "藍苗精靈" },
  wellness: { color: "green",  emoji: "🟢", label: "綠苗精靈" },
  romance:  { color: "red",    emoji: "🔴", label: "紅苗精靈" },
  surprise: { color: "yellow", emoji: "🟡", label: "黃苗精靈" },
  coop:     { color: "purple", emoji: "🟣", label: "紫苗精靈" },
};
