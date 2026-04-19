"use client";

import { useEffect } from "react";

export type CelebrationKind =
  | "evolve"       // 寵物進化 — 放射光芒 + 旋轉
  | "level-up"     // 王國升等 — 金光衝頂
  | "achievement"  // 成就解鎖 — 獎盃升起
  | "streak"       // 連擊 — 火焰放大
  | "task-approve" // 任務准奏 — 彩帶飛散
  | "card-drop";   // 卡牌掉落 — 翻轉展示

interface Props {
  kind: CelebrationKind;
  title: string;
  subtitle?: string;
  emoji: string;
  rarity?: "N" | "R" | "SR" | "SSR";
  duration?: number;
  onClose: () => void;
}

export function CelebrationOverlay({ kind, title, subtitle, emoji, rarity, duration = 3600, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const config: Record<CelebrationKind, { bg: string; labelColor: string; particleCount: number; particleEmoji: string }> = {
    evolve:       { bg: "linear-gradient(135deg, #fff1c4, #ffb8de, #b8d8ff)", labelColor: "text-empire-berry", particleCount: 32, particleEmoji: "✨" },
    "level-up":   { bg: "linear-gradient(135deg, #ffd447, #ff9052, #ffb547)", labelColor: "text-white",         particleCount: 24, particleEmoji: "⭐" },
    achievement:  { bg: "linear-gradient(135deg, #a78bfa, #f472b6, #fbbf24)", labelColor: "text-white",         particleCount: 20, particleEmoji: "🏆" },
    streak:       { bg: "linear-gradient(135deg, #f97316, #ef4444, #fbbf24)", labelColor: "text-white",         particleCount: 24, particleEmoji: "🔥" },
    "task-approve": { bg: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)", labelColor: "text-white",       particleCount: 28, particleEmoji: "🎊" },
    "card-drop":  {
      bg: rarity === "SSR" ? "linear-gradient(135deg, #fff1c4, #ffb8de, #b8d8ff, #b8ffca)"
        : rarity === "SR"  ? "linear-gradient(135deg, #e9d5ff, #fbcfe8, #c4b5fd)"
        : rarity === "R"   ? "linear-gradient(135deg, #bae6fd, #dbeafe)"
        : "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
      labelColor: "text-empire-ink",
      particleCount: rarity === "SSR" ? 40 : rarity === "SR" ? 28 : 16,
      particleEmoji: rarity === "SSR" ? "🌟" : "✨",
    },
  };
  const c = config[kind];

  const particles = Array.from({ length: c.particleCount }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.8 + Math.random() * 1.2,
    size: 16 + Math.floor(Math.random() * 20),
    drift: -60 + Math.random() * 120,
  }));

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 20, 40, 0.55)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      {/* 粒子雨 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            ["--drift" as any]: `${p.drift}px`,
            animation: `celeb-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {c.particleEmoji}
        </span>
      ))}

      {/* 中央卡 */}
      <div
        className="relative max-w-sm w-full rounded-3xl p-8 text-center"
        style={{ background: c.bg, animation: "celeb-pop 0.6s cubic-bezier(.2,.8,.2,1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 放射光芒（進化用） */}
        {kind === "evolve" && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, rgba(255,255,255,0.3), transparent 30%, rgba(255,255,255,0.3) 60%, transparent)",
              animation: "celeb-spin 4s linear infinite",
            }}
          />
        )}

        <div className="relative">
          <div
            className="text-8xl mb-4"
            style={{
              animation: kind === "evolve"
                ? "celeb-bounce 1s ease-in-out infinite"
                : kind === "level-up"
                ? "celeb-rise 0.8s ease-out forwards"
                : "celeb-bounce 0.9s ease-in-out infinite",
              display: "inline-block",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
            }}
          >
            {emoji}
          </div>

          <div className={`font-display font-black text-3xl ${c.labelColor} text-shadow-soft`}>
            {title}
          </div>
          {subtitle && (
            <div className={`text-sm mt-2 ${c.labelColor} opacity-90`}>
              {subtitle}
            </div>
          )}
          {rarity && (
            <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-black ${
              rarity === "SSR" ? "bg-gradient-to-r from-amber-400 to-pink-400 text-white" :
              rarity === "SR"  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" :
              rarity === "R"   ? "bg-sky-400 text-white" :
                                 "bg-slate-300 text-slate-700"
            }`}>
              {rarity}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 rounded-full bg-white/95 text-empire-ink font-bold shadow-lg hover:scale-105 active:scale-95 transition"
          >
            繼續
          </button>
        </div>
      </div>
    </div>
  );
}
