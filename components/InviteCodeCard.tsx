"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { shareInvite } from "@/lib/liff";

/**
 * 配對邀請碼卡片 — 可事後查詢、複製、分享
 * 放在 settings 頁 + dashboard 條件式顯示
 */
export function InviteCodeCard({ compact = false }: { compact?: boolean }) {
  const couple = useGame((s) => s.couple);
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  const code = couple.inviteCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch { /* ignore */ }
  };

  const handleShare = async () => {
    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://love-empire-rho.vercel.app";
    await shareInvite(code, appUrl);
    setStatus("shared");
    setTimeout(() => setStatus("idle"), 2000);
  };

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire-cream border-2 border-empire-gold/40 text-xs font-bold text-empire-ink active:scale-95"
        title="點擊複製配對碼"
      >
        💌 配對碼 <b className="tracking-widest text-empire-berry">{code}</b>
        <span className="text-empire-mute">{status === "copied" ? "✓" : "📋"}</span>
      </button>
    );
  }

  return (
    <div className="card p-5 bg-gradient-to-br from-empire-cream to-white border-2 border-empire-gold/40">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">💌</span>
        <div>
          <div className="font-black text-empire-ink">配對邀請碼</div>
          <div className="text-xs text-empire-mute">傳給另一半加入你的王國</div>
        </div>
      </div>

      <div className="mt-3 p-4 rounded-2xl bg-empire-sky/10 border-2 border-dashed border-empire-sky/40 text-center">
        <div className="text-[10px] text-empire-mute">你的配對碼</div>
        <div className="mt-1 text-4xl font-black tracking-[0.4em] text-empire-ink font-display">
          {code}
        </div>
        <div className="text-[10px] text-empire-mute mt-1">
          👤 王國：{couple.name}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={handleCopy} className="btn-ghost py-2 text-sm font-semibold">
          {status === "copied" ? "✓ 已複製" : "📋 複製碼"}
        </button>
        <button onClick={handleShare} className="btn-primary py-2 text-sm font-semibold">
          {status === "shared" ? "✓ 已分享" : "💚 分享到 LINE"}
        </button>
      </div>

      <div className="mt-3 text-[11px] text-empire-mute leading-relaxed">
        💡 對方用「我有配對碼」進入 → 輸入此碼 → 綁定成情侶。
        一個王國只能綁兩人；已配對後此碼失效。
      </div>
    </div>
  );
}
