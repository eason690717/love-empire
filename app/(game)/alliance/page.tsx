"use client";

import { useGame } from "@/lib/store";
import { useState } from "react";
import { ISLAND_SHOP } from "@/lib/demoData";
import { ALLIANCE_TIERS, allianceTitleFor } from "@/lib/types";
import { PageBanner } from "@/components/PageBanner";

export default function AlliancePage() {
  const alliances = useGame((s) => s.alliances);
  const leaderboard = useGame((s) => s.leaderboard);
  const joinAlliance = useGame((s) => s.joinAlliance);
  const leaveAlliance = useGame((s) => s.leaveAlliance);
  const attackBoss = useGame((s) => s.attackBoss);
  const contributeAllianceItem = useGame((s) => s.contributeAllianceItem);
  const couple = useGame((s) => s.couple);
  const [flash, setFlash] = useState<string | null>(null);
  const [shopOpen, setShopOpen] = useState(false);

  const myAlliance = alliances.find((a) => a.members.includes("me"));
  const otherAlliances = alliances.filter((a) => !a.members.includes("me"));

  const getMember = (id: string) => leaderboard.find((c) => c.id === id);

  // 聯盟稱號：取成員總等級 (含自己)
  const myAllianceTitle = myAlliance
    ? allianceTitleFor(
        myAlliance.members.reduce((sum, id) => {
          if (id === "me") return sum + couple.kingdomLevel;
          const m = getMember(id);
          return sum + (m?.kingdomLevel ?? 0);
        }, 0),
      )
    : null;

  const [combatFx, setCombatFx] = useState<{ damage: number; crit: boolean; shake: boolean; kill: boolean } | null>(null);

  const handleAttack = (allianceId: string) => {
    if (couple.loveIndex < 10) { setFlash("愛意指數不足 10，先去完成任務回血"); setTimeout(() => setFlash(null), 2000); return; }
    const baseDamage = 20 + Math.floor(Math.random() * 40);
    const isCrit = Math.random() < 0.15; // 15% 暴擊
    const damage = isCrit ? baseDamage * 2 : baseDamage;
    const alliance = myAlliance;
    const willKill = !!(alliance?.bossHp && alliance.bossHp - damage <= 0);

    attackBoss(allianceId, damage);
    setCombatFx({ damage, crit: isCrit, shake: true, kill: willKill });
    setTimeout(() => setCombatFx((fx) => fx ? { ...fx, shake: false } : null), 600);
    setTimeout(() => setCombatFx(null), willKill ? 2400 : 1400);
  };

  return (
    <div className="space-y-4">
      <PageBanner
        title="情侶聯盟"
        subtitle="2-5 對情侶組隊 · 週任務 · BOSS 戰 · 共同小窩"
        emoji="🤝"
        gradient="amber"
        stats={[
          { label: "所屬", value: myAlliance?.name ?? "—" },
          { label: "稱號", value: myAllianceTitle?.title ?? "—" },
        ]}
      />

      {myAlliance ? (
        <>
          <div className="card p-5 bg-gradient-to-br from-empire-cream/60 to-white">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-empire-mute">我的聯盟</div>
                <h3 className="text-xl font-bold mt-0.5 truncate">{myAlliance.name}</h3>
                {myAllianceTitle && (
                  <span className="mt-1 inline-block tag bg-empire-sunshine/30 border-empire-sunshine/60 text-empire-ink">
                    {myAllianceTitle.emoji} {myAllianceTitle.title}
                  </span>
                )}
                <p className="text-sm text-empire-mute mt-1">{myAlliance.description}</p>
              </div>
              <div className="text-4xl">🏛️</div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{myAlliance.questTitle}</span>
                <span className="text-empire-mute">
                  {myAlliance.weeklyProgress} / {myAlliance.weeklyTarget}
                </span>
              </div>
              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.min(100, (myAlliance.weeklyProgress / myAlliance.weeklyTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {myAlliance.bossHp != null && myAlliance.bossMaxHp && (
            <div className="card p-5">
              <h3 className="font-bold mb-3">🐉 聯盟 BOSS 戰</h3>
              <div className={`rounded-2xl bg-gradient-to-br from-rose-100 via-amber-50 to-amber-100 p-6 text-center relative overflow-hidden ${combatFx?.shake ? "animate-shake" : ""}`}>
                {combatFx?.kill && (
                  <div className="absolute inset-0 bg-white z-20 animate-pop pointer-events-none flex items-center justify-center">
                    <div className="text-5xl font-display font-black text-empire-berry">擊殺！</div>
                  </div>
                )}
                <div className={`text-7xl ${myAlliance.bossHp === 0 ? "grayscale opacity-60" : "animate-bob"} ${combatFx ? "scale-110 transition-transform" : ""}`}>
                  {myAlliance.bossHp === 0 ? "💀" : "🐲"}
                </div>
                {/* 傷害數字飛出 */}
                {combatFx && (
                  <div
                    className="absolute left-1/2 top-1/3 -translate-x-1/2 pointer-events-none z-10 animate-pop"
                    style={{ animation: "damage-float 1.2s ease-out forwards" }}
                  >
                    <div className={`font-display font-black ${combatFx.crit ? "text-empire-crimson text-6xl" : "text-empire-sunshine text-4xl"} text-shadow-soft`}>
                      -{combatFx.damage}
                    </div>
                    {combatFx.crit && (
                      <div className="text-xs text-empire-crimson font-black tracking-widest mt-1">⚡ CRITICAL!</div>
                    )}
                  </div>
                )}
                <div className="mt-2 font-bold text-lg">{myAlliance.bossName}</div>

                <div className="mt-3 bar-bg h-4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(myAlliance.bossHp / myAlliance.bossMaxHp) * 100}%`,
                      background: "linear-gradient(90deg, #ff4f60, #ffd447)",
                    }}
                  />
                </div>
                <div className="text-xs text-empire-mute mt-1">
                  HP {myAlliance.bossHp} / {myAlliance.bossMaxHp}
                </div>

                {flash && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-2xl font-black text-empire-crimson text-shadow-soft animate-pop">
                      {flash}
                    </div>
                  </div>
                )}

                {myAlliance.bossHp > 0 ? (
                  <button
                    onClick={() => handleAttack(myAlliance.id)}
                    className="mt-4 btn-pink px-6 py-3 font-bold"
                  >
                    ⚔️ 攻擊 (消耗 10 愛意)
                  </button>
                ) : (
                  <div className="mt-4 inline-block px-4 py-2 rounded-full bg-empire-sunshine/30 text-empire-ink font-bold">
                    ✨ 已擊敗！週五凌晨重生
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 聯盟共同小窩 */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">🏡 聯盟共同小窩</h3>
              <button onClick={() => setShopOpen((v) => !v)} className="btn-ghost px-3 py-1.5 text-xs">
                {shopOpen ? "關閉" : "🏗️ 捐家具"}
              </button>
            </div>
            <div
              className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-white"
              style={{ background: "linear-gradient(180deg, #c9e6f8 0%, #e8f5ce 55%, #a6d18a 100%)" }}
            >
              <div className="absolute top-3 right-4 text-2xl">☀️</div>
              <div className="absolute top-4 left-4 text-xl opacity-80">☁️</div>
              {(myAlliance.sharedIsland ?? []).map((item) => (
                <div
                  key={item.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  title={item.label}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
            <p className="text-xs text-empire-mute mt-2 text-center">
              所有聯盟成員可貢獻家具（自己的金幣、全員共同欣賞）
            </p>

            {shopOpen && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ISLAND_SHOP.slice(0, 9).map((item) => {
                  const afford = couple.coins >= item.price;
                  return (
                    <button
                      key={item.id}
                      disabled={!afford}
                      onClick={() => contributeAllianceItem(myAlliance.id, item.id, item.label, item.emoji, item.price)}
                      className={`p-2 rounded-xl border text-center ${
                        afford ? "border-empire-sky hover:bg-empire-cloud" : "border-slate-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-2xl">{item.emoji}</div>
                      <div className="text-[10px] font-medium mt-0.5 truncate">{item.label}</div>
                      <div className="text-[10px] text-empire-gold">{item.price} 金</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">聯盟成員 ({myAlliance.members.length})</h3>
              <button
                onClick={() => { if (confirm(`確定離開「${myAlliance.name}」？共同小窩的貢獻會留下。`)) leaveAlliance(myAlliance.id); }}
                className="text-xs text-empire-mute hover:text-rose-600"
              >
                離開聯盟
              </button>
            </div>
            {/* 本週貢獻榜 (以 weeklyTasks 排序) */}
            {(() => {
              const ranked = myAlliance.members.map((id) => {
                if (id === "me") return { id, name: couple.name, emoji: "🌱", tasks: 0, isMe: true, lv: couple.kingdomLevel, streak: 0 };
                const c = getMember(id);
                return c ? { id, name: c.name, emoji: c.emoji, tasks: c.weeklyTasks, isMe: false, lv: c.kingdomLevel, streak: c.streak } : null;
              }).filter(Boolean) as any[];
              ranked.sort((a, b) => b.tasks - a.tasks);
              return (
                <div className="space-y-2">
                  {ranked.map((m, i) => (
                    <div
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-empire-mist ${m.isMe ? "ring-2 ring-empire-pink/40" : ""}`}
                    >
                      <div className="text-xs font-black text-empire-mute w-6 text-center">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </div>
                      <div className="text-2xl">{m.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">
                          {m.name}
                          {m.isMe && <span className="ml-2 text-xs text-empire-berry">(我們)</span>}
                        </div>
                        <div className="text-xs text-empire-mute">Lv.{m.lv}{m.streak ? ` · 🔥${m.streak} 天` : ""}</div>
                      </div>
                      <div className="text-xs text-empire-gold font-semibold">本週 {m.tasks} 任務</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* 聯盟公告 — 目前為固定歡迎詞，未來可改後端同步 */}
          <div className="card p-4">
            <h3 className="font-bold mb-2 text-sm">📣 聯盟公告</h3>
            <p className="text-sm text-empire-mute leading-relaxed">
              歡迎加入「{myAlliance.name}」！本週目標 <b className="text-empire-ink">{myAlliance.questTitle}</b> —
              每對情侶貢獻一點，BOSS 擊敗後全員獲得「限定紀念卡」。記得週五凌晨前攻擊幾輪。
            </p>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-5xl">🌱</div>
          <h3 className="font-bold mt-2">你們還沒加入聯盟</h3>
          <p className="text-sm text-empire-mute mt-1">加入下方聯盟，一起升級！</p>
        </div>
      )}

      <div>
        <h3 className="font-bold mb-2 text-sm">🔍 瀏覽其他聯盟</h3>
        <div className="space-y-2">
          {otherAlliances.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold truncate">{a.name}</div>
                  <div className="text-xs text-empire-mute">{a.description}</div>
                  <div className="text-xs text-empire-mute mt-1">
                    {a.members.length} 對情侶 · 本週進度 {a.weeklyProgress}/{a.weeklyTarget}
                  </div>
                </div>
                <button
                  onClick={() => joinAlliance(a.id)}
                  className="btn-primary px-4 py-1.5 text-sm shrink-0 ml-2"
                >
                  加入
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-empire-mute text-center pb-2">
        建立新聯盟功能將在下一版開放 · 目前可自由加入既有聯盟
      </p>
    </div>
  );
}
