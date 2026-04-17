"use client";

import { useState } from "react";
import { shareMoment } from "@/lib/liff";

export function ShareMomentButton({
  title, subtitle, emoji, coupleName, compact = false,
}: {
  title: string;
  subtitle?: string;
  emoji: string;
  coupleName: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("sending");
    try {
      const appUrl = typeof window !== "undefined" ? window.location.origin : "https://loveempire.app";
      const result = await shareMoment({ title, subtitle, emoji, coupleName, appUrl });
      setStatus(result === "failed" ? "fail" : "ok");
    } catch {
      setStatus("fail");
    }
    setTimeout(() => setStatus("idle"), 2500);
  };

  const label =
    status === "sending" ? "分享中…"
    : status === "ok" ? "已分享 ✓"
    : status === "fail" ? "失敗，再試"
    : compact ? "🔗 分享" : "🔗 分享到 LINE / 複製";

  return (
    <button
      onClick={handleClick}
      disabled={status === "sending"}
      className={compact
        ? "text-xs px-2.5 py-1 rounded-full bg-empire-cloud text-empire-ink font-semibold hover:bg-empire-sky/20"
        : "btn w-full py-2 text-sm text-white font-semibold"}
      style={compact ? undefined : { background: "linear-gradient(180deg, #06C755 0%, #04a546 100%)", border: "2px solid #038a3a" }}
    >
      {label}
    </button>
  );
}
