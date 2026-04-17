import type {
  Task, Submission, Reward, Redemption, MemoryCard, Pet,
  IslandItem, Ritual, Streak, Couple, CoupleSummary, Alliance, Friendship, Gift,
} from "./types";

export const INITIAL_COUPLE: Couple = {
  id: "me",
  name: "波波帝國",
  inviteCode: "LV4817",
  kingdomLevel: 12,
  coins: 530,
  title: "熱戀勇者",
  queen: { nickname: "阿紅" },
  prince: { nickname: "阿藍" },
  bio: "一起成為神話級靈魂伴侶 💫",
  privacy: "public",
  loveIndex: 2340,
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

export const INITIAL_SUBMISSIONS: Submission[] = [
  { id: "s1", taskId: "t9", taskTitle: "心情不好馬上出現", reward: 200, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:33:59", reviewedAt: "2026/4/11 上午 2:40" },
  { id: "s2", taskId: "t7", taskTitle: "說好話", reward: 10, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:32:49" },
  { id: "s3", taskId: "t1", taskTitle: "丟衣服下去洗", reward: 10, submittedBy: "prince", status: "rejected", createdAt: "2026/4/11 上午 2:32:49", note: "其實是我自己洗的 😂" },
  { id: "s4", taskId: "t2", taskTitle: "摺被子整理床", reward: 10, submittedBy: "prince", status: "rejected", createdAt: "2026/4/11 上午 2:32:49" },
  { id: "s5", taskId: "t3", taskTitle: "幫忙整理 & 倒垃圾", reward: 30, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:32:49" },
  { id: "s6", taskId: "t5", taskTitle: "幫忙煮飯/買飯/飲料", reward: 50, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:32:49" },
  { id: "s7", taskId: "t4", taskTitle: "幫忙拿去烘衣服", reward: 30, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:32:49" },
  { id: "s8", taskId: "t6", taskTitle: "載我上下班", reward: 200, submittedBy: "prince", status: "approved", createdAt: "2026/4/11 上午 2:32:49" },
];

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

export const INITIAL_REDEMPTIONS: Redemption[] = [
  { id: "rd1", rewardId: "r2", rewardTitle: "代替洗碗券", cost: 250, redeemedBy: "queen", status: "unused", createdAt: "2026/4/14" },
];

export const INITIAL_PET: Pet = {
  name: "波嚕",
  stage: 2,
  attrs: { intimacy: 68, communication: 52, romance: 74, care: 85, surprise: 41 },
  lastFedAt: new Date().toISOString(),
};

export const INITIAL_CODEX: MemoryCard[] = [
  { id: "c1", name: "第一次牽手", rarity: "SSR", theme: "romance", emoji: "🤝", obtainedAt: "2026-02-14" },
  { id: "c2", name: "週末早午餐", rarity: "N", theme: "daily", emoji: "🥐", obtainedAt: "2026-04-05" },
  { id: "c3", name: "共撐一把傘", rarity: "R", theme: "daily", emoji: "☂️", obtainedAt: "2026-04-10" },
  { id: "c4", name: "深夜談心", rarity: "SR", theme: "romance", emoji: "🌙", obtainedAt: "2026-04-11" },
  { id: "c5", name: "一起煮飯", rarity: "R", theme: "daily", emoji: "🍳", obtainedAt: "2026-04-12" },
  { id: "c6", name: "情人節限定", rarity: "SSR", theme: "festival", emoji: "💝", obtainedAt: null },
  { id: "c7", name: "京都旅行", rarity: "SR", theme: "travel", emoji: "🏯", obtainedAt: null },
  { id: "c8", name: "生日蛋糕", rarity: "SR", theme: "festival", emoji: "🎂", obtainedAt: null },
  { id: "c9", name: "第一場雪", rarity: "R", theme: "travel", emoji: "❄️", obtainedAt: null },
  { id: "c10", name: "午後散步", rarity: "N", theme: "daily", emoji: "🚶", obtainedAt: "2026-04-09" },
  { id: "c11", name: "貓咪照護日", rarity: "R", theme: "daily", emoji: "🐈", obtainedAt: "2026-04-13" },
  { id: "c12", name: "神話級告白", rarity: "SSR", theme: "romance", emoji: "💍", obtainedAt: null },
];

export const INITIAL_ISLAND: IslandItem[] = [
  { id: "i1", catalogId: "castle", label: "城堡", emoji: "🏰", x: 50, y: 35 },
  { id: "i2", catalogId: "tree_sakura", label: "櫻花樹", emoji: "🌸", x: 20, y: 55 },
  { id: "i3", catalogId: "tree_sakura", label: "櫻花樹", emoji: "🌸", x: 78, y: 52 },
  { id: "i4", catalogId: "fountain", label: "愛心噴泉", emoji: "⛲", x: 50, y: 68 },
  { id: "i5", catalogId: "bench", label: "長椅", emoji: "🪑", x: 35, y: 78 },
  { id: "i6", catalogId: "bench", label: "長椅", emoji: "🪑", x: 65, y: 78 },
  { id: "i7", catalogId: "cat", label: "城堡貓", emoji: "🐈", x: 58, y: 45 },
  { id: "i8", catalogId: "flower", label: "花圃", emoji: "🌷", x: 15, y: 80 },
  { id: "i9", catalogId: "flower", label: "花圃", emoji: "🌷", x: 82, y: 80 },
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

export const INITIAL_STREAK: Streak = {
  current: 14,
  longest: 27,
  lastDate: new Date().toISOString().slice(0, 10),
};

export const LEADERBOARD: CoupleSummary[] = [
  { id: "c_01", name: "甜蜜蜜帝國", kingdomLevel: 38, loveIndex: 9821, streak: 87, codexCompletion: 92, weeklyTasks: 42, title: "神話級靈魂伴侶", emoji: "💞" },
  { id: "c_02", name: "貓奴聯邦", kingdomLevel: 34, loveIndex: 8930, streak: 120, codexCompletion: 85, weeklyTasks: 38, title: "神話級靈魂伴侶", emoji: "🐈‍⬛" },
  { id: "c_03", name: "宅宅小窩", kingdomLevel: 28, loveIndex: 7254, streak: 56, codexCompletion: 74, weeklyTasks: 35, title: "愛的大師", emoji: "🎮" },
  { id: "c_04", name: "登山夫婦", kingdomLevel: 25, loveIndex: 6801, streak: 44, codexCompletion: 68, weeklyTasks: 31, title: "愛的大師", emoji: "⛰️" },
  { id: "c_05", name: "美食帝國", kingdomLevel: 22, loveIndex: 5980, streak: 38, codexCompletion: 61, weeklyTasks: 28, title: "愛的大師", emoji: "🍜" },
  { id: "c_06", name: "咖啡與書", kingdomLevel: 18, loveIndex: 4421, streak: 22, codexCompletion: 54, weeklyTasks: 24, title: "熱戀勇者", emoji: "☕" },
  { id: "c_07", name: "旅行計畫局", kingdomLevel: 15, loveIndex: 3670, streak: 18, codexCompletion: 48, weeklyTasks: 21, title: "熱戀勇者", emoji: "✈️" },
  { id: "me",   name: "波波帝國",     kingdomLevel: 12, loveIndex: 2340, streak: 14, codexCompletion: 42, weeklyTasks: 18, title: "熱戀勇者", emoji: "👑", isSelf: true },
  { id: "c_09", name: "新手情侶",     kingdomLevel: 8,  loveIndex: 1420, streak: 10, codexCompletion: 30, weeklyTasks: 14, title: "見習情人", emoji: "🌱" },
  { id: "c_10", name: "阿貓阿狗",     kingdomLevel: 5,  loveIndex: 890,  streak: 6,  codexCompletion: 18, weeklyTasks: 9,  title: "見習情人", emoji: "🐾" },
];

export const FRIEND_COUPLES: Friendship[] = [
  { coupleId: "c_03", since: "2026-01-12" },
  { coupleId: "c_06", since: "2026-02-08" },
  { coupleId: "c_09", since: "2026-04-02" },
];

export const ALLIANCES: Alliance[] = [
  {
    id: "a_01",
    name: "神仙眷侶團",
    description: "每週一起挑戰 200 個任務的溫馨聯盟",
    members: ["me", "c_03", "c_06", "c_09"],
    weeklyProgress: 128,
    weeklyTarget: 200,
    questTitle: "本週合力完成 200 個任務",
  },
  {
    id: "a_02",
    name: "熱戀聯盟",
    description: "互相督促每日儀式，絕不斷連擊",
    members: ["c_01", "c_02", "c_04"],
    weeklyProgress: 245,
    weeklyTarget: 250,
    questTitle: "本週連擊維持 7 天以上",
  },
];

export const GIFT_INBOX: Gift[] = [
  { id: "g1", fromCoupleName: "宅宅小窩", type: "card", content: "🌸 春日散步卡 (R)", message: "送給你們！春天到啦～", receivedAt: "2026-04-16", read: false },
  { id: "g2", fromCoupleName: "咖啡與書", type: "coins", content: "50 金幣", message: "恭喜你們上新手榜！", receivedAt: "2026-04-14", read: true },
];

export const NOTICE = {
  title: "4 月不是我的謊言，是我的生日",
  body: "請大家傳訊息祝我生日快樂！",
};
