"use client";

/**
 * 情侶頭像 — 首字 + 色相 hash + 迷你皇冠 (取代 header 👑)
 * 動森粉彩 + 寶可夢徽章凸起
 */
interface Props {
  name: string;
  size?: number;
  showCrown?: boolean;
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % 360;
}

export function CoupleAvatar({ name, size = 56, showCrown = true }: Props) {
  const letter = (name || "?").slice(0, 1).toUpperCase();
  const hue = hashHue(name || "default");
  const gradId = `ca-${hue}`;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 85%, 82%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 40) % 360}, 75%, 68%)`} />
        </linearGradient>
        <filter id={`ca-shadow-${hue}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1a3a56" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* 外框 */}
      <circle cx="32" cy="32" r="30" fill="#ffffff" />
      <circle cx="32" cy="32" r="28" fill={`url(#${gradId})`} filter={`url(#ca-shadow-${hue})`} />
      {/* 首字 */}
      <text
        x="32" y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="28"
        fontWeight="900"
        fill="white"
        style={{ textShadow: "0 2px 0 rgba(0,0,0,0.15)", fontFamily: "system-ui, 'Noto Sans TC', sans-serif" }}
      >
        {letter}
      </text>
      {/* 皇冠 */}
      {showCrown && (
        <g transform="translate(42, 10)">
          <path d="M0 8 L3 2 L6 6 L10 1 L14 6 L17 2 L20 8 L18 11 L2 11 Z"
            fill="#ffd447" stroke="#c98522" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="3" cy="2" r="1.5" fill="#ff8eae" />
          <circle cx="17" cy="2" r="1.5" fill="#ff8eae" />
          <circle cx="10" cy="1" r="1.5" fill="#ff8eae" />
        </g>
      )}
    </svg>
  );
}
