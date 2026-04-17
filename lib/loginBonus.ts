/** 每日登入獎勵 — 7 日循環 */

export interface LoginBonus {
  day: number;
  label: string;
  emoji: string;
  reward: { coins?: number; xp?: number; card?: boolean; petBoost?: number };
}

export const DAILY_BONUSES: LoginBonus[] = [
  { day: 1, label: "Day 1",    emoji: "🎁", reward: { coins: 10 } },
  { day: 2, label: "Day 2",    emoji: "💝", reward: { coins: 20 } },
  { day: 3, label: "Day 3",    emoji: "🎴", reward: { card: true } },
  { day: 4, label: "Day 4",    emoji: "⭐", reward: { coins: 30, xp: 10 } },
  { day: 5, label: "Day 5",    emoji: "💰", reward: { coins: 50 } },
  { day: 6, label: "Day 6",    emoji: "🐣", reward: { petBoost: 5 } },
  { day: 7, label: "Day 7 🏆", emoji: "✨", reward: { coins: 100, xp: 30, card: true } },
];

export interface AnniversaryEvent {
  id: string;
  label: string;
  date: string;    // ISO yyyy-mm-dd
  recurring: boolean;
  emoji: string;
}
