"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { CardGiftModal } from "@/components/CardGiftModal";
import { PageBanner } from "@/components/PageBanner";

export default function FriendsPage() {
  const friends = useGame((s) => s.friends);
  const leaderboard = useGame((s) => s.leaderboard);
  const gifts = useGame((s) => s.gifts);
  const removeFriend = useGame((s) => s.removeFriend);
  const [tab, setTab] = useState<"list" | "gifts" | "add">("list");
  const [giftTarget, setGiftTarget] = useState<{ id: string; name: string } | null>(null);

  const friendCouples = friends
    .map((f) => leaderboard.find((c) => c.id === f.coupleId))
    .filter(Boolean) as any[];

  return (
    <div className="space-y-4">
      <PageBanner
        title="好友情侶"
        subtitle="加好友、送卡、參觀島嶼、PK 對戰"
        emoji="👫"
        gradient="rose"
        stats={[
          { label: "好友", value: friends.length },
          { label: "未讀禮物", value: gifts.filter((g) => !g.read).length },
        ]}
      />

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
                <button
                  onClick={() => { if (confirm(`移除好友「${c.name}」？`)) removeFriend(c.id); }}
                  className="text-xs text-empire-mute hover:text-rose-600 px-2"
                  title="移除好友"
                >✕</button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/couples/${c.id}`} className="btn-ghost flex-1 py-1.5 text-sm text-center">👀 參觀</Link>
                <button onClick={() => setGiftTarget({ id: c.id, name: c.name })} className="btn-ghost flex-1 py-1.5 text-sm">🎴 送卡</button>
                <Link href={`/pk?target=${c.id}`} className="btn-ghost flex-1 py-1.5 text-sm text-center">⚔️ PK</Link>
              </div>
            </div>
          ))}
          {friendCouples.length === 0 && (
            <div className="card p-6 text-center">
              <img src="/art/empty/no-friends.svg" alt="無好友" className="mx-auto" width={200} height={160} />
              <p className="text-empire-mute text-sm mt-3">還沒有好友情侶，去「加好友」分頁找找吧</p>
            </div>
          )}
        </div>
      )}

      {tab === "gifts" && (
        <div className="space-y-3">
          {gifts.length === 0 && (
            <p className="card p-8 text-center text-empire-mute">禮物匣還是空的，等收到再來看看</p>
          )}
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
              {g.message && <div className="mt-1 text-xs text-slate-500 italic">&ldquo;{g.message}&rdquo;</div>}
            </div>
          ))}
        </div>
      )}

      {giftTarget && (
        <CardGiftModal
          toCoupleId={giftTarget.id}
          toCoupleName={giftTarget.name}
          onClose={() => setGiftTarget(null)}
        />
      )}

      {tab === "add" && <AddFriendTab />}
    </div>
  );
}

function AddFriendTab() {
  const leaderboard = useGame((s) => s.leaderboard);
  const friends = useGame((s) => s.friends);
  const addFriend = useGame((s) => s.addFriend);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return leaderboard.filter(
      (c) => !c.isSelf && (c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)),
    );
  }, [q, leaderboard]);

  const recommendations = useMemo(
    () => leaderboard.filter((c) => !c.isSelf && !friends.find((f) => f.coupleId === c.id)).slice(0, 5),
    [leaderboard, friends],
  );

  const handleAdd = (coupleId: string, name: string) => {
    const r = addFriend(coupleId);
    if (r.ok) setMsg({ kind: "ok", text: `已加「${name}」為好友情侶 👫` });
    else setMsg({ kind: "err", text: r.reason ?? "加好友失敗" });
    setTimeout(() => setMsg(null), 2500);
  };

  return (
    <div className="card p-5 space-y-4">
      <div>
        <h3 className="font-bold mb-2">🔍 搜尋情侶 (名稱或配對碼)</h3>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="輸入名稱或 6 碼配對碼"
            className="flex-1 border border-empire-cloud rounded-xl px-3 py-2 focus:outline-none focus:border-empire-sky"
          />
        </div>
      </div>

      {msg && (
        <div className={`text-xs rounded-lg p-2 ${msg.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {msg.text}
        </div>
      )}

      {q.trim() && (
        <div>
          <div className="text-xs text-empire-mute mb-2">結果：{results.length} 筆</div>
          <div className="space-y-2">
            {results.map((c) => {
              const alreadyFriend = friends.some((f) => f.coupleId === c.id);
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-empire-mist">
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{c.name}</div>
                    <div className="text-xs text-empire-mute">Lv.{c.kingdomLevel} · {c.title}</div>
                  </div>
                  <button
                    disabled={alreadyFriend}
                    onClick={() => handleAdd(c.id, c.name)}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold ${alreadyFriend ? "bg-empire-cloud text-empire-mute" : "bg-empire-sky text-white hover:brightness-110"}`}
                  >
                    {alreadyFriend ? "已加" : "加好友"}
                  </button>
                </div>
              );
            })}
            {results.length === 0 && <p className="text-xs text-empire-mute text-center py-4">找不到相符的情侶</p>}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-empire-cloud">
        <h3 className="font-bold mb-2">✨ 推薦情侶</h3>
        <div className="space-y-2">
          {recommendations.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-empire-mist">
              <div className="text-2xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{c.name}</div>
                <div className="text-xs text-empire-mute">Lv.{c.kingdomLevel} · 🔥{c.streak} 天</div>
              </div>
              <button
                onClick={() => handleAdd(c.id, c.name)}
                className="px-3 py-1 text-xs rounded-lg bg-empire-sky text-white font-semibold hover:brightness-110"
              >加好友</button>
            </div>
          ))}
          {recommendations.length === 0 && (
            <p className="text-xs text-empire-mute text-center py-4">目前沒有可加的推薦對象</p>
          )}
        </div>
      </div>
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
