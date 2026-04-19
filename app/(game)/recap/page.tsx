"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { ShareMomentButton } from "@/components/ShareMomentButton";
import { ATTR_LABEL } from "@/lib/utils";
import { PageBanner } from "@/components/PageBanner";

/**
 * Spotify Wrapped 風格年度回顧
 * 兩種模式：
 * 1. 靜態網格（預設）— 快速看
 * 2. 🎬 電影模式（點觀看）— 全螢幕逐幀滑動 + 動畫
 */
export default function RecapPage() {
  const couple = useGame((s) => s.couple);
  const submissions = useGame((s) => s.submissions);
  const codex = useGame((s) => s.codex);
  const moments = useGame((s) => s.moments);
  const streak = useGame((s) => s.streak);
  const pet = useGame((s) => s.pet);

  const [movieOpen, setMovieOpen] = useState(false);

  const year = new Date().getFullYear();
  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);

  const approvedYear = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d.getFullYear() === year;
  });

  const totalCoins = approvedYear.reduce((a, s) => a + s.reward, 0);
  const cardsThisYear = codex.filter((c) => c.obtainedAt && c.obtainedAt.startsWith(String(year)));
  const ssrCount = cardsThisYear.filter((c) => c.rarity === "SSR").length;
  const momentsYear = moments.filter((m) => m.isSelf).length;

  const topAttr = (Object.entries(pet.attrs) as [keyof typeof pet.attrs, number][])
    .sort((a, b) => b[1] - a[1])[0];

  const topCategory = approvedYear.reduce((acc, s) => {
    const t = s.taskTitle;
    const cat = /幫忙|洗|垃圾|煮飯|床/.test(t) ? "chore" : /陪|運動|閱讀|健康/.test(t) ? "wellness" : /擁抱|情話|好話|心情/.test(t) ? "romance" : /驚喜|禮物/.test(t) ? "surprise" : "coop";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];

  const recapData = {
    coupleName: couple.name,
    year,
    tasks: approvedYear.length,
    coins: totalCoins,
    cards: cardsThisYear.length,
    ssr: ssrCount,
    longestStreak: streak.longest,
    moments: momentsYear,
    topAttr,
    topCat,
  };

  return (
    <div className="space-y-4">
      <PageBanner
        title={`${year} 年度回顧`}
        subtitle={`${couple.name} · 一年的甜蜜，濃縮成這一頁`}
        emoji="✨"
        gradient="violet"
        stats={[
          { label: "任務", value: approvedYear.length },
          { label: "卡片", value: cardsThisYear.length },
          { label: "SSR", value: ssrCount },
        ]}
      />

      {/* 🎬 電影模式入口 */}
      <button
        onClick={() => setMovieOpen(true)}
        className="w-full p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 text-white font-black shadow-lg hover:shadow-xl hover:brightness-110 transition active:scale-95"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🎬</span>
          <div>
            <div className="text-lg">觀看年度電影</div>
            <div className="text-xs opacity-90 font-semibold">全螢幕 8 幕回顧 · 滑動切換</div>
          </div>
        </div>
      </button>

      <div
        className="card p-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ffe3b3 0%, #ffbfd2 50%, #b8d8ff 100%)" }}
      >
        <div className="absolute top-3 left-4 text-2xl animate-float-slow">✨</div>
        <div className="absolute top-5 right-6 text-2xl animate-sparkle">💫</div>
        <h2 className="font-display text-3xl font-black text-empire-ink text-shadow-soft">{couple.name}</h2>
        <p className="text-sm text-empire-ink/80 mt-1">一年的甜蜜，濃縮成這一頁</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BigStat emoji="📜" label="完成任務" value={approvedYear.length} unit="個" />
        <BigStat emoji="💰" label="累積金幣" value={totalCoins} unit="枚" />
        <BigStat emoji="🎴" label="收集記憶" value={cardsThisYear.length} unit="張" />
        <BigStat emoji="✨" label="SSR 卡" value={ssrCount} unit="張" />
        <BigStat emoji="🔥" label="最長連擊" value={streak.longest} unit="天" />
        <BigStat emoji="🌸" label="紀念時刻" value={momentsYear} unit="則" />
      </div>

      <div className="card p-5 text-center">
        <div className="text-xs text-empire-mute">最擅長的屬性</div>
        <div className="mt-2 text-5xl animate-bob">
          {topAttr?.[0] === "intimacy" ? "💞"
          : topAttr?.[0] === "communication" ? "💬"
          : topAttr?.[0] === "romance" ? "🌹"
          : topAttr?.[0] === "care" ? "🫂"
          : "🎁"}
        </div>
        <div className="mt-2 font-bold text-lg">{ATTR_LABEL[topAttr?.[0] ?? "intimacy"]}</div>
        <div className="text-sm text-empire-mute">屬性值 {topAttr?.[1] ?? 0} / 100</div>
      </div>

      {topCat && (
        <div className="card p-5 text-center bg-gradient-to-br from-empire-cloud to-white">
          <div className="text-xs text-empire-mute">你們最常做的類型</div>
          <div className="mt-2 text-5xl">
            {topCat[0] === "chore" ? "🧺"
            : topCat[0] === "wellness" ? "🧘"
            : topCat[0] === "romance" ? "💕"
            : topCat[0] === "surprise" ? "🎁"
            : "🤝"}
          </div>
          <div className="mt-2 font-bold text-lg">
            {topCat[0] === "chore" ? "生活雜事"
            : topCat[0] === "wellness" ? "健康管理"
            : topCat[0] === "romance" ? "浪漫時刻"
            : topCat[0] === "surprise" ? "驚喜創意"
            : "雙人合作"}
          </div>
          <div className="text-sm text-empire-mute">共 {topCat[1]} 個任務</div>
        </div>
      )}

      <div className="card p-5">
        <h3 className="font-bold mb-3 text-center">📣 分享這份回顧</h3>
        <ShareMomentButton
          title={`${year} 年度回顧 · ${couple.name}`}
          subtitle={`完成 ${approvedYear.length} 個任務、收集 ${cardsThisYear.length} 張卡、最長連擊 ${streak.longest} 天`}
          emoji="✨"
          coupleName={couple.name}
        />
      </div>

      {movieOpen && <RecapMovie data={recapData} onClose={() => setMovieOpen(false)} />}
    </div>
  );
}

function BigStat({ emoji, label, value, unit }: { emoji: string; label: string; value: number; unit: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-1 font-display font-black text-2xl text-empire-ink">{value.toLocaleString()}</div>
      <div className="text-xs text-empire-mute">{label} · {unit}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// 🎬 電影模式 — 全螢幕 8 幕 scroll-snap + 動畫
// ════════════════════════════════════════════════════

function RecapMovie({
  data, onClose,
}: {
  data: {
    coupleName: string; year: number; tasks: number; coins: number;
    cards: number; ssr: number; longestStreak: number; moments: number;
    topAttr: [string, number] | undefined;
    topCat: [string, number] | undefined;
  };
  onClose: () => void;
}) {
  const scenes = [
    {
      bg: "linear-gradient(135deg, #1a0a2e 0%, #4a148c 50%, #880e4f 100%)",
      content: (
        <>
          <div className="text-2xl text-white/70 mb-3 animate-pop">準備好了嗎？</div>
          <div className="text-6xl font-display font-black text-white text-shadow-soft animate-pop" style={{ animationDelay: "0.3s" }}>
            {data.year}
          </div>
          <div className="text-3xl font-display font-black text-white/90 mt-4 animate-pop" style={{ animationDelay: "0.6s" }}>
            {data.coupleName}
          </div>
          <div className="mt-8 text-white/60 text-sm animate-pop" style={{ animationDelay: "1s" }}>
            ↓ 滑動開始
          </div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #ff6b6b 0%, #ffa56b 100%)",
      content: (
        <>
          <div className="text-6xl mb-4 animate-bob">📜</div>
          <div className="text-white/80 text-xl">你們一起完成了</div>
          <div className="font-display font-black text-white mt-3 animate-pop" style={{ fontSize: "8rem", lineHeight: 1 }}>
            {data.tasks}
          </div>
          <div className="text-white text-2xl font-black mt-1">個任務</div>
          <div className="mt-6 text-white/70 text-sm">每一件小事都在累積</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
      content: (
        <>
          <div className="text-6xl mb-4 animate-sparkle">💰</div>
          <div className="text-white/80 text-xl">金庫累積</div>
          <div className="font-display font-black text-white mt-3 animate-pop" style={{ fontSize: "6rem", lineHeight: 1 }}>
            {data.coins.toLocaleString()}
          </div>
          <div className="text-white text-xl font-black mt-2">枚金幣</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #ff4f7e 0%, #ffd447 100%)",
      content: (
        <>
          <div className="text-6xl mb-4 animate-bob">🔥</div>
          <div className="text-white/80 text-xl">最長一次連擊</div>
          <div className="font-display font-black text-white mt-3 animate-pop" style={{ fontSize: "8rem", lineHeight: 1 }}>
            {data.longestStreak}
          </div>
          <div className="text-white text-2xl font-black mt-1">天</div>
          <div className="mt-6 text-white/80 text-sm">{data.longestStreak >= 30 ? "🏆 超強毅力" : data.longestStreak >= 7 ? "🌟 堅持一週 +" : "🌱 剛起步"}</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #6a1b9a 0%, #ec407a 100%)",
      content: (
        <>
          <div className="text-6xl mb-4 animate-sparkle">✨</div>
          <div className="text-white/80 text-xl">稀有記憶卡收集</div>
          <div className="mt-4 flex items-baseline justify-center gap-2">
            <div className="font-display font-black text-white animate-pop" style={{ fontSize: "6rem", lineHeight: 1 }}>
              {data.ssr}
            </div>
            <div className="text-white text-2xl font-black">張 SSR</div>
          </div>
          <div className="mt-2 text-white/80">共 {data.cards} 張卡</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #00acc1 0%, #26c6da 100%)",
      content: (
        <>
          <div className="text-white/80 text-xl mb-2">你們最擅長</div>
          <div className="text-8xl mb-3 animate-bob">
            {data.topAttr?.[0] === "intimacy" ? "💞"
            : data.topAttr?.[0] === "communication" ? "💬"
            : data.topAttr?.[0] === "romance" ? "🌹"
            : data.topAttr?.[0] === "care" ? "🫂"
            : "🎁"}
          </div>
          <div className="font-display font-black text-white text-5xl animate-pop">
            {ATTR_LABEL[data.topAttr?.[0] as "intimacy" ?? "intimacy"]}
          </div>
          <div className="mt-3 text-white/80">屬性值 {data.topAttr?.[1] ?? 0}</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #e91e63 0%, #ffb347 100%)",
      content: (
        <>
          <div className="text-white/80 text-xl mb-2">最常做的事</div>
          <div className="text-8xl mb-3 animate-bob">
            {data.topCat?.[0] === "chore" ? "🧺"
            : data.topCat?.[0] === "wellness" ? "🧘"
            : data.topCat?.[0] === "romance" ? "💕"
            : data.topCat?.[0] === "surprise" ? "🎁"
            : "🤝"}
          </div>
          <div className="font-display font-black text-white text-5xl animate-pop">
            {data.topCat?.[0] === "chore" ? "生活雜事"
            : data.topCat?.[0] === "wellness" ? "健康管理"
            : data.topCat?.[0] === "romance" ? "浪漫時刻"
            : data.topCat?.[0] === "surprise" ? "驚喜創意"
            : "雙人合作"}
          </div>
          <div className="mt-3 text-white/80">共 {data.topCat?.[1] ?? 0} 個任務</div>
        </>
      ),
    },
    {
      bg: "linear-gradient(135deg, #1a0a2e 0%, #4a148c 50%, #ec407a 100%)",
      content: (
        <>
          <div className="text-5xl mb-4 animate-sparkle">💝</div>
          <div className="font-display font-black text-white text-4xl text-center leading-tight animate-pop">
            {data.coupleName}
          </div>
          <div className="text-white/90 text-lg mt-3 text-center animate-pop" style={{ animationDelay: "0.3s" }}>
            愛情不是一瞬間
          </div>
          <div className="text-white/90 text-lg text-center animate-pop" style={{ animationDelay: "0.6s" }}>
            是 {data.tasks + data.moments} 個<span className="font-black text-empire-sunshine">「我想你」</span>
          </div>
          <div className="text-white/90 text-lg text-center animate-pop" style={{ animationDelay: "0.9s" }}>
            累積出來的
          </div>
          <button
            onClick={onClose}
            className="mt-10 px-8 py-3 rounded-full bg-white text-empire-ink font-bold shadow-xl hover:scale-105 transition animate-pop"
            style={{ animationDelay: "1.2s" }}
          >
            收下這份回顧 ✨
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white text-xl flex items-center justify-center hover:bg-white/30 transition"
        aria-label="關閉電影"
      >
        ✕
      </button>

      <div
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {scenes.map((scene, i) => (
          <section
            key={i}
            className="snap-start h-screen w-full relative flex flex-col items-center justify-center p-8 text-center"
            style={{ background: scene.bg }}
          >
            {scene.content}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-6">
              {scenes.map((_, j) => (
                <div
                  key={j}
                  className={`h-1 rounded-full transition-all ${j === i ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
