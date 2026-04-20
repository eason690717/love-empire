/**
 * 7 日入門計畫（Onboarding Day 1-7）
 *
 * 目的：新手前 7 天有明確引導，從「不知道做什麼」到「養成日常習慣」
 * 留存關鍵：Day 7 留存從 30% 拉到 50%+ 的核心結構
 *
 * 機制：
 *  - 依 Couple 建國日算 day（createdAt）
 *  - 每日一個主題 + 3 個具體任務
 *  - 全部完成獎勵 +200 金 / +50 愛意 / 記憶卡保底
 *  - 錯過今天 → 不算錯誤，明天照樣顯示
 */

export interface OnboardDay {
  day: number;
  title: string;
  subtitle: string;
  emoji: string;
  theme: string;
  tasks: string[];
  reward: { coins: number; loveXp: number; hint?: string };
}

export const ONBOARDING_PLAN: OnboardDay[] = [
  {
    day: 1,
    title: "認識你們的王國",
    subtitle: "今天只要做三件事就好",
    emoji: "🏛",
    theme: "setup",
    tasks: [
      "填好兩個人的暱稱",
      "給寵物取個名字",
      "抽一題深度問答，各自回答",
    ],
    reward: { coins: 30, loveXp: 10, hint: "不要急，慢慢來" },
  },
  {
    day: 2,
    title: "建立儀式感",
    subtitle: "愛情需要每天的小動作",
    emoji: "🌅",
    theme: "ritual",
    tasks: [
      "打一次早晨儀式",
      "打一次夜晚儀式（睡前）",
      "完成 1 個今日任務",
    ],
    reward: { coins: 40, loveXp: 15, hint: "連擊就是這樣開始的" },
  },
  {
    day: 3,
    title: "為對方做一件事",
    subtitle: "愛是動詞，不是名詞",
    emoji: "💝",
    theme: "serve",
    tasks: [
      "新增一個自訂任務給對方",
      "完成一件家事任務（洗碗 / 倒垃圾）",
      "送對方一張記憶卡（若有）",
    ],
    reward: { coins: 50, loveXp: 20, hint: "付出讓愛變得具體" },
  },
  {
    day: 4,
    title: "打造你們的小窩",
    subtitle: "兩個人的空間要一起佈置",
    emoji: "🏡",
    theme: "home",
    tasks: [
      "到 /island 買一件家具",
      "移動家具到你喜歡的位置",
      "餵寵物 3 次",
    ],
    reward: { coins: 60, loveXp: 20, hint: "把日常變成有畫面的" },
  },
  {
    day: 5,
    title: "看見彼此的內在",
    subtitle: "問一些你沒問過的事",
    emoji: "💭",
    theme: "depth",
    tasks: [
      "回答 3 題深度問答",
      "看對方的答案並評分",
      "勾一件人生清單",
    ],
    reward: { coins: 80, loveXp: 30, hint: "親密是知道，不只是愛" },
  },
  {
    day: 6,
    title: "走出去看看世界",
    subtitle: "讓別的情侶看見你們",
    emoji: "🌸",
    theme: "social",
    tasks: [
      "到廣場看別的情侶動態",
      "加一對好友情侶（/friends）",
      "發一則動態到廣場",
    ],
    reward: { coins: 100, loveXp: 40, hint: "愛情不是孤島" },
  },
  {
    day: 7,
    title: "成為習慣",
    subtitle: "這一週，你們已經不一樣了",
    emoji: "✨",
    theme: "habit",
    tasks: [
      "完成今日 3 個任務（combo）",
      "餵寵物到進化 stage 1+",
      "看一次關係儀表板 /insights",
    ],
    reward: { coins: 200, loveXp: 100, hint: "7 天過了，你們的愛意 +235 XP" },
  },
];

/** 依 couple 建國日計算 Day 1-7 */
export function getOnboardingDay(coupleCreatedAt: string | undefined): number | null {
  if (!coupleCreatedAt) return null;
  const created = new Date(coupleCreatedAt).getTime();
  if (isNaN(created)) return null;
  const now = Date.now();
  const days = Math.floor((now - created) / 86400000) + 1;
  if (days < 1 || days > 7) return null;
  return days;
}

export function getTodayPlan(coupleCreatedAt: string | undefined): OnboardDay | null {
  const day = getOnboardingDay(coupleCreatedAt);
  if (!day) return null;
  return ONBOARDING_PLAN.find((p) => p.day === day) ?? null;
}
