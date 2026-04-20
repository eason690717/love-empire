"use client";

/**
 * 島嶼家具 / 物件 emoji 包裝 — 質感升級（v0.8.1）
 *  - 物件本體 + 地面橢圓陰影（偽 2.5D）
 *  - hover 彈跳 + 亮度提升
 *  - glow 模式（噴泉 / 彩虹）加光暈環繞
 *  - 依 catalogId size 表不同尺寸（避免一堆垃圾感）
 */

/** 不同家具 catalog 的相對大小倍率（讓城堡比杯子大 2x，還原真實比例感） */
const SIZE_MAP: Record<string, number> = {
  // 大物（× 1.6）
  castle: 1.8, fountain: 1.6, tree: 1.5, rainbow: 1.7, cherry: 1.5, pine: 1.5,
  // 中物（× 1.2）
  sofa: 1.2, bed: 1.2, dresser: 1.2, fridge: 1.2, bathtub: 1.2, table: 1.2, shelf: 1.15,
  // 動植物（× 1.0）
  cat: 1.0, dog: 1.0, bird: 0.9, fish: 0.9, rabbit: 1.0, flower: 0.9, rose: 0.9, tulip: 0.9,
  // 小物（× 0.8）
  cup: 0.75, book: 0.8, lamp: 0.85, clock: 0.9, candle: 0.7, coffee: 0.75,
};

interface Props {
  emoji: string;
  size?: number;
  glow?: boolean;
  className?: string;
  title?: string;
  catalogId?: string;
}

export function ItemIcon({ emoji, size = 36, glow = false, className = "", title, catalogId }: Props) {
  const sizeMultiplier = catalogId ? (SIZE_MAP[catalogId] ?? 1.0) : 1.0;
  const finalSize = size * sizeMultiplier;
  const shadowW = finalSize * 0.9;
  const shadowH = finalSize * 0.15;

  return (
    <span
      title={title}
      className={`relative inline-block leading-none select-none group ${className}`}
      style={{ width: finalSize, height: finalSize }}
    >
      {/* 地面橢圓陰影（偽 2.5D 透視）*/}
      <span
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all group-hover:scale-110"
        style={{
          bottom: -shadowH * 0.4,
          width: shadowW,
          height: shadowH,
          background: "radial-gradient(ellipse, rgba(40,30,60,0.35) 0%, rgba(40,30,60,0.15) 45%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />

      {/* emoji 本體 — 加多層陰影做立體感，glow 時加光暈 */}
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform group-hover:-translate-y-1 group-hover:scale-105"
        style={{
          fontSize: finalSize,
          lineHeight: 1,
          filter: glow
            ? "drop-shadow(0 3px 2px rgba(26,58,86,0.35)) drop-shadow(0 0 14px rgba(255,212,71,0.55)) drop-shadow(0 0 22px rgba(255,212,71,0.3))"
            : "drop-shadow(0 3px 2px rgba(26,58,86,0.3)) drop-shadow(0 1px 0 rgba(255,255,255,0.5))",
          textShadow: "0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {emoji}
      </span>
    </span>
  );
}
