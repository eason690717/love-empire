/**
 * 被動技能 — 兩角色互補效果
 * - 王妃 (queen)：溫柔光環 — 任務金幣收益 +10%
 * - 王子 (prince)：騎士精神 — 連擊保護 (中斷當日會消耗 1 次 token 而非歸零)
 */

export interface PassiveSkill {
  key: "queenAura" | "princeKnight";
  ownerRole: "queen" | "prince";
  name: string;
  description: string;
  emoji: string;
}

export const PASSIVE_SKILLS: Record<"queen" | "prince", PassiveSkill> = {
  queen: {
    key: "queenAura",
    ownerRole: "queen",
    name: "溫柔光環",
    description: "所有任務金幣收益 +10%",
    emoji: "✨",
  },
  prince: {
    key: "princeKnight",
    ownerRole: "prince",
    name: "騎士精神",
    description: "連擊中斷時自動保護一天 (每週一次)",
    emoji: "🛡️",
  },
};

export const QUEEN_COIN_BONUS = 0.1;

/** 週三 = 特別日 (日期邏輯中性，不受時區影響) */
export function isSpecialDay(date = new Date()): boolean {
  return date.getDay() === 3; // 0=Sun, 3=Wed
}

export const SPECIAL_DAY_LABEL = "💝 情定星期三";
export const SPECIAL_DAY_MULTIPLIER = 2;
