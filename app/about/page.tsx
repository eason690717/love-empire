import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-empire-sky">← 返回首頁</Link>
      <h1 className="mt-4 font-display font-black text-3xl text-empire-ink">關於愛的帝國</h1>
      <p className="mt-2 text-empire-mute">把日常的溫柔 · 量化成遊戲的成就</p>

      <section className="card p-6 mt-6 space-y-4">
        <div>
          <h2 className="font-bold text-lg">什麼是愛的帝國？</h2>
          <p className="text-sm text-empire-mute leading-relaxed mt-2">
            一款兩人專屬的量化戀愛遊戲。把日常的家事、情話、約會、驚喜，轉化成可視覺化的成長數據 — 寵物進化、記憶卡收集、小窩裝飾、連擊天數、王國等級。
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg">核心設計</h2>
          <ul className="text-sm text-empire-mute leading-relaxed mt-2 space-y-1">
            <li>· <b>每日儀式</b>：晨/晚打卡維持連擊，節日限定獎勵</li>
            <li>· <b>記憶圖鑑</b>：N/R/SR/SSR 稀有度收藏、節日限定卡</li>
            <li>· <b>五屬性寵物</b>：親密 / 溝通 / 浪漫 / 照顧 / 驚喜，五維互補</li>
            <li>· <b>深度對談</b>：410 題跨 13 主題的靈魂拷問</li>
            <li>· <b>人生清單</b>：100 件一起做的事，畢生紀念</li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-lg">角色</h2>
          <p className="text-sm text-empire-mute leading-relaxed mt-2">
            預設角色叫「<b>阿紅</b>」跟「<b>阿藍</b>」（取自月老紅線拆字 + 紅藍雙星）。但你們都可以自己改名字，性別中性支援多元。
          </p>
        </div>
      </section>

      <section className="card p-6 mt-4">
        <h2 className="font-bold text-lg">開發 / 聯絡</h2>
        <ul className="text-sm text-empire-mute mt-2 space-y-1">
          <li>· 程式碼：<a className="text-empire-sky hover:underline" href="https://github.com/eason690717/love-empire">github.com/eason690717/love-empire</a></li>
          <li>· 狀態：v0.1 alpha — 資料存於瀏覽器 localStorage</li>
          <li>· 意見回饋：直接開 GitHub issue</li>
        </ul>
      </section>

      <section className="card p-6 mt-4 text-xs text-empire-mute">
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:underline">隱私政策</Link>
          <Link href="/terms" className="hover:underline">使用條款</Link>
        </div>
      </section>
    </main>
  );
}
