"use client";

import { useGame } from "@/lib/store";
import { useState } from "react";
import { PageBanner } from "@/components/PageBanner";

export default function ExchangePage() {
  const rewards = useGame((s) => s.rewards);
  const couple = useGame((s) => s.couple);
  const redeem = useGame((s) => s.redeem);
  const [just, setJust] = useState<string | null>(null);

  const affordableCount = rewards.filter((r) => couple.coins >= r.cost).length;

  return (
    <div className="space-y-4">
      <PageBanner
        title="國庫兌換中心"
        subtitle="累積金幣 → 兌換真實獎勵 💞"
        emoji="💰"
        gradient="sunshine"
        stats={[
          { label: "我的金幣", value: couple.coins.toLocaleString() },
          { label: "可兌換", value: `${affordableCount}/${rewards.length}` },
        ]}
      />

      <div className="space-y-3">
        {rewards.map((r) => {
          const afford = couple.coins >= r.cost;
          return (
            <div key={r.id} className="card p-4 flex items-center gap-4">
              <div className="text-4xl">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{r.title}</div>
                <div className="text-empire-gold font-semibold text-sm mt-0.5">
                  {r.cost} 金幣
                </div>
              </div>
              <button
                onClick={() => {
                  redeem(r.id);
                  setJust(r.id);
                  setTimeout(() => setJust(null), 1500);
                }}
                disabled={!afford}
                className={`btn px-5 py-2 font-semibold ${
                  afford ? "bg-empire-sky text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {just === r.id ? "已入寶庫 ✓" : "兌換"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
