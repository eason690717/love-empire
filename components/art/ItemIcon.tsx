"use client";

/**
 * 島嶼家具 / 物件 emoji 包裝 — 加陰影 + 漂浮感，像貼紙
 */
interface Props {
  emoji: string;
  size?: number;
  glow?: boolean;
  className?: string;
  title?: string;
}

export function ItemIcon({ emoji, size = 36, glow = false, className = "", title }: Props) {
  return (
    <span
      title={title}
      className={`inline-block leading-none select-none ${className}`}
      style={{
        fontSize: size,
        filter: glow
          ? "drop-shadow(0 2px 3px rgba(26,58,86,0.3)) drop-shadow(0 0 12px rgba(255,212,71,0.4))"
          : "drop-shadow(0 2px 3px rgba(26,58,86,0.28))",
      }}
    >
      {emoji}
    </span>
  );
}
