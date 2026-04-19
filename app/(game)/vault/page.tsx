"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { REWARD_CATEGORY_LABELS, type RewardCategory } from "@/lib/types";

type Redemption = ReturnType<typeof useGame.getState>["redemptions"][number];

export default function VaultPage() {
  const redemptions = useGame((s) => s.redemptions);
  const couple = useGame((s) => s.couple);
  const useRedemption = useGame((s) => s.useRedemption);

  const [useTarget, setUseTarget] = useState<Redemption | null>(null);
  const [filter, setFilter] = useState<"all" | "unused" | "used">("unused");

  const unused = redemptions.filter((r) => r.status === "unused");
  const used = redemptions.filter((r) => r.status === "used");

  const list = useMemo(() => {
    if (filter === "unused") return unused;
    if (filter === "used") return used;
    return redemptions;
  }, [filter, redemptions, unused, used]);

  return (
    <div className="space-y-4">
      <PageBanner
        title="我的寶庫"
        subtitle={`${unused.length} 張待兌現 · 伴侶當天承諾兌現`}
        emoji="🎁"
        gradient="rose"
        stats={[
          { label: "待使用", value: unused.length },
          { label: "已使用", value: used.length },
          { label: "總兌換", value: redemptions.length },
        ]}
      />

      {redemptions.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-2">🎁</div>
          <div className="font-bold text-empire-ink">寶庫還是空的</div>
          <p className="text-sm text-empire-mute mt-1">
            完成任務累積金幣，去「國庫兌換中心」換成真實獎勵
          </p>
        </div>
      ) : (
        <>
          {/* 篩選 */}
          <div className="card p-2 flex gap-1">
            <FilterBtn active={filter === "unused"} onClick={() => setFilter("unused")}>
              待使用 ({unused.length})
            </FilterBtn>
            <FilterBtn active={filter === "used"} onClick={() => setFilter("used")}>
              已使用 ({used.length})
            </FilterBtn>
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
              全部 ({redemptions.length})
            </FilterBtn>
          </div>

          {/* 券列表 */}
          <div className="space-y-3">
            {list.map((r) => (
              <TicketCard
                key={r.id}
                redemption={r}
                redeemerName={
                  r.redeemedBy === "queen" ? couple.queen.nickname : couple.prince.nickname
                }
                onUse={() => setUseTarget(r)}
              />
            ))}
            {list.length === 0 && (
              <p className="card p-6 text-center text-empire-mute text-sm">
                {filter === "unused" ? "所有券都用完了，再去賺更多金幣！" : "這個分類還沒有"}
              </p>
            )}
          </div>
        </>
      )}

      {useTarget && (
        <UseConfirmModal
          redemption={useTarget}
          onConfirm={(note) => {
            useRedemption(useTarget.id, note);
            setUseTarget(null);
          }}
          onClose={() => setUseTarget(null)}
        />
      )}
    </div>
  );
}

function TicketCard({
  redemption, redeemerName, onUse,
}: {
  redemption: Redemption;
  redeemerName: string;
  onUse: () => void;
}) {
  const { icon, category, rewardTitle, cost, createdAt, status, usedAt, usedNote, adult } = redemption;
  const info = category ? REWARD_CATEGORY_LABELS[category as RewardCategory] : null;
  const used = status === "used";
  const tintColor = info?.color ?? "#ff8eae";

  return (
    <div
      className={`relative card p-0 overflow-hidden ${used ? "opacity-70" : ""}`}
      style={{
        background: used ? undefined : `linear-gradient(90deg, ${tintColor}26 0%, transparent 30%)`,
      }}
    >
      {/* 左側色條（票券根） */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ background: tintColor }}
      />
      {/* 虛線撕票感 */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "80px",
          borderLeft: "2px dashed #d1d5db",
        }}
      />

      <div className="pl-5 pr-4 py-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
          {icon ?? "🎁"}
        </div>
        <div className="flex-1 min-w-0 pl-3">
          <div className="flex items-center gap-1 flex-wrap">
            <div className={`font-bold text-sm ${used ? "text-empire-mute line-through" : "text-empire-ink"}`}>
              {rewardTitle}
            </div>
            {adult && !used && (
              <span className="text-[9px] px-1 rounded bg-rose-100 text-rose-600 font-bold">18+</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-empire-mute mt-0.5">
            {info && <span>{info.emoji} {info.label}</span>}
            <span>·</span>
            <span>💰 {cost}</span>
            <span>·</span>
            <span>{redeemerName} 兌換</span>
          </div>
          <div className="text-[10px] text-empire-mute mt-0.5">
            {used ? (
              <>✓ {usedAt ?? "已使用"} 完成 {usedNote && <span className="italic">— &ldquo;{usedNote}&rdquo;</span>}</>
            ) : (
              <>兌換於 {createdAt} · 等待使用</>
            )}
          </div>
        </div>
        {!used && (
          <button
            onClick={onUse}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-empire-pink text-white hover:brightness-110 shrink-0 shadow-sm"
          >
            使用
          </button>
        )}
      </div>
    </div>
  );
}

function UseConfirmModal({
  redemption, onConfirm, onClose,
}: {
  redemption: Redemption;
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const info = redemption.category
    ? REWARD_CATEGORY_LABELS[redemption.category as RewardCategory]
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-sm w-full card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-6xl mb-2">{redemption.icon ?? "🎁"}</div>
          <div className="font-display font-black text-xl text-empire-ink">
            {redemption.rewardTitle}
          </div>
          {info && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: info.color + "33", color: info.color }}>
              {info.emoji} {info.label}
            </span>
          )}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <b>⚠️ 確認使用？</b>
          <div className="mt-1">
            點確認 = 伴侶已兌現這張券。標記為已使用後<b>無法取消</b>。
            建議雙方當面或視訊確認後再按。
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs text-empire-mute block mb-1">留下心得（可選）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 60))}
            placeholder="例：超棒的按摩，週六在家完成 💕"
            rows={2}
            className="w-full border-2 border-empire-cloud rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
            maxLength={60}
          />
          <div className="text-[10px] text-right text-empire-mute">{note.length}/60</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-sm">取消</button>
          <button onClick={() => onConfirm(note)} className="btn-pink flex-1 py-2 font-bold">
            確認兌現 ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
        active ? "bg-empire-sky text-white" : "text-empire-ink hover:bg-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}
