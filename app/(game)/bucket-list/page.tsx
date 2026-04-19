"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { BUCKET_LIST } from "@/lib/bucketList";
import { BUCKET_CATEGORY_LABELS, BUCKET_REWARD } from "@/lib/types";
import type { BucketCategory, BucketItem, BucketRarity } from "@/lib/types";
import { RARITY_CLASS } from "@/lib/utils";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "@/components/Toast";

const CATEGORY_ORDER: BucketCategory[] = ["romantic", "daily", "outdoor", "growth", "playful", "tender"];

export default function BucketListPage() {
  const bucketList = useGame((s) => s.bucketList);
  const toggleBucketItem = useGame((s) => s.toggleBucketItem);

  const [openCategory, setOpenCategory] = useState<BucketCategory | "all">("all");
  const [filterRarity, setFilterRarity] = useState<BucketRarity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "undone" | "done">("all");
  const [picking, setPicking] = useState<BucketItem | null>(null);
  const [celebrate, setCelebrate] = useState<{ item: BucketItem; reward: { love: number; coins: number } } | null>(null);

  const doneIds = useMemo(() => new Set(bucketList.map((r) => r.id)), [bucketList]);
  const recordById = useMemo(() => {
    const m = new Map<string, typeof bucketList[number]>();
    for (const r of bucketList) m.set(r.id, r);
    return m;
  }, [bucketList]);

  const totalDone = bucketList.length;
  const overallPct = Math.round((totalDone / BUCKET_LIST.length) * 100);

  const filtered = BUCKET_LIST.filter((item) => {
    if (openCategory !== "all" && item.category !== openCategory) return false;
    if (filterRarity !== "all" && item.rarity !== filterRarity) return false;
    if (filterStatus === "done" && !doneIds.has(item.id)) return false;
    if (filterStatus === "undone" && doneIds.has(item.id)) return false;
    return true;
  });

  const grouped = useMemo(() => {
    const m: Record<BucketCategory, BucketItem[]> = {
      romantic: [], daily: [], outdoor: [], growth: [], playful: [], tender: [],
    };
    for (const item of filtered) m[item.category].push(item);
    return m;
  }, [filtered]);

  const handleConfirm = (note: string, proof?: { kind: "text" | "location" | "photo"; value: string; caption?: string }) => {
    if (!picking) return;
    const result = toggleBucketItem(picking.id, note, proof);
    if (result.newlyDone && result.reward) {
      setCelebrate({ item: picking, reward: result.reward });
    }
    setPicking(null);
  };

  return (
    <div className="space-y-4">
      <PageBanner
        title="情侶人生清單"
        subtitle={`一起完成 100 件事 · 已達成 ${totalDone} / 100`}
        emoji="💞"
        gradient="rose"
        stats={[
          { label: "完成度", value: `${overallPct}%` },
          { label: "已勾選", value: totalDone },
          { label: "還差", value: 100 - totalDone },
        ]}
      />

      {/* 總進度條 + 6 分類迷你格 */}
      <div className="card p-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs text-empire-mute mb-1">
            <span>🎯 總進度</span>
            <span className="font-bold">{totalDone} / 100</span>
          </div>
          <div className="h-3 bg-empire-cloud rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-empire-berry via-empire-sunshine to-empire-sky transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const info = BUCKET_CATEGORY_LABELS[cat];
            const items = BUCKET_LIST.filter((i) => i.category === cat);
            const done = items.filter((i) => doneIds.has(i.id)).length;
            const pct = Math.round((done / items.length) * 100);
            return (
              <button
                key={cat}
                onClick={() => setOpenCategory((c) => (c === cat ? "all" : cat))}
                className={`p-2 rounded-xl text-left transition border-2 ${
                  openCategory === cat ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white hover:border-empire-sky/40"
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-base">{info.emoji}</span>
                  <span className="text-[11px] font-bold text-empire-ink truncate">{info.label}</span>
                </div>
                <div className="font-display font-black text-sm text-empire-ink">
                  {done}<span className="text-[10px] text-empire-mute">/{items.length}</span>
                </div>
                <div className="h-1 mt-1 bg-empire-cloud rounded-full overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${pct}%`, background: info.color }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 篩選列 */}
      <div className="card p-2 space-y-1">
        <div className="flex gap-1 overflow-x-auto">
          <FilterPill active={filterStatus === "all"} onClick={() => setFilterStatus("all")}>全部</FilterPill>
          <FilterPill active={filterStatus === "undone"} onClick={() => setFilterStatus("undone")}>☐ 待完成</FilterPill>
          <FilterPill active={filterStatus === "done"} onClick={() => setFilterStatus("done")}>✓ 已完成</FilterPill>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          <FilterPill active={filterRarity === "all"} onClick={() => setFilterRarity("all")}>所有稀有度</FilterPill>
          {(["N", "R", "SR", "SSR"] as BucketRarity[]).map((r) => (
            <FilterPill key={r} active={filterRarity === r} onClick={() => setFilterRarity(r)}>
              {r}（{BUCKET_LIST.filter((i) => i.rarity === r).length}）
            </FilterPill>
          ))}
        </div>
      </div>

      {/* 清單 */}
      {openCategory === "all" ? (
        CATEGORY_ORDER.map((cat) =>
          grouped[cat].length > 0 ? (
            <CategorySection
              key={cat}
              cat={cat}
              items={grouped[cat]}
              doneIds={doneIds}
              recordById={recordById}
              onPick={setPicking}
            />
          ) : null,
        )
      ) : (
        <CategorySection
          cat={openCategory}
          items={grouped[openCategory]}
          doneIds={doneIds}
          recordById={recordById}
          onPick={setPicking}
        />
      )}

      {picking && (
        <PickerModal
          item={picking}
          existingNote={recordById.get(picking.id)?.note}
          alreadyDone={doneIds.has(picking.id)}
          onConfirm={handleConfirm}
          onClose={() => setPicking(null)}
        />
      )}

      {celebrate && (
        <CelebrateModal
          item={celebrate.item}
          reward={celebrate.reward}
          onClose={() => setCelebrate(null)}
        />
      )}
    </div>
  );
}

function CategorySection({
  cat, items, doneIds, recordById, onPick,
}: {
  cat: BucketCategory;
  items: BucketItem[];
  doneIds: Set<string>;
  recordById: Map<string, any>;
  onPick: (i: BucketItem) => void;
}) {
  const info = BUCKET_CATEGORY_LABELS[cat];
  const doneCount = items.filter((i) => doneIds.has(i.id)).length;
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{info.emoji}</span>
        <h3 className="font-bold text-empire-ink">{info.label}</h3>
        <span className="text-xs text-empire-mute">{doneCount} / {items.length}</span>
        <span className="ml-auto text-[10px] text-empire-mute">{info.desc}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => {
          const done = doneIds.has(item.id);
          const rec = recordById.get(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onPick(item)}
              className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition ${
                done
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-white border border-empire-cloud hover:border-empire-sky/40"
              }`}
            >
              <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center ${
                done ? "bg-emerald-500 border-emerald-500 text-white" : "border-empire-cloud"
              }`}>
                {done && "✓"}
              </div>
              <div className="text-2xl shrink-0">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold truncate ${done ? "text-emerald-800" : "text-empire-ink"}`}>
                  {item.title}
                  {done && rec?.proof && (
                    <span className="ml-1 text-[9px] px-1 rounded bg-emerald-100 text-emerald-700 font-bold">
                      {rec.proof.kind === "text" ? "📝" : rec.proof.kind === "location" ? "📍" : "📷"}
                    </span>
                  )}
                  {!done && item.proofHint && (
                    <span className="ml-1 text-[9px] text-empire-berry">證明推薦</span>
                  )}
                </div>
                {done && rec?.note ? (
                  <div className="text-[10px] text-emerald-700 italic truncate">&ldquo;{rec.note}&rdquo;</div>
                ) : done ? (
                  <div className="text-[10px] text-emerald-600">{rec?.doneAt}</div>
                ) : (
                  <div className="text-[10px] text-empire-mute">
                    +{BUCKET_REWARD[item.rarity].love} 愛意 · +{BUCKET_REWARD[item.rarity].coins} 金
                  </div>
                )}
              </div>
              <span className={`tag ${RARITY_CLASS[item.rarity]} text-[10px] shrink-0 font-bold`}>
                {item.rarity}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PickerModal({
  item, existingNote, alreadyDone, onConfirm, onClose,
}: {
  item: BucketItem;
  existingNote?: string;
  alreadyDone: boolean;
  onConfirm: (note: string, proof?: { kind: "text" | "location" | "photo"; value: string; caption?: string }) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(existingNote ?? "");
  const [proofKind, setProofKind] = useState<"text" | "location" | "photo" | "none">(item.proofHint ?? "none");
  const [proofText, setProofText] = useState("");
  const [proofPhoto, setProofPhoto] = useState("");
  const [proofLocation, setProofLocation] = useState<string>("");
  const [locating, setLocating] = useState(false);
  const info = BUCKET_CATEGORY_LABELS[item.category];
  const reward = BUCKET_REWARD[item.rarity];

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("瀏覽器不支援定位");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProofLocation(`${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`);
        setLocating(false);
        toast.success("已記錄位置");
      },
      (err) => {
        toast.error("定位失敗：" + err.message);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const buildProof = (): { kind: "text" | "location" | "photo"; value: string } | undefined => {
    if (proofKind === "text" && proofText.trim()) return { kind: "text", value: proofText.trim() };
    if (proofKind === "photo" && proofPhoto.trim()) return { kind: "photo", value: proofPhoto.trim() };
    if (proofKind === "location" && proofLocation) return { kind: "location", value: proofLocation };
    return undefined;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-sm w-full card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-6xl mb-2">{item.emoji}</div>
          <div className="font-display font-black text-xl text-empire-ink">{item.title}</div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="tag text-[10px]" style={{ background: info.color + "33", borderColor: info.color }}>
              {info.emoji} {info.label}
            </span>
            <span className={`tag ${RARITY_CLASS[item.rarity]} text-[10px] font-bold`}>{item.rarity}</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-empire-mute block mb-1">
            {alreadyDone ? "編輯心情短文（勾選後無法取消）" : "想留下的心情短文（可選）"}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 100))}
            placeholder="例：2026 年的春天，一起完成…"
            rows={3}
            className="w-full border-2 border-empire-cloud rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
            maxLength={100}
          />
          <div className="text-[10px] text-right text-empire-mute">{note.length}/100</div>
        </div>

        {!alreadyDone && (
          <div className="mt-3 p-3 rounded-xl bg-empire-cream/60 border border-empire-gold/30 text-xs text-empire-ink">
            ✨ 完成獎勵：<b>+{reward.love} 愛意 · +{reward.coins} 金</b>
            {item.rarity === "SSR" && <span className="block mt-1 text-empire-berry font-bold">🌟 畢生一次的紀念</span>}
            <div className="text-[10px] text-empire-mute mt-1">⚠️ 勾選後將無法取消 — 確認真的做了再勾</div>
          </div>
        )}

        {/* 證明收集區 */}
        <div className="mt-4 pt-3 border-t border-empire-cloud">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-empire-mute">
              {item.proofHint ? "📌 建議附證明" : "📌 可選擇附上證明"}
              {item.proofHint && <span className="ml-1 text-empire-berry">(推薦 {item.proofHint === "text" ? "文字" : item.proofHint === "location" ? "GPS" : "照片"})</span>}
            </label>
          </div>
          <div className="flex gap-1 mb-2">
            {([
              { k: "none", label: "略過", emoji: "·" },
              { k: "text", label: "文字", emoji: "📝" },
              { k: "location", label: "GPS", emoji: "📍" },
              { k: "photo", label: "照片", emoji: "📷" },
            ] as const).map((o) => (
              <button
                key={o.k}
                onClick={() => setProofKind(o.k)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  proofKind === o.k ? "bg-empire-sky text-white" : "bg-white border border-empire-cloud text-empire-mute"
                }`}
              >
                {o.emoji} {o.label}
              </button>
            ))}
          </div>

          {proofKind === "text" && (
            <input
              value={proofText}
              onChange={(e) => setProofText(e.target.value.slice(0, 60))}
              placeholder="例：電影名 / 餐廳 / 樂團 / 書名..."
              className="w-full border-2 border-empire-cloud rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-empire-sky"
              maxLength={60}
            />
          )}
          {proofKind === "location" && (
            <div>
              {proofLocation ? (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  ✓ GPS 座標已記錄：{proofLocation}
                  <button onClick={() => setProofLocation("")} className="ml-2 text-empire-mute underline">重新</button>
                </div>
              ) : (
                <button
                  onClick={getLocation}
                  disabled={locating}
                  className="w-full py-2 text-sm rounded-lg bg-empire-cream border-2 border-empire-gold/40 text-empire-ink font-semibold"
                >
                  {locating ? "定位中…" : "📍 取得目前位置"}
                </button>
              )}
            </div>
          )}
          {proofKind === "photo" && (
            <input
              value={proofPhoto}
              onChange={(e) => setProofPhoto(e.target.value)}
              placeholder="貼上照片網址（Google Drive / iCloud / Imgur 等）"
              className="w-full border-2 border-empire-cloud rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-empire-sky"
              type="url"
            />
          )}
          {proofKind !== "none" && (
            <div className="text-[10px] text-empire-mute mt-1">
              👀 只有你們倆看得到 · 儲存後無法改
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-sm">取消</button>
          <button
            onClick={() => onConfirm(note, buildProof())}
            className="btn-primary flex-1 py-2 font-bold"
          >
            {alreadyDone ? "儲存" : "我們做到了 ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CelebrateModal({
  item, reward, onClose,
}: {
  item: BucketItem;
  reward: { love: number; coins: number };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="max-w-sm w-full card p-7 text-center relative overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: item.rarity === "SSR"
            ? "linear-gradient(135deg, #fff1c4, #ffb8de, #b8d8ff)"
            : item.rarity === "SR"
            ? "linear-gradient(135deg, #e9d5ff, #fbcfe8)"
            : "linear-gradient(135deg, #ffe3b3, #ffbfd2)",
        }}
      >
        <div className="absolute top-3 right-4 text-2xl animate-sparkle">✨</div>
        <div className="absolute bottom-3 left-4 text-2xl animate-sparkle" style={{ animationDelay: "0.5s" }}>💫</div>

        <div className="text-xs text-empire-ink/70 font-bold">🎉 達成</div>
        <div className="text-7xl my-3 animate-bob">{item.emoji}</div>
        <div className="font-display font-black text-xl text-empire-ink leading-tight">
          {item.title}
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/80 font-bold text-empire-berry">
            💞 +{reward.love}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/80 font-bold text-empire-gold">
            💰 +{reward.coins}
          </div>
        </div>

        {item.rarity === "SSR" && (
          <div className="mt-4 p-2 rounded-lg bg-white/70 text-xs text-empire-ink font-bold">
            🌟 畢生一次的紀念已留下
          </div>
        )}

        <button onClick={onClose} className="mt-5 btn-primary w-full py-2.5 font-bold">
          好
        </button>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        active ? "bg-empire-sky text-white" : "bg-white text-empire-mute border border-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}
