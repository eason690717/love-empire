"use client";

import { motion } from "framer-motion";
import type { PetSpecies, PetGeneRarity } from "@/lib/types";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";

/**
 * 寵物 SVG 精靈 — 吉伊卡哇（ちいかわ）風
 *
 * 共通要素：橢圓頭身一體、黑豆大眼、白點亮光、腮紅、豆豆手短短、w 型小嘴
 * 5 系差異：耳朵形狀、尾巴、頭頂配件、身後光暈
 *
 * stage 0 = 蛋（蛋型輪廓 + 種系色調 + 上面浮小圖）
 * stage 1-4 = 幼/成/傳/神（同一角色 + 稀有度特效強度遞增）
 */
interface Props {
  species: PetSpecies;
  stage: 0 | 1 | 2 | 3 | 4;
  rarity?: PetGeneRarity;
  size?: number;
  animate?: boolean;
  className?: string;
}

export function PetSprite({ species, stage, rarity, size = 160, animate = true, className = "" }: Props) {
  const sp = SPECIES[resolveSpecies(species)];
  const rr = RARITY[resolveRarity(rarity)];

  const body = stage === 0 ? <Egg species={species} /> : <Creature species={species} stage={stage} rarity={rarity} />;

  const inner = (
    <svg viewBox="0 0 200 200" width={size} height={size} className="overflow-visible">
      <defs>
        {/* Lumen 彩虹漸層 */}
        <linearGradient id="rainbowBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc2d4" />
          <stop offset="25%" stopColor="#ffedc2" />
          <stop offset="50%" stopColor="#c8f5d0" />
          <stop offset="75%" stopColor="#c2e3ff" />
          <stop offset="100%" stopColor="#e0c8ff" />
        </linearGradient>
        {/* 通用高光漸層 */}
        <radialGradient id="bodyShine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* 光環（Lumen / 高稀有度用） */}
        <radialGradient id="auraGlow">
          <stop offset="0%" stopColor={rr.glowColor} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* 背景光暈（稀有度 ≥ SR 才顯示） */}
      {rr.auraIntensity >= 2 && (
        <circle cx="100" cy="100" r="92" fill="url(#auraGlow)" opacity={0.6 + rr.auraIntensity * 0.1} />
      )}

      {body}

      {/* Lumen 星塵粒子（mythic 特效） */}
      {sp.id === "lumen" && stage >= 1 && <LumenParticles />}
    </svg>
  );

  if (!animate) return <div className={className}>{inner}</div>;

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {inner}
    </motion.div>
  );
}

// ============================================================
// 蛋階段
// ============================================================
function Egg({ species }: { species: PetSpecies }) {
  const sp = SPECIES[resolveSpecies(species)];
  const bodyFill = sp.id === "lumen" ? "url(#rainbowBody)" : sp.baseColor;
  return (
    <g>
      {/* 蛋殼 */}
      <ellipse cx="100" cy="110" rx="56" ry="70" fill={bodyFill} stroke="#1c1c28" strokeWidth="2.5" />
      <ellipse cx="100" cy="110" rx="56" ry="70" fill="url(#bodyShine)" />

      {/* 依 species 不同的斑點花紋 */}
      <EggPattern species={sp.id} accent={sp.blushColor} />

      {/* 閉眼（Zzz 睡覺中） */}
      <path d="M 80 108 Q 86 104 92 108" stroke="#1c1c28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 108 108 Q 114 104 120 108" stroke="#1c1c28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 腮紅 */}
      <ellipse cx="80" cy="124" rx="5" ry="3" fill="#ff9fbc" opacity="0.6" />
      <ellipse cx="120" cy="124" rx="5" ry="3" fill="#ff9fbc" opacity="0.6" />
      {/* 頂部種系配件小圖 */}
      <text x="100" y="52" fontSize="24" textAnchor="middle">{sp.signatureEmoji}</text>
    </g>
  );
}

/** 5 系蛋殼花紋差異（各有獨特標誌） */
function EggPattern({ species, accent }: { species: PetSpecies; accent: string }) {
  switch (species) {
    case "nuzzle":
      // 水滴斑 3 顆
      return (
        <g opacity="0.7">
          <path d="M 75 85 q 5 -8 10 0 q -5 8 -10 0 z" fill={accent} />
          <path d="M 125 130 q 6 -9 12 0 q -6 9 -12 0 z" fill={accent} />
          <path d="M 95 165 q 5 -7 10 0 q -5 7 -10 0 z" fill={accent} />
        </g>
      );
    case "spark":
      // 小星星散佈
      return (
        <g fill={accent} opacity="0.8">
          <text x="75" y="95" fontSize="14">✦</text>
          <text x="125" y="135" fontSize="12">✦</text>
          <text x="95" y="170" fontSize="10">✦</text>
          <text x="118" y="88" fontSize="9">✧</text>
        </g>
      );
    case "sturdy":
      // 葉片 / 愛心斑
      return (
        <g opacity="0.7">
          <ellipse cx="78" cy="90" rx="10" ry="5" fill={accent} transform="rotate(-30 78 90)" />
          <ellipse cx="124" cy="130" rx="10" ry="5" fill={accent} transform="rotate(20 124 130)" />
          <ellipse cx="100" cy="168" rx="9" ry="5" fill={accent} transform="rotate(10 100 168)" />
        </g>
      );
    case "glide":
      // 雲朵斑（半圓雙連）
      return (
        <g opacity="0.65" fill={accent}>
          <path d="M 68 92 q 5 -6 10 0 q 5 -6 10 0 l 0 4 l -20 0 z" />
          <path d="M 115 138 q 5 -6 10 0 q 5 -6 10 0 l 0 4 l -20 0 z" />
          <path d="M 90 170 q 5 -6 10 0 q 5 -6 10 0 l 0 4 l -20 0 z" />
        </g>
      );
    case "lumen":
      // 光粒子 + 彩虹弧
      return (
        <g>
          <path d="M 60 100 q 40 -40 80 0" fill="none" stroke="#ff8eae" strokeWidth="2" opacity="0.5" />
          <path d="M 60 112 q 40 -40 80 0" fill="none" stroke="#ffb947" strokeWidth="2" opacity="0.5" />
          <path d="M 60 124 q 40 -40 80 0" fill="none" stroke="#5aa4ff" strokeWidth="2" opacity="0.5" />
          <circle cx="72" cy="150" r="2" fill="#ffd7f0" />
          <circle cx="128" cy="155" r="2.5" fill="#ffd7f0" />
          <circle cx="100" cy="78" r="2" fill="#ffd7f0" />
          <circle cx="118" cy="92" r="1.5" fill="#ffffff" />
        </g>
      );
    default:
      return (
        <g opacity="0.7">
          <ellipse cx="78" cy="90" rx="7" ry="5" fill={accent} />
          <ellipse cx="122" cy="130" rx="8" ry="6" fill={accent} />
          <ellipse cx="100" cy="165" rx="6" ry="4" fill={accent} />
        </g>
      );
  }
}

// ============================================================
// 寵物本體（吉伊卡哇風）— 依 species 切分 + 依 stage 大幅差異化
// ============================================================
function Creature({ species, stage, rarity: _rarity }: { species: PetSpecies; stage: 1 | 2 | 3 | 4; rarity?: PetGeneRarity }) {
  const sp = SPECIES[resolveSpecies(species)];
  const bodyFill = sp.id === "lumen" ? "url(#rainbowBody)" : sp.baseColor;

  // ── 依 stage 定義的大幅差異化參數 ──
  const stageCfg = {
    1: { // 幼體 — 超萌嬰兒版
      scale: 0.65,
      bodyRx: 52, bodyRy: 50, // 較扁圓
      eyeRx: 8, eyeRy: 9,    // 大眼 +++
      pupilR: 2.8,
      blushOpacity: 0.7,
      handY: 125, handR: 7,  // 手更低更小
      footY: 162, footRx: 9, // 腳更短
      showHead: false,       // 幼體無耳朵/角
      showFront: false,      // 無前景配件
      showBack: false,       // 無尾巴
      showAura: false,
      showCrown: false,
      showWings: false,
    },
    2: { // 成型 — 標準版
      scale: 0.88,
      bodyRx: 52, bodyRy: 56,
      eyeRx: 6.5, eyeRy: 7.5,
      pupilR: 2.2,
      blushOpacity: 0.55,
      handY: 122, handR: 8,
      footY: 166, footRx: 11,
      showHead: true,
      showFront: true,
      showBack: true,
      showAura: false,
      showCrown: false,
      showWings: false,
    },
    3: { // 傳說 — 進化版（加翅膀 + 光環 + 閃亮眼）
      scale: 1.0,
      bodyRx: 52, bodyRy: 56,
      eyeRx: 6.5, eyeRy: 7.5,
      pupilR: 2.2,
      blushOpacity: 0.55,
      handY: 122, handR: 8,
      footY: 166, footRx: 11,
      showHead: true,
      showFront: true,
      showBack: true,
      showAura: true,   // 金光環
      showCrown: false,
      showWings: true,  // 背後翅膀
    },
    4: { // 神話 — 究極版（皇冠 + 大翅膀 + 底座光圈 + 光芒）
      scale: 1.08,
      bodyRx: 52, bodyRy: 56,
      eyeRx: 7, eyeRy: 8,
      pupilR: 2.4,
      blushOpacity: 0.55,
      handY: 122, handR: 8,
      footY: 166, footRx: 11,
      showHead: true,
      showFront: true,
      showBack: true,
      showAura: true,
      showCrown: true,     // 皇冠
      showWings: true,     // 大翅膀
    },
  } as const;

  const cfg = stageCfg[stage];

  return (
    <g transform={`translate(100 105) scale(${cfg.scale}) translate(-100 -105)`}>
      {/* Stage 4 底座光圈（最底層） */}
      {stage === 4 && <StagePlatform />}

      {/* Stage 3+ 背後光芒條紋 */}
      {cfg.showAura && <StageAura stage={stage} />}

      {/* Stage 3+ 背後翅膀 */}
      {cfg.showWings && <StageWings stage={stage} />}

      {/* 背後配件（尾巴等）— stage ≥ 2 才有 */}
      {cfg.showBack && <SpeciesBackDeco species={sp.id} stage={stage} />}

      {/* 身體 */}
      <ellipse cx="100" cy="110" rx={cfg.bodyRx} ry={cfg.bodyRy} fill={bodyFill} stroke="#1c1c28" strokeWidth="2.8" />
      <ellipse cx="100" cy="110" rx={cfg.bodyRx} ry={cfg.bodyRy} fill="url(#bodyShine)" />

      {/* 肚子色區 */}
      <ellipse cx="100" cy={110 + (cfg.bodyRy - 56) / 2 + 15} rx="34" ry={Math.min(34, cfg.bodyRy - 22)} fill={sp.bellyColor} opacity="0.85" />

      {/* 耳朵/頭頂 — stage ≥ 2 才有 */}
      {cfg.showHead && <SpeciesHeadDeco species={sp.id} stage={stage} />}

      {/* 眼睛（幼體眼超大） */}
      <ellipse cx="82" cy="98" rx={cfg.eyeRx} ry={cfg.eyeRy} fill="#1c1c28" />
      <ellipse cx="118" cy="98" rx={cfg.eyeRx} ry={cfg.eyeRy} fill="#1c1c28" />
      <circle cx={82 + cfg.eyeRx * 0.3} cy={98 - cfg.eyeRy * 0.4} r={cfg.pupilR} fill="#ffffff" />
      <circle cx={118 + cfg.eyeRx * 0.3} cy={98 - cfg.eyeRy * 0.4} r={cfg.pupilR} fill="#ffffff" />
      <circle cx={82 - cfg.eyeRx * 0.3} cy={98 + cfg.eyeRy * 0.4} r={cfg.pupilR * 0.45} fill="#ffffff" opacity="0.8" />
      <circle cx={118 - cfg.eyeRx * 0.3} cy={98 + cfg.eyeRy * 0.4} r={cfg.pupilR * 0.45} fill="#ffffff" opacity="0.8" />

      {/* Stage 3+ 眼睛閃光 sparkle */}
      {stage >= 3 && <EyeSparkle />}

      {/* 腮紅 */}
      <ellipse cx="74" cy="115" rx="7" ry="4" fill={sp.blushColor} opacity={cfg.blushOpacity} />
      <ellipse cx="126" cy="115" rx="7" ry="4" fill={sp.blushColor} opacity={cfg.blushOpacity} />

      {/* 小嘴 */}
      <SpeciesMouth species={sp.id} />

      {/* 短手 */}
      <ellipse cx="54" cy={cfg.handY} rx={cfg.handR} ry={cfg.handR + 2} fill={bodyFill} stroke="#1c1c28" strokeWidth="2.5" />
      <ellipse cx="146" cy={cfg.handY} rx={cfg.handR} ry={cfg.handR + 2} fill={bodyFill} stroke="#1c1c28" strokeWidth="2.5" />

      {/* 短腳 */}
      <ellipse cx="80" cy={cfg.footY} rx={cfg.footRx} ry="6" fill={bodyFill} stroke="#1c1c28" strokeWidth="2.5" />
      <ellipse cx="120" cy={cfg.footY} rx={cfg.footRx} ry="6" fill={bodyFill} stroke="#1c1c28" strokeWidth="2.5" />

      {/* 前景配件（額頭星星、蝴蝶結） — stage ≥ 2 才有 */}
      {cfg.showFront && <SpeciesFrontDeco species={sp.id} stage={stage} />}

      {/* Stage 4 皇冠 */}
      {cfg.showCrown && <StageCrown />}
    </g>
  );
}

// ============================================================
// Stage 特效元件
// ============================================================

/** Stage 4 底座光圈（金色圓盤） */
function StagePlatform() {
  return (
    <g>
      <ellipse cx="100" cy="178" rx="55" ry="10" fill="#ffd7a8" opacity="0.45" />
      <ellipse cx="100" cy="178" rx="40" ry="6" fill="#ffe6b8" opacity="0.65" />
    </g>
  );
}

/** Stage 3+ 背後金光環 + 光芒條紋 */
function StageAura({ stage }: { stage: number }) {
  const strokeOpacity = stage === 4 ? 0.75 : 0.5;
  const rayCount = stage === 4 ? 12 : 8;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i / rayCount) * 360;
    return angle;
  });
  return (
    <g transform="translate(100 105)">
      {rays.map((a, i) => (
        <rect
          key={i}
          x="-1.5"
          y="-85"
          width="3"
          height={stage === 4 ? 30 : 22}
          fill="#ffe6a8"
          opacity={strokeOpacity}
          transform={`rotate(${a})`}
          rx="1.5"
        />
      ))}
      {/* 金光環 */}
      <ellipse cx="0" cy="-55" rx="42" ry="9" fill="none" stroke="#ffd580" strokeWidth="3" opacity="0.8" />
    </g>
  );
}

/** Stage 3+ 背後翅膀（天使風） */
function StageWings({ stage }: { stage: number }) {
  const scale = stage === 4 ? 1.25 : 0.9;
  return (
    <g transform={`translate(100 110) scale(${scale}) translate(-100 -110)`}>
      {/* 左翅膀 */}
      <path
        d="M 45 100 Q 12 80 18 115 Q 28 110 38 120 Q 30 98 45 100 Z"
        fill="#ffffff"
        stroke="#1c1c28"
        strokeWidth="1.8"
        opacity="0.95"
      />
      <path d="M 25 100 Q 22 108 28 112" fill="none" stroke="#c8d4e8" strokeWidth="1.5" />
      {/* 右翅膀 */}
      <path
        d="M 155 100 Q 188 80 182 115 Q 172 110 162 120 Q 170 98 155 100 Z"
        fill="#ffffff"
        stroke="#1c1c28"
        strokeWidth="1.8"
        opacity="0.95"
      />
      <path d="M 175 100 Q 178 108 172 112" fill="none" stroke="#c8d4e8" strokeWidth="1.5" />
    </g>
  );
}

/** Stage 4 皇冠 */
function StageCrown() {
  return (
    <g>
      <path
        d="M 75 50 L 85 65 L 92 40 L 100 62 L 108 40 L 115 65 L 125 50 L 122 72 L 78 72 Z"
        fill="#ffd447"
        stroke="#b8820f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 寶石 */}
      <circle cx="92" cy="62" r="2.5" fill="#ff8eae" />
      <circle cx="100" cy="60" r="3" fill="#5aa4ff" />
      <circle cx="108" cy="62" r="2.5" fill="#8ed172" />
    </g>
  );
}

/** Stage 3+ 眼睛閃光 */
function EyeSparkle() {
  return (
    <g>
      <text x="88" y="90" fontSize="10" fill="#fff4a3">✦</text>
      <text x="124" y="90" fontSize="10" fill="#fff4a3">✦</text>
    </g>
  );
}

// ============================================================
// 系別差異 — 耳朵 / 頭頂
// ============================================================
function SpeciesHeadDeco({ species, stage: _stage }: { species: PetSpecies; stage: number }) {
  switch (species) {
    case "nuzzle":
      // 水獺：兩個小圓耳朵
      return (
        <g>
          <circle cx="68" cy="65" r="9" fill="#ffc2d4" stroke="#1c1c28" strokeWidth="2.5" />
          <circle cx="132" cy="65" r="9" fill="#ffc2d4" stroke="#1c1c28" strokeWidth="2.5" />
          <circle cx="68" cy="65" r="4" fill="#ff7fa1" />
          <circle cx="132" cy="65" r="4" fill="#ff7fa1" />
        </g>
      );
    case "spark":
      // 小狐：三角耳
      return (
        <g>
          <path d="M 58 72 L 68 40 L 82 68 Z" fill="#ffedc2" stroke="#1c1c28" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 118 68 L 132 40 L 142 72 Z" fill="#ffedc2" stroke="#1c1c28" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 64 64 L 68 50 L 75 64 Z" fill="#ff9d5c" />
          <path d="M 125 64 L 132 50 L 136 64 Z" fill="#ff9d5c" />
        </g>
      );
    case "sturdy":
      // 麻糬熊：半圓耳
      return (
        <g>
          <path d="M 60 70 Q 60 48 80 55" fill="#d9e8c2" stroke="#1c1c28" strokeWidth="2.5" />
          <path d="M 120 55 Q 140 48 140 70" fill="#d9e8c2" stroke="#1c1c28" strokeWidth="2.5" />
          <circle cx="72" cy="60" r="4" fill="#e89ac7" />
          <circle cx="128" cy="60" r="4" fill="#e89ac7" />
        </g>
      );
    case "glide":
      // 鴨：三根呆毛 + 無耳
      return (
        <g>
          <path d="M 100 58 Q 100 38 96 28" stroke="#1c1c28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 90 60 Q 85 45 80 36" stroke="#1c1c28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 110 60 Q 115 45 120 36" stroke="#1c1c28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="96" cy="28" r="3" fill="#c2e3ff" stroke="#1c1c28" strokeWidth="1.5" />
          <circle cx="80" cy="36" r="3" fill="#c2e3ff" stroke="#1c1c28" strokeWidth="1.5" />
          <circle cx="120" cy="36" r="3" fill="#c2e3ff" stroke="#1c1c28" strokeWidth="1.5" />
        </g>
      );
    case "lumen":
      // 獨角獸：螺旋角 + 小翅膀
      return (
        <g>
          {/* 螺旋角 */}
          <path d="M 100 58 L 95 28 L 105 28 Z" fill="#fff5fb" stroke="#1c1c28" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 97 38 L 103 38" stroke="#ffb6da" strokeWidth="2" />
          <path d="M 98 46 L 102 46" stroke="#ffb6da" strokeWidth="2" />
          {/* 小翅膀 */}
          <path d="M 50 90 Q 30 85 35 105 Q 45 100 52 105 Z" fill="#ffffff" stroke="#1c1c28" strokeWidth="2" opacity="0.9" />
          <path d="M 150 90 Q 170 85 165 105 Q 155 100 148 105 Z" fill="#ffffff" stroke="#1c1c28" strokeWidth="2" opacity="0.9" />
        </g>
      );
    default:
      return null;
  }
}

function SpeciesBackDeco({ species, stage }: { species: PetSpecies; stage: number }) {
  if (species === "lumen" && stage >= 2) {
    // 光圈
    return (
      <ellipse cx="100" cy="70" rx="36" ry="8" fill="none" stroke="#ffd7a8" strokeWidth="3" opacity="0.85" />
    );
  }
  if (species === "nuzzle") {
    // 扁尾巴
    return (
      <ellipse cx="155" cy="145" rx="14" ry="7" fill="#ffc2d4" stroke="#1c1c28" strokeWidth="2.5" transform="rotate(20 155 145)" />
    );
  }
  if (species === "spark") {
    // 蓬尾巴
    return (
      <g>
        <ellipse cx="155" cy="135" rx="16" ry="12" fill="#ffedc2" stroke="#1c1c28" strokeWidth="2.5" />
        <ellipse cx="160" cy="128" rx="6" ry="4" fill="#fff5d8" />
      </g>
    );
  }
  return null;
}

function SpeciesFrontDeco({ species, stage }: { species: PetSpecies; stage: number }) {
  switch (species) {
    case "nuzzle":
      // 耳邊貝殼（stage ≥ 2 才顯示）
      return stage >= 2 ? <text x="52" y="68" fontSize="14">🐚</text> : null;
    case "spark":
      // 額頭星星
      return <text x="92" y="80" fontSize="16">⭐</text>;
    case "sturdy":
      // 頭頂楓葉
      return <text x="92" y="52" fontSize="18">🍁</text>;
    case "glide":
      // 脖子蝴蝶結
      return <text x="92" y="152" fontSize="14">🎀</text>;
    case "lumen":
      return null; // 已用螺旋角
    default:
      return null;
  }
}

function SpeciesMouth({ species }: { species: PetSpecies }) {
  if (species === "glide") {
    // 鴨嘴（三角）
    return <path d="M 93 122 L 107 122 L 100 130 Z" fill="#ff9d5c" stroke="#1c1c28" strokeWidth="2" strokeLinejoin="round" />;
  }
  // 其他：w 型小嘴
  return <path d="M 94 122 Q 100 128 106 122" stroke="#1c1c28" strokeWidth="2.2" fill="none" strokeLinecap="round" />;
}

// ============================================================
// Lumen 星塵粒子
// ============================================================
function LumenParticles() {
  const dots = [
    { x: 40, y: 50, d: 0, r: 2 },
    { x: 160, y: 60, d: 0.6, r: 1.5 },
    { x: 35, y: 140, d: 1.2, r: 2 },
    { x: 170, y: 150, d: 0.3, r: 2.5 },
    { x: 100, y: 30, d: 0.9, r: 1.8 },
    { x: 50, y: 175, d: 1.5, r: 1.5 },
  ];
  return (
    <g>
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="#ffd7f0"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.95, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.4, delay: d.d, repeat: Infinity }}
        />
      ))}
    </g>
  );
}

export const PET_STAGE_LABEL = ["蛋", "幼體", "成型", "傳說", "神話"] as const;
