# Vercel 先上線（不用 LIFF）

專案已經 `git init` + 初次 commit 完成，branch: `main`。
**目前狀態 = 純 Web Demo 版**，任何人開網址都能試玩（localStorage 持久化單機 demo）。LIFF ID 之後補填會自動啟用 LINE 功能。

## 選項 A：Vercel CLI（最快，不用 GitHub）

打開 PowerShell 或 git-bash，執行：

```bash
npm i -g vercel
cd D:/GA/0417_LoveGame
vercel
```

第一次會問：
1. `Set up and deploy?` → `Y`
2. `Which scope?` → 選你自己的帳號
3. `Link to existing project?` → `N`
4. `Project name?` → 按 Enter 用預設 `0417-lovegame`，或改 `love-empire`
5. `Directory?` → 按 Enter 用當前目錄
6. `Want to modify settings?` → `N`

部署約 1-2 分鐘 → 印出網址 e.g. `https://love-empire.vercel.app` → **直接可用**。

之後要重新部署：
```bash
vercel --prod
```

> 第一次執行會在瀏覽器跳出 Vercel 登入，選 **Continue with GitHub / Email** 任一個即可（免信用卡）。

---

## 選項 B：GitHub + Vercel Web UI（長期推薦，push 自動部署）

### 1. 在 GitHub 建 repo
1. <https://github.com/new>
2. Repository name: `love-empire`（或你喜歡的）
3. **Private / Public** 隨你（Private 也能部署 Vercel）
4. **不要勾** Initialize with README / gitignore（我已建好）
5. Create

### 2. 推上去
複製 GitHub 給的 URL，執行：

```bash
cd D:/GA/0417_LoveGame
git remote add origin https://github.com/<你的帳號>/love-empire.git
git push -u origin main
```

第一次 push 可能跳出瀏覽器要求授權，跟著 GitHub 的指示登入。

### 3. Vercel 接 GitHub
1. <https://vercel.com/new>
2. 用 GitHub 登入
3. **Import** 剛剛推上去的 `love-empire` repo
4. Framework Preset 會自動偵測為 **Next.js** → 不用改
5. Environment Variables **可以先跳過**（LIFF ID 之後再補）
6. **Deploy** → 約 1-2 分鐘

之後 `git push` 會自動觸發新 deploy。

---

## 部署後馬上能用的功能
- ✅ 登入 / 註冊 / 配對碼流程
- ✅ 任務申報 / 准奏 / 駁回
- ✅ 金幣經濟 + 國庫兌換 + 寶庫
- ✅ 愛之寵物 + 屬性 + 進化
- ✅ 記憶圖鑑 + 稀有度 + SSR 彩虹光
- ✅ 帝國島嶼（可拖曳家具）
- ✅ 每日儀式 + 連擊
- ✅ 全球排行榜 / 好友情侶 / 聯盟 BOSS
- ✅ **分享按鈕**：非 LINE 環境 fallback 到 Web Share / 剪貼簿
- ⚠️ 所有資料目前存在**瀏覽器 localStorage**，不同裝置不同步（等 Supabase 階段才會真串資料庫）

## 之後補 LIFF 的步驟
等你有空註冊 LINE Developer 帳號：

1. 照 [GETTING_STARTED_LIFF.md](GETTING_STARTED_LIFF.md) A 段拿到 LIFF ID
2. Vercel → Settings → Environment Variables 加：
   - `NEXT_PUBLIC_LIFF_ID` = `1234567890-AbCdEfGh`
   - `NEXT_PUBLIC_APP_URL` = `https://<你的>.vercel.app`
3. Redeploy
4. 回 LINE Console 把 LIFF Endpoint 指向 `https://<你的>.vercel.app/login`

搞定。LINE 功能自動啟用，不用改任何程式碼。

---

## 回報給我

Deploy 完成後把 Vercel 網址貼給我，我會：
- 打開檢查 UI 是否正確渲染
- 確認所有頁面可訪問
- 有任何錯誤幫你排
