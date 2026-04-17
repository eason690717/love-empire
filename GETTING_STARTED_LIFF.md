# 愛的帝國 · LIFF 上線手冊

程式碼這邊我已經接好 LIFF SDK (init、profile、shareTargetPicker、deep-link 配對碼)。你接下來要做的事情是**註冊 LINE 開發者帳號** + **部署到公開 HTTPS 網址**。這份手冊逐步帶你完成。

---

## 總覽
完整上線 = A + B + C 三步：

- **A. 建立 LIFF App** → 拿到 `LIFF_ID`
- **B. 部署到 Vercel** → 拿到公開 HTTPS URL
- **C. 回填 LIFF 設定** → endpoint URL 指向 Vercel

最快 30 分鐘可跑通。不需要信用卡。

---

## A. 建立 LIFF App（15 分鐘）

### A1. 登入 LINE Developers Console
1. 打開 <https://developers.line.biz/console/>
2. 用你的 LINE 帳號登入（手機掃 QR）
3. 第一次會要你接受開發者條款，填 email 驗證

### A2. 建立 Provider
Provider 是「開發者/公司」的概念，之後可放多個 channel。

1. 點 **Create a new provider** → 名稱：`愛的帝國` (或任何你喜歡的)
2. 建立後會進入 Provider 首頁

### A3. 建立 LINE Login Channel
LIFF App 必須附掛在一個 Channel 下。我們用 **LINE Login** (不是 Messaging API)。

1. 在 Provider 頁按 **Create a new channel** → 選 **LINE Login**
2. 填：
   - **Channel name**：`愛的帝國`
   - **Channel description**：`情侶互動量化遊戲`
   - **App types**：勾 ✅ **Web app**
   - **Email address**：你的 email
   - **Category / Subcategory**：隨便選 (e.g. Lifestyle / Dating)
3. 同意條款 → Create

### A4. 在 Channel 裡建立 LIFF App
1. 在剛建的 Channel 頁 → 切到上方 **LIFF** tab → **Add**
2. 填：
   - **LIFF app name**：`愛的帝國`
   - **Size**：**Full** (佔滿整個 LINE 視窗)
   - **Endpoint URL**：**先填 `https://localhost:3000`（或任何網址佔位）**，之後換成 Vercel 網址
   - **Scope**：勾 ✅ `profile`、✅ `openid`
   - **Bot link feature**：Off (暫不需要)
3. 按 **Add**
4. 建立後會看到一個 **LIFF ID**，長這樣：`1234567890-AbCdEfGh`
5. **複製 LIFF ID，等會用**

---

## B. 部署到 Vercel（10 分鐘）

### B1. 把程式碼 push 到 GitHub
在專案目錄：

```bash
cd D:/GA/0417_LoveGame
git init
git add .
git commit -m "initial"
```

到 <https://github.com/new> 建新 repo (名稱任意)，然後：

```bash
git remote add origin https://github.com/<你的帳號>/<repo名稱>.git
git branch -M main
git push -u origin main
```

### B2. 部署
1. 打開 <https://vercel.com/> → 用 GitHub 登入
2. **Add New → Project** → 選剛才的 repo → **Import**
3. **Framework Preset** 會自動偵測為 Next.js（不用改）
4. 展開 **Environment Variables**，加入：
   - `NEXT_PUBLIC_LIFF_ID` = `<剛才 A4 複製的 LIFF ID>`
   - `NEXT_PUBLIC_APP_URL` = `https://<你的專案>.vercel.app` (先留空，等 deploy 完回頭填)
5. 按 **Deploy**
6. 約 1-2 分鐘後 → 拿到網址，例如 `https://love-empire-xyz.vercel.app`

### B3. 補回環境變數
1. 在 Vercel 專案 → **Settings → Environment Variables**
2. 更新 `NEXT_PUBLIC_APP_URL` 為真實 Vercel 網址
3. **Deployments → 最新那筆 → Redeploy** 讓新 env 生效

---

## C. 回填 LIFF Endpoint（5 分鐘）

1. 回到 LINE Developers Console → Provider → Channel → LIFF tab
2. 點你建的 LIFF app → **Edit**
3. **Endpoint URL** 改成：`https://<你的專案>.vercel.app/login`
   - ⚠️ 一定是 **HTTPS**，`http://` 或 `localhost` 不行
4. 儲存

---

## D. 測試（5 分鐘）

### D1. 取得可分享的 LIFF URL
在 LIFF app 詳情頁會看到 **LIFF URL**，格式：
```
https://liff.line.me/1234567890-AbCdEfGh
```

### D2. 手機測試
1. 用 LINE 傳送 LIFF URL 給自己 (Keep Memo)
2. 在 LINE 裡點開 → 會開在 LINE 內嵌瀏覽器
3. 應看到登入頁，按 **「💚 以 LINE 身份進入」** → 自動抓你的 LINE profile → 進入儀表板
4. 到 **建立王國** → 註冊完成 → 應該看到 **💚 分享到 LINE** 按鈕 → 按下去 → 選一個朋友 / 群組 → 會送出一張 flex 邀請卡

### D3. 瀏覽器測試
- 直接打開 `https://<你的專案>.vercel.app` → 走一般 Web 登入流程（看不到 LINE 登入按鈕的自動跳轉，但有一個綠色 LINE 登入按鈕）

---

## E. 進階（選擇性）

### E1. 自訂 Rich Menu（LINE 裡的永久底部選單）
到 LINE Official Account Manager 可設定 rich menu 直接連 LIFF，體驗更像 app。

### E2. 接 Messaging API 送推播
目前 LIFF Login Channel 不能送 push。若要做推播：
1. 在同一 Provider 下建立 **Messaging API Channel**
2. 把你的 LIFF app 綁到該 channel
3. 用戶加入機器人為好友 → 取得 `userId` → 用 Messaging API `/v2/bot/message/push` 發送
4. 免費每月 500 條訊息，付費可擴充

### E3. 換自有網址
Vercel 專案 → Settings → Domains → 加你的網域 (e.g. `love.yourdomain.com`) → 更新 LIFF endpoint + `NEXT_PUBLIC_APP_URL`

---

## 常見問題

**Q: 我還沒 LINE Developer 帳號怎麼辦？**  
A: 用手邊任何 LINE 帳號即可登入 <https://developers.line.biz/console/>，自動會幫你建立開發者身分，免費。

**Q: Endpoint URL 可以先用 localhost 測試嗎？**  
A: LINE LIFF 強制 HTTPS 公開 URL，localhost 不行。可先用 <https://ngrok.com/> 打洞 → `ngrok http 3000` → 拿 `https://xxx.ngrok-free.app` 填進去暫用。

**Q: LIFF 在 LINE 裡打開但一直白畫面？**  
A: 多半是 Endpoint URL 指錯，或 `NEXT_PUBLIC_LIFF_ID` 沒填。F12 開瀏覽器 console (電腦版 LINE 可用) 看錯誤訊息。

**Q: 沒 LIFF_ID 也可以跑嗎？**  
A: 可以，這時 LIFF 相關 API 會 no-op，app 照常跑（只是 LINE 登入按鈕沒效、分享按鈕會 fallback 到剪貼簿）。適合先本地開發。

**Q: 要收費嗎？**  
A: 全部免費。Vercel Hobby 100 GB/月、LINE LIFF 無限制、LINE Login 無限制。Messaging API push 每月 500 條免費，付費 NT$2,400/月起 4,000 條。對 30 對情侶（每天約 6 條推播）月需 5,400 條，會超免費額度 → 屆時要付費升級。

---

## 給我的回饋

完成後跟我說：
1. LIFF ID 是多少 (方便我幫你驗證)
2. Vercel URL 是多少
3. 有卡在哪一步

我就能接下去把 Supabase 後端、推播佇列、排行榜 materialized view 等 Phase 5 上線事項一起串上。
