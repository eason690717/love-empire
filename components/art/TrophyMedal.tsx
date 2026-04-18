"use client";

/**
 * 獎盃徽章 — 4 個 tier 金屬質感
 * 銅 < 銀 < 金 < 彩虹(神話)
 */
interface Props {
  tier: "bronze" | "silver" | "gold" | "rainbow";
  size?: number;
  emoji?: string;  // 中央嵌入的內容 emoji (achievement 的)
}

const TIERS = {
  bronze:  { outer: "#e0a878", inner: "#c28658", rim: "#8a5a38", text: "#4a2c18" },
  silver:  { outer: "#e0e5ec", inner: "#b8c2cf", rim: "#7d8a9c", text: "#2d3a4a" },
  gold:    { outer: "#ffe38a", inner: "#ffb547", rim: "#c98522", text: "#6a3e07" },
  rainbow: { outer: "#ffc8e0", inner: "#b8d8ff", rim: "#d280ff", text: "#2d4f6a" },
};

export function TrophyMedal({ tier, size = 56, emoji = "⭐" }: Props) {
  const t = TIERS[tier];
  const gid = `tm-${tier}`;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="40%" stopColor={t.outer} />
          <stop offset="100%" stopColor={t.inner} />
        </radialGradient>
        {tier === "rainbow" && (
          <linearGradient id={`${gid}-rainbow`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe38a" />
            <stop offset="33%" stopColor="#ffb8de" />
            <stop offset="66%" stopColor="#b8d8ff" />
            <stop offset="100%" stopColor="#b8ffca" />
          </linearGradient>
        )}
        <filter id={`${gid}-shadow`}>
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#1a3a56" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* 緞帶 */}
      <path d="M18 40 L12 62 L22 56 L32 62 L42 56 L52 62 L46 40 Z"
        fill={tier === "rainbow" ? "#ff8eae" : t.inner} opacity="0.9" />
      {/* 主徽章 */}
      <circle cx="32" cy="30" r="24"
        fill={tier === "rainbow" ? `url(#${gid}-rainbow)` : `url(#${gid})`}
        stroke={t.rim} strokeWidth="2.5"
        filter={`url(#${gid}-shadow)`}
      />
      {/* 內圈光澤 */}
      <circle cx="32" cy="30" r="19" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
      {/* 中央內容 */}
      <text x="32" y="30"
        textAnchor="middle" dominantBaseline="central"
        fontSize="20"
        style={{ fontFamily: "system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif" }}
      >
        {emoji}
      </text>
      {/* 頂端星點 (寶可夢徽章感) */}
      <polygon points="32,4 33.5,8 38,8 34.3,10.5 35.8,14.5 32,12 28.2,14.5 29.7,10.5 26,8 30.5,8"
        fill={t.outer} stroke={t.rim} strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

/** 從 achievement category 推導 tier */
export function tierForAchievement(category: string, id: string): "bronze" | "silver" | "gold" | "rainbow" {
  // 特殊分類 / 高階關鍵字 → rainbow
  if (category === "special") return "rainbow";
  if (id.includes("hundred") || id.includes("fifty") || id.includes("myth") || id.includes("Legend") || id.includes("petMyth")) return "rainbow";
  if (id.includes("ten") || id.includes("thirty") || id.includes("streak30") || id.includes("three")) return "gold";
  if (id.includes("lv5") || id.includes("streak7") || id.includes("first")) return "silver";
  return "bronze";
}
