"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "@/components/Toast";
import { shareInvite } from "@/lib/liff";

/**
 * /invite — 情侶邀情侶（病毒 loop）
 *
 * 機制：
 *  1. 使用者拿到「情侶邀請連結」— 裡面帶 ref=inviteCode
 *  2. 分享到 LINE / IG / FB 給其他情侶
 *  3. 新情侶透過連結進來 → 建立新王國 → 雙方各得獎勵
 *
 * 簡化版（不需新 migration）：
 *  - ref 用 couple.inviteCode（已有）
 *  - landing page 偵測 ?ref= 存 localStorage
 *  - 新 couple 建國後自動新手禮包
 *  - 推薦人獎勵由 Supabase function 或客服手動發（初期 TODO）
 */

export default function InvitePage() {
  const couple = useGame((s) => s.couple);
  const [copied, setCopied] = useState(false);

  const referralUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/?ref=${couple.inviteCode}`;
  }, [couple.inviteCode]);

  async function handleShare() {
    const ok = await shareInvite(couple.inviteCode, typeof window !== "undefined" ? window.location.origin : "");
    if (ok) toast.success("已開啟分享，選擇要傳給誰");
    else toast.error("分享失敗，請複製連結手動分享");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("已複製邀請連結");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("複製失敗");
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="情侶邀情侶"
        subtitle="每一對加入 = 雙方都有獎勵"
        emoji="💞"
        gradient="rose"
        stats={[
          { label: "王國", value: couple.name },
          { label: "邀請碼", value: couple.inviteCode },
        ]}
      />

      <div className="card p-6 text-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
        <div className="absolute -top-4 -right-4 text-8xl opacity-10">💞</div>
        <div className="relative">
          <div className="text-5xl mb-2">💌</div>
          <h2 className="font-display font-black text-xl text-empire-ink">
            找另一對情侶一起玩
          </h2>
          <p className="text-xs text-empire-mute mt-2 leading-relaxed">
            把連結傳給你最要好的另一對情侶朋友
            <br />他們進來建立王國 → 雙方都會有獎勵
          </p>
        </div>
      </div>

      {/* 邀請連結顯示 */}
      <div className="card p-4 space-y-3">
        <div>
          <div className="text-[11px] text-empire-mute font-bold">🔗 我的情侶邀請連結</div>
          <div className="mt-1.5 p-3 rounded-xl bg-empire-cream border border-empire-cloud break-all text-xs text-empire-ink font-mono">
            {referralUrl || "載入中..."}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`w-full py-2.5 rounded-full font-bold text-sm transition ${
            copied ? "bg-emerald-500 text-white" : "bg-empire-sky text-white hover:bg-empire-berry"
          }`}
        >
          {copied ? "✓ 已複製！" : "📋 複製連結"}
        </button>
        <button
          onClick={handleShare}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-empire-berry to-empire-sunshine text-white font-black shadow-md"
        >
          💌 用 LINE / IG 分享
        </button>
      </div>

      {/* 獎勵說明 */}
      <div className="card p-4 bg-gradient-to-br from-amber-50 to-rose-50 space-y-2">
        <div className="font-bold text-empire-ink flex items-center gap-1.5">🎁 邀請獎勵</div>
        <div className="space-y-1.5 text-[12px]">
          <Reward emoji="💞" title="被邀請情侶（新王國）" desc="新手禮包 +100 金 + 愛意 +50" />
          <Reward emoji="💎" title="你（推薦人）" desc="金 +200 + 稀有記憶卡 1 張" />
          <Reward emoji="👑" title="邀請滿 3 對情侶" desc="解鎖「帝國媒人」稱號 + SSR 記憶卡" />
          <Reward emoji="🌟" title="邀請滿 10 對情侶" desc="Premium 免費 1 個月" />
        </div>
        <div className="text-[10px] text-empire-mute pt-2 border-t border-empire-cloud">
          ⚠️ 獎勵需對方成功建立王國並達到 Lv.3 才會發放 · 防刷設計
        </div>
      </div>

      <div className="card p-4 bg-empire-mist text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">💡 什麼樣的朋友適合邀請？</div>
        <div>· 你們的伴侶閨蜜情侶（一起 double date 的那對）</div>
        <div>· 大學同學 / 同事的情侶</div>
        <div>· 想一起成長的兄弟 / 姐妹淘情侶</div>
        <div>· 新手情侶（想要學怎麼一起經營感情）</div>
      </div>

      <div className="text-center pb-6">
        <Link href="/dashboard" className="text-xs text-empire-sky underline">← 回主殿</Link>
      </div>
    </main>
  );
}

function Reward({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60">
      <span className="text-xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-empire-ink">{title}</div>
        <div className="text-[11px] text-empire-mute">{desc}</div>
      </div>
    </div>
  );
}
