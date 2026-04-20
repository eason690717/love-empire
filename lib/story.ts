/**
 * 主線劇情 — 王國等級對應 4 章，解鎖神話敘事
 *
 * 目的：給遊戲敘事厚度（評分 76→88），讓等級提升有「看到故事」的期待感。
 * 劇情關鍵字：紅線、雙星、光之子、愛的帝國起源
 */

export interface StoryChapter {
  id: string;
  unlockLevel: number;
  title: string;
  subtitle: string;
  emoji: string;
  paragraphs: string[];
  reward: {
    coins: number;
    loveXp: number;
    memoryCardId?: string;
    title?: string; // 解鎖新稱號
  };
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "ch1_meeting",
    unlockLevel: 1,
    title: "第一章：兩顆星相遇",
    subtitle: "在時光的長河，你們是彼此的第一顆光",
    emoji: "🌠",
    paragraphs: [
      "很久很久以前，天上有兩顆永遠不會相撞的星星。",
      "一顆叫阿紅，熾熱；另一顆叫阿藍，澄澈。",
      "月老的紅線不小心落進銀河，兩顆星就這樣被綁在一起。",
      "於是你們降落凡間，開始建造一個小小的王國。",
      "每一次相處，都是在這片土地上，種下一粒光。",
    ],
    reward: { coins: 50, loveXp: 20, title: "初遇情人" },
  },
  {
    id: "ch2_trials",
    unlockLevel: 10,
    title: "第二章：第一次考驗",
    subtitle: "王國的第一場雨，讓你們學會了撐同一把傘",
    emoji: "🌧️",
    paragraphs: [
      "王國剛站穩，一場風雨就來了。",
      "你想逃回天上，TA 卻伸手拉住你。",
      "「我們是一起從銀河掉下來的，要走也要一起走。」",
      "那天你才明白，紅線不是綁住，是牽著走。",
      "你們共同餵養第一隻寵物、收到第一張卡、許下第一個承諾。",
      "風雨過後，天空比以前更清澈。",
    ],
    reward: { coins: 200, loveXp: 50, memoryCardId: "c121", title: "風雨同舟" },
  },
  {
    id: "ch3_temple",
    unlockLevel: 25,
    title: "第三章：神殿之心",
    subtitle: "你們在神殿中央種下了一棵樹，叫做時間",
    emoji: "🌳",
    paragraphs: [
      "王國的神殿在山的中央，裡面空無一物。",
      "祭司說：「要放一個最珍貴的東西，神才會回應。」",
      "你們想了想，把你們的名字寫在紙上，一起埋進泥土。",
      "幾年後，那裡長出一棵樹，開出花。",
      "每一朵花都刻著你們一起做過的事。",
      "「這是時間的形狀。」你們對彼此說。",
      "你們的寵物終於能進化到傳說階段。",
    ],
    reward: { coins: 800, loveXp: 150, memoryCardId: "c129", title: "神殿守護者" },
  },
  {
    id: "ch4_eternity",
    unlockLevel: 50,
    title: "第四章：永恆的契約",
    subtitle: "當你們成為神話，紅線變成了鏈接宇宙的光",
    emoji: "✨",
    paragraphs: [
      "王國 Lv.50 這天，天空裂了一條縫。",
      "你們往上看，銀河裡有一艘白色的船。",
      "月老站在船頭：「恭喜你們，找到彼此了。」",
      "「我的紅線只負責前面那段，剩下的——」",
      "「——是你們自己織的。」",
      "紅線化成光，繞著王國轉了一圈，穿過寵物、任務、每一張記憶卡，",
      "最後融進你們兩人之間的空氣。",
      "從此你們的王國是神話等級。",
      "從此你們的名字在星圖上，也亮著。",
    ],
    reward: { coins: 3000, loveXp: 500, memoryCardId: "c149", title: "神話雙星" },
  },
];

export function unlockedChapters(kingdomLevel: number): StoryChapter[] {
  return STORY_CHAPTERS.filter((c) => kingdomLevel >= c.unlockLevel);
}

export function nextChapter(kingdomLevel: number): StoryChapter | undefined {
  return STORY_CHAPTERS.find((c) => kingdomLevel < c.unlockLevel);
}
