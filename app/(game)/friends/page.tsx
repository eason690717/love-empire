"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { CardGiftModal } from "@/components/CardGiftModal";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "@/components/Toast";

export default function FriendsPage() {
  const friends = useGame((s) => s.friends);
  const leaderboard = useGame((s) => s.leaderboard);
  const gifts = useGame((s) => s.gifts);
  const removeFriend = useGame((s) => s.removeFriend);
  const openGift = useGame((s) => s.openGift);
  const [tab, setTab] = useState<"list" | "gifts" | "add">("list");
  const [giftTarget, setGiftTarget] = useState<{ id: string; name: string } | null>(null);
  const [openingGiftId, setOpeningGiftId] = useState<string | null>(null);

  const friendCouples = friends
    .map((f) => leaderboard.find((c) => c.id === f.coupleId))
    .filter(Boolean) as any[];

  return (
    <div className="space-y-4">
      <PageBanner
        title="好友情侶"
        subtitle="加好友、送卡、參觀小窩、PK 對戰"
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
                  onClick={async () => { if (await toast.confirm(`移除好友「${c.name}」？`, { okLabel: "移除" })) removeFriend(c.id); }}
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
          {gifts.map((g) => {
            if (!g.read) {
              // 未拆禮物：包裝盒 + 閃光
              return (
                <button
                  key={g.id}
                  onClick={() => setOpeningGiftId(g.id)}
                  className="card w-full p-5 text-center relative overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-empire-pink/10 via-empire-sunshine/10 to-empire-sky/10 animate-pulse" />
                  <div className="relative">
                    <div className="text-5xl mb-2 animate-bob group-hover:scale-110 transition">🎁</div>
                    <div className="font-bold text-sm">來自「{g.fromCoupleName}」的禮物</div>
                    <div className="text-xs text-empire-mute">{g.receivedAt} · 點擊拆開 ✨</div>
                    <span className="absolute -top-1 -right-1 tag bg-empire-pink text-white text-[10px] animate-pop">NEW</span>
                  </div>
                </button>
              );
            }
            return (
              <div key={g.id} className="card p-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{g.type === "card" ? "🎴" : g.type === "coins" ? "💰" : "📦"}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">來自「{g.fromCoupleName}」</div>
                    <div className="text-xs text-slate-500">{g.receivedAt}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">{g.content}</div>
                {g.message && <div className="mt-1 text-xs text-slate-500 italic">&ldquo;{g.message}&rdquo;</div>}
              </div>
            );
          })}
        </div>
      )}

      {openingGiftId && (
        <GiftUnboxModal
          gift={gifts.find((g) => g.id === openingGiftId)!}
          onFinish={() => {
            if (openingGiftId) openGift(openingGiftId);
            setOpeningGiftId(null);
          }}
        />
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

function GiftUnboxModal({ gift, onFinish }: { gift: any; onFinish: () => void }) {
  // 3 階段：shaking (搖動) → opening (盒子打開) → revealed (卡片浮出)
  const [phase, setPhase] = useState<"shaking" | "opening" | "revealed">("shaking");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1100);
    const t2 = setTimeout(() => setPhase("revealed"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const icon = gift.type === "card" ? "🎴" : gift.type === "coins" ? "💰" : "📦";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.6)", backdropFilter: "blur(6px)" }}
      onClick={phase === "revealed" ? onFinish : undefined}
    >
      <div className="max-w-sm w-full card p-7 text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* 背景光暈 */}
        <div className={`absolute inset-0 ${phase === "revealed" ? "opacity-100" : "opacity-40"} transition-opacity duration-700 pointer-events-none`}
             style={{ background: "radial-gradient(circle at center, rgba(255,212,71,0.35) 0%, transparent 60%)" }} />

        {phase === "shaking" && (
          <div className="relative py-6">
            <div className="text-8xl animate-shake inline-block">🎁</div>
            <div className="mt-4 text-empire-mute text-sm">搖一搖…裡面有東西 ✨</div>
          </div>
        )}

        {phase === "opening" && (
          <div className="relative py-6">
            <div className="text-8xl inline-block animate-pop">📦</div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-4xl animate-sparkle">✨</div>
            </div>
            <div className="mt-4 text-empire-ink font-bold">打開中…</div>
          </div>
        )}

        {phase === "revealed" && (
          <div className="relative py-4">
            <div className="text-7xl mb-3 inline-block animate-pop">{icon}</div>
            <div className="font-display font-black text-xl text-empire-ink">{gift.content}</div>
            <div className="mt-2 text-xs text-empire-mute">來自 {gift.fromCoupleName}</div>
            {gift.message && (
              <div className="mt-3 p-3 rounded-xl bg-empire-cream/80 text-sm italic text-empire-ink">
                &ldquo;{gift.message}&rdquo;
              </div>
            )}
            <button onClick={onFinish} className="mt-5 btn-primary px-6 py-2 font-bold">
              收下 💕
            </button>
          </div>
        )}
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
