"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";

export default function FriendsPage() {
  const friends = useGame((s) => s.friends);
  const leaderboard = useGame((s) => s.leaderboard);
  const gifts = useGame((s) => s.gifts);
  const sendGift = useGame((s) => s.sendGift);
  const [tab, setTab] = useState<"list" | "gifts" | "add">("list");

  const friendCouples = friends
    .map((f) => leaderboard.find((c) => c.id === f.coupleId))
    .filter(Boolean) as any[];

  return (
    <div className="space-y-4">
      <div className="card p-2 flex gap-1">
        <TabBtn active={tab === "list"} onClick={() => setTab("list")}>好友情侶 ({friends.length})</TabBtn>
        <TabBtn active={tab === "gifts"} onClick={() => setTab("gifts")}>禮物匣 ({gifts.filter((g) => !g.read).length})</TabBtn>
        <TabBtn active={tab === "add"} onClick={() => setTab("add")}>加好友</TabBtn>
      </div>

      {tab === "list" && (
        <div className="space-y-3">
          {friendCouples.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.title} · Lv.{c.kingdomLevel} · 🔥{c.streak} 天</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/couples/${c.id}`} className="btn-ghost flex-1 py-1.5 text-sm text-center">👀 參觀</Link>
                <button onClick={() => sendGift()} className="btn-ghost flex-1 py-1.5 text-sm">🎁 送禮</button>
                <Link href="/pk" className="btn-ghost flex-1 py-1.5 text-sm text-center">⚔️ PK</Link>
              </div>
            </div>
          ))}
          {friendCouples.length === 0 && (
            <p className="card p-8 text-center text-slate-500">還沒有好友情侶，去「加好友」分頁看看吧</p>
          )}
        </div>
      )}

      {tab === "gifts" && (
        <div className="space-y-3">
          {gifts.map((g) => (
            <div key={g.id} className={`card p-4 ${g.read ? "" : "border-l-4 border-empire-pink"}`}>
              <div className="flex items-center gap-2">
                <div className="text-2xl">{g.type === "card" ? "🎴" : g.type === "coins" ? "💰" : "📦"}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">來自「{g.fromCoupleName}」</div>
                  <div className="text-xs text-slate-500">{g.receivedAt}</div>
                </div>
                {!g.read && <span className="tag bg-empire-pink text-white text-[10px]">NEW</span>}
              </div>
              <div className="mt-2 text-sm">{g.content}</div>
              <div className="mt-1 text-xs text-slate-500 italic">"{g.message}"</div>
            </div>
          ))}
        </div>
      )}

      {tab === "add" && (
        <div className="card p-5 space-y-4">
          <div>
            <h3 className="font-bold mb-2">🔍 以配對碼尋找</h3>
            <div className="flex gap-2">
              <input placeholder="輸入 6 碼配對碼" className="flex-1 border border-empire-cloud rounded-xl px-3 py-2" />
              <button className="btn-primary px-4">搜尋</button>
            </div>
          </div>
          <div className="pt-4 border-t border-empire-cloud">
            <h3 className="font-bold mb-2">✨ 系統推薦情侶</h3>
            <div className="space-y-2">
              {leaderboard.filter((c) => !c.isSelf && !friends.find((f) => f.coupleId === c.id)).slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-empire-mist">
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{c.name}</div>
                    <div className="text-xs text-slate-500">Lv.{c.kingdomLevel}</div>
                  </div>
                  <button className="btn-ghost px-3 py-1 text-xs">加好友</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
        active ? "bg-empire-sky text-white" : "text-empire-ink hover:bg-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}
