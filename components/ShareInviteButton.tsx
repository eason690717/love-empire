"use client";

import { useState } from "react";
import { canShare, shareInvite } from "@/lib/liff";

export function ShareInviteButton({ inviteCode }: { inviteCode: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "fallback">("idle");

  const handleClick = async () => {
    setStatus("sending");
    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://loveempire.app";
    const ok = await shareInvite(inviteCode, appUrl);
    if (ok) {
      // 若 LIFF shareTargetPicker 可用 → 直接送出；否則 clipboard fallback
      const canLineShare = await canShare();
      setStatus(canLineShare ? "done" : "fallback");
    } else {
      setStatus("idle");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const label =
    status === "sending" ? "分享中…"
    : status === "done" ? "已送到 LINE ✓"
    : status === "fallback" ? "已複製邀請文案 ✓"
    : "💚 分享到 LINE";

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
