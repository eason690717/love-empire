# 愛的帝國 (Love Empire) — 情侶互動量化遊戲

預設遊戲名 **愛的帝國** (未來可改名)。阿紅牽起阿藍，月老紅線纏上天上雙星。

結合《動物森友會》《寶可夢》《皮克敏》的上癮 DNA，與「波波帝國」的真實互動量化系統，打造一款兩人專屬、可被量化的情侶線上遊戲。命名靈感來自**月老紅線** + **雙星神話**（牛郎織女、雙子座 Castor & Pollux、金星晨昏星同體的維納斯愛神）。

## 命名
- **遊戲名**：繫星帝國 — 月老紅線「繫」住天上「星」，古今中外愛情神話融合
- **角色**：阿紅 / 阿藍（月老紅線拆字 + 紅藍雙星色階），性別完全中性，支援多元

## 快速開始

```bash
npm install
npm run dev
```

開啟 <http://localhost:3000>

## 技術棧
- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + Framer Motion
- Zustand (狀態管理，示範用 — 後續接 Supabase)
- Supabase (預計 Auth + Postgres + Realtime)

## 專案狀態 (2026-04-17)
此為 **Phase 0 scaffolding + 靜態 UI 示範版**。所有資料為記憶體 mock，重新整理會回到初始狀態。Supabase 整合與多情侶後端為下一階段工作。

## 遊戲模組
1. 任務申報 / 准奏 / 駁回 + 金幣 (Phase 1)
2. 國庫兌換真實獎勵 (Phase 1)
3. 愛之寵物 (Phase 2)
4. 記憶圖鑑 (Phase 3)
5. 帝國島嶼 + 每日儀式 (Phase 4)
6. 情侶排行榜 + 社交 + 聯盟 (Phase 4.5)

詳見 `C:\Users\Home\.claude\plans\glistening-brewing-engelbart.md`。
