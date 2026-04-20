/**
 * 限時活動系統 — 每週末 / 特定節日 / 月初啟動，加強 XP / 金幣 / 記憶卡倍率
 * 目的：製造「今天要玩」的緊迫感（留存優化）
 */

export type EventKind = "weekend" | "festival" | "newmonth" | "birthday" | "lunar";

export interface ActiveEvent {
  id: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  bonuses: {
    coinMultiplier?: number;   // 金幣 × N
    loveMultiplier?: number;   // 愛意 × N
    petXpMultiplier?: number;  // 寵物 XP × N
    cardDropBonus?: number;    // 記憶卡掉率 +N%
  };
  endsAt: string; // ISO
}

/** 取得當前 active events（可能多個同時） */
export function getActiveEvents(now: Date = new Date()): ActiveEvent[] {
  const events: ActiveEvent[] = [];
  const d = now.getDay(); // 0 = 日
  const dom = now.getDate();
  const m = now.getMonth() + 1;

  // 週末（週五 18:00 至週日 23:59）
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - d) % 7);
  endOfWeek.setHours(23, 59, 59);
  if (d === 0 || d === 6 || (d === 5 && now.getHours() >= 18)) {
    events.push({
      id: "weekend",
      kind: "weekend",
      title: "週末 Love 雙倍",
      subtitle: "金幣 ×1.5 · 愛意 ×1.5",
      emoji: "🎉",
      color: "#ff8eae",
      bonuses: { coinMultiplier: 1.5, loveMultiplier: 1.5 },
      endsAt: endOfWeek.toISOString(),
    });
  }

  // 月初（每月 1-3 號）
  if (dom >= 1 && dom <= 3) {
    const end = new Date(now.getFullYear(), now.getMonth(), 3, 23, 59, 59);
    events.push({
      id: "newmonth",
      kind: "newmonth",
      title: "月初慶典",
      subtitle: "寵物 XP ×2 · 記憶卡掉率 +20%",
      emoji: "🌟",
      color: "#ffb947",
      bonuses: { petXpMultiplier: 2, cardDropBonus: 20 },
      endsAt: end.toISOString(),
    });
  }

  // 節日（情人節 / 七夕 / 聖誕）
  const festivalDates: Record<string, { m: number; d: number; window: number; title: string; subtitle: string; emoji: string; color: string }> = {
    valentine: { m: 2, d: 14, window: 2, title: "情人節", subtitle: "愛意 ×3 · 記憶卡掉率 +30%", emoji: "💘", color: "#ff4f88" },
    qixi:      { m: 8, d: 22, window: 2, title: "七夕", subtitle: "愛意 ×3 · 寵物 XP ×2", emoji: "🌌", color: "#a87cff" },
    christmas: { m: 12, d: 25, window: 3, title: "聖誕季", subtitle: "金幣 ×2 · 記憶卡掉率 +25%", emoji: "🎄", color: "#3fb06b" },
    nye:       { m: 12, d: 31, window: 1, title: "跨年", subtitle: "全屬性 ×2", emoji: "🎆", color: "#ffd447" },
  };
  for (const [id, f] of Object.entries(festivalDates)) {
    if (m === f.m && Math.abs(dom - f.d) <= f.window) {
      const end = new Date(now.getFullYear(), f.m - 1, f.d + f.window, 23, 59, 59);
      events.push({
        id,
        kind: "festival",
        title: f.title,
        subtitle: f.subtitle,
        emoji: f.emoji,
        color: f.color,
        bonuses: id === "valentine" ? { loveMultiplier: 3, cardDropBonus: 30 }
               : id === "qixi" ? { loveMultiplier: 3, petXpMultiplier: 2 }
               : id === "christmas" ? { coinMultiplier: 2, cardDropBonus: 25 }
               : { coinMultiplier: 2, loveMultiplier: 2, petXpMultiplier: 2 },
        endsAt: end.toISOString(),
      });
    }
  }

  return events;
}

export function getCoinMultiplier(): number {
  return getActiveEvents().reduce((m, e) => m * (e.bonuses.coinMultiplier ?? 1), 1);
}
export function getLoveMultiplier(): number {
  return getActiveEvents().reduce((m, e) => m * (e.bonuses.loveMultiplier ?? 1), 1);
}
export function getPetXpMultiplier(): number {
  return getActiveEvents().reduce((m, e) => m * (e.bonuses.petXpMultiplier ?? 1), 1);
}
export function getCardDropBonus(): number {
  return getActiveEvents().reduce((b, e) => b + (e.bonuses.cardDropBonus ?? 0), 0);
}
