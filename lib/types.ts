export type Rarity = "N" | "R" | "SR" | "SSR";
export type Attribute = "intimacy" | "communication" | "romance" | "care" | "surprise";
export type TaskCategory = "chore" | "romance" | "wellness" | "surprise" | "coop";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  reward: number;
  attribute: Attribute;
  coop?: boolean;
}

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
