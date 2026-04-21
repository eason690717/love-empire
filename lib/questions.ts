/**
 * 深度問答題庫 — 610 題，17 分類（目標擴至 999）
 *   q001-q200: 原 10 類 × 20 題
 *   q201-q400: 深度對談 3 子類 (listening / unsaid / shared)
 *   q401-q410: 遊戲感互動題 (choice / timed / roleplay / relay / gesture)
 *   q411-q610: 4 大靈魂拷問篇（v1.8 擴充，使用者靈感）
 *     · devotion 心動偏愛 50 / scars 脆弱傷痕 50 / tolerance 矛盾包容 50 / commitment 未來承諾 50
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
  | "humor"    // 幽默 / 奇想
  | "listening" // 深度對談 — 聆聽品質
  | "unsaid"    // 深度對談 — 未說出口
  | "shared"    // 深度對談 — 共寫記憶
  | "devotion"  // 心動與偏愛 — 確認你是唯一（v1.8 新）
  | "scars"     // 脆弱與共情 — 看見彼此的傷痕
  | "tolerance" // 矛盾與包容 — 一起面對問題
  | "commitment"; // 未來與承諾 — 聊完就想過一生

export type QuestionDepth = "light" | "medium" | "deep";

export interface Question {
  id: string;
  category: QuestionCategory;
  depth: QuestionDepth;
  text: string;
  /** 大師策展精選 100 題池 */
  featured?: boolean;
  /** 互動類型（非純問答）：選擇、計時、角色扮演、接龍、手勢 — 給遊戲感 */
  kind?: "choice" | "timed" | "roleplay" | "relay" | "gesture";
}

export const CATEGORY_LABELS: Record<QuestionCategory, { label: string; emoji: string; color: string }> = {
  past:      { label: "童年過往", emoji: "👶", color: "#ffcda8" },
  family:    { label: "家庭原生", emoji: "👨‍👩‍👧", color: "#ffb4cf" },
  future:    { label: "夢想未來", emoji: "🔮", color: "#b8d8ff" },
  romance:   { label: "浪漫愛情", emoji: "💞", color: "#ff8eae" },
  values:    { label: "價值信念", emoji: "⚖️", color: "#d4a574" },
  fears:     { label: "恐懼脆弱", emoji: "🌧️", color: "#b0b0c8" },
  prefs:     { label: "喜好習慣", emoji: "☕", color: "#a8d89a" },
  conflict:  { label: "衝突溝通", emoji: "💬", color: "#ffd689" },
  intimacy:  { label: "親密默契", emoji: "🫂", color: "#ff9fbc" },
  humor:     { label: "幽默奇想", emoji: "🎭", color: "#d7a8ff" },
  listening: { label: "聆聽品質", emoji: "👂", color: "#7ec8e3" },
  unsaid:    { label: "未說出口", emoji: "🤫", color: "#e89ac7" },
  shared:    { label: "共寫記憶", emoji: "✍️", color: "#f4c879" },
  devotion:   { label: "心動偏愛", emoji: "💘", color: "#ff4f88" },
  scars:      { label: "脆弱傷痕", emoji: "🌿", color: "#8ea9bf" },
  tolerance:  { label: "矛盾包容", emoji: "🕊️", color: "#b5b0e0" },
  commitment: { label: "未來承諾", emoji: "💍", color: "#f0b877" },
};

export const DEPTH_LABELS: Record<QuestionDepth, { label: string; xp: number }> = {
  light:  { label: "輕鬆", xp: 5 },
  medium: { label: "深入", xp: 10 },
  deep:   { label: "靈魂拷問", xp: 20 },
};

export const KIND_LABELS: Record<NonNullable<Question["kind"]>, { label: string; emoji: string }> = {
  choice:   { label: "二擇一", emoji: "🔀" },
  timed:    { label: "30 秒限時", emoji: "⏱️" },
  roleplay: { label: "角色扮演", emoji: "🎭" },
  relay:    { label: "接龍", emoji: "🔁" },
  gesture:  { label: "動作表達", emoji: "👋" },
};

// ============================================================
// 410 題題庫
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
  { id: "q008", category: "past", depth: "deep",   text: "有沒有一句話，你至今聽見還會胃痛？是誰說的？如果對方收回那句話，你會變成什麼樣的人？" },
  { id: "q009", category: "past", depth: "deep",   text: "你第一次意識到「大人也會對小孩說謊」是什麼時候？發現那刻你失去了什麼？" },
  { id: "q010", category: "past", depth: "light",  text: "小時候想過長大要做什麼？現在呢？" },
  { id: "q011", category: "past", depth: "medium", text: "國中時你的自我認同是什麼？" },
  { id: "q012", category: "past", depth: "medium", text: "高中最好的朋友是誰？你們關係現在如何？" },
  { id: "q013", category: "past", depth: "light",  text: "第一次獨自旅行是幾歲？發生什麼？" },
  { id: "q014", category: "past", depth: "deep",   text: "過去的某個十字路口，你選了 A；如果選了 B，現在的你跟我在一起嗎？這題讓你不安嗎？為什麼？" },
  { id: "q015", category: "past", depth: "medium", text: "最懷念哪一個年紀？" },
  { id: "q016", category: "past", depth: "medium", text: "家人中你跟誰最像？哪方面？" },
  { id: "q017", category: "past", depth: "light",  text: "你小時候最想要但沒得到的東西是？" },
  { id: "q018", category: "past", depth: "medium", text: "童年有沒有被誤會過的事情？" },
  { id: "q019", category: "past", depth: "light",  text: "家裡有哪個「傳統」現在想延續？" },
  { id: "q020", category: "past", depth: "deep",   text: "有沒有某一天，你到現在還沒原諒那天的自己？如果能對那天的你說一句話，你會說什麼？" },

  // ─────────────────────────── 家庭原生 (20)
  { id: "q021", category: "family", depth: "deep",   text: "看著父母的婚姻長大，你最怕自己哪部分變得像他們？你做過哪些努力去避免？" },
  { id: "q022", category: "family", depth: "medium", text: "家族裡誰是你最想學習的人？" },
  { id: "q023", category: "family", depth: "deep",   text: "你跟父親（或母親）之間，有哪句話你一直想說、卻知道此生很可能不會說出口？說不出口是為了保護誰？" },
  { id: "q024", category: "family", depth: "light",  text: "媽媽做的哪一道菜你會想教給孩子？" },
  { id: "q025", category: "family", depth: "deep",   text: "家裡有哪個「大家都知道、但永遠不談」的事？你覺得那沉默是誰在守護？代價在誰身上？" },
  { id: "q026", category: "family", depth: "medium", text: "遇到困難時你會第一個聯絡誰？" },
  { id: "q027", category: "family", depth: "deep",   text: "你在原生家庭學到的哪個「愛的樣子」，其實不太健康、但到現在還會不自覺重演？你在我身上做過嗎？" },
  { id: "q028", category: "family", depth: "medium", text: "兄弟姐妹對你的意義？(獨生子女：你怎麼看自己的成長？)" },
  { id: "q029", category: "family", depth: "medium", text: "跟父母最近一次大爭執是什麼？" },
  { id: "q030", category: "family", depth: "deep",   text: "如果以後我們有小孩，你最怕自己在情緒上崩掉的一刻是什麼情境？你會怎麼請我攔住你？" },
  { id: "q031", category: "family", depth: "medium", text: "家裡誰是你的心靈支柱？" },
  { id: "q032", category: "family", depth: "deep",   text: "你一生扮演的家庭角色（長子/小孩/調解者/透明人…）是什麼？哪一刻你累了但還裝沒事？" },
  { id: "q033", category: "family", depth: "medium", text: "長輩裡有沒有一個人你特別想孝順？" },
  { id: "q034", category: "family", depth: "medium", text: "你覺得我的家人對我影響最深的是？" },
  { id: "q035", category: "family", depth: "light",  text: "家庭節日中最重視的是哪一個？" },
  { id: "q036", category: "family", depth: "deep",   text: "你有沒有過一段時期，「家」是一個你不想回去的地方？那段時期你把自己寄放在哪裡？" },
  { id: "q037", category: "family", depth: "deep",   text: "父母有哪件事你曾經暗自發誓「絕對不要變成那樣」，結果你發現你正在做同樣的事？那刻你對自己說了什麼？" },
  { id: "q038", category: "family", depth: "medium", text: "如果我們要見家長，你最緊張什麼？" },
  { id: "q039", category: "family", depth: "medium", text: "你童年家裡的氣氛大部分時間是？" },
  { id: "q040", category: "family", depth: "medium", text: "家人中最欣賞你的是誰？為什麼？" },

  // ─────────────────────────── 夢想未來 (20)
  { id: "q041", category: "future", depth: "light",  text: "10 年後你想住在哪裡？" },
  { id: "q042", category: "future", depth: "medium", text: "如果只能選一件事做到退休，會是什麼？" },
  { id: "q043", category: "future", depth: "light",  text: "有想實現的 bucket list 嗎？" },
  { id: "q044", category: "future", depth: "deep",   text: "想像我們五年後某個普通的週三晚上 9 點——你在做什麼？我在做什麼？這個畫面讓你感覺的是溫暖還是窒息？" },
  { id: "q045", category: "future", depth: "deep",   text: "你追的「成功」，有多少是為了證明給某個人看？那個人是誰？那個人真的有在看嗎？" },
  { id: "q046", category: "future", depth: "light",  text: "如果中樂透 5000 萬，第一件事做什麼？" },
  { id: "q047", category: "future", depth: "deep",   text: "如果生小孩這件事你我的意願有落差，你願意走到哪一步？有沒有某個底線，一旦越過你會離開？" },
  { id: "q048", category: "future", depth: "deep",   text: "如果只能留下三件事陪你走到老，其他全部放手——你留的那三件，是你真的要的，還是你怕失去的？差別在哪？" },
  { id: "q049", category: "future", depth: "medium", text: "有什麼夢想一直沒實踐？為什麼？" },
  { id: "q050", category: "future", depth: "medium", text: "退休時想做什麼？" },
  { id: "q051", category: "future", depth: "light",  text: "最想培養的習慣？" },
  { id: "q052", category: "future", depth: "medium", text: "如果可以轉行，想做什麼？" },
  { id: "q053", category: "future", depth: "deep",   text: "如果你知道三年後會失去一樣對你重要的東西，你希望先被告知、還是被蒙在鼓裡活完那三年？為什麼？" },
  { id: "q054", category: "future", depth: "light",  text: "想去一個國家定居嗎？" },
  { id: "q055", category: "future", depth: "deep",   text: "你想像過自己 70 歲的某個早上醒來的樣子嗎？那個畫面裡，我在嗎？如果在，我們上一句對話是什麼？" },
  { id: "q056", category: "future", depth: "light",  text: "想學一項新技能，會是？" },
  { id: "q057", category: "future", depth: "deep",   text: "10 年後回頭看現在的你，會最心疼哪一面？會最想罵哪一面？" },
  { id: "q058", category: "future", depth: "medium", text: "如果有一年的時間只做一件事，選什麼？" },
  { id: "q059", category: "future", depth: "deep",   text: "如果彌留時只能留一段錄音給一個人，你會錄給誰？講什麼？為什麼那個人到現在還不知道？" },
  { id: "q060", category: "future", depth: "deep",   text: "我們的「共同夢想」裡，有哪個其實主要是你的、你只是希望我陪跑？如果我跟不上，你會獨自走嗎？" },

  // ─────────────────────────── 浪漫愛情 (20)
  { id: "q061", category: "romance", depth: "light",  text: "我做哪件事最讓你心動？" },
  { id: "q062", category: "romance", depth: "deep",   text: "你「確定」愛上我是哪一刻？那一刻之前你在對抗什麼？確定之後你失去了什麼（例如某種自由、某個想像）？" },
  { id: "q063", category: "romance", depth: "medium", text: "你最浪漫的定義是什麼？" },
  { id: "q064", category: "romance", depth: "medium", text: "在我身上發現最驚喜的特質是？" },
  { id: "q065", category: "romance", depth: "deep",   text: "你有沒有某一刻「閃過要離開我的念頭」？是什麼樣的情境？讓你留下的不是我，而是什麼？" },
  { id: "q066", category: "romance", depth: "light",  text: "最喜歡一起做的事？" },
  { id: "q067", category: "romance", depth: "light",  text: "我的哪個表情最讓你融化？" },
  { id: "q068", category: "romance", depth: "light",  text: "想去哪裡度蜜月？（或：想像版）" },
  { id: "q069", category: "romance", depth: "light",  text: "情人節最想收到什麼樣的禮物？" },
  { id: "q070", category: "romance", depth: "medium", text: "什麼時候你最想抱緊我？" },
  { id: "q071", category: "romance", depth: "medium", text: "我們之間最甜的回憶？" },
  { id: "q072", category: "romance", depth: "deep",   text: "你愛過的人裡，有哪個特質是我沒有的、但你偶爾還會想念？那個想念讓你內疚嗎？" },
  { id: "q073", category: "romance", depth: "medium", text: "如果有人想追我，你會有什麼反應？" },
  { id: "q074", category: "romance", depth: "medium", text: "你最愛我哪個缺點？" },
  { id: "q075", category: "romance", depth: "light",  text: "想給我的 2 個字暱稱？" },
  { id: "q076", category: "romance", depth: "deep",   text: "我們現在相處中，有什麼是你最怕在五年後會消失的？你為了留住它，默默做了哪些我還不知道的事？" },
  { id: "q077", category: "romance", depth: "medium", text: "跟我在一起後你改變最大的是？" },
  { id: "q078", category: "romance", depth: "light",  text: "我們最「默契」的一次？" },
  { id: "q079", category: "romance", depth: "deep",   text: "如果我某天醒來不認得你、但很快會再愛上一個人——你希望是別人，還是再追我一次？誠實點。" },
  { id: "q080", category: "romance", depth: "light",  text: "用一首歌形容我們，是哪一首？" },

  // ─────────────────────────── 價值信念 (20)
  { id: "q081", category: "values", depth: "deep",   text: "有沒有一次你對某個陌生人湧出惡意、又立刻壓下去？當時你真正在氣的，是他還是別的東西？" },
  { id: "q082", category: "values", depth: "medium", text: "相信神嗎？為什麼？" },
  { id: "q083", category: "values", depth: "deep",   text: "如果死後確定是一片黑，沒有重逢——你今天還願意為誰付出到骨子裡？這個「沒有回報」的答案改變你怎麼愛嗎？" },
  { id: "q084", category: "values", depth: "medium", text: "對金錢的看法？" },
  { id: "q085", category: "values", depth: "medium", text: "對名聲的看法？" },
  { id: "q086", category: "values", depth: "deep",   text: "如果救一個陌生人需要永久犧牲一隻手，你會猶豫多久？如果那個陌生人是我，會不一樣嗎？差別告訴了你什麼？" },
  { id: "q087", category: "values", depth: "light",  text: "對動物有感情嗎？會為流浪動物停下來嗎？" },
  { id: "q088", category: "values", depth: "deep",   text: "你做過最不像自己的一件事，是為了什麼？那件事之後，你變得更像自己，還是更遠離？" },
  { id: "q089", category: "values", depth: "medium", text: "你覺得「好人」有標準答案嗎？" },
  { id: "q090", category: "values", depth: "deep",   text: "你對我說過最大的一個善意謊言是什麼？現在我已經知道了——你會想拿回來，還是讓它繼續存在？" },
  { id: "q091", category: "values", depth: "deep",   text: "如果婚姻只是法律文件，拿掉戒指和儀式，你對我的承諾還剩什麼？這讓你不安還是安心？" },
  { id: "q092", category: "values", depth: "deep",   text: "照顧年邁父母這件事，你準備到哪一步？如果照顧的重擔會壓垮我們兩人，你會怎麼選？你怕我知道這個答案嗎？" },
  { id: "q093", category: "values", depth: "medium", text: "政治立場對你重要嗎？" },
  { id: "q094", category: "values", depth: "light",  text: "環保是你生活的一部分嗎？" },
  { id: "q095", category: "values", depth: "deep",   text: "有沒有某條底線，你知道如果為了我而讓步，你就不再是你自己了？那條線是什麼？你怕我要求你跨過它嗎？" },
  { id: "q096", category: "values", depth: "deep",   text: "有沒有過一個時刻，你發現你把工作看得比我重要？那個瞬間你怎麼跟自己解釋的？你信那個解釋嗎？" },
  { id: "q097", category: "values", depth: "deep",   text: "如果有一天你對別人產生情感動搖、但還沒做任何事——你會告訴我嗎？那個沉默，對你來說是保護我還是背叛我？" },
  { id: "q098", category: "values", depth: "light",  text: "最尊敬的歷史人物是？" },
  { id: "q099", category: "values", depth: "medium", text: "覺得自己最強的價值觀是？" },
  { id: "q100", category: "values", depth: "deep",   text: "我們價值觀最不同的那一點，你私底下是不是覺得「她/他總有一天會被我改變」？如果我永遠不改變，你還留嗎？" },

  // ─────────────────────────── 恐懼脆弱 (20)
  { id: "q101", category: "fears", depth: "medium", text: "你最怕什麼？" },
  { id: "q102", category: "fears", depth: "deep",   text: "有一個祕密，如果我知道了，你最怕我眼裡閃過的那種表情是什麼？為了不看到那個表情，你寧可一輩子不說？" },
  { id: "q103", category: "fears", depth: "deep",   text: "過去最痛的一次傷害，你現在還在跟誰算帳？那個帳，你打算算到什麼時候？" },
  { id: "q104", category: "fears", depth: "medium", text: "有沒有做過讓自己後悔的事？" },
  { id: "q105", category: "fears", depth: "deep",   text: "你最常在鏡子前迴避看見的自己是哪一面？從什麼時候開始躲的？" },
  { id: "q106", category: "fears", depth: "medium", text: "有沒有哭過很久的事？" },
  { id: "q107", category: "fears", depth: "deep",   text: "你最孤單的一次，是獨處時、還是身邊有人（甚至有我）時？那次孤單你用了什麼方式撐過來？我知道嗎？" },
  { id: "q108", category: "fears", depth: "deep",   text: "有什麼東西你怕到不敢告訴我，不是因為我會罵你，而是因為告訴我等於承認它存在？" },
  { id: "q109", category: "fears", depth: "deep",   text: "你怕失去我的哪個版本？是現在的我、還是你在腦海裡建構的那個我？如果發現兩者不一樣，你會怎麼辦？" },
  { id: "q110", category: "fears", depth: "deep",   text: "你最深的不安全感，是哪個具體事件種下的？你到現在還活在那個事件裡嗎？" },
  { id: "q111", category: "fears", depth: "medium", text: "哭的時候最希望誰陪？" },
  { id: "q112", category: "fears", depth: "deep",   text: "你怕的是死本身、還是死之前那段誰都不願陪的時間？你希望那段時間我在場嗎？要我看到你失控的樣子嗎？" },
  { id: "q113", category: "fears", depth: "deep",   text: "你認定的背叛，是對方做了什麼、還是對方沒做什麼？有沒有某個你至今認為是背叛、卻從沒跟對方對質過的事？" },
  { id: "q114", category: "fears", depth: "deep",   text: "有沒有一句「我是不是…」的自我懷疑，你從十幾歲問到現在還沒答案？那句話最後的空格是什麼？" },
  { id: "q115", category: "fears", depth: "deep",   text: "有沒有過某一天，你連起床都覺得是對自己的暴力？那天你怎麼過完的？那之後你學會了什麼？" },
  { id: "q116", category: "fears", depth: "deep",   text: "你最怕在我面前展現的脆弱是什麼？你怕的是我看了會怎麼想，還是你自己看到那一面會怎麼想？" },
  { id: "q117", category: "fears", depth: "deep",   text: "你有沒有做過某件事、用「這是為了她/他好」合理化，但心底知道其實是為了自己？我能知道是哪件嗎？" },
  { id: "q118", category: "fears", depth: "medium", text: "我能怎樣讓你覺得安全？" },
  { id: "q119", category: "fears", depth: "deep",   text: "身體的哪個部位最常替你承受壓力（胸口、胃、肩膀…）？那個部位在對你說什麼，你一直沒聽？" },
  { id: "q120", category: "fears", depth: "deep",   text: "有沒有一刻你覺得「我配不上她/他」？反過來有沒有某刻你偷偷覺得「其實我值得更好的」？哪個念頭讓你更羞恥？" },

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
  { id: "q145", category: "conflict", depth: "deep",   text: "冷戰時你心裡在等什麼？一個道歉、一個低頭、還是證明我在乎到願意追上來？等不到的話你會怎麼收場？" },
  { id: "q146", category: "conflict", depth: "deep",   text: "我們吵架時，你心裡真正在保護的那個東西是什麼？不是表面的爭點——是更底下那個你從小就在保護的？" },
  { id: "q147", category: "conflict", depth: "deep",   text: "有沒有某次我道歉你口頭說「沒關係」，但心裡根本沒過去？那件事到現在還在影響你嗎？你想什麼時候跟我講？" },
  { id: "q148", category: "conflict", depth: "medium", text: "有什麼小事會讓你突然心情變差？" },
  { id: "q149", category: "conflict", depth: "medium", text: "什麼舉動最能安撫你？" },
  { id: "q150", category: "conflict", depth: "medium", text: "當我心情不好你希望怎麼處理？" },
  { id: "q151", category: "conflict", depth: "deep",   text: "我說過最傷你的那句話——你覺得我是脫口而出、還是醞釀很久終於說出口的？你怎麼分辨？答案會改變你對我的感覺嗎？" },
  { id: "q152", category: "conflict", depth: "medium", text: "我做過最暖的事是？" },
  { id: "q153", category: "conflict", depth: "medium", text: "聊天 vs 肢體安慰你更需要哪個？" },
  { id: "q154", category: "conflict", depth: "medium", text: "你覺得我聽你說話的時候夠專心嗎？" },
  { id: "q155", category: "conflict", depth: "deep",   text: "我們的溝通有個「早就該處理、但一直繞開」的死角，你先想到的是哪個？你一直繞開，是為了保護誰？" },
  { id: "q156", category: "conflict", depth: "medium", text: "生氣時不能碰你的哪個話題？" },
  { id: "q157", category: "conflict", depth: "light",  text: "你喜歡在公共場合被抱嗎？" },
  { id: "q158", category: "conflict", depth: "deep",   text: "我有哪個特質是你當初被吸引的、但現在讓你疲憊？你是什麼時候意識到它從優點變成刺的？" },
  { id: "q159", category: "conflict", depth: "medium", text: "你希望我什麼時候多表達一些？" },
  { id: "q160", category: "conflict", depth: "deep",   text: "如果我們遇到一個大到會逼我們選邊（家庭、金錢、方向）的問題——你會先試著說服我、還是先保全自己？這兩個選擇哪一個聽起來比較像你？" },

  // ─────────────────────────── 親密默契 (20)
  { id: "q161", category: "intimacy", depth: "medium", text: "喜歡怎樣的擁抱？" },
  { id: "q162", category: "intimacy", depth: "medium", text: "我的哪個肢體動作你特別喜歡？" },
  { id: "q163", category: "intimacy", depth: "light",  text: "牽手或擁抱你選哪個？" },
  { id: "q164", category: "intimacy", depth: "deep",   text: "有件你一直想跟我做卻沒開口的事——不一定是性，可能是旅行、對話、身體互動——你不開口是怕我拒絕，還是怕我答應之後不如你想像？" },
  { id: "q165", category: "intimacy", depth: "deep",   text: "有沒有過某一刻，你突然覺得我離你很遠、但我明明就在身邊？那瞬間你在想什麼？你希望我當時察覺還是沒察覺？" },
  { id: "q166", category: "intimacy", depth: "medium", text: "喜歡我說什麼樣的話？" },
  { id: "q167", category: "intimacy", depth: "light",  text: "想像我們兩個月獨處會做什麼？" },
  { id: "q168", category: "intimacy", depth: "medium", text: "最舒服的相處距離（身體／情感）？" },
  { id: "q169", category: "intimacy", depth: "medium", text: "有沒有一個願望關於我們的？" },
  { id: "q170", category: "intimacy", depth: "light",  text: "我的哪個笑容讓你心動？" },
  { id: "q171", category: "intimacy", depth: "medium", text: "什麼情境下你覺得最有「戀愛感」？" },
  { id: "q172", category: "intimacy", depth: "light",  text: "希望我怎麼 surprise 你？" },
  { id: "q173", category: "intimacy", depth: "deep",   text: "有什麼是你一直在等我主動猜到的？你想過為什麼不直接說嗎？不說的話，是想保留那份「被懂」的浪漫、還是害怕說出來就不珍貴了？" },
  { id: "q174", category: "intimacy", depth: "light",  text: "有沒有一個舞步／活動想一起做？" },
  { id: "q175", category: "intimacy", depth: "medium", text: "給彼此空間的標準是？" },
  { id: "q176", category: "intimacy", depth: "light",  text: "你喜歡共用浴室（洗手台、杯子）嗎？" },
  { id: "q177", category: "intimacy", depth: "light",  text: "我睡覺的習慣你喜歡哪一個？" },
  { id: "q178", category: "intimacy", depth: "deep",   text: "想像我們老到身體變形、慾望褪色的那一天——你希望我們之間還保留哪個動作/儀式？不能回答「擁抱」這種模糊答案，請具體到時間地點。" },
  { id: "q179", category: "intimacy", depth: "light",  text: "一起看影集 vs 各自看自己喜歡的？" },
  { id: "q180", category: "intimacy", depth: "deep",   text: "有什麼方式「我以為是在愛你、你其實不需要」？你沒糾正我，是不想讓我失望、還是還沒找到自己真正需要的名字？" },

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

  // ─────────────────────────── 聆聽品質 / 未說出口 / 共寫記憶 (200)
  // 原 q201-q400 重新 tag 為三子分類 + depth 重平衡 (light 50 / medium 100 / deep 50)

  { id: "q201", category: "shared",    depth: "light",  featured: true, text: "今天你最想跟我聊、但還沒開口的話題是什麼？" },
  { id: "q202", category: "shared",    depth: "light",  text: "這週有哪件小事想到我、卻忘了跟我說？" },
  { id: "q203", category: "listening", depth: "light",  text: "最近一次笑出聲是因為什麼？那件事你分享給我了嗎？" },
  { id: "q204", category: "shared",    depth: "light",  text: "今晚想先聽我講、還是自己先講？" },
  { id: "q205", category: "shared",    depth: "light",  featured: true, text: "我們上次真正坐下來聊超過 30 分鐘是什麼時候？" },
  { id: "q206", category: "unsaid",    depth: "light",  featured: true, text: "此刻最想被我問什麼？" },
  { id: "q207", category: "unsaid",    depth: "light",  featured: true, text: "此刻最不想被我問什麼？" },
  { id: "q208", category: "shared",    depth: "light",  text: "如果我現在只能問你一個問題，你希望是什麼？" },
  { id: "q209", category: "shared",    depth: "light",  text: "今天你對自己最滿意的一件小事？" },
  { id: "q210", category: "shared",    depth: "light",  text: "今天你對自己最不耐煩的一件小事？" },
  { id: "q211", category: "shared",    depth: "light",  featured: true, text: "這一週哪一天是「還好你在」的一天？" },
  { id: "q212", category: "shared",    depth: "light",  text: "最近哪一刻你想起我會偷偷微笑？" },
  { id: "q213", category: "shared",    depth: "light",  text: "有什麼新發現（書／影片／想法）一直想跟我分享？" },
  { id: "q214", category: "shared",    depth: "light",  featured: true, text: "你今天的能量條（0-100）是多少？為什麼是這個數字？" },
  { id: "q215", category: "shared",    depth: "light",  text: "如果我們今晚只能聊 10 分鐘，你想從哪開始？" },
  { id: "q216", category: "unsaid",    depth: "light",  text: "最近有沒有一個句子一直在你腦海裡？" },
  { id: "q217", category: "unsaid",    depth: "light",  featured: true, text: "有一件你本來想說、結果打字到一半刪掉的事是？" },
  { id: "q218", category: "listening", depth: "light",  featured: true, text: "最近我說過哪句話，你在心裡 replay 過？" },
  { id: "q219", category: "listening", depth: "light",  text: "這陣子你最想聽我講的是我的什麼？" },
  { id: "q220", category: "unsaid",    depth: "light",  featured: true, text: "有一件你一直想問、但覺得太平常不好意思問的，是？" },
  { id: "q221", category: "shared",    depth: "light",  text: "現在這一刻，你最想我做的一個動作是什麼？" },
  { id: "q222", category: "shared",    depth: "light",  featured: true, text: "今天想要一個擁抱、一個問句、還是一段沉默的陪伴？" },
  { id: "q223", category: "shared",    depth: "light",  text: "最近哪一次跟我對話，你覺得「意外地剛剛好」？" },
  { id: "q224", category: "unsaid",    depth: "light",  text: "這陣子有沒有一句話想被我大聲說出來？" },
  { id: "q225", category: "shared",    depth: "light",  text: "今晚想不想一起把手機放遠一點、只專心聊半小時？" },
  { id: "q226", category: "shared",    depth: "light",  text: "有沒有一個小故事是你這週想我記住的？" },
  { id: "q227", category: "shared",    depth: "light",  text: "今天我可以為你做一件「不用多、剛剛好」的事是什麼？" },
  { id: "q228", category: "shared",    depth: "light",  text: "最近你跟我聊天時，最舒服的一個片刻是？" },
  { id: "q229", category: "listening", depth: "light",  text: "你希望我現在用哪一種語氣跟你說話？" },
  { id: "q230", category: "listening", depth: "light",  featured: true, text: "這一刻你心裡最需要的是「被聽見」還是「被回應」？" },

  // 原 medium 70 題：保 50 medium + 降 20 為 light
  { id: "q231", category: "shared",    depth: "medium", featured: true, text: "我們上一次真正「說到心裡」是什麼話題？是什麼讓那次對話變深？" },
  { id: "q232", category: "listening", depth: "medium", text: "你覺得我最會逃避哪一類對話？我的逃避方式是？" },
  { id: "q233", category: "unsaid",    depth: "medium", text: "你覺得自己最會逃避哪一類對話？你的逃避方式是？" },
  { id: "q234", category: "listening", depth: "medium", featured: true, text: "我們有沒有哪種話題，你察覺我一開口你就身體僵一下？" },
  { id: "q235", category: "shared",    depth: "medium", text: "你跟我聊天時最放鬆的姿勢／場所／時段是？為什麼是那個組合？" },
  { id: "q236", category: "shared",    depth: "medium", text: "你跟別人聊天 vs 跟我聊天，有哪些地方你其實不一樣？" },
  { id: "q237", category: "listening", depth: "medium", text: "我哪種語氣會讓你不自覺想收起話頭？" },
  { id: "q238", category: "listening", depth: "medium", featured: true, text: "當你聊自己的事時，你最希望我怎麼結尾（吐完就好／給建議／問你需要什麼）？" },
  { id: "q239", category: "listening", depth: "light",  text: "你覺得我最懂你的一次對話是哪次？那次我做對了什麼？" },
  { id: "q240", category: "listening", depth: "light",  text: "你覺得我最不懂你的一次對話是哪次？我漏聽了什麼？" },
  { id: "q241", category: "shared",    depth: "medium", text: "我們之間有沒有一個「專屬關鍵字」，一出現你就知道話題要轉深？" },
  { id: "q242", category: "listening", depth: "medium", featured: true, text: "有沒有什麼話題我講時你會走神？你走神時去了哪裡？" },
  { id: "q243", category: "unsaid",    depth: "medium", featured: true, text: "最近有沒有我講到某件事、你其實有不同意見但沒出聲？是哪件？" },
  { id: "q244", category: "listening", depth: "light",  text: "你希望我聽你說話時更常問你什麼？" },
  { id: "q245", category: "listening", depth: "light",  text: "你希望我聽你說話時更少做什麼？" },
  { id: "q246", category: "unsaid",    depth: "medium", featured: true, text: "我們之間有沒有一個「你沒說、我沒問」的中間地帶？那塊地方長什麼樣？" },
  { id: "q247", category: "listening", depth: "light",  text: "你覺得我最常誤解你哪個表情或沉默？" },
  { id: "q248", category: "listening", depth: "light",  text: "我最常誤解你什麼語氣？" },
  { id: "q249", category: "shared",    depth: "medium", text: "哪個話題你跟我聊完會覺得「被理解」一整天？" },
  { id: "q250", category: "shared",    depth: "medium", text: "哪個話題你跟我聊完會覺得「沒被理解」一整夜？" },
  { id: "q251", category: "unsaid",    depth: "medium", featured: true, text: "你現在對我有哪個問題，已經在心裡盤旋超過一個月？" },
  { id: "q252", category: "unsaid",    depth: "medium", featured: true, text: "如果我們現在交換問題清單，你猜我清單上第一條是什麼？" },
  { id: "q253", category: "shared",    depth: "medium", text: "你覺得我們之間最被低估的對話時刻是哪一種（通勤、做飯、睡前…）？" },
  { id: "q254", category: "shared",    depth: "medium", text: "我們最近一次對話，你事後有沒有回想過？回想的是哪一句？" },
  { id: "q255", category: "shared",    depth: "medium", text: "你希望我多跟你說我的哪一面？" },
  { id: "q256", category: "unsaid",    depth: "medium", text: "你希望我少把哪些事留給自己處理？" },
  { id: "q257", category: "shared",    depth: "medium", featured: true, text: "你覺得我們「真正在聊」vs「只是交換資訊」的比例大概多少？" },
  { id: "q258", category: "shared",    depth: "medium", text: "我們有沒有哪個共同朋友或事件，是你想好好跟我聊但一直沒機會？" },
  { id: "q259", category: "unsaid",    depth: "medium", text: "有沒有什麼是你只能跟我說、但我卻還不知道？" },
  { id: "q260", category: "unsaid",    depth: "medium", text: "有沒有什麼是你希望「只有我」知道、但不確定我真的聽進去的？" },
  { id: "q261", category: "listening", depth: "light",  text: "哪種時機你開口最容易被我接住？" },
  { id: "q262", category: "listening", depth: "light",  text: "哪種時機你開口最常被我打斷？" },
  { id: "q263", category: "shared",    depth: "medium", text: "如果我們每週有一次「什麼都可以問」的 30 分鐘，你希望安排在什麼時候？" },
  { id: "q264", category: "shared",    depth: "medium", text: "講電話、見面、訊息——你覺得哪個最能跟我談到底？" },
  { id: "q265", category: "shared",    depth: "medium", featured: true, text: "你有沒有一個「只有跟我講時才會用」的講話方式？那個方式是什麼？" },
  { id: "q266", category: "unsaid",    depth: "light",  text: "你最近一次覺得「還好有把這件事講出來」是什麼？" },
  { id: "q267", category: "unsaid",    depth: "light",  text: "你最近一次覺得「早知道不要講」是什麼？" },
  { id: "q268", category: "shared",    depth: "medium", text: "我們有沒有某次吵完，你希望那次是用「對話」而不是「爭辯」的？差在哪？" },
  { id: "q269", category: "shared",    depth: "medium", featured: true, text: "你覺得我們對話裡誰比較常先軟下來？這個模式公平嗎？" },
  { id: "q270", category: "listening", depth: "medium", text: "你希望我問你問題的方式更像誰（朋友／家人／治療師…）？" },
  { id: "q271", category: "listening", depth: "light",  text: "聊天時你最喜歡我的一個動作是？（歪頭、挑眉、身體前傾…）" },
  { id: "q272", category: "listening", depth: "medium", featured: true, text: "你覺得我聽你說話時，眼神什麼時候最對？什麼時候飄走？" },
  { id: "q273", category: "listening", depth: "light",  text: "你跟我分享好消息時最希望我的第一反應是？" },
  { id: "q274", category: "listening", depth: "light",  text: "你跟我分享壞消息時最希望我的第一反應是？" },
  { id: "q275", category: "unsaid",    depth: "medium", featured: true, text: "我們之間有沒有一個話題你已經說累了、但我還沒察覺？" },
  { id: "q276", category: "unsaid",    depth: "medium", text: "有沒有某個話題你以為我不想聊、其實是你不想聊？" },
  { id: "q277", category: "listening", depth: "light",  text: "你希望我更常問你關於什麼的細節？" },
  { id: "q278", category: "listening", depth: "light",  text: "你希望我更常跟你分享關於我的什麼？" },
  { id: "q279", category: "unsaid",    depth: "medium", featured: true, text: "最近一週你有沒有「話到嘴邊又吞回去」的事？大概幾次？" },
  { id: "q280", category: "shared",    depth: "medium", text: "如果我們對話有一個「按暫停」鍵，你會按在哪一次的哪一刻？" },
  { id: "q281", category: "shared",    depth: "light",  text: "你覺得我們現在的對話品質，跟三個月前比是變好還是變淡？" },
  { id: "q282", category: "listening", depth: "medium", text: "你最近一次覺得「我想多了解他／她」是什麼情境？" },
  { id: "q283", category: "unsaid",    depth: "medium", featured: true, text: "有沒有一個話題你一直在等我主動提起？你等多久了？" },
  { id: "q284", category: "listening", depth: "light",  text: "你跟我聊天時，最常沒注意到的自己的小表情是？" },
  { id: "q285", category: "shared",    depth: "medium", text: "你覺得我身上有哪個「被低估的深度」？" },
  { id: "q286", category: "shared",    depth: "medium", text: "你覺得自己身上有哪個「希望被我看到的深度」？" },
  { id: "q287", category: "unsaid",    depth: "medium", text: "你跟我聊童年時，通常省略掉哪一塊？為什麼？" },
  { id: "q288", category: "listening", depth: "medium", text: "我跟你聊工作時，你最想幫我補哪個問題？" },
  { id: "q289", category: "shared",    depth: "medium", text: "我們之間最怕變成什麼樣的對話模式？（報備式／客套式／審問式…）" },
  { id: "q290", category: "listening", depth: "light",  text: "最近你對我的一個新觀察是什麼？" },
  { id: "q291", category: "listening", depth: "light",  text: "最近你對自己的一個新觀察是什麼？" },
  { id: "q292", category: "unsaid",    depth: "medium", text: "如果我們交換日記三天，你最怕我在你日記裡看到什麼？" },
  { id: "q293", category: "unsaid",    depth: "medium", text: "如果我們交換日記三天，你最希望我在你日記裡看到什麼？" },
  { id: "q294", category: "listening", depth: "medium", featured: true, text: "你覺得我聽你說話時的哪種回應最療癒？" },
  { id: "q295", category: "listening", depth: "medium", featured: true, text: "你覺得我聽你說話時的哪種回應最殘忍？" },
  { id: "q296", category: "unsaid",    depth: "medium", text: "有沒有什麼話題我一開口你就想結案？你想結案的是話題、還是我？" },
  { id: "q297", category: "shared",    depth: "medium", text: "你跟我聊情緒 vs 聊邏輯，哪個更累？為什麼？" },
  { id: "q298", category: "shared",    depth: "medium", text: "我們之間有沒有一個「只要談到就會吵」的話題？你怎麼看那個地雷？" },
  { id: "q299", category: "unsaid",    depth: "medium", text: "你有沒有一個句型最近變得頻繁使用？那個句型在保護什麼？" },
  { id: "q300", category: "shared",    depth: "light",  text: "你覺得我們之間最珍貴、但最容易被忽略的對話儀式是？" },

  // 原 deep 100 題：保 50 deep + 降 50 medium
  { id: "q301", category: "unsaid",    depth: "deep",   featured: true, text: "有一個想法或故事，至今你只講給過一個人聽——那個人是我嗎？如果不是，你為什麼還沒讓它變成「我」？" },
  { id: "q302", category: "shared",    depth: "medium", text: "當我們對話陷入死角，你心裡閃過的第一個念頭是「好想逃」還是「好想更近」？這個差別取決於什麼？" },
  { id: "q303", category: "shared",    depth: "deep",   featured: true, text: "如果今天我們之間只能留一次未完的對話，你希望保留哪一次？為什麼是那次、不是更親密的其他次？" },
  { id: "q304", category: "unsaid",    depth: "deep",   featured: true, text: "你覺得我有哪個「我自己以為你知道、但其實我從未說過」的部分？那部分你是用什麼方式拼湊出來的？" },
  { id: "q305", category: "listening", depth: "deep",   featured: true, text: "在一起這段時間，你有沒有一瞬間覺得「他／她對我的了解其實沒有自己想的那麼深」？那一瞬間你有沒有想戳破？" },
  { id: "q306", category: "unsaid",    depth: "deep",   featured: true, text: "你最常在腦海裡跟我進行的「沒有真實發生的對話」是哪一場？你為什麼不讓它在現實裡發生？" },
  { id: "q307", category: "listening", depth: "medium", text: "如果你知道我在某個話題上一直假裝沒事，你會主動拆穿、還是陪我演下去？這個答案透露了你對「親密」的哪個底色？" },
  { id: "q308", category: "unsaid",    depth: "deep",   featured: true, text: "你對我講過最完整的故事是哪一段？那段故事你省略掉的是哪個版本的自己？" },
  { id: "q309", category: "listening", depth: "deep",   text: "你聽我講某段往事時，有沒有一刻心底閃過「我不相信」？你怎麼處理那個不相信？" },
  { id: "q310", category: "unsaid",    depth: "deep",   featured: true, text: "我們之間最久沒被拿出來講的話題是哪一個？那份沉默，你認為是共識還是逃避？" },
  { id: "q311", category: "unsaid",    depth: "deep",   featured: true, text: "你希望我問、但我還沒問到的問題一共幾個？最重要的那個是什麼？你準備等到什麼時候再告訴我？" },
  { id: "q312", category: "listening", depth: "deep",   featured: true, text: "我聽你說話時，最常出現的是「專注」「分析」「同理」還是「評判」？哪個讓你最靠近我、哪個讓你最想關門？" },
  { id: "q313", category: "shared",    depth: "medium", text: "如果我們錄下彼此最近一個月所有對話、分類貼標籤，你最怕哪個標籤的佔比嚇到你？" },
  { id: "q314", category: "listening", depth: "deep",   featured: true, text: "你心裡「我懂」和「我聽到了」有什麼差別？你現在更需要哪一個？從什麼時候開始有這個差別？" },
  { id: "q315", category: "listening", depth: "medium", text: "當我講到一個我很興奮的話題、你其實跟不上，你會假裝跟上還是誠實承認？你希望我在相反的情境怎麼做？" },
  { id: "q316", category: "unsaid",    depth: "deep",   featured: true, text: "我們之間有沒有一段對話，你事後一直在心裡重寫？那句你後來重寫好的話是什麼？你為什麼還沒傳給我？" },
  { id: "q317", category: "listening", depth: "deep",   featured: true, text: "當你跟我講心裡的事、我卻給出「解決方案」，你當下會收回多少真心？下一次你會少講多少？" },
  { id: "q318", category: "unsaid",    depth: "medium", text: "有沒有一個「情緒詞彙」你從來沒跟我用過、但常跟朋友用？那個詞被你留給別人的原因是什麼？" },
  { id: "q319", category: "unsaid",    depth: "deep",   featured: true, text: "你希望我更常對你說的一句話是什麼？我一直沒說，是我不知道、還是你沒表現出需要？" },
  { id: "q320", category: "unsaid",    depth: "deep",   featured: true, text: "如果今晚我說「講一個你從沒跟我講過的故事」，你腦中會浮現三個版本：最重、最輕、中等——你會給我哪個？我知道這個答案嗎？" },
  { id: "q321", category: "listening", depth: "medium", text: "你跟我說話時，有沒有一種「向外表演給想像觀眾看」的狀態？那個觀眾是誰？" },
  { id: "q322", category: "unsaid",    depth: "deep",   text: "你有沒有某次開口前演練超過五分鐘，講出來之後卻只得到我一句敷衍？那一次你收回了什麼？" },
  { id: "q323", category: "shared",    depth: "medium", text: "我們之間最接近「共寫」的一段對話是哪一次？那次是誰先開場、誰先把話題打開？" },
  { id: "q324", category: "listening", depth: "medium", text: "我最近跟你說話時語氣裡最大的變化是什麼？那個變化讓你更想靠近、還是更退後？" },
  { id: "q325", category: "shared",    depth: "deep",   featured: true, text: "如果把我們的「對話史」畫成地圖，你會標什麼為「失落之地」？什麼為「聖所」？" },
  { id: "q326", category: "unsaid",    depth: "deep",   featured: true, text: "有沒有某次我問你一個問題、你當下隨便答了敷衍答案——那個問題你現在還在心裡自己默答嗎？真正的答案是？" },
  { id: "q327", category: "unsaid",    depth: "deep",   featured: true, text: "你有沒有某個「需要很久才能講完」的故事，一直等不到足夠安靜的我？你現在願意告訴我要怎樣的安靜嗎？" },
  { id: "q328", category: "shared",    depth: "deep",   featured: true, text: "你願意跟我進行一次「不要建議、不要評論、只要陪」的 20 分鐘對話嗎？願意的話主題會是什麼？不願意的話，是我哪部分還沒通過測試？" },
  { id: "q329", category: "listening", depth: "deep",   text: "我在傾聽你時，最像你生命中哪個人？你希望我越來越像那個人、還是越來越不像？" },
  { id: "q330", category: "unsaid",    depth: "deep",   featured: true, text: "我們之間有沒有一段「你講了一半我打斷、然後再也沒接回去」的對話？那後半段在哪？我有權聽嗎？" },
  { id: "q331", category: "listening", depth: "medium", text: "有沒有一個時刻你覺得我對你的理解「停在某個版本的你」，而你已經前進了？那個落差讓你失望、還是安心？" },
  { id: "q332", category: "unsaid",    depth: "deep",   text: "你有沒有試過跟我說話時其實在測試我？測試什麼？結果是？" },
  { id: "q333", category: "listening", depth: "medium", text: "我問你問題時，你最能分辨「我是真想知道」還是「我只是在表達關心」嗎？你怎麼分辨？" },
  { id: "q334", category: "unsaid",    depth: "medium", text: "當我把你一段話誤解成另一件事，你選擇糾正還是讓誤會留著？你通常依據什麼做這個決定？" },
  { id: "q335", category: "unsaid",    depth: "deep",   featured: true, text: "我們之間最大的「誤會紅利」是什麼？哪個誤會其實撐起了我們關係的一部分？" },
  { id: "q336", category: "unsaid",    depth: "deep",   featured: true, text: "你有沒有一句「以前想說給某個前任／好友／家人聽、但現在想說給我」的話？內容是？為什麼你認為現在是我？" },
  { id: "q337", category: "listening", depth: "medium", text: "當我講到我的脆弱，你最常做的動作是什麼（身體、眼神、語氣）？那個動作是你學來的、還是本能的？" },
  { id: "q338", category: "listening", depth: "medium", text: "你跟我聊到家人時，會不會不自覺用他們的語氣跟我說話？我察覺過嗎？你希望我提醒你嗎？" },
  { id: "q339", category: "shared",    depth: "medium", text: "你講話時有沒有某個細節是「專門為了讓我記住」而安排的？你安排過幾次？我中過幾次？" },
  { id: "q340", category: "unsaid",    depth: "deep",   text: "我們之間有沒有一個主題，你只願意在「酒後／深夜／下雨／旅行中」打開？那個條件其實在保護什麼？" },
  { id: "q341", category: "shared",    depth: "medium", text: "你有沒有某個私人儀式是「跟我說話之前要先做的」？那個儀式在為你準備什麼？" },
  { id: "q342", category: "shared",    depth: "medium", text: "你希望我跟你對話時更像「伴侶」還是「好朋友」？你心裡知道哪個對我來說更難嗎？" },
  { id: "q343", category: "unsaid",    depth: "medium", text: "當你有一件重要的事想告訴我、我卻正在忙，你用什麼方式讓自己不失落？那個方式裡你犧牲了什麼？" },
  { id: "q344", category: "listening", depth: "medium", text: "我最擅長替你「命名」哪一種情緒？最不擅長命名哪一種？你希望我練習嗎？" },
  { id: "q345", category: "listening", depth: "medium", text: "當你難過，我給的安慰方式裡有沒有一種其實你不想要、但捨不得拒絕？你希望我怎麼改？" },
  { id: "q346", category: "unsaid",    depth: "deep",   featured: true, text: "有沒有一次因為我聽得特別認真、你反而不敢講完？那次你停在哪句？我現在重新問你還可以嗎？" },
  { id: "q347", category: "shared",    depth: "deep",   featured: true, text: "我們之間最具體、最私密的那個「哏」（只有我們懂的笑點）是什麼？它什麼時候誕生的？我還能讓它繼續生長嗎？" },
  { id: "q348", category: "listening", depth: "medium", text: "你跟我講笑話時，最怕看到我哪個表情？如果真的出現那個表情，你會下一秒做什麼？" },
  { id: "q349", category: "unsaid",    depth: "deep",   text: "你有沒有過一個時刻，希望我以全然陌生的身分重新認識你？你想以怎樣的開場白被重新認識？" },
  { id: "q350", category: "shared",    depth: "medium", text: "如果我們所有對話都可以重來一次，你最想重講哪一次？你想改的是你講的、還是你聽的那部分？" },
  { id: "q351", category: "shared",    depth: "medium", text: "我們在對話裡比較像「兩個說話的人」還是「兩個輪流聽的人」？你希望未來哪個比例多一點？" },
  { id: "q352", category: "listening", depth: "medium", text: "你有沒有發現我最近某句口頭禪變多？你擔心它的話，是擔心內容、還是擔心背後的我？" },
  { id: "q353", category: "shared",    depth: "deep",   featured: true, text: "當我們沉默了十分鐘沒說話，你心裡最常出現的念頭是？那個念頭十年前的你也會有嗎？" },
  { id: "q354", category: "shared",    depth: "deep",   featured: true, text: "我們之間有沒有一種「不說比說更深」的時刻？那種時刻最近一次發生在？" },
  { id: "q355", category: "shared",    depth: "medium", text: "吵完架重新開口時，那第一句話「應該由誰說」？這個「應該」是你從哪裡學來的？" },
  { id: "q356", category: "unsaid",    depth: "medium", text: "你願意在對話中承認「我不確定我在說什麼」嗎？不願意的話，你怕我怎麼看你？" },
  { id: "q357", category: "unsaid",    depth: "deep",   text: "當我問你一個你不想回答的問題，你最常用什麼方式脫逃？那個方式是不是你從小就在用？" },
  { id: "q358", category: "unsaid",    depth: "medium", text: "你有沒有在我面前「假裝自己對某件事很有想法」？那件事其實你沒想清楚，你怕我覺得你空洞？" },
  { id: "q359", category: "listening", depth: "deep",   featured: true, text: "我對你的理解裡，最大的一塊「盲區」在哪？你介意那塊盲區嗎？還是偷偷享受？" },
  { id: "q360", category: "unsaid",    depth: "deep",   featured: true, text: "你對我最大的一個「期待我主動問你」的事情是什麼？你等這個問題等多久了？" },
  { id: "q361", category: "shared",    depth: "medium", text: "我們對話中「誰比較常把話題帶深」？那個人累嗎？另一個人知道嗎？" },
  { id: "q362", category: "shared",    depth: "deep",   text: "如果對話有一個情緒儀表板，哪一格你最想我看到是紅色：焦慮、喜悅、疲倦、渴望、害怕？" },
  { id: "q363", category: "listening", depth: "medium", text: "我聽你說話時最常漏掉的訊號是哪個？下一次我可以怎麼補回來？" },
  { id: "q364", category: "unsaid",    depth: "deep",   featured: true, text: "你跟我分享創作／夢想／中二想像時，最怕我的哪種反應？我曾經給過嗎？當時你是怎麼把它吞下去的？" },
  { id: "q365", category: "listening", depth: "deep",   featured: true, text: "你希望我做的「聆聽升級」具體是哪三件事？請具體到動作、眼神、語氣。" },
  { id: "q366", category: "shared",    depth: "medium", text: "我們之間最需要做、卻最難排進時間表的對話類型是哪一種？為什麼它總是被擠掉？" },
  { id: "q367", category: "listening", depth: "medium", text: "當你講到一半我開始看手機，你心裡的溫度下降幾度？要多久回升？有沒有哪次沒有回升？" },
  { id: "q368", category: "shared",    depth: "medium", text: "你有沒有一種「跟我講完會特別累」的對話類型？那種累是被看穿的累、還是沒被看穿的累？" },
  { id: "q369", category: "unsaid",    depth: "deep",   featured: true, text: "我們之間最需要「被翻譯」的一個字是什麼？（我說 A 其實指 A'，你說 B 其實指 B'）" },
  { id: "q370", category: "listening", depth: "medium", text: "當你發現我對某件事根本沒興趣、但還在配合聽，你會希望我繼續配合、還是誠實喊停？你希望我怎麼喊停？" },
  { id: "q371", category: "unsaid",    depth: "deep",   text: "你有沒有一段話是「留給未來某個特別時刻才要跟我說」的？那個時刻的條件是什麼？你怕等不到嗎？" },
  { id: "q372", category: "listening", depth: "medium", text: "你覺得我們對話中的「安靜」，我是加太多、還是加太少？怎麼定義你心中的剛好？" },
  { id: "q373", category: "shared",    depth: "deep",   featured: true, text: "如果我們每晚睡前只能交換一個問題與答案，你希望哪個問題被我問到第一千次？" },
  { id: "q374", category: "unsaid",    depth: "deep",   featured: true, text: "你對我最近一個「難以啟齒的觀察」是什麼？你打算用多久想清楚要不要跟我講？" },
  { id: "q375", category: "listening", depth: "medium", text: "你有沒有一個「只有跟我說話時才會出現的人格」？那個人格你喜歡嗎？她／他讓你更自由、還是更拘束？" },
  { id: "q376", category: "unsaid",    depth: "medium", text: "你有沒有覺得我誤解你，然後你乾脆讓那個誤解停在那裡？那個誤解現在的版本是什麼？" },
  { id: "q377", category: "unsaid",    depth: "deep",   featured: true, text: "你表達不滿時最常用的「偽裝句型」是哪個？（例：「沒事啦」「我隨便」「那就你決定」）我意識得到嗎？" },
  { id: "q378", category: "unsaid",    depth: "medium", text: "你最近有沒有一句話，講完之後覺得「我應該再解釋一下的」？那句話我怎麼理解了？跟你原意差多少？" },
  { id: "q379", category: "shared",    depth: "medium", text: "我們最容易在哪個「時間／場景」把對話從表面帶到心底？那個場景我們多久沒去了？" },
  { id: "q380", category: "unsaid",    depth: "deep",   text: "你有沒有一個「希望我替你問、然後替你答」的問題？內容是？為什麼你不能自己問自己？" },
  { id: "q381", category: "listening", depth: "medium", text: "當你情緒來了、話不成形時，你希望我用哪一種方式幫你整理：提問、轉述、陪你沉默？這個偏好有改變過嗎？" },
  { id: "q382", category: "listening", depth: "medium", text: "你對我講過的話裡，有沒有一句你後來才聽懂的？那句是？聽懂的那天感覺如何？" },
  { id: "q383", category: "listening", depth: "medium", text: "我對你講過的話裡，有沒有一句你覺得我自己還沒聽懂？你想什麼時候告訴我？" },
  { id: "q384", category: "shared",    depth: "medium", text: "我們之間有沒有「一方講話比較容易被記住」的不對等？那個不對等讓你舒服還是委屈？" },
  { id: "q385", category: "shared",    depth: "medium", text: "你有沒有一個「很小、沒人會在意、但希望我記住」的細節（一個日期、一首歌、一句話）？你暗示過我幾次？" },
  { id: "q386", category: "unsaid",    depth: "deep",   text: "如果可以互換一小時「聽對方腦中的獨白」，你最怕我聽到你腦中的什麼？" },
  { id: "q387", category: "shared",    depth: "medium", text: "我們對話中「最誠實的一分鐘」發生在什麼情境？那一分鐘之後你們各自做了什麼？" },
  { id: "q388", category: "unsaid",    depth: "medium", text: "當我們聊到一件敏感事，你察覺自己聲音變小時，你會繼續講完、還是退出？你的退出機制是？" },
  { id: "q389", category: "listening", depth: "medium", text: "我最常在對話裡放棄你哪個信號？我放棄的是「累了」、還是「不想知道」？" },
  { id: "q390", category: "shared",    depth: "deep",   featured: true, text: "你希望我們之間能發生什麼樣的對話，是你從戀愛一開始就想要、卻到現在還沒實現的？" },
  { id: "q391", category: "unsaid",    depth: "deep",   featured: true, text: "你有沒有為了「保護我」而省略真實感受？那個省略的代價你自己承擔了多少？願意還我一部分嗎？" },
  { id: "q392", category: "shared",    depth: "deep",   featured: true, text: "我們之間「最能代表我們的」一段三句對話是什麼？直接寫出來，當成這題的答案。" },
  { id: "q393", category: "shared",    depth: "medium", text: "當我們講到未來，你有沒有一刻希望我打斷你、把你拉回現在？那是怎樣的情境？" },
  { id: "q394", category: "listening", depth: "medium", text: "你希望我在什麼樣的對話中「不要急著回應、先停三秒」？那三秒你要我在做什麼？" },
  { id: "q395", category: "unsaid",    depth: "deep",   text: "你有沒有一個「對你很重要、但從沒讓它出現在我們對話裡」的人名？那個名字出現了會發生什麼？" },
  { id: "q396", category: "listening", depth: "medium", text: "你跟我對話時，有沒有過「一邊聽一邊在想對方怎麼會這樣想」的抽離感？那種抽離最常出現在哪類話題？" },
  { id: "q397", category: "shared",    depth: "medium", text: "我們對話的天花板在哪？是我的、你的、還是我們共同的？怎麼抬高一格？" },
  { id: "q398", category: "listening", depth: "medium", text: "你心裡有沒有一個「希望我成為的聆聽者版本」？她／他跟現在的我差多少？那塊差距可以練嗎？" },
  { id: "q399", category: "shared",    depth: "deep",   text: "對話是親密關係最古老的「身體活動」——你覺得我們這個活動目前的體力分佈公平嗎？若不公平，是誰在做重量訓練？" },
  { id: "q400", category: "shared",    depth: "deep",   featured: true, text: "寫給五年後的我們：你希望五年後還能跟我進行一次什麼樣的對話？請具體到時間、地點、第一句話、最後一句話。" },

  // ─────────────────────────── 遊戲感互動題 (10)
  // kind 標註讓 UI 可用特殊 widget 呈現；全部 featured
  { id: "q401", category: "shared",    depth: "light", featured: true, kind: "roleplay", text: "我們之間最廢的一段對話是哪一次？30 秒內用演的重現給對方看。" },
  { id: "q402", category: "shared",    depth: "light", featured: true, kind: "choice",   text: "我們的愛情如果要開 podcast，第一集標題是：(A) 我真的搞不懂她／他 / (B) 我們的第一個共同廢話？" },
  { id: "q403", category: "shared",    depth: "light", featured: true, kind: "gesture",  text: "用 5 個 emoji 總結我們這一週的對話氣氛。不解釋，直接丟出來。" },
  { id: "q404", category: "listening", depth: "light", featured: true, kind: "timed",    text: "30 秒倒數，說出一個你對我最誠實的形容詞。不能是「可愛」「帥」這種安全答案。" },
  { id: "q405", category: "shared",    depth: "light", featured: true, kind: "roleplay", text: "扮演我 30 秒，用我的語氣、我的口頭禪回答：「今天想吃什麼？」看我猜到幾分。" },
  { id: "q406", category: "shared",    depth: "light", featured: true, kind: "relay",    text: "接龍：「我最愛你的時候是___」，輪流 3 回合，不許重複、不許用「都愛」這種混過去。" },
  { id: "q407", category: "shared",    depth: "light", featured: true, kind: "choice",   text: "A 或 B：現在你想跟我 (A) 安靜坐著 10 分鐘什麼都不說 / (B) 瘋狂講 30 分鐘任何話題？" },
  { id: "q408", category: "shared",    depth: "light", featured: true, kind: "roleplay", text: "幫這一刻的我們取一個 3 字綜藝節目名。要能上節目表的那種，越蠢越好。" },
  { id: "q409", category: "listening", depth: "light", featured: true, kind: "gesture",  text: "用擊掌次數表達：你現在有多想被我理解？(1 下=還好 / 10 下=快爆炸)" },
  { id: "q410", category: "shared",    depth: "light", featured: true, kind: "roleplay", text: "如果我們是遊戲角色，目前這段關係的關卡名稱是？副標題是？難度幾星？" },

  // ============================================================
  // v1.8 擴充：4 大靈魂拷問篇（使用者版 × 本系統風格融合）+ 200 題
  // ============================================================

  // ─────────────────────────── 一、心動與偏愛篇 devotion (50) — 確認你是唯一
  { id: "q411", category: "devotion", depth: "medium", featured: true, text: "你第一次對我心動，是哪個瞬間？不要回答「剛認識的時候」，講一個具體的畫面。" },
  { id: "q412", category: "devotion", depth: "deep",   featured: true, text: "我身上最讓你放不下的點是什麼？不是優點，是那個「沒了會很失落」的東西。" },
  { id: "q413", category: "devotion", depth: "medium", featured: true, text: "和我在一起後，你最大的改變是什麼？是變好還是變壞？" },
  { id: "q414", category: "devotion", depth: "deep",   featured: true, text: "你有沒有哪一刻，覺得「就是這個人了」？那天天氣如何，你在想什麼？" },
  { id: "q415", category: "devotion", depth: "medium", featured: true, text: "你最喜歡我對你的哪種溫柔？是大事的時候還是小細節裡？" },
  { id: "q416", category: "devotion", depth: "light",  text: "你手機相簿裡我的照片，第幾張是你最常偷看的？" },
  { id: "q417", category: "devotion", depth: "medium", text: "你覺得我身上的哪一個味道會讓你想起家？" },
  { id: "q418", category: "devotion", depth: "medium", text: "你對我哪一個表情特別沒辦法招架？" },
  { id: "q419", category: "devotion", depth: "deep",   text: "你有沒有告訴過你的朋友我什麼事，是你從來沒告訴過我的？" },
  { id: "q420", category: "devotion", depth: "medium", text: "我笑的時候，你腦袋裡第一個冒出來的詞是什麼？" },
  { id: "q421", category: "devotion", depth: "light",  text: "我身上哪個小習慣，你一開始覺得煩但現在已經喜歡上了？" },
  { id: "q422", category: "devotion", depth: "medium", text: "如果要在我身上挑一個部位貼紙條說「這是我的」，你會貼哪裡？" },
  { id: "q423", category: "devotion", depth: "deep",   featured: true, text: "你什麼時候開始不再比較前任跟我？那個轉折是什麼？" },
  { id: "q424", category: "devotion", depth: "medium", text: "我睡著的樣子是什麼樣的？你看過最久的一次？" },
  { id: "q425", category: "devotion", depth: "medium", text: "你最想鎖住哪一段我們曾經有過的對話？" },
  { id: "q426", category: "devotion", depth: "deep",   text: "如果有人問你「你的 TA 有什麼特別的？」你會怎麼回答，不是那些浮面的稱讚？" },
  { id: "q427", category: "devotion", depth: "medium", featured: true, text: "我最幼稚的一個樣子是什麼？你最喜歡那個版本的我嗎？" },
  { id: "q428", category: "devotion", depth: "light",  text: "如果我們可以一起變成動物，你會選哪種，為什麼？" },
  { id: "q429", category: "devotion", depth: "medium", text: "你有沒有因為我而開始喜歡上某個東西（食物 / 音樂 / 興趣）？" },
  { id: "q430", category: "devotion", depth: "deep",   text: "你想不想擁有我小時候的一張照片？為什麼？" },
  { id: "q431", category: "devotion", depth: "medium", text: "如果我明天變成另一個樣子（外貌完全不同），你覺得你還會愛我嗎？" },
  { id: "q432", category: "devotion", depth: "medium", text: "我哪一個缺點讓你覺得「很我」、甚至不想我改？" },
  { id: "q433", category: "devotion", depth: "light",  text: "我有沒有哪句話你特別喜歡聽，總希望我再說一次？" },
  { id: "q434", category: "devotion", depth: "deep",   featured: true, text: "你曾經有一瞬間覺得「可能要失去這個人」嗎？那時候你心裡想什麼？" },
  { id: "q435", category: "devotion", depth: "medium", text: "你偷偷截過我哪些照片 / 對話當收藏？為什麼是那個？" },
  { id: "q436", category: "devotion", depth: "medium", text: "如果我們的愛情是一首歌，副歌的歌詞會是什麼？" },
  { id: "q437", category: "devotion", depth: "deep",   text: "你在哪些人面前會不自覺地提起我？那種「忍不住說出來」的場合？" },
  { id: "q438", category: "devotion", depth: "medium", text: "我做過哪一件小事，你記了好久都沒跟我說？" },
  { id: "q439", category: "devotion", depth: "light",  text: "你最喜歡牽我的哪隻手？左還右？為什麼？" },
  { id: "q440", category: "devotion", depth: "medium", text: "你心裡有沒有一個只屬於我們的暗號、手勢、眼神？" },
  { id: "q441", category: "devotion", depth: "deep",   text: "如果我今天就走了，你最後悔沒讓我知道的一件事是什麼？" },
  { id: "q442", category: "devotion", depth: "medium", text: "你最羨慕我身上的什麼？是特質還是某個你沒有的天賦？" },
  { id: "q443", category: "devotion", depth: "medium", featured: true, text: "有沒有一個瞬間，你覺得「原來被這個人愛著就夠了」？" },
  { id: "q444", category: "devotion", depth: "light",  text: "你手機主畫面是我嗎？為什麼選那張？" },
  { id: "q445", category: "devotion", depth: "medium", text: "當我生氣的時候，你心裡的第一反應是什麼？" },
  { id: "q446", category: "devotion", depth: "deep",   text: "你覺得自己有把「愛我」這件事做好嗎？哪裡還想進步？" },
  { id: "q447", category: "devotion", depth: "medium", text: "我做的哪一個小動作，讓你覺得「這個才是我的人」？" },
  { id: "q448", category: "devotion", depth: "light",  text: "你最喜歡我身上哪件衣服？穿起來的樣子？" },
  { id: "q449", category: "devotion", depth: "medium", text: "你有沒有一個私藏關於我的小秘密？是不能告訴朋友的那種？" },
  { id: "q450", category: "devotion", depth: "deep",   featured: true, text: "當我不在身邊的時候，什麼事情最容易讓你想起我？" },
  { id: "q451", category: "devotion", depth: "medium", text: "你最常在腦中跟我對話的時刻是什麼？" },
  { id: "q452", category: "devotion", depth: "light",  text: "你心目中「我最美 / 最帥的瞬間」是哪次？" },
  { id: "q453", category: "devotion", depth: "medium", text: "你希望我在任何情況下都記得的一句話是什麼？" },
  { id: "q454", category: "devotion", depth: "deep",   text: "你覺得自己有一部分只屬於我嗎？哪一部分？" },
  { id: "q455", category: "devotion", depth: "medium", text: "和我在一起的日子，和你一個人的日子，有什麼你不想失去的差別？" },
  { id: "q456", category: "devotion", depth: "medium", text: "你最不希望我改變的我是什麼樣子？" },
  { id: "q457", category: "devotion", depth: "light",  text: "我吃飯的時候有沒有哪個動作你特別想一直看？" },
  { id: "q458", category: "devotion", depth: "deep",   text: "你有沒有幻想過我們的下輩子是什麼樣子？" },
  { id: "q459", category: "devotion", depth: "medium", text: "你心裡有沒有一個「如果我離開，某某人也一起帶走」的東西？" },
  { id: "q460", category: "devotion", depth: "deep",   featured: true, text: "如果要寫一封信給三年前剛遇見我的你，你會跟他說什麼？" },

  // ─────────────────────────── 二、脆弱與共情篇 scars (50) — 看見彼此的傷痕
  { id: "q461", category: "scars", depth: "deep",   featured: true, text: "你童年最缺的東西，現在還在意嗎？如果我能補上，你希望怎麼被補？" },
  { id: "q462", category: "scars", depth: "deep",   featured: true, text: "你有沒有一段回憶，想起來就會沉默？可以只講表情不講內容。" },
  { id: "q463", category: "scars", depth: "deep",   featured: true, text: "你內心最自卑、最不想讓人看穿的是什麼？" },
  { id: "q464", category: "scars", depth: "medium", featured: true, text: "你壓力最大的時候，最希望我怎麼對你？具體到動作。" },
  { id: "q465", category: "scars", depth: "deep",   featured: true, text: "你有沒有假裝堅強，其實特別想哭的時候？那時候你在想什麼？" },
  { id: "q466", category: "scars", depth: "medium", text: "小時候你最害怕的一件事是什麼？你怎麼克服（或沒克服）？" },
  { id: "q467", category: "scars", depth: "deep",   text: "你有沒有一個爸 / 媽沒做到的事，你現在還在等？" },
  { id: "q468", category: "scars", depth: "medium", text: "上一次你覺得自己「沒有人懂」是什麼情況？" },
  { id: "q469", category: "scars", depth: "deep",   text: "有沒有一個人你以為你已經放下了，但講到他你還會情緒起伏？" },
  { id: "q470", category: "scars", depth: "medium", text: "你身上哪一個小動作，其實是你的防衛姿勢？" },
  { id: "q471", category: "scars", depth: "deep",   text: "你最怕別人看到你的哪一面？連我也不太敢給我看？" },
  { id: "q472", category: "scars", depth: "medium", text: "你有沒有某個場景（天氣、音樂、氣味）會突然讓你心情很糟？" },
  { id: "q473", category: "scars", depth: "deep",   text: "你最失控的一次情緒是什麼時候？後來怎麼回到自己？" },
  { id: "q474", category: "scars", depth: "medium", text: "你曾經在哪一段關係裡最沒有自己？現在回看是什麼感覺？" },
  { id: "q475", category: "scars", depth: "deep",   featured: true, text: "你最不想遺傳給孩子的爸媽特質是什麼？你擔心自己已經變成那樣了嗎？" },
  { id: "q476", category: "scars", depth: "medium", text: "你長大以後還有哪件事是你會躲起來哭的？" },
  { id: "q477", category: "scars", depth: "deep",   text: "你有沒有一個秘密，藏在心裡很多年？可以只說藏了多久。" },
  { id: "q478", category: "scars", depth: "medium", text: "你最討厭自己的一個習慣是什麼？明明知道但改不掉的那種。" },
  { id: "q479", category: "scars", depth: "deep",   text: "你曾經被誰深深傷害過，卻從來沒跟他 / 她說？" },
  { id: "q480", category: "scars", depth: "medium", text: "你有沒有一種感覺 / 情緒，你到現在還不知道怎麼描述？" },
  { id: "q481", category: "scars", depth: "deep",   text: "如果時光能回到某一年某一天，你想回去抱那時候的自己說什麼？" },
  { id: "q482", category: "scars", depth: "medium", text: "你最害怕我看到你什麼樣子？（生病 / 素顏 / 崩潰...）" },
  { id: "q483", category: "scars", depth: "deep",   text: "你從哪一次失去學到最多？那個學會的代價是什麼？" },
  { id: "q484", category: "scars", depth: "medium", text: "你有沒有在深夜對自己生氣過？為了什麼？" },
  { id: "q485", category: "scars", depth: "deep",   featured: true, text: "你覺得你還有一個沒被真正愛過的部分嗎？那是什麼？" },
  { id: "q486", category: "scars", depth: "medium", text: "當你說「我沒事」，通常藏的是什麼？" },
  { id: "q487", category: "scars", depth: "deep",   text: "你有沒有哪個失敗，讓你好幾年不敢再嘗試同一件事？" },
  { id: "q488", category: "scars", depth: "medium", text: "別人罵你什麼字眼最會戳到你？為什麼是那個？" },
  { id: "q489", category: "scars", depth: "deep",   text: "你有沒有一個「如果當時 ___，我就不會變成今天這樣」的假設？" },
  { id: "q490", category: "scars", depth: "medium", text: "你在眾人面前最自在，獨處時反而最不安的時刻是什麼？" },
  { id: "q491", category: "scars", depth: "deep",   text: "你身體上哪裡被觸碰會讓你不自覺閃躲？為什麼？" },
  { id: "q492", category: "scars", depth: "medium", text: "你覺得你最容易被哪種安慰擊中？是話語、擁抱、還是沉默陪伴？" },
  { id: "q493", category: "scars", depth: "deep",   text: "你會不會擔心自己「不值得被愛」？那個感覺什麼時候最強？" },
  { id: "q494", category: "scars", depth: "medium", text: "你小時候哪一次被誇獎，到現在還記得？" },
  { id: "q495", category: "scars", depth: "deep",   text: "有沒有一個人，你現在還希望他在世上某處看到你過得好？" },
  { id: "q496", category: "scars", depth: "medium", text: "你最怕失去的，除了我之外還有什麼？" },
  { id: "q497", category: "scars", depth: "deep",   text: "你有沒有一個願望是你還不敢承認的？" },
  { id: "q498", category: "scars", depth: "medium", text: "你覺得自己現在比 5 年前勇敢還是脆弱？" },
  { id: "q499", category: "scars", depth: "deep",   featured: true, text: "你最希望我在你什麼時候擁抱你，什麼都不問？" },
  { id: "q500", category: "scars", depth: "medium", text: "你小時候的棉被 / 娃娃 / 特殊物件是什麼？現在還留著嗎？" },
  { id: "q501", category: "scars", depth: "deep",   text: "你有沒有一段記憶是「明明很難但卻不想忘」？為什麼？" },
  { id: "q502", category: "scars", depth: "medium", text: "你覺得自己是哪一種哭法的人？默默、嚎啕、還是不哭？" },
  { id: "q503", category: "scars", depth: "deep",   text: "你最後一次覺得自己被「真正看見」是什麼時候？誰做到的？" },
  { id: "q504", category: "scars", depth: "medium", text: "你壓力大時身體會出現什麼訊號？（你希望我能看懂那個訊號嗎）" },
  { id: "q505", category: "scars", depth: "deep",   text: "你有一部分是你小時候答應過自己「不再示弱」的嗎？可以描述那個承諾？" },
  { id: "q506", category: "scars", depth: "medium", text: "你最希望我認真聽的一個話題，每次說起你都覺得沒被好好聽？" },
  { id: "q507", category: "scars", depth: "deep",   text: "有沒有一個人，你覺得他 / 她誤會你一輩子？你沒辯解？" },
  { id: "q508", category: "scars", depth: "medium", text: "你最近哪一件小事讓你覺得「沒事但其實有事」？" },
  { id: "q509", category: "scars", depth: "deep",   text: "你希望我在你崩潰時，先說話還是先抱著？" },
  { id: "q510", category: "scars", depth: "deep",   featured: true, text: "你有沒有一個「永遠不想讓爸媽失望」的包袱？那個包袱累嗎？" },

  // ─────────────────────────── 三、矛盾與包容篇 tolerance (50) — 一起面對問題
  { id: "q511", category: "tolerance", depth: "medium", featured: true, text: "你覺得我最讓你心疼的地方是什麼？那個心疼會不會讓你不忍心直說？" },
  { id: "q512", category: "tolerance", depth: "deep",   featured: true, text: "我們之間有沒有一個一直沒講開的小心結？可以今天講一部分嗎？" },
  { id: "q513", category: "tolerance", depth: "medium", text: "我最讓你想翻白眼的一個行為是什麼？我有進步嗎？" },
  { id: "q514", category: "tolerance", depth: "deep",   text: "我們吵架的時候，你心裡真正想要的結果是什麼？贏？被理解？被擁抱？" },
  { id: "q515", category: "tolerance", depth: "medium", text: "我冷戰時你都在想什麼？你會期待什麼動作打破？" },
  { id: "q516", category: "tolerance", depth: "deep",   text: "你曾經憋著沒說但差點傷到我們的一句話是什麼？" },
  { id: "q517", category: "tolerance", depth: "medium", text: "我什麼時候會不小心傷到你，而你沒讓我知道？" },
  { id: "q518", category: "tolerance", depth: "deep",   text: "你覺得我們吵架的模式重複出現嗎？那個輪迴的根源是什麼？" },
  { id: "q519", category: "tolerance", depth: "medium", text: "你最後悔跟我說過哪句話？後來有沒有補救？" },
  { id: "q520", category: "tolerance", depth: "deep",   text: "如果我某天做了一件你不能接受的事，你會先離開還是先問為什麼？" },
  { id: "q521", category: "tolerance", depth: "medium", text: "你覺得我什麼時候最難搞？那個時候你需要什麼？" },
  { id: "q522", category: "tolerance", depth: "deep",   text: "你有沒有一個底線是你從沒告訴過我的？" },
  { id: "q523", category: "tolerance", depth: "medium", text: "我什麼時候讓你覺得「被當成空氣」？你希望我怎麼補？" },
  { id: "q524", category: "tolerance", depth: "deep",   featured: true, text: "你願意為我放下什麼？願意為我堅持什麼？（兩個都要答）" },
  { id: "q525", category: "tolerance", depth: "medium", text: "我們的相處裡有沒有一種「其實不用，但我們一直在做」的習慣？" },
  { id: "q526", category: "tolerance", depth: "deep",   text: "你怕我哪一天某個方向會怎麼改變？那個擔心合理嗎？" },
  { id: "q527", category: "tolerance", depth: "medium", text: "當我太累的時候，你希望我選擇自我照顧還是陪你？" },
  { id: "q528", category: "tolerance", depth: "deep",   text: "你有沒有某件事是「你其實同意但沒跟我說」？為什麼？" },
  { id: "q529", category: "tolerance", depth: "medium", text: "你吵架時最不喜歡我用的一招是什麼？沉默、大聲、講道理？" },
  { id: "q530", category: "tolerance", depth: "deep",   text: "你心裡有沒有一個「如果某件事發生，我會選擇離開」的條件？" },
  { id: "q531", category: "tolerance", depth: "medium", text: "你覺得我們吵完架最有效的和好方式是什麼？" },
  { id: "q532", category: "tolerance", depth: "deep",   text: "如果我們今天第一次見面，你會不會還選擇我？為什麼？" },
  { id: "q533", category: "tolerance", depth: "medium", text: "你最不喜歡我跟朋友在一起時的哪個版本？" },
  { id: "q534", category: "tolerance", depth: "deep",   text: "你覺得自己在我們關係裡已經妥協過最多的一件事是什麼？" },
  { id: "q535", category: "tolerance", depth: "medium", text: "當我犯錯的時候，你希望我怎麼道歉？" },
  { id: "q536", category: "tolerance", depth: "deep",   featured: true, text: "我們之間有沒有某個議題，你其實很想討論但怕傷感情？" },
  { id: "q537", category: "tolerance", depth: "medium", text: "你最介意我什麼習慣但一直沒直接講？（現在可以講嗎）" },
  { id: "q538", category: "tolerance", depth: "deep",   text: "如果我做了一件讓你心寒的事，你會給我幾次機會？" },
  { id: "q539", category: "tolerance", depth: "medium", text: "你覺得我道歉是真心還是搪塞？怎麼判斷？" },
  { id: "q540", category: "tolerance", depth: "deep",   text: "你曾經暗自期待我改變什麼，但最後決定「算了接受吧」？" },
  { id: "q541", category: "tolerance", depth: "medium", text: "你最不能容忍的「關係裡的小事」是什麼？" },
  { id: "q542", category: "tolerance", depth: "deep",   text: "你覺得你對我最大的包容是什麼？" },
  { id: "q543", category: "tolerance", depth: "medium", text: "當你覺得我不理解你，你第一個想法是「再解釋一次」還是「算了」？" },
  { id: "q544", category: "tolerance", depth: "deep",   text: "你有沒有為了不吵架，吞下某種情緒？吞多久了？" },
  { id: "q545", category: "tolerance", depth: "medium", text: "我們有沒有一個話題，三年內每次提都會變成吵架？" },
  { id: "q546", category: "tolerance", depth: "deep",   text: "如果我們分開，你覺得你會最想念我什麼？最不想念什麼？" },
  { id: "q547", category: "tolerance", depth: "medium", text: "你希望我們吵架後的黃金 24 小時怎麼度過？" },
  { id: "q548", category: "tolerance", depth: "deep",   featured: true, text: "你覺得在這段關係裡，誰付出比較多？那個差距你在意嗎？" },
  { id: "q549", category: "tolerance", depth: "medium", text: "你覺得我最需要改掉的一個習慣是什麼？（具體到動作）" },
  { id: "q550", category: "tolerance", depth: "deep",   text: "有沒有哪件事你已經原諒我了，但你希望我自己想起來？" },
  { id: "q551", category: "tolerance", depth: "medium", text: "你覺得我們的金錢觀有沒有暗地裡不合？你敢講嗎？" },
  { id: "q552", category: "tolerance", depth: "deep",   text: "你曾經對我說過最違心的一句話是什麼？" },
  { id: "q553", category: "tolerance", depth: "medium", text: "當我情緒化時，你需要我給你空間幾分鐘？" },
  { id: "q554", category: "tolerance", depth: "deep",   text: "你有沒有某個你覺得「我一定做不到」所以放棄說出口的期待？" },
  { id: "q555", category: "tolerance", depth: "medium", text: "你覺得我對家人的態度有哪部分讓你不舒服？" },
  { id: "q556", category: "tolerance", depth: "deep",   text: "我們之間有沒有一個「我以為只是小事、你以為很大事」的落差？" },
  { id: "q557", category: "tolerance", depth: "medium", text: "你心中有沒有一個「我對你最不公平的時刻」？" },
  { id: "q558", category: "tolerance", depth: "deep",   text: "如果可以重來一次某個爭吵，你想怎麼重新回應？" },
  { id: "q559", category: "tolerance", depth: "medium", text: "你認為理想的「對你讓步」是什麼樣？" },
  { id: "q560", category: "tolerance", depth: "deep",   featured: true, text: "我們之間最沒有共識的一個價值觀是什麼？我們怎麼共存？" },

  // ─────────────────────────── 四、未來與承諾篇 commitment (50) — 聊完就想過一生
  { id: "q561", category: "commitment", depth: "deep",   featured: true, text: "你有沒有認真把我放進你的未來裡？哪一年、哪個畫面最具體？" },
  { id: "q562", category: "commitment", depth: "medium", featured: true, text: "我們 10 年後的一個平凡星期二晚上，你希望長什麼樣子？" },
  { id: "q563", category: "commitment", depth: "deep",   featured: true, text: "你覺得我們的孩子會長什麼樣？（個性上，不是外型）" },
  { id: "q564", category: "commitment", depth: "medium", text: "你覺得你能跟我一起面對「爸媽老了」這件事嗎？怎麼面對？" },
  { id: "q565", category: "commitment", depth: "deep",   text: "我們之間的承諾，你最不願意破的是哪一個？" },
  { id: "q566", category: "commitment", depth: "medium", text: "你想要什麼樣的求婚 / 告白？不是浪漫的那種，是「這就是我」的那種。" },
  { id: "q567", category: "commitment", depth: "deep",   featured: true, text: "你覺得你這輩子，會為我放棄什麼不會後悔？" },
  { id: "q568", category: "commitment", depth: "medium", text: "如果我們要買第一間房，你希望它長什麼樣？一個房間、三個房間、有院子嗎？" },
  { id: "q569", category: "commitment", depth: "deep",   text: "你有沒有擔心過「萬一真的一輩子」這件事？那個擔心是什麼？" },
  { id: "q570", category: "commitment", depth: "medium", text: "你想不想寫一份「我們共同的目標清單」？五年內必完成的那種。" },
  { id: "q571", category: "commitment", depth: "deep",   text: "你會想要孩子嗎？幾個？如果我們無法生育，你會想領養嗎？" },
  { id: "q572", category: "commitment", depth: "medium", text: "你覺得我們的婚禮最重要的一個元素是什麼？錢、人、儀式、心意？" },
  { id: "q573", category: "commitment", depth: "deep",   text: "如果我們變成老夫老妻，你希望我們保留什麼像「年輕時」的樣子？" },
  { id: "q574", category: "commitment", depth: "medium", text: "你願意為了我搬到哪個城市 / 國家？那個界線在哪？" },
  { id: "q575", category: "commitment", depth: "deep",   text: "如果我們其中一個人病重了，你希望對方怎麼做？" },
  { id: "q576", category: "commitment", depth: "medium", text: "你想跟我一起養寵物嗎？什麼動物？誰負責？" },
  { id: "q577", category: "commitment", depth: "deep",   featured: true, text: "你覺得「愛」跟「陪伴」，10 年後哪個對你比較重要？" },
  { id: "q578", category: "commitment", depth: "medium", text: "你想要我們的週年紀念日怎麼過？一直都這樣嗎？" },
  { id: "q579", category: "commitment", depth: "deep",   text: "你想不想跟我一起寫遺願？不是沉重的，是「如果先走了希望你怎樣」的那種。" },
  { id: "q580", category: "commitment", depth: "medium", text: "你覺得我們是類「一起奮鬥」型還是「相濡以沫」型？你更想要哪一型？" },
  { id: "q581", category: "commitment", depth: "deep",   text: "你覺得我們之間最能撐過時間考驗的是什麼？" },
  { id: "q582", category: "commitment", depth: "medium", text: "你最期待我們一起經歷的一個人生階段是哪個？" },
  { id: "q583", category: "commitment", depth: "deep",   text: "你希望我們老的時候還能做的事情是什麼？散步、旅行、一起追劇？" },
  { id: "q584", category: "commitment", depth: "medium", text: "你願意跟我一起學新東西嗎？語言、樂器、運動？（具體哪一個）" },
  { id: "q585", category: "commitment", depth: "deep",   featured: true, text: "你有沒有一個「只有我們知道」的長遠計劃？講一部分給我聽？" },
  { id: "q586", category: "commitment", depth: "medium", text: "我們如果真的結婚，婚前誰想留一點自己的秘密空間？要怎麼尊重？" },
  { id: "q587", category: "commitment", depth: "deep",   text: "你希望我們的愛情，10 年後變成「親情」還是「愛情」？那個取捨是什麼？" },
  { id: "q588", category: "commitment", depth: "medium", text: "你有沒有希望我們每年都做的一件「小儀式」？（年度旅行、寫信、拍照）" },
  { id: "q589", category: "commitment", depth: "deep",   text: "你想要自己的葬禮是什麼樣？你希望我在上面說什麼？" },
  { id: "q590", category: "commitment", depth: "medium", text: "你希望我們的住家有什麼元素是「一定要有」的？（陽台 / 書房 / 貓）" },
  { id: "q591", category: "commitment", depth: "deep",   text: "你覺得我們最大的風險是什麼？（外在、內在都可以）" },
  { id: "q592", category: "commitment", depth: "medium", text: "你希望我們的吵架風格 10 年後會怎麼改變？" },
  { id: "q593", category: "commitment", depth: "deep",   text: "你覺得「我們」這個詞，在你心裡會逐漸取代「我」嗎？" },
  { id: "q594", category: "commitment", depth: "medium", text: "你希望我們有沒有固定「兩個人的夜晚」？（無 3C / 無小孩 / 無工作）" },
  { id: "q595", category: "commitment", depth: "deep",   text: "如果我們都有事業，哪一個願意先為家庭退讓？那個協商是什麼樣？" },
  { id: "q596", category: "commitment", depth: "medium", text: "你會希望我們之間存一筆「夢想基金」嗎？存什麼？" },
  { id: "q597", category: "commitment", depth: "deep",   featured: true, text: "你覺得我們最大的共同點是什麼？那個共同點能陪我們到 80 歲嗎？" },
  { id: "q598", category: "commitment", depth: "medium", text: "你希望我陪你度過的下一個難關是什麼？你已經準備好讓我進去了嗎？" },
  { id: "q599", category: "commitment", depth: "deep",   text: "你會不會希望每個月有一晚我們什麼都不做，就坐在一起？" },
  { id: "q600", category: "commitment", depth: "deep",   featured: true, text: "如果我問「我們要不要結婚？」你希望我用什麼方式問？" },
  { id: "q601", category: "commitment", depth: "medium", text: "你希望我對你的家人用什麼方式相處？（像親人 / 保持距離）" },
  { id: "q602", category: "commitment", depth: "deep",   text: "你會希望我們信任對方到什麼程度？（看手機 / 分帳號 / 各自空間）" },
  { id: "q603", category: "commitment", depth: "medium", text: "你希望我們共同擁有的第一件大物品是什麼？" },
  { id: "q604", category: "commitment", depth: "deep",   text: "我們這段關係 10 年後，你會給它打幾分？你希望怎麼達到那分數？" },
  { id: "q605", category: "commitment", depth: "medium", text: "你會想不想為我們的關係，定一個「年度主題字」？" },
  { id: "q606", category: "commitment", depth: "deep",   text: "你願意在我生命最脆弱的時候出現嗎？例如失業、生重病、失去親人？" },
  { id: "q607", category: "commitment", depth: "medium", text: "如果我們沒辦法做我們想像中的「一輩子」，最少最少我們要做到什麼？" },
  { id: "q608", category: "commitment", depth: "deep",   text: "你覺得我們能不能當彼此「最後的家人」？那個感覺是什麼？" },
  { id: "q609", category: "commitment", depth: "medium", text: "你希望我每年在你生日那天做一件什麼事？成為我們的習慣。" },
  { id: "q610", category: "commitment", depth: "deep",   featured: true, text: "如果此刻我問你「你願意嗎？」你腦袋裡第一個浮現的答案是什麼？" },
];

// ============================================================
// Helpers
// ============================================================

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/**
 * 隨機抽題。
 * - 若指定 category/depth：退化為原本的均勻抽樣。
 * - 若未指定 category：採用「**分類等機率**」兩段式抽樣，避免 dialogue 三子類
 *   單邊傾斜（q201-q410 共 210 題 vs 其他每類 20 題，若直接均勻抽會有 ~50% 機率落在對談池）。
 *   先在可用類別裡等機率挑一類，再在該類內均勻抽一題。
 * - featured=true 可只抽精選 100 題池。
 */
export function randomQuestion(
  filter?: {
    category?: QuestionCategory;
    depth?: QuestionDepth;
    excludeIds?: string[];
    featuredOnly?: boolean;
    kind?: NonNullable<Question["kind"]>;
  },
): Question | undefined {
  let pool = QUESTIONS;
  if (filter?.featuredOnly) pool = pool.filter((q) => q.featured);
  if (filter?.depth) pool = pool.filter((q) => q.depth === filter.depth);
  if (filter?.excludeIds?.length) pool = pool.filter((q) => !filter.excludeIds!.includes(q.id));
  if (filter?.kind) pool = pool.filter((q) => q.kind === filter.kind);

  if (filter?.category) {
    pool = pool.filter((q) => q.category === filter.category);
    if (!pool.length) return undefined;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (!pool.length) return undefined;
  // 兩段式：先等機率選類別，再類別內等機率選題
  const byCategory = new Map<QuestionCategory, Question[]>();
  for (const q of pool) {
    const arr = byCategory.get(q.category) ?? [];
    arr.push(q);
    byCategory.set(q.category, arr);
  }
  const categories = Array.from(byCategory.keys());
  const pickedCat = categories[Math.floor(Math.random() * categories.length)];
  const bucket = byCategory.get(pickedCat)!;
  return bucket[Math.floor(Math.random() * bucket.length)];
}

/** 統計工具：給 UI 展示用 */
export function countsByCategory(): Record<QuestionCategory, number> {
  const out = {} as Record<QuestionCategory, number>;
  for (const key of Object.keys(CATEGORY_LABELS) as QuestionCategory[]) out[key] = 0;
  for (const q of QUESTIONS) out[q.category]++;
  return out;
}

export function featuredCount(): number {
  return QUESTIONS.filter((q) => q.featured).length;
}
