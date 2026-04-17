/**
 * 深度問答題庫 — 200 題，10 類 × 20 題
 * 參考：36 Questions That Lead to Love (Arthur Aron) · Gottman Love Map ·
 *      Esther Perel · 結合台灣情侶文化適度調整
 */

export type QuestionCategory =
  | "past"     // 童年 / 過往
  | "family"   // 家庭 / 原生
  | "future"   // 夢想 / 未來
  | "romance"  // 浪漫 / 愛情
  | "values"   // 價值觀 / 信念
  | "fears"    // 恐懼 / 脆弱
  | "prefs"    // 喜好 / 習慣
  | "conflict" // 衝突 / 溝通
  | "intimacy" // 親密 / 默契
  | "humor";   // 幽默 / 奇想

export type QuestionDepth = "light" | "medium" | "deep";

export interface Question {
  id: string;
  category: QuestionCategory;
  depth: QuestionDepth;
  text: string;
}

export const CATEGORY_LABELS: Record<QuestionCategory, { label: string; emoji: string; color: string }> = {
  past:     { label: "童年過往", emoji: "👶", color: "#ffcda8" },
  family:   { label: "家庭原生", emoji: "👨‍👩‍👧", color: "#ffb4cf" },
  future:   { label: "夢想未來", emoji: "🔮", color: "#b8d8ff" },
  romance:  { label: "浪漫愛情", emoji: "💞", color: "#ff8eae" },
  values:   { label: "價值信念", emoji: "⚖️", color: "#d4a574" },
  fears:    { label: "恐懼脆弱", emoji: "🌧️", color: "#b0b0c8" },
  prefs:    { label: "喜好習慣", emoji: "☕", color: "#a8d89a" },
  conflict: { label: "衝突溝通", emoji: "💬", color: "#ffd689" },
  intimacy: { label: "親密默契", emoji: "🫂", color: "#ff9fbc" },
  humor:    { label: "幽默奇想", emoji: "🎭", color: "#d7a8ff" },
};

export const DEPTH_LABELS: Record<QuestionDepth, { label: string; xp: number }> = {
  light:  { label: "輕鬆", xp: 5 },
  medium: { label: "深入", xp: 10 },
  deep:   { label: "靈魂拷問", xp: 20 },
};

// ============================================================
// 200 題題庫
// ============================================================

export const QUESTIONS: Question[] = [
  // ─────────────────────────── 童年過往 (20)
  { id: "q001", category: "past", depth: "light",  text: "你童年最難忘的一個早晨是？" },
  { id: "q002", category: "past", depth: "medium", text: "5 歲之前你有什麼清晰的記憶？" },
  { id: "q003", category: "past", depth: "light",  text: "小學時最喜歡的老師是誰？為什麼？" },
  { id: "q004", category: "past", depth: "light",  text: "你最常被媽媽罵的事情是什麼？" },
  { id: "q005", category: "past", depth: "medium", text: "第一次心動的對象是誰？" },
  { id: "q006", category: "past", depth: "medium", text: "青少年時最叛逆的一件事？" },
  { id: "q007", category: "past", depth: "light",  text: "你童年的綽號是什麼？" },
  { id: "q008", category: "past", depth: "deep",   text: "有沒有一個家人的話影響你很久？" },
  { id: "q009", category: "past", depth: "deep",   text: "第一次覺得世界不公平是什麼時候？" },
  { id: "q010", category: "past", depth: "light",  text: "小時候想過長大要做什麼？現在呢？" },
  { id: "q011", category: "past", depth: "medium", text: "國中時你的自我認同是什麼？" },
  { id: "q012", category: "past", depth: "medium", text: "高中最好的朋友是誰？你們關係現在如何？" },
  { id: "q013", category: "past", depth: "light",  text: "第一次獨自旅行是幾歲？發生什麼？" },
  { id: "q014", category: "past", depth: "deep",   text: "有沒有一件「如果當初…」會很不一樣的事？" },
  { id: "q015", category: "past", depth: "medium", text: "最懷念哪一個年紀？" },
  { id: "q016", category: "past", depth: "medium", text: "家人中你跟誰最像？哪方面？" },
  { id: "q017", category: "past", depth: "light",  text: "你小時候最想要但沒得到的東西是？" },
  { id: "q018", category: "past", depth: "medium", text: "童年有沒有被誤會過的事情？" },
  { id: "q019", category: "past", depth: "light",  text: "家裡有哪個「傳統」現在想延續？" },
  { id: "q020", category: "past", depth: "deep",   text: "如果可以回到任何一天，你會回到哪一天？" },

  // ─────────────────────────── 家庭原生 (20)
  { id: "q021", category: "family", depth: "deep",   text: "你覺得父母的婚姻給你什麼啟發？" },
  { id: "q022", category: "family", depth: "medium", text: "家族裡誰是你最想學習的人？" },
  { id: "q023", category: "family", depth: "deep",   text: "你跟父親最深的一次對話是？" },
  { id: "q024", category: "family", depth: "light",  text: "媽媽做的哪一道菜你會想教給孩子？" },
  { id: "q025", category: "family", depth: "deep",   text: "家人之間有什麼「沒說出口的話」？" },
  { id: "q026", category: "family", depth: "medium", text: "遇到困難時你會第一個聯絡誰？" },
  { id: "q027", category: "family", depth: "deep",   text: "你希望以後家庭關係跟原生家庭哪裡一樣、哪裡不一樣？" },
  { id: "q028", category: "family", depth: "medium", text: "兄弟姐妹對你的意義？(獨生子女：你怎麼看自己的成長？)" },
  { id: "q029", category: "family", depth: "medium", text: "跟父母最近一次大爭執是什麼？" },
  { id: "q030", category: "family", depth: "deep",   text: "你覺得自己會是怎樣的父母？" },
  { id: "q031", category: "family", depth: "medium", text: "家裡誰是你的心靈支柱？" },
  { id: "q032", category: "family", depth: "deep",   text: "如果能改變原生家庭一件事，會改什麼？" },
  { id: "q033", category: "family", depth: "medium", text: "長輩裡有沒有一個人你特別想孝順？" },
  { id: "q034", category: "family", depth: "medium", text: "你覺得我的家人對我影響最深的是？" },
  { id: "q035", category: "family", depth: "light",  text: "家庭節日中最重視的是哪一個？" },
  { id: "q036", category: "family", depth: "deep",   text: "對「家」的定義是什麼？" },
  { id: "q037", category: "family", depth: "deep",   text: "原生家庭教你的最珍貴的事情？" },
  { id: "q038", category: "family", depth: "medium", text: "如果我們要見家長，你最緊張什麼？" },
  { id: "q039", category: "family", depth: "medium", text: "你童年家裡的氣氛大部分時間是？" },
  { id: "q040", category: "family", depth: "medium", text: "家人中最欣賞你的是誰？為什麼？" },

  // ─────────────────────────── 夢想未來 (20)
  { id: "q041", category: "future", depth: "light",  text: "10 年後你想住在哪裡？" },
  { id: "q042", category: "future", depth: "medium", text: "如果只能選一件事做到退休，會是什麼？" },
  { id: "q043", category: "future", depth: "light",  text: "有想實現的 bucket list 嗎？" },
  { id: "q044", category: "future", depth: "deep",   text: "你覺得我們五年後會怎樣？" },
  { id: "q045", category: "future", depth: "deep",   text: "對「成功」的定義是什麼？" },
  { id: "q046", category: "future", depth: "light",  text: "如果中樂透 5000 萬，第一件事做什麼？" },
  { id: "q047", category: "future", depth: "deep",   text: "想養孩子嗎？幾個？" },
  { id: "q048", category: "future", depth: "deep",   text: "你覺得人生最重要的三件事？" },
  { id: "q049", category: "future", depth: "medium", text: "有什麼夢想一直沒實踐？為什麼？" },
  { id: "q050", category: "future", depth: "medium", text: "退休時想做什麼？" },
  { id: "q051", category: "future", depth: "light",  text: "最想培養的習慣？" },
  { id: "q052", category: "future", depth: "medium", text: "如果可以轉行，想做什麼？" },
  { id: "q053", category: "future", depth: "deep",   text: "你最害怕失去的東西是什麼？" },
  { id: "q054", category: "future", depth: "light",  text: "想去一個國家定居嗎？" },
  { id: "q055", category: "future", depth: "deep",   text: "對「老去」的想像？" },
  { id: "q056", category: "future", depth: "light",  text: "想學一項新技能，會是？" },
  { id: "q057", category: "future", depth: "deep",   text: "10 年後你希望自己是怎樣的人？" },
  { id: "q058", category: "future", depth: "medium", text: "如果有一年的時間只做一件事，選什麼？" },
  { id: "q059", category: "future", depth: "deep",   text: "你覺得 100 歲的你會後悔沒做什麼？" },
  { id: "q060", category: "future", depth: "deep",   text: "你和我，有什麼共同夢想？" },

  // ─────────────────────────── 浪漫愛情 (20)
  { id: "q061", category: "romance", depth: "light",  text: "我做哪件事最讓你心動？" },
  { id: "q062", category: "romance", depth: "deep",   text: "第一次覺得愛上我是什麼時候？" },
  { id: "q063", category: "romance", depth: "medium", text: "你最浪漫的定義是什麼？" },
  { id: "q064", category: "romance", depth: "medium", text: "在我身上發現最驚喜的特質是？" },
  { id: "q065", category: "romance", depth: "deep",   text: "你覺得兩個人走下去最關鍵是什麼？" },
  { id: "q066", category: "romance", depth: "light",  text: "最喜歡一起做的事？" },
  { id: "q067", category: "romance", depth: "light",  text: "我的哪個表情最讓你融化？" },
  { id: "q068", category: "romance", depth: "light",  text: "想去哪裡度蜜月？（或：想像版）" },
  { id: "q069", category: "romance", depth: "light",  text: "情人節最想收到什麼樣的禮物？" },
  { id: "q070", category: "romance", depth: "medium", text: "什麼時候你最想抱緊我？" },
  { id: "q071", category: "romance", depth: "medium", text: "我們之間最甜的回憶？" },
  { id: "q072", category: "romance", depth: "deep",   text: "你覺得愛情跟喜歡的差別？" },
  { id: "q073", category: "romance", depth: "medium", text: "如果有人想追我，你會有什麼反應？" },
  { id: "q074", category: "romance", depth: "medium", text: "你最愛我哪個缺點？" },
  { id: "q075", category: "romance", depth: "light",  text: "想給我的 2 個字暱稱？" },
  { id: "q076", category: "romance", depth: "deep",   text: "你希望我們關係五年後保有什麼？" },
  { id: "q077", category: "romance", depth: "medium", text: "跟我在一起後你改變最大的是？" },
  { id: "q078", category: "romance", depth: "light",  text: "我們最「默契」的一次？" },
  { id: "q079", category: "romance", depth: "deep",   text: "如果我失憶了，你會怎麼讓我重新愛上你？" },
  { id: "q080", category: "romance", depth: "light",  text: "用一首歌形容我們，是哪一首？" },

  // ─────────────────────────── 價值信念 (20)
  { id: "q081", category: "values", depth: "deep",   text: "你覺得人性本善還是本惡？" },
  { id: "q082", category: "values", depth: "medium", text: "相信神嗎？為什麼？" },
  { id: "q083", category: "values", depth: "deep",   text: "死後世界你的想像？" },
  { id: "q084", category: "values", depth: "medium", text: "對金錢的看法？" },
  { id: "q085", category: "values", depth: "medium", text: "對名聲的看法？" },
  { id: "q086", category: "values", depth: "deep",   text: "如果救一個陌生人會讓你斷一條腿，救嗎？" },
  { id: "q087", category: "values", depth: "light",  text: "對動物有感情嗎？會為流浪動物停下來嗎？" },
  { id: "q088", category: "values", depth: "deep",   text: "最重視的個人原則？" },
  { id: "q089", category: "values", depth: "medium", text: "你覺得「好人」有標準答案嗎？" },
  { id: "q090", category: "values", depth: "deep",   text: "謊言能拯救關係嗎？" },
  { id: "q091", category: "values", depth: "deep",   text: "你覺得婚姻的本質是什麼？" },
  { id: "q092", category: "values", depth: "deep",   text: "對父母養育是否有「義務」？" },
  { id: "q093", category: "values", depth: "medium", text: "政治立場對你重要嗎？" },
  { id: "q094", category: "values", depth: "light",  text: "環保是你生活的一部分嗎？" },
  { id: "q095", category: "values", depth: "deep",   text: "有什麼東西你永遠不會讓步？" },
  { id: "q096", category: "values", depth: "deep",   text: "你會為了什麼事放棄工作？" },
  { id: "q097", category: "values", depth: "deep",   text: "對「忠誠」的定義？" },
  { id: "q098", category: "values", depth: "light",  text: "最尊敬的歷史人物是？" },
  { id: "q099", category: "values", depth: "medium", text: "覺得自己最強的價值觀是？" },
  { id: "q100", category: "values", depth: "deep",   text: "我們兩個價值觀最不同的地方？" },

  // ─────────────────────────── 恐懼脆弱 (20)
  { id: "q101", category: "fears", depth: "medium", text: "你最怕什麼？" },
  { id: "q102", category: "fears", depth: "deep",   text: "有什麼事你一直沒告訴任何人？" },
  { id: "q103", category: "fears", depth: "deep",   text: "過去最痛的一次傷害？" },
  { id: "q104", category: "fears", depth: "medium", text: "有沒有做過讓自己後悔的事？" },
  { id: "q105", category: "fears", depth: "deep",   text: "最擔心關於自己的什麼？" },
  { id: "q106", category: "fears", depth: "medium", text: "有沒有哭過很久的事？" },
  { id: "q107", category: "fears", depth: "deep",   text: "最孤單的一次感覺是什麼時候？" },
  { id: "q108", category: "fears", depth: "deep",   text: "有什麼恐懼只有你一個人懂？" },
  { id: "q109", category: "fears", depth: "deep",   text: "怕失去我嗎？怎麼怕的？" },
  { id: "q110", category: "fears", depth: "deep",   text: "你最大的不安全感來自哪裡？" },
  { id: "q111", category: "fears", depth: "medium", text: "哭的時候最希望誰陪？" },
  { id: "q112", category: "fears", depth: "deep",   text: "對死亡的想法？" },
  { id: "q113", category: "fears", depth: "deep",   text: "有沒有被背叛過？" },
  { id: "q114", category: "fears", depth: "deep",   text: "最深的自我懷疑是什麼？" },
  { id: "q115", category: "fears", depth: "deep",   text: "有沒有曾經想放棄一切？" },
  { id: "q116", category: "fears", depth: "deep",   text: "什麼會讓你覺得軟弱但又必須面對？" },
  { id: "q117", category: "fears", depth: "deep",   text: "有沒有什麼你做了卻一直沒告訴我？" },
  { id: "q118", category: "fears", depth: "medium", text: "我能怎樣讓你覺得安全？" },
  { id: "q119", category: "fears", depth: "deep",   text: "你最怕讓我看到的一面是？" },
  { id: "q120", category: "fears", depth: "deep",   text: "有沒有一個瞬間讓你覺得「我配不上她/他」？" },

  // ─────────────────────────── 喜好習慣 (20)
  { id: "q121", category: "prefs", depth: "light",  text: "最愛的食物？" },
  { id: "q122", category: "prefs", depth: "light",  text: "不吃的東西？" },
  { id: "q123", category: "prefs", depth: "light",  text: "早餐的 3 個首選？" },
  { id: "q124", category: "prefs", depth: "light",  text: "最愛的咖啡／茶／飲料？" },
  { id: "q125", category: "prefs", depth: "light",  text: "最喜歡的音樂類型？" },
  { id: "q126", category: "prefs", depth: "light",  text: "最常聽的一首歌？" },
  { id: "q127", category: "prefs", depth: "light",  text: "最愛的電影？" },
  { id: "q128", category: "prefs", depth: "light",  text: "會重複看的書／電影／影集？" },
  { id: "q129", category: "prefs", depth: "light",  text: "最舒服的穿搭？" },
  { id: "q130", category: "prefs", depth: "light",  text: "起床第一件事做什麼？" },
  { id: "q131", category: "prefs", depth: "light",  text: "睡前習慣？" },
  { id: "q132", category: "prefs", depth: "light",  text: "最喜歡的顏色？" },
  { id: "q133", category: "prefs", depth: "light",  text: "最愛的季節？" },
  { id: "q134", category: "prefs", depth: "light",  text: "一天中最放鬆的時刻？" },
  { id: "q135", category: "prefs", depth: "medium", text: "喜歡獨處還是有人陪？" },
  { id: "q136", category: "prefs", depth: "medium", text: "有哪個日常小習慣自己覺得很可愛？" },
  { id: "q137", category: "prefs", depth: "medium", text: "累的時候怎麼放鬆？" },
  { id: "q138", category: "prefs", depth: "light",  text: "最愛的天氣？" },
  { id: "q139", category: "prefs", depth: "light",  text: "最想去的餐廳？" },
  { id: "q140", category: "prefs", depth: "medium", text: "有沒有什麼怪癖？" },

  // ─────────────────────────── 衝突溝通 (20)
  { id: "q141", category: "conflict", depth: "medium", text: "生氣的時候希望我怎麼做？" },
  { id: "q142", category: "conflict", depth: "medium", text: "最不喜歡我用什麼方式溝通？" },
  { id: "q143", category: "conflict", depth: "medium", text: "我們最常為什麼吵？" },
  { id: "q144", category: "conflict", depth: "medium", text: "吵架後你需要多久才能好？" },
  { id: "q145", category: "conflict", depth: "deep",   text: "你覺得「冷戰」該避免嗎？" },
  { id: "q146", category: "conflict", depth: "deep",   text: "怎樣算是被傷到了？" },
  { id: "q147", category: "conflict", depth: "deep",   text: "我道歉的時候你聽進去了嗎？" },
  { id: "q148", category: "conflict", depth: "medium", text: "有什麼小事會讓你突然心情變差？" },
  { id: "q149", category: "conflict", depth: "medium", text: "什麼舉動最能安撫你？" },
  { id: "q150", category: "conflict", depth: "medium", text: "當我心情不好你希望怎麼處理？" },
  { id: "q151", category: "conflict", depth: "deep",   text: "我說過最傷你的話是？" },
  { id: "q152", category: "conflict", depth: "medium", text: "我做過最暖的事是？" },
  { id: "q153", category: "conflict", depth: "medium", text: "聊天 vs 肢體安慰你更需要哪個？" },
  { id: "q154", category: "conflict", depth: "medium", text: "你覺得我聽你說話的時候夠專心嗎？" },
  { id: "q155", category: "conflict", depth: "deep",   text: "我們溝通可以進步的一件事？" },
  { id: "q156", category: "conflict", depth: "medium", text: "生氣時不能碰你的哪個話題？" },
  { id: "q157", category: "conflict", depth: "light",  text: "你喜歡在公共場合被抱嗎？" },
  { id: "q158", category: "conflict", depth: "deep",   text: "我的哪個習慣你其實不愛但沒說？" },
  { id: "q159", category: "conflict", depth: "medium", text: "你希望我什麼時候多表達一些？" },
  { id: "q160", category: "conflict", depth: "deep",   text: "遇到大問題你想怎麼一起解？" },

  // ─────────────────────────── 親密默契 (20)
  { id: "q161", category: "intimacy", depth: "medium", text: "喜歡怎樣的擁抱？" },
  { id: "q162", category: "intimacy", depth: "medium", text: "我的哪個肢體動作你特別喜歡？" },
  { id: "q163", category: "intimacy", depth: "light",  text: "牽手或擁抱你選哪個？" },
  { id: "q164", category: "intimacy", depth: "deep",   text: "想一起嘗試但還沒做的事？" },
  { id: "q165", category: "intimacy", depth: "deep",   text: "什麼時候你覺得我們最親密？" },
  { id: "q166", category: "intimacy", depth: "medium", text: "喜歡我說什麼樣的話？" },
  { id: "q167", category: "intimacy", depth: "light",  text: "想像我們兩個月獨處會做什麼？" },
  { id: "q168", category: "intimacy", depth: "medium", text: "最舒服的相處距離（身體／情感）？" },
  { id: "q169", category: "intimacy", depth: "medium", text: "有沒有一個願望關於我們的？" },
  { id: "q170", category: "intimacy", depth: "light",  text: "我的哪個笑容讓你心動？" },
  { id: "q171", category: "intimacy", depth: "medium", text: "什麼情境下你覺得最有「戀愛感」？" },
  { id: "q172", category: "intimacy", depth: "light",  text: "希望我怎麼 surprise 你？" },
  { id: "q173", category: "intimacy", depth: "deep",   text: "一個你渴望但沒開口的要求？" },
  { id: "q174", category: "intimacy", depth: "light",  text: "有沒有一個舞步／活動想一起做？" },
  { id: "q175", category: "intimacy", depth: "medium", text: "給彼此空間的標準是？" },
  { id: "q176", category: "intimacy", depth: "light",  text: "你喜歡共用浴室（洗手台、杯子）嗎？" },
  { id: "q177", category: "intimacy", depth: "light",  text: "我睡覺的習慣你喜歡哪一個？" },
  { id: "q178", category: "intimacy", depth: "deep",   text: "你會希望老了還保有的親密互動？" },
  { id: "q179", category: "intimacy", depth: "light",  text: "一起看影集 vs 各自看自己喜歡的？" },
  { id: "q180", category: "intimacy", depth: "deep",   text: "「最懂你」的 3 個表達愛的方式？" },

  // ─────────────────────────── 幽默奇想 (20)
  { id: "q181", category: "humor", depth: "light",  text: "如果變成一隻動物會是？" },
  { id: "q182", category: "humor", depth: "light",  text: "有超能力想要哪一個？" },
  { id: "q183", category: "humor", depth: "light",  text: "如果能跟任何人喝咖啡？" },
  { id: "q184", category: "humor", depth: "light",  text: "有沒有什麼「奇怪」的夢想？" },
  { id: "q185", category: "humor", depth: "light",  text: "最想扮演哪個虛構角色？" },
  { id: "q186", category: "humor", depth: "light",  text: "想回到哪個年代看看？" },
  { id: "q187", category: "humor", depth: "light",  text: "如果獨自上無人島帶 3 件東西？" },
  { id: "q188", category: "humor", depth: "light",  text: "如果只能留一個 App 會是？" },
  { id: "q189", category: "humor", depth: "medium", text: "笑到哭過的是什麼事？" },
  { id: "q190", category: "humor", depth: "light",  text: "最想跟名人約吃什麼？" },
  { id: "q191", category: "humor", depth: "light",  text: "有什麼中二的想像？" },
  { id: "q192", category: "humor", depth: "light",  text: "最想擁有的虛構物品？" },
  { id: "q193", category: "humor", depth: "light",  text: "最想發明什麼東西？" },
  { id: "q194", category: "humor", depth: "light",  text: "如果是情侶綜藝你會想上哪個節目？" },
  { id: "q195", category: "humor", depth: "medium", text: "最想被寫進書裡的一段故事？" },
  { id: "q196", category: "humor", depth: "light",  text: "想開一家什麼店？" },
  { id: "q197", category: "humor", depth: "light",  text: "最想學一種技能（但幾乎不可能）？" },
  { id: "q198", category: "humor", depth: "light",  text: "最想成為什麼職業（幻想向）？" },
  { id: "q199", category: "humor", depth: "light",  text: "我們的愛情如果是電影，片名是？" },
  { id: "q200", category: "humor", depth: "medium", text: "想一起做一件「世界末日前一定要做」的事？" },
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function randomQuestion(
  filter?: { category?: QuestionCategory; depth?: QuestionDepth; excludeIds?: string[] },
): Question | undefined {
  let pool = QUESTIONS;
  if (filter?.category) pool = pool.filter((q) => q.category === filter.category);
  if (filter?.depth) pool = pool.filter((q) => q.depth === filter.depth);
  if (filter?.excludeIds?.length) pool = pool.filter((q) => !filter.excludeIds!.includes(q.id));
  if (!pool.length) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}
