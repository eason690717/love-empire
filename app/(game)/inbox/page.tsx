"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";

type Filter = "all" | "high" | "normal" | "gifts" | "unread";

export default function InboxPage() {
  const notifications = useGame((s) => s.notifications);
  const gifts = useGame((s) => s.gifts);
  const markRead = useGame((s) => s.markNotificationRead);
  const markAll = useGame((s) => s.markAllNotificationsRead);

  const [filter, setFilter] = useState<Filter>("all");

  const highPriority = notifications.filter((n) => n.priority === "high");
  const normalPriority = notifications.filter((n) => n.priority !== "high");

  const unreadHigh = highPriority.filter((n) => !n.read).length;
  const unreadNormal = normalPriority.filter((n) => !n.read).length;
  const unreadG = gifts.filter((g) => !g.read).length;

  const shownNotifications =
    filter === "high" ? highPriority :
    filter === "normal" ? normalPriority :
    filter === "unread" ? notifications.filter((n) => !n.read) :
    filter === "gifts" ? [] :
    notifications;

  const shownGifts = filter === "gifts" || filter === "all" ? gifts : [];

  return (
    <div className="space-y-4">
      <PageBanner
        title="通知中心"
        subtitle="🔴 互動型 · 🔵 一般 · 🎁 禮物匣 · 分層減少視覺過載"
        emoji="🔔"
        gradient="sky"
        stats={[
          { label: "🔴 互動", value: unreadHigh },
          { label: "🔵 一般", value: unreadNormal },
          { label: "🎁 禮物", value: unreadG },
        ]}
        cta={notifications.some((n) => !n.read) ? { label: "全部已讀", onClick: markAll } : undefined}
      />

      {/* 分層篩選 */}
      <div className="card p-2 flex gap-1 overflow-x-auto">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          全部 ({notifications.length + gifts.length})
        </FilterBtn>
        <FilterBtn active={filter === "unread"} onClick={() => setFilter("unread")} accent="pink">
          未讀 ({unreadHigh + unreadNormal})
        </FilterBtn>
        <FilterBtn active={filter === "high"} onClick={() => setFilter("high")} accent="red">
          🔴 互動 ({highPriority.length})
        </FilterBtn>
        <FilterBtn active={filter === "normal"} onClick={() => setFilter("normal")}>
          🔵 一般 ({normalPriority.length})
        </FilterBtn>
        <FilterBtn active={filter === "gifts"} onClick={() => setFilter("gifts")}>
          🎁 禮物 ({gifts.length})
        </FilterBtn>
      </div>

      {notifications.length === 0 && gifts.length === 0 && (
        <div className="card p-6 text-center">
          <img src="/art/empty/no-gifts.svg" alt="無通知" className="mx-auto" width={200} height={160} />
          <p className="text-empire-mute text-sm mt-3">
            還沒有通知。完成任務、收到禮物、伴侶准奏都會出現在這裡
          </p>
        </div>
      )}

      {/* 🔴 互動類（high priority）— 永遠先顯示 */}
      {filter !== "gifts" && filter !== "normal" && highPriority.length > 0 && (filter === "all" || filter === "high" || filter === "unread") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-empire-crimson">🔴 互動 · 重要</span>
            {unreadHigh > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-empire-crimson text-white font-bold animate-pulse">
                {unreadHigh} 未讀
              </span>
            )}
          </div>
          {highPriority
            .filter((n) => filter !== "unread" || !n.read)
            .map((n) => <NotificationCard key={n.id} n={n} markRead={markRead} highlight />)}
        </div>
      )}

      {/* 🔵 一般 */}
      {filter !== "gifts" && filter !== "high" && normalPriority.length > 0 && (filter === "all" || filter === "normal" || filter === "unread") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-empire-sky">🔵 一般動態</span>
          </div>
          {normalPriority
            .filter((n) => filter !== "unread" || !n.read)
            .map((n) => <NotificationCard key={n.id} n={n} markRead={markRead} />)}
        </div>
      )}

      {/* 🎁 禮物匣 */}
      {shownGifts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-empire-berry">🎁 禮物匣</span>
            {unreadG > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-empire-berry text-white font-bold">
                {unreadG} 未拆
              </span>
            )}
          </div>
          {shownGifts.map((g) => (
            <div key={g.id} className={`card p-4 ${g.read ? "" : "border-l-4 border-empire-berry"}`}>
              <div className="flex items-center gap-2">
                <div className="text-2xl">{g.type === "card" ? "🎴" : g.type === "coins" ? "💰" : "📦"}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">來自「{g.fromCoupleName}」</div>
                  <div className="text-xs text-empire-mute">{g.receivedAt}</div>
                </div>
                {!g.read && <span className="tag bg-empire-berry text-white text-[10px]">NEW</span>}
              </div>
              <div className="mt-2 text-sm">{g.content}</div>
              {g.message && <div className="mt-1 text-xs text-empire-mute italic">&ldquo;{g.message}&rdquo;</div>}
            </div>
          ))}
        </div>
      )}

      {filter === "unread" && unreadHigh + unreadNormal === 0 && (
        <div className="card p-6 text-center text-empire-mute text-sm">
          🎉 全部讀完了
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  n, markRead, highlight,
}: {
  n: ReturnType<typeof useGame.getState>["notifications"][number];
  markRead: (id: string) => void;
  highlight?: boolean;
}) {
  const content = (
    <div className={`card p-4 flex gap-3 ${
      n.read ? "" : highlight ? "border-l-4 border-empire-crimson ring-1 ring-empire-crimson/20" : "border-l-4 border-empire-sky"
    }`}>
      <div className="text-2xl shrink-0">{n.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm ${highlight && !n.read ? "text-empire-crimson" : "text-empire-ink"}`}>
          {n.title}
        </div>
        {n.body && <div className="text-xs text-empire-mute mt-0.5 truncate">{n.body}</div>}
        <div className="text-xs text-empire-mute mt-1">{n.createdAt}</div>
      </div>
      {!n.read && (
        <span className={`tag text-white text-[10px] px-1.5 py-0 self-start font-bold ${highlight ? "bg-empire-crimson animate-pulse" : "bg-empire-sky"}`}>
          NEW
        </span>
      )}
    </div>
  );
  return n.link ? (
    <Link key={n.id} href={n.link} onClick={() => markRead(n.id)}>{content}</Link>
  ) : (
    <button key={n.id} onClick={() => markRead(n.id)} className="w-full text-left">{content}</button>
  );
}

function FilterBtn({ active, onClick, children, accent }: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: "pink" | "red" }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
        active
          ? accent === "red" ? "bg-empire-crimson text-white"
            : accent === "pink" ? "bg-empire-pink text-white"
            : "bg-empire-sky text-white"
          : "text-empire-mute hover:bg-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}
