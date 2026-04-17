"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";

export default function InboxPage() {
  const notifications = useGame((s) => s.notifications);
  const gifts = useGame((s) => s.gifts);
  const markRead = useGame((s) => s.markNotificationRead);
  const markAll = useGame((s) => s.markAllNotificationsRead);

  const unreadN = notifications.filter((n) => !n.read).length;
  const unreadG = gifts.filter((g) => !g.read).length;

  return (
    <div className="space-y-4">
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold">🔔 通知中心</h2>
          <p className="text-xs text-empire-mute mt-0.5">{unreadN + unreadG} 則未讀</p>
        </div>
        {unreadN > 0 && (
          <button onClick={markAll} className="btn-ghost px-3 py-1.5 text-xs">全部已讀</button>
        )}
      </div>

      {notifications.length === 0 && gifts.length === 0 && (
        <p className="card p-8 text-center text-empire-mute">
          還沒有通知。完成任務、收到禮物、伴侶准奏都會出現在這裡
        </p>
      )}

      {notifications.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-sm">動態</h3>
          {notifications.map((n) => {
            const content = (
              <div className={`card p-4 flex gap-3 ${
                n.read ? "" : "border-l-4 border-empire-pink"
              }`}>
                <div className="text-2xl shrink-0">{n.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{n.title}</div>
                  {n.body && <div className="text-xs text-empire-mute mt-0.5 truncate">{n.body}</div>}
                  <div className="text-xs text-empire-mute mt-1">{n.createdAt}</div>
                </div>
                {!n.read && <span className="tag bg-empire-pink text-white text-[10px] px-1.5 py-0 self-start">NEW</span>}
              </div>
            );
            return n.link ? (
              <Link key={n.id} href={n.link} onClick={() => markRead(n.id)}>
                {content}
              </Link>
            ) : (
              <button key={n.id} onClick={() => markRead(n.id)} className="w-full text-left">
                {content}
              </button>
            );
          })}
        </div>
      )}

      {gifts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-sm">禮物匣</h3>
          {gifts.map((g) => (
            <div key={g.id} className={`card p-4 ${g.read ? "" : "border-l-4 border-empire-pink"}`}>
              <div className="flex items-center gap-2">
                <div className="text-2xl">{g.type === "card" ? "🎴" : g.type === "coins" ? "💰" : "📦"}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">來自「{g.fromCoupleName}」</div>
                  <div className="text-xs text-empire-mute">{g.receivedAt}</div>
                </div>
                {!g.read && <span className="tag bg-empire-pink text-white text-[10px]">NEW</span>}
              </div>
              <div className="mt-2 text-sm">{g.content}</div>
              <div className="mt-1 text-xs text-empire-mute italic">"{g.message}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
