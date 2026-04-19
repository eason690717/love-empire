"use client";

import { motion } from "framer-motion";
import type { PetGeneRarity } from "@/lib/types";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";

/**
 * 稀有度邊框 + 光暈 — 包在 PetSprite 外面
 *
 * N  無邊框
 * R  藍色細框
 * SR 紫色實框 + 光暈
 * SSR 金色雙框 + 粒子
 * UR 彩虹流動邊框（雙層 div 法，Safari 相容）+ 強光暈 + 角標
 */
interface Props {
  rarity?: PetGeneRarity;
  size?: number;
  children: React.ReactNode;
  showTag?: boolean;
  className?: string;
}

export function RarityFrame({ rarity, size = 200, children, showTag = true, className = "" }: Props) {
  const rr = RARITY[resolveRarity(rarity)];
  const outerSize = size + 28;

  const isMythic = rr.id === "mythic";
  const innerCardBg = "rgba(255,255,255,0.72)";

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: outerSize, height: outerSize }}
    >
      {/* 背景光暈 */}
      {rr.auraIntensity >= 1 && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${rr.glowColor} 0%, rgba(255,255,255,0) 70%)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* 邊框外層 — 決定邊框顏色/彩虹 */}
      {isMythic ? (
        <motion.div
          className="absolute inset-0 rounded-[28px]"
          style={{
            background: "conic-gradient(from 0deg, #ff8eae, #ffb947, #8ed172, #5aa4ff, #d280ff, #ff8eae)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <div
          className="absolute inset-0 rounded-[28px]"
          style={buildNonMythicBorderBg(rr.id, rr)}
        />
      )}

      {/* 邊框內層 — 白色卡片擋住邊框中間（雙層 div 法 — 不用 mask-composite） */}
      <div
        className="absolute rounded-[22px] flex items-center justify-center overflow-hidden"
        style={{
          inset: isMythic ? 4 : mythicOffsetByRarity(rr.id),
          background: innerCardBg,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          {children}
        </div>
      </div>

      {/* 稀有度標籤 */}
      {showTag && (
        <div
          className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[11px] font-black shadow-md z-10"
          style={{
            background: isMythic
              ? "linear-gradient(90deg,#ff8eae,#ffb947,#8ed172,#5aa4ff,#d280ff)"
              : rr.primaryColor,
            color: "#ffffff",
            border: "1.5px solid #ffffff",
          }}
        >
          {rr.emoji} {rr.tag}
        </div>
      )}
    </div>
  );
}

/** 非 mythic 邊框以 background + border 混合畫 */
function buildNonMythicBorderBg(id: PetGeneRarity, rr: typeof RARITY[keyof typeof RARITY]): React.CSSProperties {
  switch (id) {
    case "common":
      return {
        background: "#ffffff",
        border: `1.5px solid ${rr.primaryColor}`,
      };
    case "uncommon":
      return {
        background: rr.primaryColor,
      };
    case "rare":
      return {
        background: rr.primaryColor,
        boxShadow: `0 0 14px ${rr.glowColor}`,
      };
    case "legendary":
      return {
        background: `linear-gradient(135deg, ${rr.primaryColor}, #ffe6ad, ${rr.primaryColor})`,
        boxShadow: `0 0 22px ${rr.glowColor}`,
      };
    default:
      return { background: "#ffffff" };
  }
}

/** 內層 inset（邊框粗細）依 rarity */
function mythicOffsetByRarity(id: PetGeneRarity): number {
  switch (id) {
    case "common": return 2;
    case "uncommon": return 3;
    case "rare": return 3;
    case "legendary": return 4;
    default: return 3;
  }
}
