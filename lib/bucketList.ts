/**
 * 情侶人生清單 — 100 件一生想一起做的事
 * 根據使用者提供的優化版清單建構，分 6 分類：
 *   romantic (浪漫約會)  / daily (日常小確幸) / outdoor (戶外冒險)
 *   growth (共同成長)    / playful (趣味挑戰)  / tender (溫柔瞬間)
 *
 * rarity 依「難度 / 重量 / 一生一次感」分級：
 *   N (~64 件)：日常就能做的
 *   R (~22 件)：需要特別安排、有體驗感
 *   SR (~12 件)：人生大事級
 *   SSR (~2 件)：畢生一次
 */

import { BucketItem } from "./types";

export const BUCKET_LIST: BucketItem[] = [
  // ═══════════════════════════════════════ 一、浪漫約會與儀式感 (20)
  { id: "b001", category: "romantic", rarity: "N",  emoji: "🌃", title: "一起在山頂或海邊看一次夜景" },
  { id: "b002", category: "romantic", rarity: "R",  emoji: "🎢", title: "穿情侶裝去遊樂園玩一整天" },
  { id: "b003", category: "romantic", rarity: "N",  emoji: "🌙", title: "一起去電影院看一場深夜首映" },
  { id: "b004", category: "romantic", rarity: "N",  emoji: "🎂", title: "互相慶祝彼此的每一個生日" },
  { id: "b005", category: "romantic", rarity: "R",  emoji: "🎁", title: "互送一份親手製作的 DIY 禮物" },
  { id: "b006", category: "romantic", rarity: "R",  emoji: "🌅", title: "一起跨年迎接第一道曙光" },
  { id: "b007", category: "romantic", rarity: "R",  emoji: "🎤", title: "一起去看喜歡的歌手/樂團演唱會" },
  { id: "b008", category: "romantic", rarity: "N",  emoji: "🛐", title: "一起去廟裡或教堂祈福" },
  { id: "b009", category: "romantic", rarity: "N",  emoji: "🤫", title: "瞞著對方偷買他捨不得買的東西" },
  { id: "b010", category: "romantic", rarity: "R",  emoji: "🐬", title: "一起去海洋館看海豚與水母" },
  { id: "b011", category: "romantic", rarity: "N",  emoji: "🎄", title: "一起逛聖誕耶誕城或燈會" },
  { id: "b012", category: "romantic", rarity: "SR", emoji: "💍", title: "策劃一場驚喜求婚或大型紀念日" },
  { id: "b013", category: "romantic", rarity: "N",  emoji: "📚", title: "去書店互選一本書給對方" },
  { id: "b014", category: "romantic", rarity: "R",  emoji: "📸", title: "去照相館拍一組情侶寫真" },
  { id: "b015", category: "romantic", rarity: "N",  emoji: "📱", title: "戴上成套的情侶手機殼" },
  { id: "b016", category: "romantic", rarity: "R",  emoji: "💋", title: "在摩天輪最高點時親吻" },
  { id: "b017", category: "romantic", rarity: "N",  emoji: "🎨", title: "一起參觀一次畫展或博物館" },
  { id: "b018", category: "romantic", rarity: "N",  emoji: "💌", title: "為對方手寫一封長長的情書" },
  { id: "b019", category: "romantic", rarity: "N",  emoji: "☔", title: "一起在雨中撐傘散步" },
  { id: "b020", category: "romantic", rarity: "N",  emoji: "📷", title: "在朋友圈大方秀出對方的照片" },

  // ═══════════════════════════════════════ 二、日常小確幸 (20)
  { id: "b021", category: "daily", rarity: "N",  emoji: "🛒", title: "一起採買一週的生活用品" },
  { id: "b022", category: "daily", rarity: "N",  emoji: "👕", title: "互換衣服穿，拍一張搞怪照" },
  { id: "b023", category: "daily", rarity: "N",  emoji: "😘", title: "早上醒來給對方一個早安吻" },
  { id: "b024", category: "daily", rarity: "N",  emoji: "🛏️", title: "一起賴床什麼都不做只聊天" },
  { id: "b025", category: "daily", rarity: "N",  emoji: "💇", title: "互相幫對方吹頭髮" },
  { id: "b026", category: "daily", rarity: "N",  emoji: "🍳", title: "一起下廚做一頓豐富的晚餐" },
  { id: "b027", category: "daily", rarity: "N",  emoji: "🌙", title: "睡前互相說一聲晚安" },
  { id: "b028", category: "daily", rarity: "N",  emoji: "✂️", title: "幫對方剪一次指甲或修一次眉" },
  { id: "b029", category: "daily", rarity: "N",  emoji: "📺", title: "一起窩在沙發上追完一部長劇" },
  { id: "b030", category: "daily", rarity: "N",  emoji: "🪥", title: "互相幫對方刷牙看鏡子笑" },
  { id: "b031", category: "daily", rarity: "N",  emoji: "💃", title: "在客廳空地跳一支笨拙的舞" },
  { id: "b032", category: "daily", rarity: "N",  emoji: "🎧", title: "共用一副耳機聽同一首歌" },
  { id: "b033", category: "daily", rarity: "N",  emoji: "🥗", title: "記住對方所有飲食忌諱與愛好" },
  { id: "b034", category: "daily", rarity: "N",  emoji: "🛋️", title: "一起給家裡傢俱重新排版或佈置" },
  { id: "b035", category: "daily", rarity: "N",  emoji: "🥞", title: "為對方做一頓營養的早餐" },
  { id: "b036", category: "daily", rarity: "N",  emoji: "🍽️", title: "一起洗碗，一個洗一個擦乾" },
  { id: "b037", category: "daily", rarity: "R",  emoji: "💬", title: "在睡前進行一次深度的心靈對談" },
  { id: "b038", category: "daily", rarity: "N",  emoji: "🥬", title: "週末一起逛一次早市或傳統市場" },
  { id: "b039", category: "daily", rarity: "N",  emoji: "💆", title: "幫對方按摩肩膀或泡腳放鬆" },
  { id: "b040", category: "daily", rarity: "N",  emoji: "🍔", title: "穿著睡衣在家裡吃垃圾食物" },

  // ═══════════════════════════════════════ 三、戶外冒險 (15)
  { id: "b041", category: "outdoor", rarity: "N",  emoji: "🐚", title: "一起去海邊踏浪、撿貝殼" },
  { id: "b042", category: "outdoor", rarity: "SR", emoji: "🪂", title: "嘗試一次高空彈跳或跳傘" },
  { id: "b043", category: "outdoor", rarity: "R",  emoji: "🏕️", title: "一起去深山裡露營看滿天星斗" },
  { id: "b044", category: "outdoor", rarity: "R",  emoji: "🚴", title: "一起騎自行車環河或環島" },
  { id: "b045", category: "outdoor", rarity: "SR", emoji: "🤿", title: "一起去潛水看海底的世界" },
  { id: "b046", category: "outdoor", rarity: "R",  emoji: "🥾", title: "共同完成一次長途爬山健行" },
  { id: "b047", category: "outdoor", rarity: "R",  emoji: "🚗", title: "來場說走就走的自駕旅行" },
  { id: "b048", category: "outdoor", rarity: "SR", emoji: "⛷️", title: "一起去滑雪或嘗試溜冰" },
  { id: "b049", category: "outdoor", rarity: "N",  emoji: "🦒", title: "一起去動物園餵食可愛小動物" },
  { id: "b050", category: "outdoor", rarity: "N",  emoji: "🌲", title: "一起去森林深呼吸享受芬多精" },
  { id: "b051", category: "outdoor", rarity: "N",  emoji: "🍓", title: "一起採草莓、摘橘子等農家體驗" },
  { id: "b052", category: "outdoor", rarity: "N",  emoji: "📮", title: "在不同城市收集當地明信片" },
  { id: "b053", category: "outdoor", rarity: "R",  emoji: "🏃", title: "一起跑一次路跑或馬拉松" },
  { id: "b054", category: "outdoor", rarity: "SR", emoji: "✈️", title: "嘗試一次在異國街頭擁吻" },
  { id: "b055", category: "outdoor", rarity: "R",  emoji: "🚣", title: "一起划獨木舟或 SUP 立槳" },

  // ═══════════════════════════════════════ 四、共同成長與承諾 (15)
  { id: "b056", category: "growth", rarity: "SR", emoji: "💰", title: "建立一個共同儲蓄帳戶為目標存錢" },
  { id: "b057", category: "growth", rarity: "N",  emoji: "💒", title: "一起去參加朋友的婚禮" },
  { id: "b058", category: "growth", rarity: "SR", emoji: "🐾", title: "領養並一起養一隻寵物" },
  { id: "b059", category: "growth", rarity: "R",  emoji: "🫂", title: "吵架後雙方主動認錯和好" },
  { id: "b060", category: "growth", rarity: "N",  emoji: "🏫", title: "一起回彼此的母校看看" },
  { id: "b061", category: "growth", rarity: "R",  emoji: "🎙️", title: "錄一段給 10 年後對方的真心話" },
  { id: "b062", category: "growth", rarity: "N",  emoji: "👫", title: "互相介紹自己的好朋友給對方" },
  { id: "b063", category: "growth", rarity: "N",  emoji: "🍽️", title: "一起陪對方的家人吃飯" },
  { id: "b064", category: "growth", rarity: "SR", emoji: "💍", title: "一起挑選一對意義非凡的戒指" },
  { id: "b065", category: "growth", rarity: "R",  emoji: "📖", title: "共同學習一項新技能" },
  { id: "b066", category: "growth", rarity: "R",  emoji: "🤒", title: "對方生病時寸步不離地照顧" },
  { id: "b067", category: "growth", rarity: "SR", emoji: "🏠", title: "一起規劃未來的退休生活或買房" },
  { id: "b068", category: "growth", rarity: "N",  emoji: "📖", title: "每個月一起讀完一本書並分享" },
  { id: "b069", category: "growth", rarity: "N",  emoji: "🏷️", title: "為對方起一個只有你們懂的暱稱" },
  { id: "b070", category: "growth", rarity: "R",  emoji: "🌟", title: "堅定地支持對方的夢想" },

  // ═══════════════════════════════════════ 五、趣味挑戰 (10)
  { id: "b071", category: "playful", rarity: "R",  emoji: "🗝️", title: "一起挑戰高難度密室逃脫" },
  { id: "b072", category: "playful", rarity: "N",  emoji: "🍢", title: "夜市從街頭吃到街尾" },
  { id: "b073", category: "playful", rarity: "N",  emoji: "👻", title: "一起挑戰看一場最恐怖的電影" },
  { id: "b074", category: "playful", rarity: "N",  emoji: "🎤", title: "KTV 唱那首你們的主題曲" },
  { id: "b075", category: "playful", rarity: "N",  emoji: "🎮", title: "玩遊戲，輸的答應對方一個要求" },
  { id: "b076", category: "playful", rarity: "N",  emoji: "🎭", title: "互相模仿對方說話口吻或姿勢" },
  { id: "b077", category: "playful", rarity: "N",  emoji: "🤝", title: "公開場合悄悄牽手放在口袋" },
  { id: "b078", category: "playful", rarity: "N",  emoji: "🎯", title: "一起去抓娃娃直到抓到為止" },
  { id: "b079", category: "playful", rarity: "R",  emoji: "🔄", title: "互換一天身分體驗對方的工作" },
  { id: "b080", category: "playful", rarity: "N",  emoji: "🍷", title: "一起喝到微醺然後胡言亂語" },

  // ═══════════════════════════════════════ 六、溫柔瞬間 (20)
  { id: "b081", category: "tender", rarity: "N",  emoji: "🌧️", title: "一起淋一場溫暖的春雨" },
  { id: "b082", category: "tender", rarity: "N",  emoji: "🍠", title: "冬天街頭共吃一個滾燙烤地瓜" },
  { id: "b083", category: "tender", rarity: "N",  emoji: "📸", title: "拍下對方的「醜照」存在秘密相冊" },
  { id: "b084", category: "tender", rarity: "N",  emoji: "🏟️", title: "陪對方做他有興趣但你沒興趣的事" },
  { id: "b085", category: "tender", rarity: "R",  emoji: "♨️", title: "一起去泡一次溫泉" },
  { id: "b086", category: "tender", rarity: "N",  emoji: "💋", title: "在人群中大方親吻對方的臉頰" },
  { id: "b087", category: "tender", rarity: "R",  emoji: "🕯️", title: "為對方準備一次浪漫的燭光晚餐" },
  { id: "b088", category: "tender", rarity: "N",  emoji: "🌅", title: "一起追一場日出" },
  { id: "b089", category: "tender", rarity: "N",  emoji: "🍂", title: "幫對方撥開掉在頭髮上的落葉" },
  { id: "b090", category: "tender", rarity: "N",  emoji: "🌙", title: "深夜巷弄散步聽影子重疊" },
  { id: "b091", category: "tender", rarity: "N",  emoji: "🎙️", title: "錄下彼此打呼或說夢話" },
  { id: "b092", category: "tender", rarity: "N",  emoji: "🍤", title: "互相幫對方剝蝦或挑出蔥蒜" },
  { id: "b093", category: "tender", rarity: "N",  emoji: "🎂", title: "記得對方父母的生日並送上問候" },
  { id: "b094", category: "tender", rarity: "R",  emoji: "🎆", title: "一起看一場煙火大會" },
  { id: "b095", category: "tender", rarity: "SR", emoji: "🫂", title: "失落時給對方一個安靜且長久的擁抱" },
  { id: "b096", category: "tender", rarity: "R",  emoji: "🌸", title: "一起看一次櫻花盛開" },
  { id: "b097", category: "tender", rarity: "R",  emoji: "🧩", title: "共同完成一套 1000 片的拼圖" },
  { id: "b098", category: "tender", rarity: "N",  emoji: "🏥", title: "陪對方去醫院看醫生或做檢查" },
  { id: "b099", category: "tender", rarity: "SSR", emoji: "💒", title: "領取結婚證，正式結為夫妻" },
  { id: "b100", category: "tender", rarity: "SSR", emoji: "👴", title: "手牽手共度餘生，直到白頭偕老" },
];

export function getBucketItemById(id: string): BucketItem | undefined {
  return BUCKET_LIST.find((b) => b.id === id);
}

export function bucketProgressByCategory(done: Set<string>): Record<string, { done: number; total: number }> {
  const out: Record<string, { done: number; total: number }> = {};
  for (const item of BUCKET_LIST) {
    if (!out[item.category]) out[item.category] = { done: 0, total: 0 };
    out[item.category].total++;
    if (done.has(item.id)) out[item.category].done++;
  }
  return out;
}
