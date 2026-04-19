export type Rarity = "N" | "R" | "SR" | "SSR";
export type Attribute = "intimacy" | "communication" | "romance" | "care" | "surprise";
export type TaskCategory = "chore" | "romance" | "wellness" | "surprise" | "coop";

/**
 * 任務執行方向 (公平性設計)：
 * - queenToPrince: 阿紅做、阿藍審核
 * - princeToQueen: 阿藍做、阿紅審核
 * - together: 兩人一起做，任一方都可申報，另一方審核
 */
export type TaskDirection = "queenToPrince" | "princeToQueen" | "together";

/** 情侶類型 — 決定哪些任務模板最適合這對情侶
 *  cohabit      = 同居（同一個家）
 *  nearby       = 附近（不同居但近距離）
 *  longdistance = 遠距（不同城市/國家）
 *  any          = 所有類型都適用
 */
export type RelationshipType = "cohabit" | "nearby" | "longdistance" | "any";

export const RELATIONSHIP_LABELS: Record<Exclude<RelationshipType, "any">, { label: string; emoji: string; desc: string }> = {
  cohabit:      { label: "同居",   emoji: "🏡", desc: "住在同一個屋簷下" },
  nearby:       { label: "附近",   emoji: "🚗", desc: "不同住但住得近，常見面" },
  longdistance: { label: "遠距",   emoji: "✈️", desc: "不同城市/國家，靠訊息視訊維繫" },
};

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  reward: number;           // 金幣獎勵（情侶自訂，有分類上限；內部貨幣）
  systemXp: number;         // 系統愛意 XP（公平指標，由 category 決定，不可自訂）
  attribute: Attribute;
  direction: TaskDirection;
  custom?: boolean;         // true = 使用者自訂，false/undefined = 系統預設
  coop?: boolean;           // legacy 欄位，新用 direction === 'together'
  unlockLevel?: number;     // 解鎖所需王國等級（未達等級無法申報）
  relationshipType?: RelationshipType; // 此任務最適合的情侶類型
}

/** 每個分類的系統預設 XP 與 reward 上限（公平性護欄） */
export const CATEGORY_META: Record<TaskCategory, { xp: number; rewardCap: number; color: string; defaultAttr: Attribute }> = {
  chore:    { xp: 5,  rewardCap: 300, color: "#8ed172", defaultAttr: "care" },
  wellness: { xp: 8,  rewardCap: 200, color: "#5aa4ff", defaultAttr: "care" },
  romance:  { xp: 10, rewardCap: 500, color: "#ff7fa1", defaultAttr: "intimacy" },
  surprise: { xp: 15, rewardCap: 500, color: "#ffd447", defaultAttr: "surprise" },
  coop:     { xp: 12, rewardCap: 300, color: "#d280ff", defaultAttr: "communication" },
};

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  reward: number;
  submittedBy: "queen" | "prince";
  status: SubmissionStatus;
  createdAt: string;
  reviewedAt?: string;
  note?: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  cost: number;
  redeemedBy: "queen" | "prince";
  status: "unused" | "used";
  createdAt: string;
}

export interface MemoryCard {
  id: string;
  name: string;
  rarity: Rarity;
  theme: "daily" | "romance" | "travel" | "festival";
  emoji: string;
  obtainedAt: string | null; // null = 尚未收集
  festival?: {
    month: number;    // 1-12
    day: number;      // 1-31
    window: number;   // 前後各 N 天可掉落
    label: string;    // "情人節" / "聖誕節"
  };
}

export interface PikminHelper {
  color: "red" | "blue" | "yellow" | "green" | "purple";
  emoji: string;
  count: number;
  label: string;
}

export interface Pet {
  name: string;
  stage: 0 | 1 | 2 | 3 | 4; // 蛋 → 幼 → 成 → 傳說 → 神話
  attrs: Record<Attribute, number>;
  lastFedAt: string;
}

export interface IslandItem {
  id: string;
  catalogId: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
}

export interface Ritual {
  date: string;
  morning: boolean;
  night: boolean;
}

export interface Streak {
  current: number;
  longest: number;
  lastDate: string;
  knightShields?: number;       // 王子「騎士精神」剩餘保護次數（每週重置為 1）
  knightShieldsResetWeek?: string; // 紀錄本週 ISO (e.g. 2026-W16)
}

export interface Couple {
  id: string;
  name: string;
  inviteCode: string;
  kingdomLevel: number;
  coins: number;
  title: string;
  queen: { nickname: string };
  prince: { nickname: string };
  bio?: string;
  privacy: "public" | "friends" | "private";
  loveIndex: number;
  relationshipType?: RelationshipType; // 同居 / 附近 / 遠距
}

export interface CoupleSummary {
  id: string;
  name: string;
  kingdomLevel: number;
  loveIndex: number;
  streak: number;
  codexCompletion: number;
  weeklyTasks: number;
  title: string;
  emoji: string;
  isSelf?: boolean;
}

export interface Alliance {
  id: string;
  name: string;
  description: string;
  members: string[]; // couple ids
  weeklyProgress: number;
  weeklyTarget: number;
  questTitle: string;
  bossHp?: number;
  bossMaxHp?: number;
  bossName?: string;
  sharedIsland?: IslandItem[];
}

export interface AllianceTier {
  minLevel: number;
  title: string;
  emoji: string;
}

export const ALLIANCE_TIERS: AllianceTier[] = [
  { minLevel: 0,   title: "初聚聯盟",       emoji: "🌱" },
  { minLevel: 20,  title: "熱戀聯盟",       emoji: "💞" },
  { minLevel: 50,  title: "神仙眷侶團",     emoji: "✨" },
  { minLevel: 100, title: "天命聯盟",       emoji: "🌟" },
  { minLevel: 200, title: "神話級情緣公會", emoji: "👑" },
];

export function allianceTitleFor(totalLevels: number): AllianceTier {
  return [...ALLIANCE_TIERS].reverse().find((t) => totalLevels >= t.minLevel) ?? ALLIANCE_TIERS[0];
}

export interface Friendship {
  coupleId: string;
  since: string;
}

export interface Gift {
  id: string;
  fromCoupleName: string;
  type: "card" | "coins" | "item";
  content: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  answeredBy: "queen" | "prince";
  text: string;
  createdAt: string;
  rating?: number;        // partner 評分 1-5
  ratingComment?: string; // partner 回饋
  ratedAt?: string;
}

export interface NotificationItem {
  id: string;
  type: "submission" | "review" | "gift" | "visitor" | "level" | "streak" | "pet" | "card" | "system";
  title: string;
  body?: string;
  emoji: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export type MomentType =
  | "pet_evolve"
  | "ssr_card"
  | "sr_card"
  | "streak"
  | "level_up"
  | "title_up"
  | "anniversary"
  | "alliance_boss"
  | "codex_complete"
  | "custom";

export interface Moment {
  id: string;
  coupleId: string;
  coupleName: string;
  type: MomentType;
  title: string;
  subtitle?: string;
  emoji: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  comments: number;
  isSelf?: boolean;
}
