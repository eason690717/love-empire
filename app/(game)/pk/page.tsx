"use client";

import { useGame } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";

type Phase = "pick" | "charging" | "reveal" | "done";

export default function PkPage() {
  const couple = useGame((s) => s.couple);
  const streak = useGame((s) => s.streak);
  const leaderboard = useGame((s) => s.leaderboard);
  const addMoment = useGame((s) => s.addMoment);
  const recordPkWin = useGame((s) => s.recordPkWin);
  const checkAchievements = useGame((s) => s.checkAchievements);
  const pkWins = useGame((s) => s.pkWins);

  const searchParams = useSearchParams();
  const initialTarget = searchParams.get("target") ?? "";

  const [opponent, setOpponent] = useState<string>(initialTarget);
  const [phase, setPhase] = useState<Phase>("pick");
  const [result, setResult] = useState<{
    winner: "me" | "them" | "draw";
    myScore: number;
    theirScore: number;
    coinReward: number;
    loveReward: number;
  } | null>(null);

  const others = leaderboard.filter((c) => !c.isSelf);
  const opp = leaderboard.find((c) => c.id === opponent);

  // 從 URL ?target= 帶入時，跳到選好的狀態
  useEffect(() => {
    if (initialTarget) setOpponent(initialTarget);
  }, [initialTarget]);

  const handleFight = () => {
    if (!opp) return;
    setPhase("charging");
    setResult(null);
    // 蓄力 1.2s → 揭曉
    setTimeout(() => {
      // 公式：loveIndex + streak*10 + kingdomLevel*20 + random(0-120)
      const myScore = Math.floor(couple.loveIndex + streak.current * 10 + couple.kingdomLevel * 20 + Math.random() * 120);
      const theirScore = Math.floor(opp.loveIndex + opp.streak * 10 + opp.kingdomLevel * 20 + Math.random() * 120);
      const winner = myScore > theirScore ? "me" : theirScore > myScore ? "them" : "draw";

      let coinReward = 0;
      let loveReward = 0;
      if (winner === "me") {
        coinReward = 30 + Math.floor(Math.random() * 40); // 30-70
        loveReward = 15;
        recordPkWin(); // 此 action 已會加金幣 + love
        addMoment({
          type: "custom",
          title: `PK 贏了 ${opp.name}！`,
          subtitle: `${myScore} : ${theirScore} · 霸主地位穩固 ⚔️`,
          emoji: "🏆",
        });
      } else if (winner === "draw") {
        coinReward = 10;
        // 平手給一點安慰獎
        useGame.setState((s) => ({ couple: { ...s.couple, coins: s.couple.coins + 10 } }));
      }
      checkAchievements();
      setResult({ winner, myScore, theirScore, coinReward, loveReward });
      setPhase("reveal");
      setTimeout(() => setPhase("done"), 800);
    }, 1200);
  };

  const reset = () => {
    setPhase("pick");
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <PageBanner
        title="情侶 PK"
        subtitle={`已勝 ${pkWins} 場 · 愛意 + 連擊 + 等級 + 運氣 決定勝負`}
        emoji="⚔️"
        gradient="rose"
        stats={[
          { label: "我方愛意", value: couple.loveIndex.toLocaleString() },
          { label: "連擊", value: `${streak.current}天` },
          { label: "等級", value: `Lv.${couple.kingdomLevel}` },
        ]}
      />

      {phase === "pick" && (
        <>
          <div className="card p-5">
            <h3 className="font-bold mb-3">選一對情侶挑戰</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {others.map((c) => {
                const powerHint = c.loveIndex + c.streak * 10 + c.kingdomLevel * 20;
                const myPower = couple.loveIndex + streak.current * 10 + couple.kingdomLevel * 20;
                const advantage = myPower - powerHint;
                const tier = advantage > 300 ? { label: "優勢", color: "bg-emerald-100 text-emerald-700" }
                  : advantage > -300 ? { label: "五五波", color: "bg-amber-100 text-amber-700" }
                  : { label: "劣勢", color: "bg-rose-100 text-rose-700" };
                return (
                  <button
                    key={c.id}
                    onClick={() => setOpponent(c.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 border-2 text-left transition ${
                      opponent === c.id ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white hover:border-empire-sky/50"
                    }`}
                  >
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{c.name}</div>
                      <div className="text-xs text-empire-mute">Lv.{c.kingdomLevel} · 愛意 {c.loveIndex.toLocaleString()} · 🔥{c.streak}</div>
                    </div>
                    <span className={`tag text-[10px] ${tier.color} border-0`}>{tier.label}</span>
                    {opponent === c.id && <span className="text-empire-berry font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFight}
              disabled={!opponent}
              className="mt-4 btn-pink w-full py-3.5 font-bold text-lg disabled:opacity-40"
            >
              🔥 開戰
            </button>
            <p className="text-[10px] text-empire-mute text-center mt-2">勝者 +30~70 金 + 15 愛意 · 平手 +10 金 · 敗者不損失</p>
          </div>

          {opp && (
            <div className="card p-4">
              <div className="text-xs text-empire-mute mb-2">實力對比預覽</div>
              <PowerBar label={couple.name} power={couple.loveIndex + streak.current * 10 + couple.kingdomLevel * 20} color="bg-empire-berry" />
              <div className="h-2" />
              <PowerBar label={opp.name} power={opp.loveIndex + opp.streak * 10 + opp.kingdomLevel * 20} color="bg-empire-sky" />
            </div>
          )}
        </>
      )}

      {phase === "charging" && opp && (
        <div className="card p-8 text-center bg-gradient-to-br from-rose-100/60 to-amber-100/60">
          <div className="flex items-center justify-center gap-4 text-5xl mb-4">
            <span className="animate-bounce">{couple.name[0] ?? "💞"}</span>
            <span className="text-3xl animate-pulse">VS</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>{opp.emoji}</span>
          </div>
          <div className="text-lg font-bold font-display">蓄力中…</div>
          <div className="mt-3 h-2 bg-empire-cloud rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-empire-berry to-empire-sunshine animate-[charge_1.2s_ease-out]" style={{ width: "100%" }} />
          </div>
        </div>
      )}

      {(phase === "reveal" || phase === "done") && result && opp && (
        <div className={`card p-6 text-center ${result.winner === "me" ? "ring-2 ring-empire-sunshine shine-ssr" : ""}`}>
          <div className="text-7xl mb-2 animate-bounce">
            {result.winner === "me" ? "🏆" : result.winner === "them" ? "💔" : "🤝"}
          </div>
          <h3 className="font-display text-3xl font-black">
            {result.winner === "me" ? "勝利！" : result.winner === "them" ? "再接再厲" : "平手"}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className={`p-3 rounded-xl ${result.winner === "me" ? "bg-emerald-50 ring-2 ring-emerald-400" : "bg-empire-mist"}`}>
              <div className="text-empire-mute text-xs">{couple.name}</div>
              <div className="font-display text-2xl font-black">{result.myScore}</div>
            </div>
            <div className={`p-3 rounded-xl ${result.winner === "them" ? "bg-rose-50 ring-2 ring-rose-400" : "bg-empire-mist"}`}>
              <div className="text-empire-mute text-xs">{opp.name}</div>
              <div className="font-display text-2xl font-black">{result.theirScore}</div>
            </div>
          </div>
          {(result.coinReward > 0 || result.loveReward > 0) && (
            <div className="mt-4 flex justify-center gap-3 text-sm font-bold">
              {result.coinReward > 0 && (
                <span className="px-3 py-1.5 rounded-full bg-empire-sunshine/20 text-empire-gold">💰 +{result.coinReward}</span>
              )}
              {result.loveReward > 0 && (
                <span className="px-3 py-1.5 rounded-full bg-empire-berry/20 text-empire-berry">💞 +{result.loveReward}</span>
              )}
            </div>
          )}
          {phase === "done" && (
            <button onClick={reset} className="mt-5 btn-primary px-6 py-2 text-sm font-bold">
              再來一戰
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PowerBar({ label, power, color }: { label: string; power: number; color: string }) {
  const pct = Math.min(100, (power / 3000) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold">{label}</span>
        <span className="text-empire-mute">{power.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-empire-cloud rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
