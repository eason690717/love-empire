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
