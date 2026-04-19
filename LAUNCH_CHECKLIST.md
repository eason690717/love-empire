# 🚀 公測上線檢查清單

依序執行：

## ① 後端清空 + schema 同步

```sql
-- 1. 在 Supabase SQL Editor 執行新 migration
\i supabase/migrations/0004_launch_security.sql

-- 2. 清空所有測試 couple 資料
\i scripts/wipe-prod.sql
```

接著到 **Supabase Dashboard**：
- **Authentication → Users**：全選刪除舊匿名帳號（保留你自己想留的測試帳號）
- **Database → Replication**：確認 `submissions / question_answers / pets / rituals / moments / gifts / island_items / memory_cards / redemptions` 都打勾（realtime 用）

---

## ② 安全檢查（已在 0004 處理）

✅ couples SELECT：限本 couple 內可讀完整資料；公開資料用 `public_couples` view（白名單）
✅ leaderboard / public_couples 排除 paused / archived 的王國
✅ moments 公開讀加上 privacy / paused / archived 過濾
✅ 所有 couple-private 表都有 `in_couple()` RLS：
   - submissions / pets / memory_cards / island_items / rituals / streaks
   - redemptions / question_answers / bucket_records / custom_rituals / anniversaries
✅ users 表只能讀本 couple 內 + 自己

⚠️ **手動再驗一次**（Supabase Console）：
1. 開 Database → Tables → 各表右上角「RLS Enabled」必須是綠色
2. 各表的 Policies 至少 1 條（沒 policy + RLS 開 = 全部讀不到，會壞 app）

---

## ③ 帳密救援

**現狀**：王國使用 6 碼配對碼 + 裝置綁定。「忘記」的處理：

### 場景 A：同瀏覽器 cache 還在
- 自動恢復（device binding 從 localStorage 讀）

### 場景 B：換新裝置 / 清 cache / 忘記鑰匙
- **解法 1（自助）**：另一半的裝置打開 `/settings` → 配對碼永久顯示 → 截圖傳給你
- **解法 2（管理員）**：你提供 Supabase Console 用 `couples` 表查 `invite_code`（admin 救援）

### 場景 C：兩人都忘記 + 都換裝置
- 走方案 C 自動封存流程：90 天無人登入 → 系統自動標記 `archived_at`
- 或聯絡管理員人工救援

**已強化（批次）**：
- Settings 頂部永久顯示鑰匙 + 「⚠️ 截圖保存」警告
- InviteCodeCard 預設展開（不需點開）
- 新增「忘記鑰匙怎麼辦」FAQ 連結

---

## ④ 環境變數確認 (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxx (LINE 用)
SENTRY_DSN=https://xxx (錯誤追蹤)
```

確認 `.env.local` 有同步到 Vercel Project Settings → Environment Variables。

---

## ⑤ Pre-launch 檢查（手動）

- [ ] `https://love-empire-rho.vercel.app/login` 進得去
- [ ] 建新王國能正常拿到 6 碼鑰匙
- [ ] 鑰匙在 Settings 頂部永久可見
- [ ] 另一裝置用該鑰匙能加入
- [ ] 兩裝置之間任務即時同步（≤ 30 秒）
- [ ] 兩裝置之間問答即時同步
- [ ] 排行榜不顯示 paused/archived 王國
- [ ] 試 `/settings` → 進階 → 暫停王國 → 看 banner
- [ ] 試 `/archive` 畢業紀念冊正常顯示
- [ ] 隱私設「private」後是否確實不在 leaderboard 出現
- [ ] 開不同帳號試 — 確認看不到對方的任務 / 問答 / 寵物

---

## ⑥ 資料保護告知（給公測使用者的訊息範本）

```
親愛的測試者：

愛的帝國公測即將開始。請注意：

1. 配對碼 = 王國鑰匙，請截圖保存。忘記了你需要請伴侶幫忙截圖傳給你。
2. 你和伴侶的所有對話 / 問答 / 任務 / 寵物 / 圖片，只有你們兩人看得到。
3. 公開資料只有：王國名 / 等級 / 暱稱 / 廣場動態（你選擇公開時）。
4. 隨時可在「設定 → 隱私」改成「完全不公開」。
5. 不確定關係未來時可在「設定 → 進階 → 暫停王國」90 天保留資料。
6. 任何問題回報到 GitHub issues 或 Email：admin@i-style.store

謝謝你成為我們的早期使用者 💕
```

---

## ⑦ 監控 (上線後)

- Vercel Analytics → 看流量 / 錯誤
- Sentry → 看 runtime errors
- Supabase → Database → 看 query slowness
- 每日檢查 `couples` 表新增數
