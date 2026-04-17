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

export const INITIAL_TASKS: Task[] = [
  // 生活雜事類
  { id: "t1", title: "丟衣服下去洗", category: "chore", reward: 10, attribute: "care" },
  { id: "t2", title: "摺被子整理床", category: "chore", reward: 10, attribute: "care" },
  { id: "t3", title: "幫忙整理 & 倒垃圾", category: "chore", reward: 30, attribute: "care" },
  { id: "t4", title: "幫忙拿去烘衣服", category: "chore", reward: 30, attribute: "care" },
  { id: "t5", title: "幫忙煮飯/買飯/飲料", category: "chore", reward: 50, attribute: "care" },
  { id: "t6", title: "載我上下班", category: "chore", reward: 200, attribute: "care" },
  // 浪漫時刻
  { id: "t7", title: "說好話 / 情話一句", category: "romance", reward: 10, attribute: "communication" },
  { id: "t8", title: "主動擁抱一次", category: "romance", reward: 20, attribute: "intimacy" },
  { id: "t9", title: "心情不好馬上出現", category: "romance", reward: 200, attribute: "intimacy" },
  { id: "t10", title: "驚喜小禮物", category: "surprise", reward: 150, attribute: "surprise" },
  // 健康管理
  { id: "t11", title: "陪伴運動 30 分鐘", category: "wellness", reward: 60, attribute: "care" },
  { id: "t12", title: "一起睡前閱讀", category: "wellness", reward: 30, attribute: "communication" },
  // 合作任務
  { id: "t13", title: "一起看一部電影 🎬 (合作)", category: "coop", reward: 80, attribute: "intimacy", coop: true },
  { id: "t14", title: "互相讚美 10 句 💕 (合作)", category: "coop", reward: 100, attribute: "communication", coop: true },
];

/** 新使用者的申報紀錄：空的 */
export const INITIAL_SUBMISSIONS: Submission[] = [];

export const INITIAL_REWARDS: Reward[] = [
  { id: "r1", title: "演唱會一場（含熱舞）", cost: 100, icon: "🎤" },
  { id: "r2", title: "代替洗碗券", cost: 250, icon: "🍽️" },
  { id: "r3", title: "長輩擋箭牌", cost: 300, icon: "🛡️" },
  { id: "r4", title: "現金回饋 50 元", cost: 500, icon: "💴" },
  { id: "r5", title: "現金回饋 100 元", cost: 900, icon: "💴" },
  { id: "r6", title: "高級貓咪照護（含餵食鏟屎、照片）", cost: 1200, icon: "🐱" },
  { id: "r7", title: "一日約會主導權", cost: 800, icon: "📅" },
  { id: "r8", title: "按摩 30 分鐘券", cost: 400, icon: "💆" },
];

/** 新使用者的兌換紀錄：空的 */
export const INITIAL_REDEMPTIONS: Redemption[] = [];

/** 新使用者的寵物：蛋階段，屬性全 0，等情侶完成任務餵養 */
export const INITIAL_PET: Pet = {
  name: "小小蛋",
  stage: 0,
  attrs: { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 },
  lastFedAt: new Date().toISOString(),
};

/** 圖鑑清單本身是定義，每個項目 obtainedAt:null 代表未收集。新使用者全部未收集 */
export const INITIAL_CODEX: MemoryCard[] = [
  { id: "c1", name: "第一次牽手", rarity: "SSR", theme: "romance", emoji: "🤝", obtainedAt: null },
  { id: "c2", name: "週末早午餐", rarity: "N", theme: "daily", emoji: "🥐", obtainedAt: null },
  { id: "c3", name: "共撐一把傘", rarity: "R", theme: "daily", emoji: "☂️", obtainedAt: null },
  { id: "c4", name: "深夜談心", rarity: "SR", theme: "romance", emoji: "🌙", obtainedAt: null },
  { id: "c5", name: "一起煮飯", rarity: "R", theme: "daily", emoji: "🍳", obtainedAt: null },
  { id: "c6", name: "情人節限定", rarity: "SSR", theme: "festival", emoji: "💝", obtainedAt: null },
  { id: "c7", name: "京都旅行", rarity: "SR", theme: "travel", emoji: "🏯", obtainedAt: null },
  { id: "c8", name: "生日蛋糕", rarity: "SR", theme: "festival", emoji: "🎂", obtainedAt: null },
  { id: "c9", name: "第一場雪", rarity: "R", theme: "travel", emoji: "❄️", obtainedAt: null },
  { id: "c10", name: "午後散步", rarity: "N", theme: "daily", emoji: "🚶", obtainedAt: null },
  { id: "c11", name: "貓咪照護日", rarity: "R", theme: "daily", emoji: "🐈", obtainedAt: null },
  { id: "c12", name: "神話級告白", rarity: "SSR", theme: "romance", emoji: "💍", obtainedAt: null },
];

/** 新使用者的島嶼：只有一座城堡 + 一隻貓咪 (新手禮物)，其他家具要自己買 */
export const INITIAL_ISLAND: IslandItem[] = [
  { id: "i1", catalogId: "castle", label: "城堡", emoji: "🏰", x: 50, y: 35 },
  { id: "i2", catalogId: "cat", label: "新手貓", emoji: "🐈", x: 58, y: 45 },
];

export const ISLAND_SHOP: { id: string; label: string; emoji: string; price: number }[] = [
  { id: "tree_sakura", label: "櫻花樹", emoji: "🌸", price: 50 },
  { id: "tree_pine", label: "松樹", emoji: "🌲", price: 40 },
  { id: "fountain", label: "愛心噴泉", emoji: "⛲", price: 200 },
  { id: "bench", label: "長椅", emoji: "🪑", price: 30 },
  { id: "cat", label: "城堡貓", emoji: "🐈", price: 120 },
  { id: "flower", label: "花圃", emoji: "🌷", price: 20 },
  { id: "castle_tower", label: "城堡塔", emoji: "🗼", price: 500 },
  { id: "lantern", label: "燈籠", emoji: "🏮", price: 35 },
];

export const INITIAL_RITUAL: Ritual = {
  date: new Date().toISOString().slice(0, 10),
  morning: false,
  night: false,
};

/** 新使用者的連擊：從 0 開始 */
export const INITIAL_STREAK: Streak = {
  current: 0,
  longest: 0,
  lastDate: "",
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

/** 新使用者還沒加入任何聯盟；每個聯盟都有一隻 BOSS 可以合力攻擊 */
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
