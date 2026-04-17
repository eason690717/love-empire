/**
 * 獎盃 / 成就系統 (寶可夢徽章 DNA)
 * — 與記憶卡互補：記憶卡是收集「時刻」，成就是里程碑「徽章」
 */

export type AchievementCategory = "growth" | "collect" | "social" | "combat" | "special";

export interface Achievement {
  id: string;
  category: AchievementCategory;
  emoji: string;
  title: string;
  description: string;
  // 靜態條件 — 由 store.ts check 時讀 state 判斷
  check: (state: {
    couple: { kingdomLevel: number; coins: number; loveIndex: number };
    streak: { current: number; longest: number };
    pet: { stage: number };
    submissionsApproved: number;
    cardsOwned: number;
    cardsSSR: number;
    alliancesJoined: number;
    friendsCount: number;
    visitsSent: number;
    pkWins: number;
    momentsSelf: number;
    pikminsTotal: number;
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // 成長 growth
  { id: "a_firstTask", category: "growth", emoji: "🥚", title: "第一步",
    description: "第一個被准奏的任務", check: (s) => s.submissionsApproved >= 1 },
  { id: "a_tenTasks", category: "growth", emoji: "📋", title: "勤勞小幫手",
    description: "10 個任務被准奏", check: (s) => s.submissionsApproved >= 10 },
  { id: "a_fiftyTasks", category: "growth", emoji: "📚", title: "任務達人",
    description: "50 個任務被准奏", check: (s) => s.submissionsApproved >= 50 },
  { id: "a_hundredTasks", category: "growth", emoji: "🏅", title: "百戰勇者",
    description: "100 個任務被准奏", check: (s) => s.submissionsApproved >= 100 },
  { id: "a_lv5", category: "growth", emoji: "🥉", title: "熱戀勇者",
    description: "王國等級達 5", check: (s) => s.couple.kingdomLevel >= 5 },
  { id: "a_lv15", category: "growth", emoji: "🥈", title: "愛的大師",
    description: "王國等級達 15", check: (s) => s.couple.kingdomLevel >= 15 },
  { id: "a_lv30", category: "growth", emoji: "🥇", title: "神話級靈魂伴侶",
    description: "王國等級達 30", check: (s) => s.couple.kingdomLevel >= 30 },
  { id: "a_petHatch", category: "growth", emoji: "🐣", title: "破蛋而出",
    description: "寵物孵化進化到幼體", check: (s) => s.pet.stage >= 1 },
  { id: "a_petFull", category: "growth", emoji: "🐥", title: "寵物長大",
    description: "寵物進化到成型", check: (s) => s.pet.stage >= 2 },
  { id: "a_petLegend", category: "growth", emoji: "🦄", title: "傳說級夥伴",
    description: "寵物進化到傳說", check: (s) => s.pet.stage >= 3 },
  { id: "a_petMyth", category: "growth", emoji: "🌟", title: "神話級化身",
    description: "寵物進化到神話", check: (s) => s.pet.stage >= 4 },
  { id: "a_streak7", category: "growth", emoji: "🔥", title: "七日連擊",
    description: "連擊 7 天", check: (s) => s.streak.current >= 7 || s.streak.longest >= 7 },
  { id: "a_streak30", category: "growth", emoji: "🔥🔥", title: "月圓之誓",
    description: "連擊 30 天", check: (s) => s.streak.current >= 30 || s.streak.longest >= 30 },
  { id: "a_streak100", category: "growth", emoji: "💯", title: "百日神話",
    description: "連擊 100 天", check: (s) => s.streak.current >= 100 || s.streak.longest >= 100 },

  // 收集 collect
  { id: "a_firstCard", category: "collect", emoji: "🎴", title: "初次相遇",
    description: "收集第一張記憶卡", check: (s) => s.cardsOwned >= 1 },
  { id: "a_tenCards", category: "collect", emoji: "🖼️", title: "小小收藏家",
    description: "收集 10 張記憶卡", check: (s) => s.cardsOwned >= 10 },
  { id: "a_firstSSR", category: "collect", emoji: "✨", title: "閃耀時刻",
    description: "收集第一張 SSR", check: (s) => s.cardsSSR >= 1 },
  { id: "a_threeSSR", category: "collect", emoji: "💎", title: "SSR 三連",
    description: "收集 3 張 SSR", check: (s) => s.cardsSSR >= 3 },
  { id: "a_coinHoard", category: "collect", emoji: "💰", title: "小富翁",
    description: "一次存 1000 金幣以上", check: (s) => s.couple.coins >= 1000 },
  { id: "a_pikminColors", category: "collect", emoji: "🌱", title: "皮克敏隊伍",
    description: "累積 10 隻以上皮克敏", check: (s) => s.pikminsTotal >= 10 },

  // 社交 social
  { id: "a_firstFriend", category: "social", emoji: "👫", title: "結緣",
    description: "加入第一對好友情侶", check: (s) => s.friendsCount >= 1 },
  { id: "a_threeFriends", category: "social", emoji: "👨‍👩‍👧‍👦", title: "社交圈",
    description: "3 對好友情侶", check: (s) => s.friendsCount >= 3 },
  { id: "a_firstAlliance", category: "social", emoji: "🏛️", title: "加盟",
    description: "加入第一個聯盟", check: (s) => s.alliancesJoined >= 1 },
  { id: "a_firstMoment", category: "social", emoji: "📣", title: "留下足跡",
    description: "在廣場上發第一則動態", check: (s) => s.momentsSelf >= 1 },
  { id: "a_tenMoments", category: "social", emoji: "🌸", title: "廣場常客",
    description: "發 10 則動態", check: (s) => s.momentsSelf >= 10 },
  { id: "a_visited", category: "social", emoji: "✈️", title: "愛探訪",
    description: "參觀 5 對情侶", check: (s) => s.visitsSent >= 5 },

  // 戰鬥 combat
  { id: "a_firstPK", category: "combat", emoji: "⚔️", title: "初戰",
    description: "贏得第一場 PK", check: (s) => s.pkWins >= 1 },
  { id: "a_threePK", category: "combat", emoji: "🏆", title: "PK 王者",
    description: "贏得 3 場 PK", check: (s) => s.pkWins >= 3 },

  // 特殊 special
  { id: "a_highLove", category: "special", emoji: "💖", title: "愛意滿溢",
    description: "愛意指數 1000+", check: (s) => s.couple.loveIndex >= 1000 },
  { id: "a_allAttrs", category: "special", emoji: "⭐", title: "全能情侶",
    description: "所有屬性達 80+", check: () => false /* placeholder; check in store with pet.attrs */ },
];
