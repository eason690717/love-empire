"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { titleByLevel, SEASON_LABEL, season } from "@/lib/utils";
import { InlineRename } from "@/components/InlineRename";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CoupleAvatar } from "@/components/art/CoupleAvatar";
import { SupabaseSync } from "@/components/SupabaseSync";
import { MoreMenu } from "@/components/MoreMenu";
import { getKingdomStatus } from "@/lib/types";

// 底部 5 主 tab + 更多
const MAIN_TABS = [
  { href: "/dashboard", label: "主殿",   icon: "🏛️" },
  { href: "/tasks",     label: "任務",   icon: "📜" },
  { href: "/pet",       label: "寵物",   icon: "🐣" },
  { href: "/island",    label: "小窩",   icon: "🏡" },
  { href: "/plaza",     label: "廣場",   icon: "🌸" },
];

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const loggedIn = useGame((s) => s.loggedIn);
  const logout = useGame((s) => s.logout);
  const streak = useGame((s) => s.streak);
  const setNickname = useGame((s) => s.setNickname);
  const notifications = useGame((s) => s.notifications);
  const gifts = useGame((s) => s.gifts);
  const submissions = useGame((s) => s.submissions);
  const unreadCount = notifications.filter((n) => !n.read).length + gifts.filter((g) => !g.read).length;
  const pendingTasks = submissions.filter((s) => s.status === "pending" && s.submittedBy !== role).length;
  const [moreOpen, setMoreOpen] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  const checkKingdomStatus = useGame((s) => s.checkKingdomStatus);
  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => {
    if (hydrated && !loggedIn) router.push("/login");
  }, [hydrated, loggedIn, router]);
  useEffect(() => {
    if (hydrated) checkKingdomStatus();
  }, [hydrated, checkKingdomStatus]);

  const status = getKingdomStatus(couple);

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
  const loveToNext = couple.loveIndex % 50;
  const loveProgress = (loveToNext / 50) * 100;

  return (
    <div className="min-h-screen pb-20">
      <SupabaseSync />
      <OnboardingModal />

      {/* 暫停/封存 banner — 不顯眼但常駐提醒 */}
      {status.state === "paused" && (
        <Link
          href="/settings"
          className="block px-3 py-1.5 text-center text-[11px] bg-amber-100 border-b border-amber-200 text-amber-900 font-semibold hover:bg-amber-200 transition"
        >
          ⏸️ 王國暫停中 · 還剩 {status.daysLeft} 天 · 點此解除或查看
        </Link>
      )}
      {status.state === "archived" && (
        <Link
          href="/archive"
          className="block px-3 py-1.5 text-center text-[11px] bg-slate-200 border-b border-slate-300 text-slate-700 font-semibold hover:bg-slate-300 transition"
        >
          📜 王國已封存 · 點此查看畢業紀念
        </Link>
      )}

      {/* 頂部資源 + avatar bar (固定, 類似 gacha 遊戲) */}
      <header
        className="sticky top-0 z-30 px-3 pt-2 pb-3"
        style={{
          background: "linear-gradient(180deg, rgba(26,58,86,0.95) 0%, rgba(45,79,106,0.88) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* 資源列 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="resource-chip">
            <span className="plus">+</span>
            💞 {couple.loveIndex.toLocaleString()}
          </span>
          <span className="resource-chip">
            <span className="plus">+</span>
            💰 {couple.coins.toLocaleString()}
          </span>
          <span className="resource-chip">
            <span className="plus">+</span>
            🔥 {streak.current}
          </span>
          <div className="flex-1" />
          <Link href="/inbox" className="relative w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-sm">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-empire-crimson text-white text-[9px] font-black flex items-center justify-center border border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-sm"
            title="登出"
          >
            ↪
          </button>
        </div>

        {/* Avatar + nickname + progress */}
        <div className="mt-2 flex items-center gap-3">
          <div className="relative">
            <CoupleAvatar name={nickname} size={54} />
            <div className="absolute -bottom-1 -left-1 bg-gradient-to-b from-empire-sunshine to-empire-orange text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow">
              Lv.{couple.kingdomLevel}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">
              <InlineRename value={nickname} onSave={(v) => setNickname(role, v)} className="text-white" />
            </div>
            <div className="text-[11px] text-white/80 truncate">{title} · {SEASON_LABEL[today]}</div>
            <div className="progress-pill mt-1">
              <div style={{ width: `${loveProgress}%` }} />
            </div>
            <div className="text-[10px] text-white/70 mt-0.5">
              Lv.{couple.kingdomLevel + 1}：{50 - loveToNext} 愛意
            </div>
          </div>
        </div>

        {/* 最高聖旨 */}
        <Notice />
      </header>

      {/* 主內容 */}
      <main className="max-w-3xl mx-auto px-3 pt-3">{children}</main>

      {/* 底部 gacha 風 tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 gacha-tabbar">
        <div className="max-w-3xl mx-auto flex">
          {MAIN_TABS.map((tab) => {
            const active = path === tab.href;
            const showBadge = tab.href === "/tasks" && pendingTasks > 0;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`gacha-tab ${active ? "active" : ""}`}
              >
                <div className="icon-wrap relative">
                  {tab.icon}
                  {showBadge && (
                    <span className="absolute -top-1 -right-3 min-w-[16px] h-[16px] px-1 rounded-full bg-empire-crimson text-white text-[9px] font-black flex items-center justify-center border border-white">
                      {pendingTasks}
                    </span>
                  )}
                </div>
                <span className="label relative">{tab.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen(true)} className="gacha-tab">
            <div className="icon-wrap relative">
              ☰
              {unreadCount > 0 && <span className="notify-dot" />}
            </div>
            <span className="label relative">更多</span>
          </button>
        </div>
      </nav>

      {moreOpen && <MoreMenu onClose={() => setMoreOpen(false)} />}
    </div>
  );
}

function Notice() {
  const notice = useGame((s) => s.notice);
  if (!notice?.title) return null;
  return (
    <div className="mt-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-[11px]">
      📜 <b>{notice.title}</b>
      <span className="opacity-80 ml-1.5">{notice.body}</span>
    </div>
  );
}
