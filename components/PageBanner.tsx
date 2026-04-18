"use client";

/**
 * Gacha 手遊風頁首 banner
 * - 漸層背景 + 大標題 + 副標
 * - 右側浮動角色 emoji
 * - 可選：倒數、stat chips、右下 CTA
 */

interface Props {
  title: string;
  subtitle?: string;
  emoji: string;
  gradient: "rose" | "sky" | "amber" | "violet" | "leaf" | "sunshine";
  stats?: Array<{ label: string; value: string | number }>;
  countdown?: string;          // e.g. "2 天 08 小時"
  cta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}

const GRADIENTS: Record<Props["gradient"], { bg: string; shadow: string }> = {
  rose:     { bg: "linear-gradient(135deg, #ffb8de 0%, #ff8eae 60%, #ff5f8d 100%)",  shadow: "rgba(255,95,141,0.4)" },
  sky:      { bg: "linear-gradient(135deg, #b8d8ff 0%, #7ec1ff 60%, #4ea3ff 100%)",  shadow: "rgba(78,163,255,0.4)" },
  amber:    { bg: "linear-gradient(135deg, #ffe38a 0%, #ffc050 60%, #ff9052 100%)",  shadow: "rgba(255,144,50,0.45)" },
  violet:   { bg: "linear-gradient(135deg, #e3b0ff 0%, #c57aff 60%, #9a3fff 100%)",  shadow: "rgba(154,63,255,0.4)" },
  leaf:     { bg: "linear-gradient(135deg, #d9f5b0 0%, #a6d18a 60%, #6cba3d 100%)",  shadow: "rgba(108,186,61,0.4)" },
  sunshine: { bg: "linear-gradient(135deg, #fff5c4 0%, #ffd447 60%, #ffb547 100%)",  shadow: "rgba(255,180,70,0.4)" },
};

export function PageBanner({ title, subtitle, emoji, gradient, stats, countdown, cta, className = "" }: Props) {
  const g = GRADIENTS[gradient];
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] p-5 pb-6 mb-3 ${className}`}
      style={{ background: g.bg, boxShadow: `0 8px 24px ${g.shadow}` }}
    >
      {/* 斜紋裝飾 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* 星星 */}
      <span className="absolute top-3 left-3 text-white/60 text-lg">✦</span>
      <span className="absolute top-6 right-20 text-white/50 text-sm">✧</span>
      <span className="absolute bottom-4 left-8 text-white/40 text-base">✦</span>

      {/* 大角色 emoji 右下浮動 */}
      <div
        className="absolute -right-2 -bottom-4 text-[120px] leading-none opacity-90 select-none"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
      >
        {emoji}
      </div>

      {/* 文字區 */}
      <div className="relative z-10 text-white pr-24">
        {countdown && (
          <div className="inline-block px-2 py-0.5 rounded-full bg-black/30 text-[11px] font-semibold mb-2">
            ⏰ {countdown}
          </div>
        )}
        <h1 className="font-display text-[26px] font-black leading-tight tracking-wider text-shadow-soft"
            style={{ textShadow: "0 3px 0 rgba(0,0,0,0.25), 0 0 12px rgba(255,255,255,0.3)" }}>
          {title}
        </h1>
        {subtitle && <div className="text-[12px] font-semibold opacity-95 mt-1">{subtitle}</div>}

        {stats && stats.length > 0 && (
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {stats.map((s, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur text-[11px] font-bold border border-white/30">
                {s.label} <b className="ml-1">{s.value}</b>
              </span>
            ))}
          </div>
        )}

        {cta && (
          <button
            onClick={cta.onClick}
            className="mt-3 px-4 py-2 rounded-full bg-white/90 text-empire-ink font-black text-sm shadow-sm active:translate-y-0.5"
          >
            {cta.label} →
          </button>
        )}
      </div>
    </div>
  );
}
