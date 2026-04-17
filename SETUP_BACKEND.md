# 愛的帝國 · 後端啟用手冊 (Supabase + Cron + Sentry)

目前 app 跑在 **localStorage demo** 模式，所有資料在使用者自己的瀏覽器。
啟用下面三個後端能力後，就會變成真實多情侶、跨裝置、自動結算的產品。

---

## A. Supabase (真實 Auth + 跨裝置同步) · 30 分鐘

### A1. 建立 Supabase 專案
1. 打開 <https://supabase.com/> → Sign in with GitHub
2. **New Project** → 取個名字 (e.g. `love-empire-prod`)
3. 挑最近的 region (**Tokyo (ap-northeast-1)** 或 **Seoul**)
4. 建立 database password (保存起來)
5. 等 2 分鐘它建好專案

### A2. 跑 schema migration
1. 左側選單 **SQL Editor** → **New query**
2. 把 `supabase/migrations/0001_init.sql` 整個複製貼上 → **Run**
   - 會建立 15 張表 + RLS + materialized view
3. **再一個 New query** → 貼 `supabase/seed.sql` → **Run**
   - 會填入 task / reward / card / item catalog

### A3. 取 env 並設定 Vercel
1. Supabase 左側 **Settings → API**
2. 複製：
   - `Project URL`
   - `anon public` key
   - `service_role` key（伺服器專用，Cron 用）
3. 打開 Vercel 專案 → **Settings → Environment Variables** 加：
   - `NEXT_PUBLIC_SUPABASE_URL` = URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role
4. Vercel **Deployments** → 最新那筆 → **⋯ Redeploy**

### A4. 測試
- 部署後進網站 → 「建立新王國」→ 填 Email + 密碼 → 建立
- 到 Supabase **Authentication → Users** 應看到該使用者
- **Database → Tables → couples** 應看到新情侶

---

## B. Vercel Cron (週榜自動結算 + 每日維護) · 5 分鐘

程式碼已寫好：
- `app/api/cron/weekly-leaderboard/route.ts` — 每週一 00:00 UTC 結算前三名
- `app/api/cron/daily-maintenance/route.ts` — 每日 01:00 UTC 斷連擊 + 清舊通知
- `vercel.json` — 已定義排程

### 啟用步驟
1. Vercel 專案 → **Settings → Environment Variables** 加：
   - `CRON_SECRET` = 任意隨機字串 (e.g. 32 字元 hex)
2. 重 deploy
3. Vercel 專案 → **Cron Jobs** 分頁 (Hobby plan 免費 3 job)
4. 會看到兩個 cron 自動出現，**Enable**

**Cron 不能本地試跑**，但可用 curl 手動觸發：
```bash
curl -H "authorization: Bearer <CRON_SECRET>" \
  https://love-empire-rho.vercel.app/api/cron/weekly-leaderboard
```

---

## C. Sentry 錯誤追蹤 · 5 分鐘

程式碼已寫好：
- `sentry.client.config.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts`
- `app/error.tsx` — 錯誤邊界 + 自動 capture

### 啟用步驟
1. <https://sentry.io/signup/> 免費帳號 (5k events/月免費)
2. **Create Project** → Platform: **Next.js** → 取個名字
3. 建立後會給你一個 **DSN** (看起來像 `https://xxx@sentry.io/yyy`)
4. Vercel → **Settings → Environment Variables** 加：
   - `NEXT_PUBLIC_SENTRY_DSN` = 上面的 DSN
5. 重 deploy

往後任何未捕捉錯誤都會即時回報到 Sentry dashboard。

---

## 啟用優先序建議

| 優先 | 項目 | 效益 |
|---|---|---|
| 🔥 1 | Supabase | 真正多情侶、跨裝置同步、真實 Auth |
| 🔥 2 | Sentry | 知道使用者遇到什麼 bug (不用等他們回報) |
| 3 | Vercel Cron | 週榜自動化、維護自動化 |
| 4 | LIFF | 上 LINE 生態 (看 [GETTING_STARTED_LIFF.md](GETTING_STARTED_LIFF.md)) |
| 5 | Web Push VAPID | 真實推播 (需再寫一個後端 endpoint) |

---

## 驗收檢查表

啟用後逐項測試：

- [ ] 使用者 A 在裝置 A 註冊 → 到 Supabase Authentication 看到
- [ ] 使用者 A 建立王國 → Supabase couples 表有記錄
- [ ] 使用者 A 在裝置 B 登入 → 看到自己的王國狀態
- [ ] 使用者 B 輸配對碼 → 兩人綁定成情侶
- [ ] A 申報任務 → B 即時看到 (realtime)
- [ ] B 准奏 → A 金幣增加 (即時)
- [ ] 塞 3 張不同情侶的 demo 資料 → 排行榜正確
- [ ] 週一早上 8 點 → 前三名收到 SSR 卡禮物

---

## 費用 (2026 行情)

- **Supabase Free**: 500 MB DB、50k MAU、無限 API、2 GB bandwidth → 夠前 200 對情侶
- **Vercel Hobby**: 無限 deploy、100 GB bandwidth、3 cron → 免費
- **Sentry Free**: 5k errors / 月 → 夠用
- **LINE Messaging API**: 免費每月 500 推播；付費 NT$2400/月 4k 推播

對 30 對情侶（每天 ~6 推播/對 = 5400 推播/月），LINE 推播會超免費 → 先用 LINE Notify (已終止) 或 Web Push。
