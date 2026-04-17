import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-empire-sky">← 返回首頁</Link>
      <h1 className="mt-4 font-display font-black text-3xl text-empire-ink">使用條款</h1>
      <p className="mt-2 text-sm text-empire-mute">最後更新：2026-04-17</p>

      <article className="card p-6 mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-empire-ink">1. 服務性質</h2>
          <p className="mt-1 text-empire-mute">
            「愛的帝國 / Love Empire」為一款兩人 (情侶) 共同使用的互動量化遊戲。使用者需年滿 13 歲 (或當地法定同意年齡) 才可使用。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">2. 使用者行為規範</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· 不得上傳違法、仇恨、騷擾他人的內容</li>
            <li>· 不得偽造他人身份或假冒配對碼</li>
            <li>· 不得濫用系統 (刷榜、自動化腳本、多重帳號)</li>
            <li>· 留言、送禮、聯盟互動應尊重其他使用者</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">3. 國庫兌換獎勵</h2>
          <p className="mt-1 text-empire-mute">
            「國庫兌換」中的「現金回饋」、「洗碗券」、「長輩擋箭牌」等獎勵，是<b>你跟另一半之間的私下約定</b>。愛的帝國平台<b>不介入履行</b>、不承擔任何兌換後續。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">4. 智慧財產權</h2>
          <p className="mt-1 text-empire-mute">
            你在遊戲內創造的內容 (王國名、自訂任務、島嶼裝飾) 屬於你。平台保留為維運目的顯示的權利。程式碼本身遵循 GitHub repo 標示的授權。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">5. 免責聲明</h2>
          <p className="mt-1 text-empire-mute">
            服務目前為 <b>alpha 版</b>，可能有 bug 或資料遺失風險。我們不保證服務不中斷，不對因使用本服務造成的感情糾紛、家庭爭議、兌換糾紛負責。請理性遊玩。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">6. 條款變更</h2>
          <p className="mt-1 text-empire-mute">
            我們保留隨時修改本條款的權利，重大變更會在首頁公告。
          </p>
        </section>
      </article>
    </main>
  );
}
