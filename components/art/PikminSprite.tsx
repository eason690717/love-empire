"use client";

import type { PikminHelper } from "@/lib/types";

/**
 * 小精靈 SVG — 單一設計 + CSS filter hue-rotate 產 5 色
 * 圓身 + 嫩葉/花/芽 頭飾
 */
interface Props {
  color: PikminHelper["color"];
  size?: number;
  sprouting?: "leaf" | "bud" | "flower";
  className?: string;
}

const COLOR_HUE: Record<PikminHelper["color"], number> = {
  red:    0,
  blue:   200,
  yellow: 45,
  green:  130,
  purple: 280,
};

const COLOR_FILL: Record<PikminHelper["color"], string> = {
  red:    "#ff6b6b",
  blue:   "#5aa4ff",
  yellow: "#ffd447",
  green:  "#8ed172",
  purple: "#b561f5",
};

export function PikminSprite({ color, size = 28, sprouting = "leaf", className = "" }: Props) {
  const body = COLOR_FILL[color];
  const id = `pk-${color}`;

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 32 42" className={`inline-block ${className}`}>
      <defs>
        <radialGradient id={id} cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="60%" stopColor={body} />
          <stop offset="100%" stopColor={body} />
        </radialGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#1a3a56" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* 嫩莖 */}
      <line x1="16" y1="14" x2="16" y2="4" stroke="#4a8128" strokeWidth="1.5" strokeLinecap="round" />
      {/* 頭飾：葉 / 花苞 / 花 */}
      {sprouting === "leaf" && (
        <path d="M16 4 Q10 2 9 6 Q11 7 14 7 Q13 3 16 4 Z" fill="#8ed172" stroke="#4a8128" strokeWidth="0.8" />
      )}
      {sprouting === "bud" && (
        <circle cx="16" cy="5" r="3" fill="#ffb8de" stroke="#d04878" strokeWidth="0.8" />
      )}
      {sprouting === "flower" && (
        <>
          <circle cx="16" cy="5" r="2" fill="#ff8eae" />
          <circle cx="13" cy="5" r="2" fill="#ffb8de" />
          <circle cx="19" cy="5" r="2" fill="#ffb8de" />
          <circle cx="16" cy="3" r="2" fill="#ffb8de" />
          <circle cx="16" cy="5" r="1.2" fill="#ffd447" />
        </>
      )}
      {/* 身體 */}
      <ellipse cx="16" cy="26" rx="11" ry="12" fill={`url(#${id})`} filter={`url(#${id}-shadow)`} />
      {/* 眼睛 */}
      <ellipse cx="12" cy="24" rx="1.6" ry="2.2" fill="white" />
      <ellipse cx="20" cy="24" rx="1.6" ry="2.2" fill="white" />
      <circle cx="12" cy="24.5" r="1.1" fill="#2d4f6a" />
      <circle cx="20" cy="24.5" r="1.1" fill="#2d4f6a" />
      {/* 腳 */}
      <ellipse cx="12" cy="39" rx="2.5" ry="1.5" fill={body} opacity="0.8" />
      <ellipse cx="20" cy="39" rx="2.5" ry="1.5" fill={body} opacity="0.8" />
    </svg>
  );
}
