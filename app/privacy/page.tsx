import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-empire-sky">← 返回首頁</Link>
      <h1 className="mt-4 font-display font-black text-3xl text-empire-ink">隱私政策</h1>
      <p className="mt-2 text-sm text-empire-mute">最後更新：2026-04-17</p>

      <article className="card p-6 mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-empire-ink">1. 我們收集哪些資料</h2>
          <p className="mt-1 text-empire-mute">
            目前 v0.1 alpha 版本 <b>不向伺服器上傳任何資料</b>。所有遊戲資料 (任務、金幣、寵物、圖鑑、島嶼) 僅存在你的裝置瀏覽器 localStorage。
          </p>
          <p className="mt-2 text-empire-mute">
            若透過 LINE LIFF 登入，我們會取得 LINE 提供的：顯示名稱、頭像、LINE User ID。不會取得你的聊天記錄、好友清單或手機號碼。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">2. 未來資料儲存 (Supabase)</h2>
          <p className="mt-1 text-empire-mute">
            當我們開始使用 Supabase 後端儲存資料時，每對情侶的資料會以 Row Level Security 嚴格隔離。你們絕對看不到其他情侶的私密資料 (任務、記憶卡、島嶼)。只有情侶自己選擇「公開」的部分 (王國名、等級、排行榜指標) 會被其他使用者看到。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">3. 第三方服務</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· <b>Vercel</b>：網站代管，收集匿名訪問記錄 (IP、瀏覽器)</li>
            <li>· <b>LINE</b>：若使用 LIFF 登入，適用 LINE 隱私政策</li>
            <li>· <b>Supabase</b> (未來)：資料庫代管，資料存於 AWS 亞太區</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">4. 你的權利</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· 隨時刪除瀏覽器 localStorage 即可清除所有本地資料</li>
            <li>· 未來 Supabase 版將提供「匯出」、「刪除帳號」按鈕</li>
            <li>· GDPR / 個資法相關詢問：在 GitHub 開 issue</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">5. Cookie</h2>
          <p className="mt-1 text-empire-mute">
            本站不使用 tracking cookies。僅使用 localStorage 儲存遊戲狀態與你的登入角色偏好。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">6. 聯絡</h2>
          <p className="mt-1 text-empire-mute">
            有任何隱私相關疑問，請至 <a href="https://github.com/eason690717/love-empire/issues" className="text-empire-sky underline">GitHub issues</a> 留言。
          </p>
        </section>
      </article>
    </main>
  );
}
