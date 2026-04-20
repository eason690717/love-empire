/**
 * 任務模板 — 按情侶類型分 4 組，每組 15 個，共 60 個。
 * 不是 INITIAL_TASKS（使用者原本預設 19 個保留不動）；
 * 而是在 /tasks 頁「從模板新增」抽屜展示，讓使用者挑著加入自己的任務清單。
 *
 * 設計原則：
 * 1. 同居 (cohabit)：生活交織，家事、煮飯、睡前
 * 2. 附近 (nearby)：見面為主，約會、接送、碰面
 * 3. 遠距 (longdistance)：連結為主，視訊、訊息、跨距離的儀式
 * 4. 通用 (any)：不分類型都能做，語言、情話、承諾
 * 5. 每組都有 easy / mid / high 三種 reward 分佈，不是只有簡單或只有困難
 * 6. 每組都有 chore / wellness / romance / surprise / coop 五類涵蓋
 */

import { Task } from "./types";

type Preset = Omit<Task, "id" | "custom">;

// ─────────────────────────── 同居 (15)
export const PRESETS_COHABIT: Preset[] = [
  { title: "一起煮晚餐",                       category: "coop",     reward: 80,  systemXp: 12, attribute: "care",          direction: "together", relationshipType: "cohabit", coop: true },
  { title: "輪流洗碗（誰做誰主導選音樂）",       category: "chore",    reward: 30,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "幫對方按摩 10 分鐘",               category: "romance",  reward: 100, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "cohabit" },
  { title: "一起做一次大掃除",                  category: "coop",     reward: 120, systemXp: 12, attribute: "care",          direction: "together", relationshipType: "cohabit", coop: true },
  { title: "早上泡一杯飲料給對方",              category: "romance",  reward: 20,  systemXp: 10, attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "晚上一起散步 20 分鐘",              category: "wellness", reward: 40,  systemXp: 8,  attribute: "communication", direction: "together", relationshipType: "cohabit" },
  { title: "主動接對方上下班",                  category: "chore",    reward: 150, systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "睡前聊天 15 分鐘（不碰手機）",      category: "romance",  reward: 50,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "cohabit" },
  { title: "幫對方處理一件他討厭的家事",        category: "chore",    reward: 50,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "一起看一集影集",                    category: "coop",     reward: 60,  systemXp: 12, attribute: "intimacy",      direction: "together", relationshipType: "cohabit", coop: true },
  { title: "一起去採買日常用品",                category: "coop",     reward: 40,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "cohabit", coop: true },
  { title: "為對方做早餐",                      category: "romance",  reward: 50,  systemXp: 10, attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "在家一起健身 30 分鐘",              category: "wellness", reward: 60,  systemXp: 8,  attribute: "care",          direction: "together", relationshipType: "cohabit" },
  { title: "同時放下手機 1 小時專心陪對方",    category: "romance",  reward: 80,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "cohabit" },
  { title: "親手洗一次對方的衣服",              category: "chore",    reward: 60,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "cohabit" },
];

// ─────────────────────────── 附近 (15)
export const PRESETS_NEARBY: Preset[] = [
  { title: "約一次外食約會",                    category: "romance",  reward: 100, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "nearby" },
  { title: "一起出門散步 30 分鐘",              category: "wellness", reward: 40,  systemXp: 8,  attribute: "communication", direction: "together", relationshipType: "nearby" },
  { title: "送早餐到對方家",                    category: "surprise", reward: 80,  systemXp: 15, attribute: "care",          direction: "together", relationshipType: "nearby" },
  { title: "一起去超市買菜",                    category: "coop",     reward: 40,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "nearby", coop: true },
  { title: "一起去運動/健身房",                 category: "wellness", reward: 60,  systemXp: 8,  attribute: "care",          direction: "together", relationshipType: "nearby" },
  { title: "中午碰面吃個飯",                    category: "romance",  reward: 60,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "nearby" },
  { title: "臨時驚喜拜訪",                      category: "surprise", reward: 200, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "nearby" },
  { title: "陪對方處理一件麻煩事（跑腿/陪辦）", category: "chore",    reward: 100, systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "nearby" },
  { title: "一起上一堂新課（烘焙/陶藝/語言）",  category: "coop",     reward: 150, systemXp: 12, attribute: "communication", direction: "together", relationshipType: "nearby", coop: true, unlockLevel: 5 },
  { title: "去對方家住一晚",                    category: "romance",  reward: 150, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "nearby" },
  { title: "一起看一場電影（電影院）",          category: "coop",     reward: 100, systemXp: 12, attribute: "intimacy",      direction: "together", relationshipType: "nearby", coop: true },
  { title: "幫對方搬/載東西",                   category: "chore",    reward: 80,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "nearby" },
  { title: "陪對方看醫生",                      category: "wellness", reward: 100, systemXp: 8,  attribute: "care",          direction: "together", relationshipType: "nearby" },
  { title: "週末短途小旅行（一天來回）",        category: "surprise", reward: 300, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "nearby", unlockLevel: 15 },
  { title: "一起做「只有這附近才有的事」",      category: "coop",     reward: 120, systemXp: 12, attribute: "communication", direction: "together", relationshipType: "nearby", coop: true },
];

// ─────────────────────────── 遠距 (15)
export const PRESETS_LONGDISTANCE: Preset[] = [
  { title: "視訊 30 分鐘（不做別的事）",        category: "romance",  reward: 80,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "longdistance" },
  { title: "寄一張手寫明信片",                  category: "surprise", reward: 200, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "longdistance" },
  { title: "早安/晚安語音訊息",                 category: "romance",  reward: 20,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "longdistance" },
  { title: "一起同步看同一部電影",              category: "coop",     reward: 80,  systemXp: 12, attribute: "intimacy",      direction: "together", relationshipType: "longdistance", coop: true },
  { title: "分享今天的天空照片",                category: "romance",  reward: 15,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "longdistance" },
  { title: "寫一封 500 字以上的長訊息",         category: "romance",  reward: 100, systemXp: 10, attribute: "communication", direction: "together", relationshipType: "longdistance" },
  { title: "為對方錄一段歌/唱一首歌",           category: "surprise", reward: 150, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "longdistance" },
  { title: "時差內一通長電話（≥30 分）",        category: "romance",  reward: 80,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "longdistance" },
  { title: "準備下次見面的驚喜",                category: "surprise", reward: 300, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "longdistance" },
  { title: "寄一份小禮物到對方家",              category: "surprise", reward: 300, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "longdistance" },
  { title: "同步玩一款線上遊戲 30 分",          category: "coop",     reward: 80,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "longdistance", coop: true },
  { title: "拍「你現在的樣子」傳給對方",        category: "romance",  reward: 20,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "longdistance" },
  { title: "一起線上跟同一堂課/直播",           category: "coop",     reward: 60,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "longdistance", coop: true },
  { title: "寫一段「為什麼想你」給對方",        category: "romance",  reward: 100, systemXp: 10, attribute: "communication", direction: "together", relationshipType: "longdistance" },
  { title: "買下次見面的車票/機票",             category: "surprise", reward: 500, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "longdistance", unlockLevel: 5 },
];

// ─────────────────────────── 已婚 (15) — parenting / 婚姻向
// 設計原則：時間壓力大、小孩在身邊、要「重新當情侶不是爸媽」
export const PRESETS_MARRIED: Preset[] = [
  { title: "小孩睡後專心聊 15 分（不滑手機）",  category: "romance",  reward: 80,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "married" },
  { title: "替對方顧小孩 1 小時（放風券）",       category: "surprise", reward: 200, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "married" },
  { title: "一起回憶結婚前的某件小事",             category: "romance",  reward: 50,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "married" },
  { title: "主動排一個兩人獨處的晚上",             category: "surprise", reward: 150, systemXp: 15, attribute: "intimacy",      direction: "together", relationshipType: "married" },
  { title: "把小孩丟給爺奶，約會 2 小時",          category: "romance",  reward: 300, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "married", unlockLevel: 5 },
  { title: "睡前說一句「謝謝你今天」",             category: "romance",  reward: 15,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "married" },
  { title: "主動做對方討厭的家務一週",             category: "chore",    reward: 200, systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "married", unlockLevel: 5 },
  { title: "在小孩面前稱讚對方一次",               category: "romance",  reward: 30,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "married" },
  { title: "一起回顧小孩成長的一張照片",           category: "coop",     reward: 40,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "married", coop: true },
  { title: "婚後第一次一起看婚禮影片",             category: "romance",  reward: 100, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "married" },
  { title: "結婚紀念日前主動規劃驚喜",             category: "surprise", reward: 500, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "married", unlockLevel: 5 },
  { title: "為對方打理一件他平常煩的事",           category: "chore",    reward: 80,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "married" },
  { title: "一起做一次原本只為小孩做的事",         category: "coop",     reward: 60,  systemXp: 12, attribute: "intimacy",      direction: "together", relationshipType: "married", coop: true },
  { title: "睡前交換一件「今天為你感謝的事」",     category: "romance",  reward: 40,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "married" },
  { title: "週末留一餐沒有小孩的飯局（訂餐在家）", category: "romance",  reward: 120, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "married" },
];

// ─────────────────────────── 通用 (15)
export const PRESETS_ANY: Preset[] = [
  { title: "一句情話",                          category: "romance",  reward: 10,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "主動說「我愛你」",                  category: "romance",  reward: 20,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "any" },
  { title: "一個深擁抱（10 秒以上）",           category: "romance",  reward: 20,  systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "any" },
  { title: "問「你今天好嗎」認真聽完",          category: "romance",  reward: 30,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "寫一張紙條藏在包包/桌上",           category: "surprise", reward: 50,  systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any" },
  { title: "訂一個驚喜禮物",                    category: "surprise", reward: 200, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any" },
  { title: "一起做一題深度問答",                category: "coop",     reward: 60,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "any", coop: true },
  { title: "回顧共同的老照片",                  category: "romance",  reward: 40,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "記得一個小細節（朋友名/喜好）",      category: "romance",  reward: 30,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "為對方慶祝一個小里程碑",            category: "surprise", reward: 100, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any" },
  { title: "原諒一件可以不追究的事",            category: "romance",  reward: 150, systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any", unlockLevel: 5 },
  { title: "主動說一次「謝謝」",                category: "romance",  reward: 15,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "說一次「對不起，我錯了」",          category: "romance",  reward: 80,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "記住對方的夢想/目標主動問進度",     category: "romance",  reward: 60,  systemXp: 10, attribute: "communication", direction: "together", relationshipType: "any" },
  { title: "為對方拒絕一件佔掉相處時間的事",    category: "romance",  reward: 100, systemXp: 10, attribute: "intimacy",      direction: "together", relationshipType: "any", unlockLevel: 5 },
  // 2026-04-20 擴充 +15 通用，依新類別↔屬性規則（wellness↔intimacy / romance↔romance）
  { title: "一起冥想/呼吸練習 10 分鐘",         category: "wellness", reward: 40,  systemXp: 8,  attribute: "intimacy",      direction: "together", relationshipType: "any" },
  { title: "今天主動擁抱對方三次",               category: "wellness", reward: 30,  systemXp: 8,  attribute: "intimacy",      direction: "together", relationshipType: "any" },
  { title: "幫對方按摩肩頸 5 分鐘",              category: "wellness", reward: 50,  systemXp: 8,  attribute: "intimacy",      direction: "together", relationshipType: "any" },
  { title: "說一個只有你們懂的笑話",             category: "romance",  reward: 30,  systemXp: 10, attribute: "romance",       direction: "together", relationshipType: "any" },
  { title: "為對方寫一句現在的感受",             category: "romance",  reward: 40,  systemXp: 10, attribute: "romance",       direction: "together", relationshipType: "any" },
  { title: "回憶第一次見面的細節",               category: "romance",  reward: 60,  systemXp: 10, attribute: "romance",       direction: "together", relationshipType: "any" },
  { title: "一起決定一件未來的小事（下次旅行）", category: "coop",     reward: 80,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "any", coop: true },
  { title: "分享今天最難受的一刻",               category: "coop",     reward: 70,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "any", coop: true },
  { title: "交換今天感謝對方的一件事",           category: "coop",     reward: 50,  systemXp: 12, attribute: "communication", direction: "together", relationshipType: "any", coop: true },
  { title: "幫對方完成他待辦清單的一項",         category: "chore",    reward: 60,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "any" },
  { title: "主動處理一件你平常不碰的家事",       category: "chore",    reward: 80,  systemXp: 5,  attribute: "care",          direction: "together", relationshipType: "any" },
  { title: "意外的小禮物（<100 元）",            category: "surprise", reward: 100, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any" },
  { title: "臨時改計畫帶對方去某地",             category: "surprise", reward: 200, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any", unlockLevel: 5 },
  { title: "準備對方最愛的食物",                 category: "surprise", reward: 120, systemXp: 15, attribute: "surprise",      direction: "together", relationshipType: "any" },
  { title: "今天說 3 次「我愛你」",              category: "romance",  reward: 30,  systemXp: 10, attribute: "romance",       direction: "together", relationshipType: "any" },
];

export const ALL_PRESETS: Preset[] = [
  ...PRESETS_COHABIT,
  ...PRESETS_NEARBY,
  ...PRESETS_LONGDISTANCE,
  ...PRESETS_MARRIED,
  ...PRESETS_ANY,
];

/** 根據情侶類型回傳推薦的任務模板 — 主類 15 + 通用 15 = 30 個 */
export function getPresetsForType(type: "cohabit" | "nearby" | "longdistance" | "married"): Preset[] {
  const main =
    type === "cohabit" ? PRESETS_COHABIT :
    type === "nearby" ? PRESETS_NEARBY :
    type === "longdistance" ? PRESETS_LONGDISTANCE :
    PRESETS_MARRIED;
  return [...main, ...PRESETS_ANY];
}
