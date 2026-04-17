"use client";

import { useState } from "react";
import { canShare, shareInvite } from "@/lib/liff";

export function ShareInviteButton({ inviteCode }: { inviteCode: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fallback" | "error">("idle");

  const handleClick = async () => {
    setStatus("sending");
    try {
      const appUrl = typeof window !== "undefined" ? window.location.origin : "https://loveempire.app";
      const ok = await shareInvite(inviteCode, appUrl);
      if (ok) {
        const liffShare = await canShare().catch(() => false);
        setStatus(liffShare ? "done" : "fallback");
      } else {
        setStatus("error");
      }
    } catch (e) {
      console.error("[share] failed", e);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const label =
    status === "sending" ? "分享中…"
    : status === "done" ? "已送到 LINE ✓"
    : status === "fallback" ? "已複製邀請 ✓ 貼到 LINE 傳送"
    : status === "error" ? "分享失敗，已複製到剪貼簿"
    : "💚 分享到 LINE / 複製邀請";

  return (
    <button
      onClick={handleClick}
      disabled={status === "sending"}
      className="btn w-full py-3 text-white font-semibold"
      style={{ background: "linear-gradient(180deg, #06C755 0%, #04a546 100%)", border: "2px solid #038a3a", boxShadow: "0 4px 0 #025a25" }}
    >
      {label}
    </button>
  );
}
