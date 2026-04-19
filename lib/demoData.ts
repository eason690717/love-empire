import type {
  Task, Submission, Reward, Redemption, MemoryCard, Pet,
  IslandItem, Ritual, Streak, Couple, CoupleSummary, Alliance, Friendship, Gift, Moment,
} from "./types";

// 隨機 6 碼邀請碼
function genInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

/** 新使用者 couple：Lv.1，一切歸零。示範資料僅用於其他情侶 (排行榜 / 廣場) */
export const INITIAL_COUPLE: Couple = {
  id: "me",
  name: "新手小窩",
  inviteCode: genInviteCode(),
  kingdomLevel: 1,
  coins: 0,
  title: "見習情人",
  queen: { nickname: "阿紅" },
  prince: { nickname: "阿藍" },
  bio: "",
  privacy: "public",
  loveIndex: 0,
};

/**
 * 預設 14 任務。direction 全部預設 "together" (兩人都可申報)，使用者新增自訂任務時可選 queen/prince 指向。
 * systemXp 由分類決定 (公平指標，跨情侶用這個比)
 * reward 由情侶自訂 (內部貨幣，不跨情侶比)
 */
export const INITIAL_TASKS: Task[] = [
  // 生活雜事類 — 多為「對方做」(serve)，任一方都能申報
  { id: "t1", title: "丟衣服下去洗", category: "chore", reward: 10, systemXp: 5, attribute: "care", direction: "serve" },
  { id: "t2", title: "摺被子整理床", category: "chore", reward: 10, systemXp: 5, attribute: "care", direction: "serve" },
  { id: "t3", title: "倒垃圾", category: "chore", reward: 30, systemXp: 5, attribute: "care", direction: "serve" },
  { id: "t4", title: "幫忙拿去烘衣服", category: "chore", reward: 30, systemXp: 5, attribute: "care", direction: "serve" },
  { id: "t5", title: "幫忙煮飯/買飯/飲料", category: "chore", reward: 50, systemXp: 5, attribute: "care", direction: "serve" },
  { id: "t6", title: "載對方上下班", category: "chore", reward: 200, systemXp: 5, attribute: "care", direction: "serve" },
  // 浪漫時刻 — 多為「對方做」
  { id: "t7", title: "說好話 / 情話一句", category: "romance", reward: 10, systemXp: 10, attribute: "communication", direction: "serve" },
  { id: "t8", title: "主動擁抱一次", category: "romance", reward: 20, systemXp: 10, attribute: "intimacy", direction: "serve" },
  { id: "t9", title: "心情不好馬上出現", category: "romance", reward: 200, systemXp: 10, attribute: "intimacy", direction: "serve" },
  // 驚喜 — 對方做
  { id: "t10", title: "驚喜小禮物", category: "surprise", reward: 150, systemXp: 15, attribute: "surprise", direction: "serve" },
  // 健康管理 — 一起做
  { id: "t11", title: "一起運動 30 分鐘", category: "wellness", reward: 60, systemXp: 8, attribute: "care", direction: "together" },
  { id: "t12", title: "一起睡前閱讀", category: "wellness", reward: 30, systemXp: 8, attribute: "communication", direction: "together" },
  // 合作任務 — 一起做
  { id: "t13", title: "一起看一部電影 🎬", category: "coop", reward: 80, systemXp: 12, attribute: "intimacy", direction: "together", coop: true },
  { id: "t14", title: "互相讚美 10 句 💕", category: "coop", reward: 100, systemXp: 12, attribute: "communication", direction: "together", coop: true },
  // 等級解鎖任務 (Lv.5+)
  { id: "t15", title: "深度談心 1 小時", category: "romance", reward: 150, systemXp: 10, attribute: "communication", direction: "together", unlockLevel: 5 },
  { id: "t16", title: "手寫信一封", category: "romance", reward: 200, systemXp: 10, attribute: "communication", direction: "serve", unlockLevel: 5 },
  // 等級解鎖任務 (Lv.15+)
  { id: "t17", title: "週末小旅行", category: "coop", reward: 300, systemXp: 12, attribute: "intimacy", direction: "together", coop: true, unlockLevel: 15 },
  { id: "t18", title: "一起做早餐", category: "coop", reward: 120, systemXp: 12, attribute: "care", direction: "together", coop: true, unlockLevel: 15 },
  // 等級解鎖任務 (Lv.30+)
  { id: "t19", title: "年度浪漫計畫", category: "surprise", reward: 500, systemXp: 15, attribute: "surprise", direction: "serve", unlockLevel: 30 },
];

/** 新使用者的申報紀錄：空的 */
export const INITIAL_SUBMISSIONS: Submission[] = [];

export const INITIAL_REWARDS: Reward[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 日常豁免 daily (8) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "r1",  title: "代替洗碗券",            cost: 250,  icon: "🍽️", category: "daily" },
  { id: "r2",  title: "代替倒垃圾券",          cost: 200,  icon: "🗑️", category: "daily" },
  { id: "r3",  title: "假日不打掃券",          cost: 200,  icon: "🛋️", category: "daily" },
  { id: "r4",  title: "今晚不用做晚餐",        cost: 300,  icon: "🍳", category: "daily" },
  { id: "r5",  title: "家事豁免一週（極限）",  cost: 1500, icon: "🧹", category: "daily", description: "週內所有家事對方一個人扛" },
  { id: "r6",  title: "早上替對方起床煮咖啡",  cost: 200,  icon: "☕", category: "daily" },
  { id: "r7",  title: "替顧寵物一週",          cost: 1200, icon: "🐱", category: "daily" },
  { id: "r8",  title: "替顧小孩 1 小時放風券", cost: 800,  icon: "🧸", category: "daily", description: "適合 married 情侶" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 約會體驗 date (8) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "r9",  title: "演唱會一場（含熱舞）",   cost: 1500, icon: "🎤", category: "date" },
  { id: "r10", title: "高級餐廳一次（你買單）", cost: 2000, icon: "🍽️", category: "date" },
  { id: "r11", title: "一日約會主導權",         cost: 800,  icon: "📅", category: "date", description: "地點/餐廳/行程都你決定" },
  { id: "r12", title: "週末小旅行規劃權",       cost: 1500, icon: "🚗", category: "date" },
  { id: "r13", title: "大旅行目的地我決定",     cost: 3000, icon: "✈️", category: "date" },
  { id: "r14", title: "電影院我選片",           cost: 300,  icon: "🎬", category: "date" },
  { id: "r15", title: "早餐外送到對方家",       cost: 200,  icon: "🥐", category: "date", description: "適合 nearby / longdistance 情侶" },
  { id: "r16", title: "突襲拜訪車費 cover",     cost: 800,  icon: "🚄", category: "date", description: "適合 longdistance 情侶" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 親密互動 intimacy (8) — 成人向 ━━━━━━━━━━━━━━━━
  { id: "r17", title: "全身按摩 60 分鐘",       cost: 600,  icon: "💆", category: "intimacy" },
  { id: "r18", title: "親手按摩 30 分鐘",       cost: 400,  icon: "🤲", category: "intimacy" },
  { id: "r19", title: "抱睡一整夜（大湯匙）",   cost: 300,  icon: "🫂", category: "intimacy" },
  { id: "r20", title: "浪漫雙人泡澡夜",         cost: 800,  icon: "🛁", category: "intimacy", adult: true },
  { id: "r21", title: "一晚親密主導權",         cost: 1000, icon: "🌹", category: "intimacy", adult: true, description: "節奏、姿勢、時長你決定" },
  { id: "r22", title: "角色扮演一次",           cost: 1200, icon: "👗", category: "intimacy", adult: true },
  { id: "r23", title: "你想做什麼都好一次",     cost: 1500, icon: "💋", category: "intimacy", adult: true, description: "在底線內，提什麼都答應" },
  { id: "r24", title: "為對方手寫一封大膽情書", cost: 400,  icon: "💌", category: "intimacy" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 主導權 control (4) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "r25", title: "一週飲食我決定",         cost: 500,  icon: "🍱", category: "control" },
  { id: "r26", title: "一週音樂播放權",         cost: 300,  icon: "🎵", category: "control" },
  { id: "r27", title: "家裡裝飾我決定一次",     cost: 600,  icon: "🪴", category: "control" },
  { id: "r28", title: "長輩擋箭牌（拒絕家族聚會）", cost: 500, icon: "🛡️", category: "control" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 解禁享受 indulge (4) ━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "r29", title: "想吃什麼就吃什麼一晚",   cost: 200,  icon: "🍕", category: "indulge", description: "高糖/高油/宵夜 解禁" },
  { id: "r30", title: "看劇通宵不被罵",         cost: 300,  icon: "📺", category: "indulge" },
  { id: "r31", title: "手機放遠 1 小時靜靜",    cost: 200,  icon: "📵", category: "indulge" },
  { id: "r32", title: "沙發任我選台一晚",       cost: 150,  icon: "🛋️", category: "indulge" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 現金回饋 cash (4) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "r33", title: "現金回饋 50 元",         cost: 500,  icon: "💴", category: "cash" },
  { id: "r34", title: "現金回饋 100 元",        cost: 900,  icon: "💴", category: "cash" },
  { id: "r35", title: "現金回饋 300 元",        cost: 2500, icon: "💵", category: "cash" },
  { id: "r36", title: "現金回饋 500 元",        cost: 4000, icon: "💵", category: "cash" },
];

/** 新使用者的兌換紀錄：空的 */
export const INITIAL_REDEMPTIONS: Redemption[] = [];

/** 新使用者的寵物：蛋階段，屬性全 0，等情侶完成任務餵養 */
export const INITIAL_PET: Pet = {
  id: "p_primary",
  name: "小小蛋",
  stage: 0,
  attrs: { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 },
  lastFedAt: new Date().toISOString(),
  bondQueen: 0,
  bondPrince: 0,
  feedCountQueen: 0,
  feedCountPrince: 0,
  species: "nuzzle",
  rarity: "common",
  mintCount: 0,
};

/** 圖鑑清單。festival 欄位的卡只在節日前後 N 天掉落率大幅提升
 * 2026-04-19 擴充 17 → 80 張（4 主題 × 4 稀有度，稀有度分佈 N 32/R 26/SR 17/SSR 5）
 */
export const INITIAL_CODEX: MemoryCard[] = [
  // ══════════════ daily 日常 (22 張) ══════════════
  { id: "c2",  name: "週末早午餐",   rarity: "N",  theme: "daily", emoji: "🥐", obtainedAt: null },
  { id: "c3",  name: "共撐一把傘",   rarity: "R",  theme: "daily", emoji: "☂️", obtainedAt: null },
  { id: "c5",  name: "一起煮飯",     rarity: "R",  theme: "daily", emoji: "🍳", obtainedAt: null },
  { id: "c10", name: "午後散步",     rarity: "N",  theme: "daily", emoji: "🚶", obtainedAt: null },
  { id: "c11", name: "貓咪照護日",   rarity: "R",  theme: "daily", emoji: "🐈", obtainedAt: null },
  { id: "c20", name: "早餐鮪魚吐司", rarity: "N",  theme: "daily", emoji: "🍞", obtainedAt: null },
  { id: "c21", name: "外送夜消",     rarity: "N",  theme: "daily", emoji: "🍜", obtainedAt: null },
  { id: "c22", name: "一起逛超市",   rarity: "N",  theme: "daily", emoji: "🛒", obtainedAt: null },
  { id: "c23", name: "洗衣晾衣",     rarity: "N",  theme: "daily", emoji: "🧺", obtainedAt: null },
  { id: "c24", name: "一起倒垃圾",   rarity: "N",  theme: "daily", emoji: "🗑️", obtainedAt: null },
  { id: "c25", name: "沙發電影夜",   rarity: "N",  theme: "daily", emoji: "🎬", obtainedAt: null },
  { id: "c26", name: "一起賴床",     rarity: "N",  theme: "daily", emoji: "🛌", obtainedAt: null },
  { id: "c27", name: "夜市小吃",     rarity: "R",  theme: "daily", emoji: "🍢", obtainedAt: null },
  { id: "c28", name: "手牽手散步",   rarity: "N",  theme: "daily", emoji: "🤝", obtainedAt: null },
  { id: "c29", name: "一起晨跑",     rarity: "R",  theme: "daily", emoji: "🏃", obtainedAt: null },
  { id: "c30", name: "整理房間",     rarity: "N",  theme: "daily", emoji: "🧹", obtainedAt: null },
  { id: "c31", name: "共用耳機",     rarity: "N",  theme: "daily", emoji: "🎧", obtainedAt: null },
  { id: "c32", name: "洗頭幫吹髮",   rarity: "R",  theme: "daily", emoji: "💇", obtainedAt: null },
  { id: "c33", name: "一起泡澡",     rarity: "SR", theme: "daily", emoji: "🛁", obtainedAt: null },
  { id: "c34", name: "新家第一夜",   rarity: "SR", theme: "daily", emoji: "🏠", obtainedAt: null },
  { id: "c35", name: "一起追劇",     rarity: "N",  theme: "daily", emoji: "📺", obtainedAt: null },
  { id: "c36", name: "睡前晚安",     rarity: "N",  theme: "daily", emoji: "🌙", obtainedAt: null },

  // ══════════════ romance 浪漫 (22 張) ══════════════
  { id: "c1",  name: "第一次牽手",   rarity: "SSR", theme: "romance", emoji: "🤝", obtainedAt: null },
  { id: "c4",  name: "深夜談心",     rarity: "SR",  theme: "romance", emoji: "🌙", obtainedAt: null },
  { id: "c12", name: "神話級告白",   rarity: "SSR", theme: "romance", emoji: "💍", obtainedAt: null },
  { id: "c40", name: "第一個吻",     rarity: "SSR", theme: "romance", emoji: "💋", obtainedAt: null },
  { id: "c41", name: "一起看星空",   rarity: "SR",  theme: "romance", emoji: "⭐", obtainedAt: null },
  { id: "c42", name: "摩天輪夜景",   rarity: "SR",  theme: "romance", emoji: "🎡", obtainedAt: null },
  { id: "c43", name: "手寫情書",     rarity: "R",   theme: "romance", emoji: "💌", obtainedAt: null },
  { id: "c44", name: "燭光晚餐",     rarity: "SR",  theme: "romance", emoji: "🕯️", obtainedAt: null },
  { id: "c45", name: "送花告白",     rarity: "R",   theme: "romance", emoji: "💐", obtainedAt: null },
  { id: "c46", name: "雨中擁吻",     rarity: "SR",  theme: "romance", emoji: "☔", obtainedAt: null },
  { id: "c47", name: "月下散步",     rarity: "R",   theme: "romance", emoji: "🌕", obtainedAt: null },
  { id: "c48", name: "海邊散步",     rarity: "R",   theme: "romance", emoji: "🏖️", obtainedAt: null },
  { id: "c49", name: "一起賞櫻",     rarity: "SR",  theme: "romance", emoji: "🌸", obtainedAt: null },
  { id: "c50", name: "情人節花束",   rarity: "R",   theme: "romance", emoji: "🌹", obtainedAt: null },
  { id: "c51", name: "共乘機車",     rarity: "N",   theme: "romance", emoji: "🏍️", obtainedAt: null },
  { id: "c52", name: "耳邊低語",     rarity: "N",   theme: "romance", emoji: "🗣️", obtainedAt: null },
  { id: "c53", name: "深情擁抱",     rarity: "R",   theme: "romance", emoji: "🫂", obtainedAt: null },
  { id: "c54", name: "含淚和好",     rarity: "SR",  theme: "romance", emoji: "🥺", obtainedAt: null },
  { id: "c55", name: "十指緊扣",     rarity: "N",   theme: "romance", emoji: "✋", obtainedAt: null },
  { id: "c56", name: "靠肩睡著",     rarity: "N",   theme: "romance", emoji: "💤", obtainedAt: null },
  { id: "c57", name: "突然的驚喜",   rarity: "R",   theme: "romance", emoji: "🎁", obtainedAt: null },
  { id: "c58", name: "牽手入睡",     rarity: "R",   theme: "romance", emoji: "🤲", obtainedAt: null },

  // ══════════════ travel 旅行 (16 張) ══════════════
  { id: "c7",  name: "京都旅行",     rarity: "SR",  theme: "travel", emoji: "🏯", obtainedAt: null },
  { id: "c9",  name: "第一場雪",     rarity: "R",   theme: "travel", emoji: "❄️", obtainedAt: null },
  { id: "c60", name: "沖繩海邊",     rarity: "SR",  theme: "travel", emoji: "🏝️", obtainedAt: null },
  { id: "c61", name: "北海道雪景",   rarity: "SR",  theme: "travel", emoji: "🗻", obtainedAt: null },
  { id: "c62", name: "峇里島日落",   rarity: "SSR", theme: "travel", emoji: "🌅", obtainedAt: null },
  { id: "c63", name: "台南古城遊",   rarity: "R",   theme: "travel", emoji: "🏛️", obtainedAt: null },
  { id: "c64", name: "墾丁浪花",     rarity: "R",   theme: "travel", emoji: "🌊", obtainedAt: null },
  { id: "c65", name: "九份山城",     rarity: "R",   theme: "travel", emoji: "⛰️", obtainedAt: null },
  { id: "c66", name: "東京鐵塔",     rarity: "SR",  theme: "travel", emoji: "🗼", obtainedAt: null },
  { id: "c67", name: "首爾賞櫻",     rarity: "SR",  theme: "travel", emoji: "🌸", obtainedAt: null },
  { id: "c68", name: "香港夜景",     rarity: "R",   theme: "travel", emoji: "🌃", obtainedAt: null },
  { id: "c69", name: "曼谷夜市",     rarity: "R",   theme: "travel", emoji: "🍢", obtainedAt: null },
  { id: "c70", name: "自駕環島",     rarity: "SR",  theme: "travel", emoji: "🚗", obtainedAt: null },
  { id: "c71", name: "露營看星空",   rarity: "SR",  theme: "travel", emoji: "🏕️", obtainedAt: null },
  { id: "c72", name: "溫泉之旅",     rarity: "R",   theme: "travel", emoji: "♨️", obtainedAt: null },
  { id: "c73", name: "海外蜜月",     rarity: "SSR", theme: "travel", emoji: "✈️", obtainedAt: null },

  // ══════════════ festival 節日限定 (20 張 — 節日前後 N 天才掉) ══════════════
  { id: "c6",  name: "情人節限定",   rarity: "SSR", theme: "festival", emoji: "💝", obtainedAt: null,
    festival: { month: 2,  day: 14, window: 7, label: "情人節" } },
  { id: "c8",  name: "生日蛋糕",     rarity: "SR",  theme: "festival", emoji: "🎂", obtainedAt: null,
    festival: { month: 4,  day: 17, window: 3, label: "生日" } },
  { id: "c13", name: "聖誕夜擁抱",   rarity: "SSR", theme: "festival", emoji: "🎄", obtainedAt: null,
    festival: { month: 12, day: 25, window: 7, label: "聖誕節" } },
  { id: "c14", name: "元旦初心願",   rarity: "SR",  theme: "festival", emoji: "🎆", obtainedAt: null,
    festival: { month: 1,  day: 1,  window: 3, label: "元旦" } },
  { id: "c15", name: "中秋月餅夜",   rarity: "SR",  theme: "festival", emoji: "🥮", obtainedAt: null,
    festival: { month: 9,  day: 17, window: 5, label: "中秋節" } },
  { id: "c16", name: "春節紅包",     rarity: "R",   theme: "festival", emoji: "🧧", obtainedAt: null,
    festival: { month: 2,  day: 1,  window: 7, label: "春節" } },
  { id: "c17", name: "週年紀念日",   rarity: "SSR", theme: "festival", emoji: "💎", obtainedAt: null,
    festival: { month: 4,  day: 17, window: 3, label: "週年" } },
  { id: "c80", name: "七夕鵲橋",     rarity: "SR",  theme: "festival", emoji: "🌠", obtainedAt: null,
    festival: { month: 8,  day: 7,  window: 3, label: "七夕" } },
  { id: "c81", name: "白色情人節",   rarity: "SR",  theme: "festival", emoji: "🤍", obtainedAt: null,
    festival: { month: 3,  day: 14, window: 3, label: "白色情人節" } },
  { id: "c82", name: "萬聖節裝扮",   rarity: "R",   theme: "festival", emoji: "🎃", obtainedAt: null,
    festival: { month: 10, day: 31, window: 5, label: "萬聖節" } },
  { id: "c83", name: "端午粽情",     rarity: "R",   theme: "festival", emoji: "🥟", obtainedAt: null,
    festival: { month: 6,  day: 10, window: 5, label: "端午節" } },
  { id: "c84", name: "跨年倒數",     rarity: "SR",  theme: "festival", emoji: "🎊", obtainedAt: null,
    festival: { month: 12, day: 31, window: 2, label: "跨年夜" } },
  { id: "c85", name: "元宵燈會",     rarity: "R",   theme: "festival", emoji: "🏮", obtainedAt: null,
    festival: { month: 2,  day: 24, window: 5, label: "元宵節" } },
  { id: "c86", name: "母親節伴偕",   rarity: "R",   theme: "festival", emoji: "💐", obtainedAt: null,
    festival: { month: 5,  day: 12, window: 3, label: "母親節" } },
  { id: "c87", name: "父親節陪伴",   rarity: "R",   theme: "festival", emoji: "👔", obtainedAt: null,
    festival: { month: 8,  day: 8,  window: 3, label: "父親節" } },
  { id: "c88", name: "國慶煙火",     rarity: "R",   theme: "festival", emoji: "🎇", obtainedAt: null,
    festival: { month: 10, day: 10, window: 3, label: "國慶日" } },
  { id: "c89", name: "冬至湯圓",     rarity: "R",   theme: "festival", emoji: "🍡", obtainedAt: null,
    festival: { month: 12, day: 22, window: 3, label: "冬至" } },
  { id: "c90", name: "愚人節玩笑",   rarity: "N",   theme: "festival", emoji: "🎭", obtainedAt: null,
    festival: { month: 4,  day: 1,  window: 1, label: "愚人節" } },
  { id: "c91", name: "清明追思",     rarity: "N",   theme: "festival", emoji: "🌿", obtainedAt: null,
    festival: { month: 4,  day: 5,  window: 3, label: "清明節" } },
  { id: "c92", name: "秋分賞菊",     rarity: "N",   theme: "festival", emoji: "🌼", obtainedAt: null,
    festival: { month: 9,  day: 23, window: 3, label: "秋分" } },
];

/** 新使用者的島嶼：只有一座城堡 + 一隻貓咪 (新手禮物)，其他家具要自己買 */
export const INITIAL_ISLAND: IslandItem[] = [
  { id: "i1", catalogId: "castle", label: "城堡", emoji: "🏰", x: 50, y: 35 },
  { id: "i2", catalogId: "cat", label: "新手貓", emoji: "🐈", x: 58, y: 45 },
];

export type FurnitureRoom = "living" | "bedroom" | "kitchen" | "bathroom" | "garden" | "deco";
export type FurnitureInteraction =
  | "petBond"        // 點擊 → 寵物雙 bond +2
  | "linkQuestions"  // 點擊 → 跳問答頁
  | "linkRituals"    // 點擊 → 跳儀式打卡
  | "linkBucket"     // 點擊 → 跳人生清單
  | "linkExchange"   // 點擊 → 跳兌換
  | "linkRecap"      // 點擊 → 跳年度回顧
  | "linkArchive"    // 點擊 → 跳畢業紀念
  | "feedTreat"      // 點擊 → 餵寵物零食
  | "loveBoost"      // 點擊 → +5 愛意
  | "playMusic";     // 點擊 → 主題曲（toast 動畫）

export interface ShopItem {
  id: string;
  label: string;
  emoji: string;
  price: number;
  room?: FurnitureRoom;
  interaction?: FurnitureInteraction;
  desc?: string;        // 互動描述
}

export const ISLAND_SHOP: ShopItem[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 客廳 living (8) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "sofa",       label: "雙人沙發", emoji: "🛋️", price: 200,  room: "living",  interaction: "petBond",       desc: "一起坐 · 寵物親密 +2" },
  { id: "tv",         label: "電視",     emoji: "📺", price: 350,  room: "living",  interaction: "linkRecap",     desc: "點擊看年度回顧" },
  { id: "bookshelf",  label: "書櫃",     emoji: "📚", price: 180,  room: "living",  interaction: "linkBucket",    desc: "翻看人生清單" },
  { id: "piano",      label: "鋼琴",     emoji: "🎹", price: 600,  room: "living",  interaction: "playMusic",     desc: "彈一首主題曲" },
  { id: "rug",        label: "地毯",     emoji: "🟫", price: 80,   room: "living",  desc: "讓家更柔軟" },
  { id: "lamp_floor", label: "立燈",     emoji: "💡", price: 60,   room: "living",  desc: "暖黃光" },
  { id: "clock",      label: "時鐘",     emoji: "🕰️", price: 90,   room: "living",  desc: "陪你們度過時光" },
  { id: "guitar",     label: "吉他",     emoji: "🎸", price: 250,  room: "living",  interaction: "playMusic",     desc: "你彈我聽" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 臥室 bedroom (6) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "bed",        label: "雙人床",   emoji: "🛏️", price: 400,  room: "bedroom", interaction: "linkRituals",   desc: "去打晨/晚安卡" },
  { id: "wardrobe",   label: "衣櫃",     emoji: "🚪", price: 200,  room: "bedroom", desc: "一起選衣" },
  { id: "mirror",     label: "鏡子",     emoji: "🪞", price: 120,  room: "bedroom", interaction: "loveBoost",     desc: "互看一眼 +5 愛意" },
  { id: "lamp_table", label: "床頭燈",   emoji: "🏮", price: 50,   room: "bedroom", desc: "睡前的陪伴" },
  { id: "diary",      label: "日記本",   emoji: "📓", price: 100,  room: "bedroom", interaction: "linkQuestions", desc: "去寫深度問答" },
  { id: "alarm",      label: "鬧鐘",     emoji: "⏰", price: 40,   room: "bedroom", desc: "明天記得起床" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 廚房 kitchen (5) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "fridge",     label: "冰箱",     emoji: "🧊", price: 250,  room: "kitchen", interaction: "feedTreat",     desc: "拿零食餵寵物" },
  { id: "stove",      label: "瓦斯爐",   emoji: "🍳", price: 180,  room: "kitchen", desc: "今晚煮什麼？" },
  { id: "coffee",     label: "咖啡機",   emoji: "☕", price: 220,  room: "kitchen", interaction: "loveBoost",     desc: "為對方泡杯咖啡 +5 愛意" },
  { id: "table_dine", label: "餐桌",     emoji: "🍽️", price: 150,  room: "kitchen", desc: "吃飯時間" },
  { id: "wine",       label: "酒櫃",     emoji: "🍷", price: 350,  room: "kitchen", interaction: "loveBoost",     desc: "微醺夜晚 +5 愛意" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 浴室 bathroom (4) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "bathtub",    label: "浴缸",     emoji: "🛁", price: 380,  room: "bathroom",interaction: "linkExchange",  desc: "兌換泡澡夜獎勵" },
  { id: "shower",     label: "淋浴間",   emoji: "🚿", price: 200,  room: "bathroom",desc: "新一天的開始" },
  { id: "towel",      label: "毛巾架",   emoji: "🧖", price: 80,   room: "bathroom",desc: "幫對方擦乾頭髮" },
  { id: "candle",     label: "香氛蠟燭", emoji: "🕯️", price: 100,  room: "bathroom",interaction: "loveBoost",     desc: "點亮療癒香氣 +5 愛意" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 庭院 garden (5) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "tree_sakura",label: "櫻花樹",   emoji: "🌸", price: 50,   room: "garden",  desc: "春天會盛開" },
  { id: "tree_pine",  label: "松樹",     emoji: "🌲", price: 40,   room: "garden",  desc: "冬天的守護" },
  { id: "flower",     label: "花圃",     emoji: "🌷", price: 20,   room: "garden",  interaction: "petBond",       desc: "撫摸植物 · 寵物親密 +2" },
  { id: "fountain",   label: "愛心噴泉", emoji: "⛲", price: 200,  room: "garden",  desc: "幸福象徵" },
  { id: "swing",      label: "鞦韆",     emoji: "🪂", price: 180,  room: "garden",  interaction: "petBond",       desc: "盪鞦韆 · 親密 +2" },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ 裝飾 deco (8) ━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: "cat",        label: "家貓",     emoji: "🐈", price: 120,  room: "deco",    interaction: "petBond",       desc: "撫摸 · 親密 +2" },
  { id: "dog",        label: "家犬",     emoji: "🐕", price: 120,  room: "deco",    interaction: "petBond",       desc: "陪散步 · 親密 +2" },
  { id: "fish",       label: "魚缸",     emoji: "🐠", price: 150,  room: "deco",    desc: "看魚游療癒" },
  { id: "plant",      label: "盆栽",     emoji: "🪴", price: 60,   room: "deco",    desc: "綠意" },
  { id: "frame",      label: "相框",     emoji: "🖼️", price: 100,  room: "deco",    interaction: "linkArchive",   desc: "看畢業紀念冊" },
  { id: "lantern",    label: "提燈",     emoji: "🏮", price: 35,   room: "deco",    desc: "節日氣氛" },
  { id: "music_box",  label: "音樂盒",   emoji: "🎵", price: 280,  room: "deco",    interaction: "playMusic",     desc: "旋律響起" },
  { id: "wishstar",   label: "許願星",   emoji: "🌟", price: 500,  room: "deco",    interaction: "loveBoost",     desc: "對星星許願 +5 愛意" },
];

/** 動森 Nook 每日特惠：依日期 rotate 出 2 件 7 折 */
export function getDailyFeatured(date = new Date()): ShopItem[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const a = ISLAND_SHOP[dayOfYear % ISLAND_SHOP.length];
  const b = ISLAND_SHOP[(dayOfYear + 5) % ISLAND_SHOP.length];
  const uniq = a.id === b.id ? [a, ISLAND_SHOP[(dayOfYear + 3) % ISLAND_SHOP.length]] : [a, b];
  return uniq.map((i) => ({ ...i, price: Math.round(i.price * 0.7) }));
}

export const INITIAL_RITUAL: Ritual = {
  date: new Date().toISOString().slice(0, 10),
  morning: false,
  night: false,
};

/** 新使用者的連擊：從 0 開始，騎士盾牌 1 個 */
export const INITIAL_STREAK: Streak = {
  current: 0,
  longest: 0,
  lastDate: "",
  knightShields: 1,
  knightShieldsResetWeek: "",
};

export const LEADERBOARD: CoupleSummary[] = [
  { id: "c_01", name: "甜蜜蜜帝國", kingdomLevel: 38, loveIndex: 9821, streak: 87, codexCompletion: 92, weeklyTasks: 42, title: "神話級靈魂伴侶", emoji: "💞" },
  { id: "c_02", name: "貓奴聯邦", kingdomLevel: 34, loveIndex: 8930, streak: 120, codexCompletion: 85, weeklyTasks: 38, title: "神話級靈魂伴侶", emoji: "🐈‍⬛" },
  { id: "c_03", name: "宅宅小窩", kingdomLevel: 28, loveIndex: 7254, streak: 56, codexCompletion: 74, weeklyTasks: 35, title: "愛的大師", emoji: "🎮" },
  { id: "c_04", name: "登山夫婦", kingdomLevel: 25, loveIndex: 6801, streak: 44, codexCompletion: 68, weeklyTasks: 31, title: "愛的大師", emoji: "⛰️" },
  { id: "c_05", name: "美食帝國", kingdomLevel: 22, loveIndex: 5980, streak: 38, codexCompletion: 61, weeklyTasks: 28, title: "愛的大師", emoji: "🍜" },
  { id: "c_06", name: "咖啡與書", kingdomLevel: 18, loveIndex: 4421, streak: 22, codexCompletion: 54, weeklyTasks: 24, title: "熱戀勇者", emoji: "☕" },
  { id: "c_07", name: "旅行計畫局", kingdomLevel: 15, loveIndex: 3670, streak: 18, codexCompletion: 48, weeklyTasks: 21, title: "熱戀勇者", emoji: "✈️" },
  { id: "me",   name: "新手小窩",     kingdomLevel: 1,  loveIndex: 0,    streak: 0,  codexCompletion: 0,  weeklyTasks: 0,  title: "見習情人", emoji: "🌱", isSelf: true },
  { id: "c_09", name: "新手情侶",     kingdomLevel: 8,  loveIndex: 1420, streak: 10, codexCompletion: 30, weeklyTasks: 14, title: "見習情人", emoji: "🌱" },
  { id: "c_10", name: "阿貓阿狗",     kingdomLevel: 5,  loveIndex: 890,  streak: 6,  codexCompletion: 18, weeklyTasks: 9,  title: "見習情人", emoji: "🐾" },
];

/** 新使用者沒有好友情侶，要自己加 */
export const FRIEND_COUPLES: Friendship[] = [];

/** 新使用者還沒加入任何聯盟；每個聯盟都有一隻 BOSS 可以合力攻擊 + 共同島嶼 */
export const ALLIANCES: Alliance[] = [
  {
    id: "a_01",
    name: "神仙眷侶團",
    description: "每週一起挑戰 200 個任務的溫馨聯盟",
    members: ["c_03", "c_06", "c_09"],
    weeklyProgress: 128,
    weeklyTarget: 200,
    questTitle: "本週合力完成 200 個任務",
    bossHp: 650,
    bossMaxHp: 1000,
    bossName: "孤單巨龍",
    sharedIsland: [
      { id: "sh1", catalogId: "castle_tower", label: "聯盟塔", emoji: "🗼", x: 50, y: 30 },
      { id: "sh2", catalogId: "fountain", label: "愛心噴泉", emoji: "⛲", x: 50, y: 55 },
      { id: "sh3", catalogId: "tree_sakura", label: "櫻花樹", emoji: "🌸", x: 20, y: 70 },
      { id: "sh4", catalogId: "tree_sakura", label: "櫻花樹", emoji: "🌸", x: 80, y: 70 },
    ],
  },
  {
    id: "a_02",
    name: "熱戀聯盟",
    description: "互相督促每日儀式，絕不斷連擊",
    members: ["c_01", "c_02", "c_04"],
    weeklyProgress: 245,
    weeklyTarget: 250,
    questTitle: "本週連擊維持 7 天以上",
    bossHp: 920,
    bossMaxHp: 1500,
    bossName: "拖延症大魔王",
    sharedIsland: [
      { id: "sh5", catalogId: "rainbow", label: "彩虹", emoji: "🌈", x: 50, y: 35 },
      { id: "sh6", catalogId: "swan", label: "天鵝", emoji: "🦢", x: 40, y: 65 },
      { id: "sh7", catalogId: "swan", label: "天鵝", emoji: "🦢", x: 60, y: 65 },
    ],
  },
];

export const INITIAL_MOMENTS: Moment[] = [
  { id: "m1", coupleId: "c_01", coupleName: "甜蜜蜜帝國", type: "codex_complete", title: "圖鑑破百！", subtitle: "集滿 120 張記憶卡，解鎖傳說圖鑑室", emoji: "📚", createdAt: "2026-04-17 08:20", likes: 48, likedByMe: false, comments: 9 },
  { id: "m2", coupleId: "c_02", coupleName: "貓奴聯邦", type: "streak", title: "連擊 120 天！", subtitle: "完全沒斷過的甜蜜馬拉松", emoji: "🔥", createdAt: "2026-04-17 07:10", likes: 91, likedByMe: true, comments: 15 },
  { id: "m3", coupleId: "c_03", coupleName: "宅宅小窩", type: "ssr_card", title: "抽到 SSR 記憶卡", subtitle: "『京都和服散步』入手", emoji: "🌸", createdAt: "2026-04-16 22:45", likes: 32, likedByMe: false, comments: 4 },
  { id: "m4", coupleId: "c_04", coupleName: "登山夫婦", type: "anniversary", title: "交往 1000 天！", subtitle: "從初見到現在，已經 1000 個日夜", emoji: "💎", createdAt: "2026-04-16 20:00", likes: 127, likedByMe: true, comments: 28 },
  { id: "m5", coupleId: "c_05", coupleName: "美食帝國", type: "pet_evolve", title: "寵物進化為「傳說」", subtitle: "波嚕兒進化成不死鳳凰", emoji: "🦄", createdAt: "2026-04-16 14:15", likes: 54, likedByMe: false, comments: 11 },
  { id: "m6", coupleId: "c_06", coupleName: "咖啡與書", type: "level_up", title: "王國升至 Lv.18", subtitle: "晉升「熱戀勇者」稱號", emoji: "👑", createdAt: "2026-04-15 19:30", likes: 18, likedByMe: false, comments: 2 },
  { id: "m7", coupleId: "c_07", coupleName: "旅行計畫局", type: "alliance_boss", title: "擊敗聯盟 BOSS！", subtitle: "「孤單巨龍」被 4 對情侶聯手擊倒", emoji: "🐲", createdAt: "2026-04-15 12:00", likes: 73, likedByMe: true, comments: 19 },
];

/** 新使用者禮物匣：空的 */
export const GIFT_INBOX: Gift[] = [];

/** 首頁公告：新手鼓勵 */
export const NOTICE = {
  title: "歡迎來到愛的帝國",
  body: "從 Lv.1 見習情人開始，一步步變成神話級靈魂伴侶 ✨",
};
