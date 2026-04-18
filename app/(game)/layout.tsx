"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { titleByLevel, SEASON_LABEL, season } from "@/lib/utils";
import { InlineRename } from "@/components/InlineRename";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CoupleAvatar } from "@/components/art/CoupleAvatar";

const TABS = [
  { href: "/dashboard",   label: "儀表板",   icon: "📊" },
  { href: "/tasks",       label: "任務申報", icon: "📜" },
  { href: "/exchange",    label: "國庫兌換", icon: "💰" },
  { href: "/vault",       label: "我的寶庫", icon: "🎁" },
  { href: "/history",     label: "歷程紀錄", icon: "📖" },
  { href: "/timeline",    label: "時間軸",   icon: "📅" },
  { href: "/pet",         label: "愛之寵物", icon: "🐣" },
  { href: "/codex",       label: "記憶圖鑑", icon: "🖼️" },
  { href: "/island",      label: "帝國島嶼", icon: "🏝️" },
  { href: "/rituals",     label: "每日儀式", icon: "🌅" },
  { href: "/inbox",       label: "通知",     icon: "🔔" },
  { href: "/achievements", label: "獎盃陳列", icon: "🏅" },
  { href: "/recap",       label: "年度回顧", icon: "✨" },
  { href: "/questions",   label: "深度問答", icon: "💬" },
  { href: "/plaza",       label: "帝國廣場", icon: "🌸" },
  { href: "/leaderboard", label: "情侶排行", icon: "🏆" },
  { href: "/friends",     label: "好友情侶", icon: "👫" },
  { href: "/alliance",    label: "聯盟",     icon: "🤝" },
  { href: "/pk",          label: "情侶 PK",  icon: "⚔️" },
  { href: "/settings",    label: "設定",     icon: "⚙️" },
];

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const loggedIn = useGame((s) => s.loggedIn);
  const logout = useGame((s) => s.logout);
  const notice = useGame((s) => s.notice);
  const streak = useGame((s) => s.streak);
  const setNickname = useGame((s) => s.setNickname);
  const notifications = useGame((s) => s.notifications);
  const gifts = useGame((s) => s.gifts);
  const unreadCount = notifications.filter((n) => !n.read).length + gifts.filter((g) => !g.read).length;

  // 等 Zustand persist 完成 rehydration 再做登入判斷，避免 SSR→client 閃爍回 /login
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !loggedIn) router.push("/login");
  }, [hydrated, loggedIn, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-empire-mute text-sm">
        載入中…
      </div>
    );
  }
  if (!loggedIn) return null;

  const nickname = role === "queen" ? couple.queen.nickname : couple.prince.nickname;
  const title = titleByLevel(couple.kingdomLevel);
  const today = season();

  return (
    <div className="min-h-screen pb-24">
      <OnboardingModal />
      {/* 聖旨公告 */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="card bg-empire-cream/80 border-empire-gold/30 p-4">
          <div className="flex items-center gap-2 text-empire-gold font-semibold text-sm">
            📜 帝國最高聖旨
          </div>
          <div className="mt-1 font-bold text-empire-ink">{notice.title}</div>
          <div className="text-sm text-slate-600">{notice.body}</div>
        </div>
      </div>

      {/* 使用者卡 */}
      <header className="max-w-3xl mx-auto px-4 mt-4">
        <div className="card p-4 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute -left-2 -top-2 text-2xl opacity-40 select-none">🍃</div>
          <CoupleAvatar name={nickname} size={56} />
          <div className="flex-1 min-w-0">
            <div className="font-bold truncate text-empire-ink">
              <InlineRename value={nickname} onSave={(v) => setNickname(role, v)} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="emblem text-xs px-2 py-0.5">Lv.{couple.kingdomLevel}</span>
              <span className="text-xs font-semibold text-empire-ink">{title}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">💰 <b className="text-empire-ink">{couple.coins}</b></span>
              <span className="inline-flex items-center gap-1">🔥 <b className="text-empire-ink">{streak.current}</b></span>
              <span className="hidden sm:inline-flex items-center gap-1 text-empire-mute">{SEASON_LABEL[today]}</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="btn-ghost px-3 py-2 text-xs font-semibold"
          >
            登出
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const active = path === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`tab-btn ${active ? "tab-btn-active" : "tab-btn-idle"} relative`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
                {tab.href === "/inbox" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-empire-berry text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-4">{children}</main>
    </div>
  );
}
