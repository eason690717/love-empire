"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * 「更多」抽屜 — 放不在底部主 tab 的次要分頁
 */
export function MoreMenu({ onClose }: { onClose: () => void }) {
  const items: Array<{ href: string; emoji: string; label: string; tint: string }> = [
    { href: "/codex",        emoji: "🎴", label: "記憶圖鑑",   tint: "from-fuchsia-100 to-pink-100" },
    { href: "/questions",    emoji: "💬", label: "深度問答",   tint: "from-sky-100 to-cyan-100" },
    { href: "/achievements", emoji: "🏅", label: "獎盃",        tint: "from-amber-100 to-yellow-100" },
    { href: "/rituals",      emoji: "🌅", label: "每日儀式",   tint: "from-rose-100 to-orange-100" },
    { href: "/exchange",     emoji: "💰", label: "國庫兌換",   tint: "from-amber-100 to-yellow-100" },
    { href: "/vault",        emoji: "🎁", label: "我的寶庫",   tint: "from-pink-100 to-rose-100" },
    { href: "/history",      emoji: "📖", label: "歷程紀錄",   tint: "from-stone-100 to-neutral-100" },
    { href: "/timeline",     emoji: "📅", label: "時間軸",      tint: "from-sky-100 to-blue-100" },
    { href: "/recap",        emoji: "✨", label: "年度回顧",   tint: "from-violet-100 to-fuchsia-100" },
    { href: "/bucket-list",  emoji: "💞", label: "人生清單",   tint: "from-pink-100 to-red-100" },
    { href: "/alliance",     emoji: "🤝", label: "聯盟",        tint: "from-amber-100 to-orange-100" },
    { href: "/friends",      emoji: "👫", label: "好友情侶",   tint: "from-rose-100 to-pink-100" },
    { href: "/leaderboard",  emoji: "🏆", label: "情侶排行",   tint: "from-yellow-100 to-amber-100" },
    { href: "/pk",           emoji: "⚔️", label: "情侶 PK",     tint: "from-red-100 to-rose-100" },
    { href: "/inbox",        emoji: "🔔", label: "通知",        tint: "from-pink-100 to-rose-100" },
    { href: "/settings",     emoji: "⚙️", label: "設定",        tint: "from-slate-100 to-gray-100" },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end"
      style={{ background: "rgba(20, 40, 70, 0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full bg-gradient-to-b from-white to-empire-cream rounded-t-[28px] p-5 pb-8 animate-pop"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="w-12 h-1.5 rounded-full bg-empire-cloud mx-auto mb-4" />
        <h3 className="font-display font-black text-xl text-empire-ink mb-1">更多功能</h3>
        <p className="text-xs text-empire-mute mb-4">點任一功能開啟</p>

        <div className="grid grid-cols-4 gap-3">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={onClose}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-gradient-to-br ${i.tint} border-2 border-white hover:scale-105 transition`}
            >
              <div className="text-3xl drop-shadow-sm">{i.emoji}</div>
              <div className="text-[11px] font-bold text-empire-ink text-center">{i.label}</div>
            </Link>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-2xl bg-empire-cloud text-empire-ink font-semibold"
        >
          關閉
        </button>
      </div>
    </div>
  );
}
