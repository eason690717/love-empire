"use client";

import type { Rarity } from "@/lib/types";

/**
 * 記憶卡外框 — 依稀有度不同裝飾（柔和圓角 + 徽章風光暈）
 */
interface Props {
  rarity: Rarity;
  owned: boolean;
  children: React.ReactNode;
  className?: string;
}

const FRAMES: Record<Rarity, { border: string; bg: string; glow?: string; badge: string; badgeBg: string }> = {
  N:   { border: "border-empire-n", bg: "bg-white", badge: "N", badgeBg: "bg-empire-n/80 text-white" },
  R:   { border: "border-empire-r/70", bg: "bg-gradient-to-b from-sky-50 to-white",
         glow: "shadow-[0_0_0_2px_rgba(124,194,243,0.3),0_6px_18px_rgba(124,194,243,0.2)]",
         badge: "R", badgeBg: "bg-empire-r text-white" },
  SR:  { border: "border-empire-sr/70", bg: "bg-gradient-to-b from-fuchsia-50 to-white",
         glow: "shadow-[0_0_0_2px_rgba(210,128,255,0.45),0_8px_22px_rgba(210,128,255,0.3)]",
         badge: "SR", badgeBg: "bg-empire-sr text-white" },
  SSR: { border: "border-empire-sunshine", bg: "bg-gradient-to-br from-amber-50 via-pink-50 to-sky-50",
         badge: "SSR", badgeBg: "bg-gradient-to-r from-empire-sunshine to-empire-berry text-white" },
};

export function CardFrame({ rarity, owned, children, className = "" }: Props) {
  const f = FRAMES[rarity];
  const ssrShine = rarity === "SSR" && owned ? "shine-ssr" : "";
  const srShine = rarity === "SR" && owned ? "shine-sr" : "";
  const opacity = owned ? "" : "opacity-55 grayscale";

  return (
    <div
      className={`relative rounded-2xl p-3 border-2 ${f.border} ${f.bg} ${f.glow ?? ""} ${ssrShine} ${srShine} ${opacity} ${className}`}
    >
      {/* 稀有度小徽章 */}
      <div
        className={`absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${f.badgeBg} shadow-emblem-sm`}
        style={{ minWidth: "28px", textAlign: "center", border: "1.5px solid white" }}
      >
        {f.badge}
      </div>
      {/* 四角裝飾 — 柔和圓角 + 嫩芽點綴 */}
      {rarity !== "N" && owned && (
        <>
          <span className="absolute top-1 left-1 text-[8px] opacity-60">✦</span>
          <span className="absolute bottom-1 right-1 text-[8px] opacity-60">✦</span>
        </>
      )}
      {children}
    </div>
  );
}
