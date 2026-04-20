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
    pet: { stage: number; attrs: Record<string, number> };
    submissionsApproved: number;
    cardsOwned: number;
    cardsSSR: number;
    alliancesJoined: number;
    friendsCount: number;
    visitsSent: number;
    pkWins: number;
    momentsSelf: number;
    pikminsTotal: number;
    questionsAnswered: number;
    questionsFiveStar: number;
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
  { id: "a_pikminColors", category: "collect", emoji: "🌱", title: "小精靈隊伍",
    description: "累積 10 隻以上小精靈助手", check: (s) => s.pikminsTotal >= 10 },

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
    description: "所有屬性達 80+", check: (s) => Object.values(s.pet.attrs).every((v) => v >= 80) },

  // 深度問答 (2026-04-17 新增)
  { id: "a_firstQuestion", category: "social", emoji: "💬", title: "敞開心扉",
    description: "完成第一題深度問答", check: (s) => s.questionsAnswered >= 1 },
  { id: "a_tenQuestions", category: "social", emoji: "📝", title: "我懂你",
    description: "回答 10 題深度問答", check: (s) => s.questionsAnswered >= 10 },
  { id: "a_fiftyQuestions", category: "social", emoji: "📖", title: "你的書",
    description: "回答 50 題深度問答", check: (s) => s.questionsAnswered >= 50 },
  { id: "a_hundredQuestions", category: "social", emoji: "🌌", title: "靈魂伴侶",
    description: "回答 100 題深度問答", check: (s) => s.questionsAnswered >= 100 },
  { id: "a_twoHundredQ", category: "social", emoji: "💬", title: "對談大師",
    description: "回答 200 題深度問答", check: (s) => s.questionsAnswered >= 200 },
  { id: "a_threeHundredQ", category: "social", emoji: "🪞", title: "心有靈犀",
    description: "回答 300 題深度問答", check: (s) => s.questionsAnswered >= 300 },
  { id: "a_fiveStarAnswer", category: "special", emoji: "⭐", title: "完美答卷",
    description: "拿到第一個 5 星評分", check: (s) => s.questionsFiveStar >= 1 },
  { id: "a_tenFiveStars", category: "special", emoji: "🌟", title: "默契滿分",
    description: "累積 10 個 5 星評分", check: (s) => s.questionsFiveStar >= 10 },

  // ============ v1.4.0 擴充 20 個新成就 ============
  // 成長 growth (+4)
  { id: "a_lv50", category: "growth", emoji: "👑", title: "帝國之主",
    description: "王國等級達 50", check: (s) => s.couple.kingdomLevel >= 50 },
  { id: "a_lv100", category: "growth", emoji: "🏰", title: "永恆帝國",
    description: "王國等級達 100", check: (s) => s.couple.kingdomLevel >= 100 },
  { id: "a_love1000", category: "growth", emoji: "💖", title: "千愛千里",
    description: "累計愛意 1000", check: (s) => s.couple.loveIndex >= 1000 },
  { id: "a_love10000", category: "growth", emoji: "💗", title: "萬愛成河",
    description: "累計愛意 10000", check: (s) => s.couple.loveIndex >= 10000 },

  // 收集 collect (+4)
  { id: "a_collect30", category: "collect", emoji: "📕", title: "初成藏家",
    description: "收集 30 張記憶卡", check: (s) => s.cardsOwned >= 30 },
  { id: "a_collect60", category: "collect", emoji: "📚", title: "半壁江山",
    description: "收集 60 張記憶卡", check: (s) => s.cardsOwned >= 60 },
  { id: "a_collectAll", category: "collect", emoji: "🏛️", title: "圖鑑完成",
    description: "收集 120 張記憶卡（全）", check: (s) => s.cardsOwned >= 120 },
  { id: "a_ssrThree", category: "collect", emoji: "💎", title: "三連 SSR",
    description: "收集 3 張 SSR 記憶卡", check: (s) => s.cardsSSR >= 3 },

  // 社交 social (+4)
  { id: "a_visitor5", category: "social", emoji: "🚪", title: "好客主人",
    description: "招待 5 位訪客", check: (s) => s.visitsSent >= 5 },
  { id: "a_pk10", category: "combat", emoji: "🥊", title: "情侶戰將",
    description: "PK 勝利 10 次", check: (s) => s.pkWins >= 10 },
  { id: "a_friend5", category: "social", emoji: "👯", title: "閨蜜 5 對",
    description: "加 5 對好友情侶", check: (s) => s.friendsCount >= 5 },
  { id: "a_alliance2", category: "social", emoji: "🤝", title: "雙聯盟",
    description: "同時加入 2 個聯盟", check: (s) => s.alliancesJoined >= 2 },

  // 連擊 combat (+3)
  { id: "a_streak60", category: "combat", emoji: "🔥", title: "兩月連擊",
    description: "連擊達 60 天", check: (s) => s.streak.current >= 60 },
  { id: "a_streak180", category: "combat", emoji: "☄️", title: "半年傳奇",
    description: "連擊達 180 天", check: (s) => s.streak.current >= 180 },
  { id: "a_streak365", category: "combat", emoji: "🌌", title: "整年神話",
    description: "連擊達 365 天", check: (s) => s.streak.current >= 365 },

  // 特殊 special (+5)
  { id: "a_pet_lv50", category: "special", emoji: "🦁", title: "寵物達人",
    description: "寵物達到 stage 3（傳說）", check: (s) => s.pet.stage >= 3 },
  { id: "a_pet_myth", category: "special", emoji: "🦄", title: "神話馴獸師",
    description: "寵物達到 stage 4（神話）", check: (s) => s.pet.stage >= 4 },
  { id: "a_allFiveStars", category: "special", emoji: "✨", title: "滿星情侶",
    description: "累積 50 個 5 星評分", check: (s) => s.questionsFiveStar >= 50 },
  { id: "a_moment50", category: "special", emoji: "📸", title: "時刻捕手",
    description: "發佈 50 則動態", check: (s) => s.momentsSelf >= 50 },
  { id: "a_pikmin20", category: "special", emoji: "🌱", title: "小助手軍團",
    description: "累積 20 個小精靈助手", check: (s) => s.pikminsTotal >= 20 },
];
