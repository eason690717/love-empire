import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-empire-sky">← 返回首頁</Link>
      <h1 className="mt-4 font-display font-black text-3xl text-empire-ink">隱私政策</h1>
      <p className="mt-2 text-sm text-empire-mute">最後更新：2026-04-19 · 公測版</p>

      <article className="card p-6 mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-empire-ink">1. 公測期間的資料儲存</h2>
          <p className="mt-1 text-empire-mute">
            公測期間你的遊戲資料儲存於 <b>Supabase（AWS 亞太區）</b> + 你的瀏覽器 localStorage。
            儲存內容：王國名、暱稱、配對碼、任務、寵物狀態、記憶卡、問答答案、心情、紀念日、廣場動態、人生清單等。
          </p>
          <p className="mt-2 text-empire-mute">
            ⚠️ <b>公測期間開發者（愛的帝國管理員）有權存取資料庫進行除錯和分析。</b>
            請勿在 app 內放置極機密資料（例如真實身份證號、銀行帳號、非你本人的他人隱私）。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">2. 資料隔離（RLS）</h2>
          <p className="mt-1 text-empire-mute">
            每對情侶的資料透過 <b>Row Level Security</b> 嚴格隔離。其他情侶看不到你們的：
          </p>
          <ul className="mt-1 text-empire-mute space-y-0.5 ml-4 list-disc">
            <li>問答答案、心情狀態、任務紀錄、禮物訊息</li>
            <li>寵物互動、人生清單 proof、記憶卡</li>
            <li>配對碼、心得、紀念日</li>
          </ul>
          <p className="mt-2 text-empire-mute">
            只有你們主動「設為公開」的才會顯示：王國名、等級、暱稱、排行榜指標、你們自己按「分享到廣場」的動態。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">3. 資料類型與敏感度</h2>
          <div className="mt-1 space-y-1 text-empire-mute">
            <div>🔒 <b>僅你們兩人可見</b>：深度問答、心情、人生清單心得 / 照片、寵物、任務、禮物訊息、紀念日、畢業紀念</div>
            <div>👀 <b>好友情侶可見</b>（若你設「僅限好友」）：你們的王國名、等級、公開動態</div>
            <div>🌐 <b>所有人可見</b>（若你設「公開」）：上述 + 排行榜、廣場動態</div>
            <div>🔕 <b>完全不可見</b>（設「完全不公開」）：不上榜、不顯示於公開列表</div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">4. 第三方服務</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· <b>Vercel</b>：網站代管，收集匿名訪問記錄（IP、UA、訪問時間）</li>
            <li>· <b>Supabase</b>：資料庫 + 認證，機房在 AWS 亞太區</li>
            <li>· <b>Sentry</b>：錯誤追蹤（不 log 個資，僅程式錯誤堆疊）</li>
            <li>· <b>LINE LIFF</b>（目前尚未完成）：若未來啟用會取得你的 LINE 顯示名稱、頭像、User ID</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">5. 你的權利</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· <b>隨時清除本地資料</b>：瀏覽器清 localStorage 即可</li>
            <li>· <b>修改隱私等級</b>：設定 → 隱私 → 公開 / 僅限好友 / 完全不公開</li>
            <li>· <b>暫停王國 90 天</b>：設定 → 進階 → 王國狀態管理（可回頭）</li>
            <li>· <b>永久刪除帳號</b>：設定 → 危險區 → 清除所有資料（寄送 email 到 admin@i-style.store 加速刪除 Supabase 端）</li>
            <li>· <b>資料匯出</b>：本版本可於「畢業紀念冊」頁查看所有資料；完整 JSON 匯出後續版本推出</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">6. 帳號安全</h2>
          <ul className="mt-1 text-empire-mute space-y-1">
            <li>· 本 app 以「6 碼配對碼」作為王國鑰匙，無密碼</li>
            <li>· 請<b>務必截圖保存配對碼</b>，忘記可能導致無法回到原王國</li>
            <li>· 請勿把配對碼給第三方（可直接加入你的王國）</li>
            <li>· 一個瀏覽器僅能綁定一個角色（queen 或 prince），不可多重綁定</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">7. Cookie & 追蹤</h2>
          <p className="mt-1 text-empire-mute">
            本站不使用 tracking cookies，不接 Google Analytics / Facebook Pixel。
            僅使用 localStorage 儲存遊戲狀態與你的登入角色偏好。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">8. 未成年使用</h2>
          <p className="mt-1 text-empire-mute">
            本 app 含有「成人親密互動」獎勵分類（預設關閉，可在兌換中心手動開啟）。
            建議使用者年齡 <b>18 歲以上</b>。若你是未成年，請勿開啟該分類。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">9. 變更通知</h2>
          <p className="mt-1 text-empire-mute">
            本政策如有重大變更，將在 app 內主殿顯示通知，並更新「最後更新」日期。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-empire-ink">10. 聯絡</h2>
          <p className="mt-1 text-empire-mute">
            隱私詢問 / 資料刪除請求 / 安全通報：
            <br />· Email：<a href="mailto:admin@i-style.store" className="text-empire-sky underline">admin@i-style.store</a>
            <br />· GitHub issues：<a href="https://github.com/eason690717/love-empire/issues" className="text-empire-sky underline">love-empire/issues</a>
          </p>
        </section>
      </article>
    </main>
  );
}
