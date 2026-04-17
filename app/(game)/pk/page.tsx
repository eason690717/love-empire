"use client";

import { useGame } from "@/lib/store";
import { useState } from "react";

export default function PkPage() {
  const couple = useGame((s) => s.couple);
  const leaderboard = useGame((s) => s.leaderboard);
  const addMoment = useGame((s) => s.addMoment);
  const recordPkWin = useGame((s) => s.recordPkWin);
  const checkAchievements = useGame((s) => s.checkAchievements);
  const [opponent, setOpponent] = useState<string>("");
  const [result, setResult] = useState<{ winner: "me" | "them" | "draw"; myScore: number; theirScore: number } | null>(null);

  const others = leaderboard.filter((c) => !c.isSelf);

  const handleFight = () => {
    const opp = leaderboard.find((c) => c.id === opponent);
    if (!opp) return;
    // 簡化公式：愛意指數 + 連擊*10 + 隨機骰 (0-100)
    const myScore = Math.floor(couple.loveIndex + 0 * 10 + Math.random() * 100);
    const theirScore = Math.floor(opp.loveIndex + opp.streak * 10 + Math.random() * 100);
    const winner = myScore > theirScore ? "me" : theirScore > myScore ? "them" : "draw";
    setResult({ winner, myScore, theirScore });
    if (winner === "me") {
      recordPkWin();
      addMoment({
        type: "custom",
        title: `PK 贏了 ${opp.name}！`,
        subtitle: `${myScore} : ${theirScore}，霸主地位穩固 ⚔️`,
        emoji: "🏆",
      });
    }
    checkAchievements();
  };

  return (
    <div className="space-y-4">
      <div className="card p-5 bg-gradient-to-br from-rose-100/60 to-amber-100/60">
        <h2 className="font-bold">⚔️ 情侶 PK</h2>
        <p className="text-xs text-empire-mute mt-1">
          跟另一對情侶比愛意指數與連擊 · 勝者獲動態發文，敗者獲取經驗 (敗者掉 0 金幣)
        </p>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">選一對情侶挑戰</h3>
        <div className="space-y-2">
          {others.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => setOpponent(c.id)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 border-2 text-left transition ${
                opponent === c.id ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white hover:border-empire-sky/50"
              }`}
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{c.name}</div>
                <div className="text-xs text-empire-mute">Lv.{c.kingdomLevel} · 愛意 {c.loveIndex.toLocaleString()} · 🔥{c.streak}</div>
              </div>
              {opponent === c.id && <span className="text-empire-berry font-bold">✓</span>}
            </button>
          ))}
        </div>

        <button
          onClick={handleFight}
          disabled={!opponent}
          className="mt-4 btn-pink w-full py-3.5 font-bold"
        >
          🔥 開戰
        </button>
      </div>

      {result && (
        <div className={`card p-6 text-center ${
          result.winner === "me" ? "ring-2 ring-empire-sunshine shine-ssr" : ""
        }`}>
          <div className="text-6xl">
            {result.winner === "me" ? "🏆" : result.winner === "them" ? "💔" : "🤝"}
          </div>
          <h3 className="mt-2 font-display text-2xl font-black">
            {result.winner === "me" ? "勝利！" : result.winner === "them" ? "再接再厲" : "平手"}
          </h3>
          <div className="mt-3 text-sm text-empire-mute">
            <b className="text-empire-ink">{couple.name}</b> {result.myScore}
            <span className="mx-2">:</span>
            {result.theirScore} <b className="text-empire-ink">{leaderboard.find((c) => c.id === opponent)?.name}</b>
          </div>
        </div>
      )}
    </div>
  );
}
