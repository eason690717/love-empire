"use client";

import { useGame } from "@/lib/store";
import { useMemo, useState } from "react";
import { PageBanner } from "@/components/PageBanner";
import { REWARD_CATEGORY_LABELS, type RewardCategory } from "@/lib/types";
import { toast } from "@/components/Toast";

const CATEGORY_ORDER: RewardCategory[] = ["daily", "date", "intimacy", "control", "indulge", "cash"];

export default function ExchangePage() {
  const rewards = useGame((s) => s.rewards);
  const couple = useGame((s) => s.couple);
  const redeem = useGame((s) => s.redeem);
  const showAdultRewards = useGame((s) => s.showAdultRewards);
  const setShowAdultRewards = useGame((s) => s.setShowAdultRewards);

  const [tab, setTab] = useState<RewardCategory | "all">("all");
  const [just, setJust] = useState<string | null>(null);
  const [confirmAdult, setConfirmAdult] = useState<string | null>(null);

  // 過濾：成人向預設隱藏
  const visibleRewards = useMemo(() => {
    return rewards.filter((r) => showAdultRewards || !r.adult);
  }, [rewards, showAdultRewards]);

  const filtered = useMemo(() => {
    if (tab === "all") return visibleRewards;
    return visibleRewards.filter((r) => r.category === tab);
  }, [visibleRewards, tab]);

  const affordableCount = visibleRewards.filter((r) => couple.coins >= r.cost).length;

  const doRedeem = (id: string) => {
    const reward = visibleRewards.find((r) => r.id === id);
    if (!reward) return;
    if (couple.coins < reward.cost) {
      toast.error(`金幣不足 — 需 ${reward.cost}，目前 ${couple.coins}`);
      return;
    }
    redeem(id);
    toast.success(`🎁 已兌換「${reward.title}」 · -${reward.cost} 金`);
    setJust(id);
    setTimeout(() => setJust(null), 1500);
  };

  const handleClick = (id: string, isAdult: boolean) => {
    if (isAdult) {
      // 成人向第一次兌換需確認
      setConfirmAdult(id);
      return;
    }
    doRedeem(id);
  };

  return (
    <div className="space-y-4">
      <PageBanner
        title="國庫兌換中心"
        subtitle="累積金幣 → 兌換真實獎勵 💞"
        emoji="💰"
        gradient="sunshine"
        stats={[
          { label: "我的金幣", value: couple.coins.toLocaleString() },
          { label: "可兌換", value: `${affordableCount}/${visibleRewards.length}` },
          { label: "種類", value: visibleRewards.length },
        ]}
      />

      {/* 提示橫幅 */}
      <div className="card p-3 bg-empire-cream/60 border border-empire-gold/30 text-xs text-empire-ink">
        🎯 完成任務 / 儀式 / 問答 / 人生清單 → 累積金幣 → 兌換真實獎勵
        <br />💡 兌換後券會進入「我的寶庫」，由情侶當天承諾兌現
      </div>

      {/* 分類 tab */}
      <div className="card p-2 flex gap-1 overflow-x-auto">
        <CategoryTab active={tab === "all"} onClick={() => setTab("all")}>
          🎁 全部 ({visibleRewards.length})
        </CategoryTab>
        {CATEGORY_ORDER.map((cat) => {
          const info = REWARD_CATEGORY_LABELS[cat];
          const count = visibleRewards.filter((r) => r.category === cat).length;
          if (count === 0) return null;
          return (
            <CategoryTab key={cat} active={tab === cat} onClick={() => setTab(cat)}>
              {info.emoji} {info.label} ({count})
            </CategoryTab>
          );
        })}
      </div>

      {/* 成人內容開關 */}
      <div className={`card p-3 flex items-center gap-3 ${showAdultRewards ? "border-2 border-empire-berry/40" : ""}`}>
        <div className="text-2xl">🌶️</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-empire-ink">成人親密互動獎勵</div>
          <div className="text-[11px] text-empire-mute">
            {showAdultRewards ? "已開啟 — 親密互動類完整顯示" : "已隱藏 — 點開啟可看到 4 個額外親密獎勵"}
          </div>
        </div>
        <button
          onClick={() => setShowAdultRewards(!showAdultRewards)}
          className={`relative w-12 h-6 rounded-full transition ${showAdultRewards ? "bg-empire-berry" : "bg-empire-cloud"}`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
              showAdultRewards ? "left-6" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {/* 獎勵清單 */}
      {tab === "all" ? (
        CATEGORY_ORDER.map((cat) => {
          const items = filtered.filter((r) => r.category === cat);
          if (items.length === 0) return null;
          const info = REWARD_CATEGORY_LABELS[cat];
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-lg">{info.emoji}</span>
                <h3 className="font-bold text-empire-ink">{info.label}</h3>
                <span className="text-xs text-empire-mute">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((r) => (
                  <RewardCard
                    key={r.id}
                    reward={r}
                    afford={couple.coins >= r.cost}
                    just={just === r.id}
                    onClick={() => handleClick(r.id, !!r.adult)}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <RewardCard
              key={r.id}
              reward={r}
              afford={couple.coins >= r.cost}
              just={just === r.id}
              onClick={() => handleClick(r.id, !!r.adult)}
            />
          ))}
        </div>
      )}

      {confirmAdult && (() => {
        const r = rewards.find((x) => x.id === confirmAdult);
        if (!r) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setConfirmAdult(null)}
          >
            <div className="max-w-sm w-full card p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-5xl mb-3">{r.icon}</div>
              <div className="font-bold text-empire-ink">{r.title}</div>
              <div className="text-empire-gold font-bold mt-1">{r.cost} 金幣</div>
              {r.description && (
                <div className="text-xs text-empire-mute mt-2 italic">「{r.description}」</div>
              )}
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-xs text-rose-700">
                🌶️ 親密向獎勵 · 兌換後雙方需取得共識才執行 · 任何時候都可說不
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setConfirmAdult(null)} className="btn-ghost flex-1 py-2 text-sm">取消</button>
                <button
                  onClick={() => { doRedeem(r.id); setConfirmAdult(null); }}
                  className="btn-pink flex-1 py-2 font-bold"
                >
                  確認兌換
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function CategoryTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
        active ? "bg-empire-sky text-white" : "text-empire-mute hover:bg-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}

function RewardCard({
  reward, afford, just, onClick,
}: {
  reward: { id: string; title: string; cost: number; icon: string; description?: string; adult?: boolean };
  afford: boolean;
  just: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`card p-3 flex items-center gap-3 ${reward.adult ? "ring-1 ring-empire-berry/30" : ""}`}>
      <div className="text-3xl shrink-0">{reward.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <div className="font-bold text-sm text-empire-ink truncate">{reward.title}</div>
          {reward.adult && <span className="text-[9px] px-1 rounded bg-rose-100 text-rose-600 font-bold">18+</span>}
        </div>
        {reward.description && (
          <div className="text-[10px] text-empire-mute truncate italic">{reward.description}</div>
        )}
        <div className="text-empire-gold font-bold text-xs mt-0.5">💰 {reward.cost.toLocaleString()}</div>
      </div>
      <button
        onClick={onClick}
        disabled={!afford}
        className={`px-4 py-2 text-xs font-bold rounded-lg shrink-0 ${
          afford ? "bg-empire-sky text-white hover:brightness-110" : "bg-empire-cloud text-empire-mute"
        }`}
      >
        {just ? "✓ 入寶庫" : afford ? "兌換" : "金幣不足"}
      </button>
    </div>
  );
}
