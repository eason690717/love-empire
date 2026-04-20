export type Rarity = "N" | "R" | "SR" | "SSR";
export type Attribute = "intimacy" | "communication" | "romance" | "care" | "surprise";
export type TaskCategory = "chore" | "romance" | "wellness" | "surprise" | "coop";

/**
 * 任務執行方向 (公平性設計)：
 * - queenToPrince: 阿紅做、阿藍審核
 * - princeToQueen: 阿藍做、阿紅審核
 * - together: 兩人一起做，任一方都可申報，另一方審核
 */
/**
 * 任務方向
 * - together    一起做：兩人共同參與的活動（一起看電影、一起運動）
 * - serve       對方做：一方為另一方做的服務（倒垃圾、按摩、煮飯給對方；任一方都可申報）
 * - queenToPrince / princeToQueen：精確指定方向（TaskEditor 高階模式用）
 */
export type TaskDirection = "queenToPrince" | "princeToQueen" | "together" | "serve";

/** 情侶類型 — 決定哪些任務模板最適合這對情侶
 *  cohabit      = 同居（同一個家）
 *  nearby       = 附近（不同居但近距離）
 *  longdistance = 遠距（不同城市/國家）
 *  any          = 所有類型都適用
 */
export type RelationshipType = "cohabit" | "nearby" | "longdistance" | "married" | "any";

export const RELATIONSHIP_LABELS: Record<Exclude<RelationshipType, "any">, { label: string; emoji: string; desc: string }> = {
  cohabit:      { label: "同居",   emoji: "🏡", desc: "住在同一個屋簷下（未婚）" },
  nearby:       { label: "附近",   emoji: "🚗", desc: "不同住但住得近、常見面（含每週一次）" },
  longdistance: { label: "遠距",   emoji: "✈️", desc: "不同城市/國家，靠訊息視訊維繫" },
  married:      { label: "已婚",   emoji: "💍", desc: "結婚的情侶（可能有小孩、時間壓力）" },
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

/** 每個分類的系統預設 XP 與 reward 上限 + 對應屬性（1:1 呼應）
 *  5 類別 ↔ 5 屬性 一對一鎖定：
 *    chore    → care         家事 = 照顧
 *    wellness → intimacy     健康 = 身心親密
 *    romance  → romance      浪漫 = 浪漫
 *    surprise → surprise     驚喜 = 驚喜
 *    coop     → communication 合作 = 溝通
 */
export const CATEGORY_META: Record<TaskCategory, { xp: number; rewardCap: number; color: string; defaultAttr: Attribute }> = {
  chore:    { xp: 5,  rewardCap: 300, color: "#8ed172", defaultAttr: "care" },
  wellness: { xp: 8,  rewardCap: 200, color: "#5aa4ff", defaultAttr: "intimacy" },
  romance:  { xp: 10, rewardCap: 500, color: "#ff7fa1", defaultAttr: "romance" },
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

export type RewardCategory = "daily" | "date" | "intimacy" | "control" | "indulge" | "cash";

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  category?: RewardCategory;
  adult?: boolean;          // 成人向 — 設定可隱藏
  description?: string;     // 額外說明
}

export const REWARD_CATEGORY_LABELS: Record<RewardCategory, { label: string; emoji: string; color: string }> = {
  daily:    { label: "日常豁免", emoji: "🧹", color: "#a8d89a" },
  date:     { label: "約會體驗", emoji: "💑", color: "#ff8eae" },
  intimacy: { label: "親密互動", emoji: "🌹", color: "#e89ac7" }, // 成人向
  control:  { label: "主導權",   emoji: "👑", color: "#ffd447" },
  indulge:  { label: "解禁享受", emoji: "🍰", color: "#d280ff" },
  cash:     { label: "現金回饋", emoji: "💵", color: "#5aa4ff" },
};

export interface Redemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  cost: number;
  redeemedBy: "queen" | "prince";
  status: "unused" | "used";
  createdAt: string;
  icon?: string;              // reward 的 emoji（票券大圖）
  category?: RewardCategory;  // 用於卡片配色
  adult?: boolean;            // 成人向標記
  usedAt?: string;            // 使用完成日期
  usedNote?: string;          // 使用後的心得（可選）
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

/** 情侶人生清單 — 100 件一生想一起做的事 */
export type BucketCategory = "romantic" | "daily" | "outdoor" | "growth" | "playful" | "tender";
export type BucketRarity = "N" | "R" | "SR" | "SSR";

export interface BucketItem {
  id: string;              // b001 - b100
  category: BucketCategory;
  rarity: BucketRarity;    // 依「難度/重量」分級，影響獎勵
  title: string;
  emoji: string;
  proofHint?: ProofKind;   // 建議的證明類型（UI 推薦而非強制）
}

export type ProofKind = "text" | "location" | "photo";

export interface ProofItem {
  kind: ProofKind;
  value: string;        // text: 內容 / location: "lat,lng" / photo: URL
  caption?: string;     // 附加說明
  addedAt?: string;     // ISO 時間
}

export interface BucketRecord {
  id: string;              // 對應 BucketItem.id
  doneAt: string;          // ISO 日期
  note?: string;           // 勾選時的心情短文（< 100 字）
  photoUrl?: string;       // 可選照片連結（legacy，新版用 proof）
  proof?: ProofItem;       // 完成證明（選填）
}

export const BUCKET_CATEGORY_LABELS: Record<BucketCategory, { label: string; emoji: string; desc: string; color: string }> = {
  romantic: { label: "浪漫約會",   emoji: "💞", desc: "儀式感的大事與紀念", color: "#ff8eae" },
  daily:    { label: "日常小確幸", emoji: "☕", desc: "把平凡過成特別",     color: "#a8d89a" },
  outdoor:  { label: "戶外冒險",   emoji: "🏕️", desc: "一起去看世界",       color: "#5aa4ff" },
  growth:   { label: "共同成長",   emoji: "🌱", desc: "承諾、學習、陪伴",   color: "#d280ff" },
  playful:  { label: "趣味挑戰",   emoji: "🎮", desc: "一起犯傻的時光",     color: "#ffd447" },
  tender:   { label: "溫柔瞬間",   emoji: "🫂", desc: "那些很細的好",       color: "#ff9fbc" },
};

export const BUCKET_REWARD: Record<BucketRarity, { love: number; coins: number; emoji: string }> = {
  N:   { love: 15,  coins: 30,  emoji: "💞" },
  R:   { love: 30,  coins: 80,  emoji: "✨" },
  SR:  { love: 60,  coins: 200, emoji: "💎" },
  SSR: { love: 150, coins: 500, emoji: "🌟" },
};

// ============================================================
// 多寵物 + 交配系統（schema 0007，UI 階段性實作中）
// ============================================================
/** 寵物種系（吉伊卡哇風融合）
 *  nuzzle  偎偎系（水獺，親密偏向）
 *  spark   閃閃系（小狐，幸運偏向）
 *  sturdy  堅堅系（麻糬熊，韌性/療癒）
 *  glide   悠悠系（呆毛鴨，冒險/探索）
 *  lumen   光光系（彩虹獨角獸，均衡 — 稀有限定，僅 UR 或 founder）
 *  basic   舊版單一種系（legacy，遷移時轉為 nuzzle）
 */
export type PetSpecies = "basic" | "nuzzle" | "spark" | "sturdy" | "glide" | "lumen";
export type PetGeneColor = "pink" | "blue" | "yellow" | "purple" | "green" | "rainbow";
export type PetGenePattern = "plain" | "spot" | "star" | "heart";
export type PetGeneFace = "smile" | "sleepy" | "shock" | "cool";
export type PetGeneAccessory = "none" | "crown" | "ribbon" | "glasses" | "wings";
/** 稀有度（N/R/SR/SSR/UR — 對應 common/uncommon/rare/legendary/mythic）
 *  決定：屬性 cap、可 MIT 次數、配色、邊框特效 */
export type PetGeneRarity = "common" | "uncommon" | "rare" | "legendary" | "mythic";

export interface PetInstance {
  id: string;
  coupleId: string;
  name: string;
  species: PetSpecies;
  generation: number;              // 0 = 初代, >0 = 後代
  geneSeed?: string;                // 32+ 字 hash
  gene: {
    color: PetGeneColor;
    pattern: PetGenePattern;
    face: PetGeneFace;
    accessory: PetGeneAccessory;
    rarity: PetGeneRarity;
  };
  // 血統（後代才有）
  parentAId?: string;
  parentBId?: string;
  parentACoupleId?: string;
  parentBCoupleId?: string;
  // 養成
  stage: 0 | 1 | 2 | 3 | 4;
  attrs: Record<Attribute, number>;
  bondQueen: number;
  bondPrince: number;
  feedCountQueen: number;
  feedCountPrince: number;
  lastFedBy?: "queen" | "prince";
  lastFedAt: string;
  lastMatedAt?: string;
  createdAt: string;
}

export interface PetMatingRequest {
  id: string;
  fromPetId: string;
  fromCoupleId: string;
  toPetId: string;
  toCoupleId: string;
  fromQueenApproved: boolean;
  fromPrinceApproved: boolean;
  toQueenApproved: boolean;
  toPrinceApproved: boolean;
  status: "pending" | "accepted" | "rejected" | "completed" | "expired";
  offspringId?: string;
  message?: string;
  createdAt: string;
  resolvedAt?: string;
  expiresAt: string;
}

/** 判斷所有 4 方都同意 */
export function isFullyApproved(r: PetMatingRequest): boolean {
  return r.fromQueenApproved && r.fromPrinceApproved && r.toQueenApproved && r.toPrinceApproved;
}

export interface PikminHelper {
  color: "red" | "blue" | "yellow" | "green" | "purple";
  emoji: string;
  count: number;
  label: string;
}

export interface Pet {
  id?: string;              // 寵物唯一 id（C2 多寵容器新增，向後相容 optional）
  name: string;
  stage: 0 | 1 | 2 | 3 | 4; // 蛋 → 幼 → 成 → 傳說 → 神話
  attrs: Record<Attribute, number>;
  lastFedAt: string;
  // 雙主人親密度系統（批次 AF 加）
  bondQueen?: number;      // 阿紅與寵物的親密度 0-100
  bondPrince?: number;     // 阿藍與寵物的親密度 0-100
  feedCountQueen?: number; // 阿紅累積餵食次數
  feedCountPrince?: number;// 阿藍累積餵食次數
  lastFedBy?: "queen" | "prince"; // 最後是誰餵的
  // 種系 + 稀有度 + 基因（批次 C1 新增）
  species?: PetSpecies;          // 未填視為 nuzzle
  rarity?: PetGeneRarity;        // 未填視為 common
  gene?: {                       // 顯性特徵，影響 SVG 細節
    color?: PetGeneColor;
    pattern?: PetGenePattern;
    face?: PetGeneFace;
    accessory?: PetGeneAccessory;
  };
  mintCount?: number;            // 已 MIT 次數（生過幾隻後代）
  isFounder?: boolean;           // 初代玩家標記（公測前拿到的）
  lastMatedAt?: string;          // 最後繁殖時間（ISO）— 用於 7 天 cooldown
  // 血統（MIT 生出的才有）
  parentAId?: string;
  parentBId?: string;
  generation?: number;           // 0 = 初代 / >0 = 後代
  // Supabase pet_instances 的 uuid（pets[] 多寵跨裝置同步用）
  remoteId?: string;
  // 48h 餓肚子衰減起算時間（pet interaction 記錄）
  lastInteractionAt?: string;
  // Level 系統（stage 內細級 1-99）
  level?: number;           // 1-99，stage up 時 reset 為 1
  petXp?: number;           // 當前 level 內累積 XP
  totalXp?: number;         // 從出生起累積總 XP（永不 reset，作為血統/成就指標）
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
  // 王國狀態（方案 C — 暫停可回頭）
  pausedAt?: string;            // ISO 暫停時間戳
  pauseReason?: string;         // 暫停原因（可選短文）
  pauseInitiator?: "queen" | "prince"; // 誰發起的
  archivedAt?: string;          // ISO 封存時間戳（90 天後或雙方都確認）
}

export const KINGDOM_PAUSE_DAYS = 90;

/** 個人心情狀態 — 影響任務推薦、通知靜音、互動節奏 */
export type MoodState = "default" | "busy" | "tired" | "missing" | "intimate" | "quiet";

export const MOOD_LABELS: Record<MoodState, { label: string; emoji: string; desc: string; color: string }> = {
  default:  { label: "沒特別",   emoji: "🙂",  desc: "日常狀態",                     color: "#8fcff5" },
  busy:     { label: "忙碌中",   emoji: "💼",  desc: "工作/學業爆炸，不要太多推播",    color: "#ffd447" },
  tired:    { label: "累癱",     emoji: "😮‍💨", desc: "只想躺平，別太用力",             color: "#b0b0c8" },
  missing:  { label: "想你",     emoji: "💭",  desc: "希望對方知道",                  color: "#ff8eae" },
  intimate: { label: "想親密",   emoji: "🌹",  desc: "今晚想靠近 (對方也會看到)",      color: "#e89ac7" },
  quiet:    { label: "想獨處",   emoji: "🕯️",  desc: "需要一些空間",                  color: "#c8b8e0" },
};

export function getKingdomStatus(couple: Couple): { state: "active" | "paused" | "archived"; daysLeft?: number; daysSincePaused?: number } {
  if (couple.archivedAt) return { state: "archived" };
  if (couple.pausedAt) {
    const ms = Date.now() - new Date(couple.pausedAt).getTime();
    const daysSince = Math.floor(ms / 86400000);
    const daysLeft = Math.max(0, KINGDOM_PAUSE_DAYS - daysSince);
    return { state: "paused", daysLeft, daysSincePaused: daysSince };
  }
  return { state: "active" };
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
  type: "submission" | "review" | "gift" | "visitor" | "level" | "streak" | "pet" | "card" | "system" | "interaction";
  title: string;
  body?: string;
  emoji: string;
  createdAt: string;
  read: boolean;
  link?: string;
  priority?: "high" | "normal" | "low"; // high = 互動類要立刻看到
  fromRole?: "queen" | "prince";         // 誰發起的
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
