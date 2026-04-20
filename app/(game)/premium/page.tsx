"use client";

import { useState } from "react";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { PREMIUM_PRICES, PREMIUM_PERKS } from "@/lib/premium";
import { useGame } from "@/lib/store";
import { toast } from "@/components/Toast";

export default function PremiumPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const [tier, setTier] = useState<"monthly" | "yearly">("monthly");

  const priceInfo = PREMIUM_PRICES[tier];
  const queenName = couple.queen.nickname;
  const princeName = couple.prince.nickname;

  async function handleSubscribe() {
    const ok = await toast.confirm(
      `確定訂閱 Premium ${priceInfo.label}？${priceInfo.perPerson} NTD（你方先扣，等對方也付完才解鎖全部功能）`,
      { okLabel: "確認訂閱", cancelLabel: "再看看" },
    );
    if (!ok) return;
    // TODO: 接金流（Stripe / 街口 / LINE Pay）
    // 本階段模擬：直接顯示「已模擬付款」
    toast.info(`🎟️ Premium 訂閱流程即將開放金流接入（目前模擬按鈕，${role === "queen" ? queenName : princeName} 已記錄）`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="情侶 Premium"
        subtitle="雙方共購才解鎖 · 共同承諾，共同擁有"
        emoji="👑"
        gradient="amber"
        stats={[
          { label: "價格", value: `${priceInfo.perPerson} NTD` },
          { label: "方案", value: priceInfo.label },
        ]}
      />

      <div className="card p-5 bg-gradient-to-br from-amber-50 via-rose-50 to-fuchsia-50 text-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 text-7xl opacity-20">👑</div>
        <div className="relative">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="font-display font-black text-2xl text-empire-ink">共購解鎖</h2>
          <p className="text-xs text-empire-mute mt-2 leading-relaxed">
            你訂 + TA 也訂 = 雙方一起擁有 Premium
            <br />只有一個人訂 → 只有你方看到小獎勵提示
            <br />兩人都訂 → 全部 6 大權益全開
          </p>
        </div>
      </div>

      {/* 方案切換 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTier("monthly")}
          className={`card p-4 text-center transition ${
            tier === "monthly" ? "ring-2 ring-empire-gold shadow-lg" : "opacity-70"
          }`}
        >
          <div className="text-2xl mb-1">📅</div>
          <div className="font-display font-black text-empire-ink">月費</div>
          <div className="text-xl font-black text-empire-gold mt-1">{PREMIUM_PRICES.monthly.perPerson}</div>
          <div className="text-[10px] text-empire-mute">NTD / 人 / 月</div>
        </button>
        <button
          onClick={() => setTier("yearly")}
          className={`card p-4 text-center transition relative ${
            tier === "yearly" ? "ring-2 ring-empire-gold shadow-lg" : "opacity-70"
          }`}
        >
          <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-empire-berry text-white text-[10px] font-black shadow">省 16%</div>
          <div className="text-2xl mb-1">🎁</div>
          <div className="font-display font-black text-empire-ink">年費</div>
          <div className="text-xl font-black text-empire-gold mt-1">{PREMIUM_PRICES.yearly.perPerson}</div>
          <div className="text-[10px] text-empire-mute">NTD / 人 / 年</div>
        </button>
      </div>

      {/* 權益清單 */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-empire-ink flex items-center gap-2">
          💎 Premium 6 大權益
        </h3>
        {PREMIUM_PERKS.map((perk) => (
          <div key={perk.title} className="flex items-start gap-3 p-2 rounded-lg bg-empire-cream/40">
            <div className="text-2xl">{perk.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-empire-ink text-sm">{perk.title}</div>
              <div className="text-[11px] text-empire-mute">{perk.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 訂閱按鈕 */}
      <button
        onClick={handleSubscribe}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 text-white font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition"
      >
        👑 我要訂閱 {priceInfo.perPerson} NTD
      </button>

      <div className="card p-4 bg-empire-cream/60 text-[11px] text-empire-mute space-y-1 leading-relaxed">
        <div className="font-bold text-empire-ink">ℹ️ 共購規則</div>
        <div>· 你訂完後，會通知 TA 也一起訂，兩人都付費才會解鎖全部權益</div>
        <div>· 等待期間你已享用專屬稱號 + 等候通知</div>
        <div>· 一方退訂 → 進入 7 天試用期保留資料 → 試用結束自動降為免費帳</div>
        <div>· 年費提前結束 → 按比例退款剩餘月份</div>
        <div>· 分手 / 王國封存 → 自動退訂，退款剩餘月份</div>
      </div>

      <div className="text-center pb-6">
        <Link href="/dashboard" className="text-xs text-empire-sky underline">← 回主殿</Link>
      </div>
    </main>
  );
}
