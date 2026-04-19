"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PetAvatar } from "@/components/art/PetAvatar";
import { RarityFrame } from "@/components/art/RarityFrame";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";
import { checkEligibility, getExpectation } from "@/lib/pet/mint";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "@/components/Toast";
import type { Pet } from "@/lib/types";

export default function PetsPage() {
  const pets = useGame((s) => s.pets);
  const activePetId = useGame((s) => s.activePetId);
  const coins = useGame((s) => s.couple.coins);
  const switchActivePet = useGame((s) => s.switchActivePet);
  const removePet = useGame((s) => s.removePet);
  const mintPet = useGame((s) => s.mintPet);
  const [mintOpen, setMintOpen] = useState(false);

  async function handleRemove(id: string, name: string) {
    const ok = await toast.confirm(`確定要放走「${name}」嗎？放走後無法復原。`, { okLabel: "放走", cancelLabel: "取消" });
    if (ok) removePet(id);
  }

  const canMintAny = pets.filter((p) => (p.stage ?? 0) >= 3).length >= 2 && pets.length < 3;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="我的寵物們"
        subtitle={`目前 ${pets.length}/3 隻 · 金幣 ${coins}`}
        emoji="🐾"
        gradient="rose"
      />

      <div className="grid grid-cols-2 gap-4">
        {pets.map((pet) => {
          const isActive = pet.id === activePetId;
          const sp = SPECIES[resolveSpecies(pet.species)];
          const rr = RARITY[resolveRarity(pet.rarity)];
          return (
            <div
              key={pet.id ?? pet.name}
              className={`card p-3 flex flex-col items-center gap-2 transition ${
                isActive ? "ring-2 ring-empire-gold shadow-lg" : "opacity-80 hover:opacity-100"
              }`}
            >
              <RarityFrame rarity={pet.rarity ?? "common"} size={120} showTag>
                <PetAvatar
                  stage={pet.stage}
                  size={110}
                  species={pet.species ?? "nuzzle"}
                  rarity={pet.rarity ?? "common"}
                  animate={isActive}
                />
              </RarityFrame>

              <div className="text-center">
                <div className="font-display font-black text-empire-ink">{pet.name}</div>
                <div className="text-[11px] text-empire-mute">{sp.nameZh} · {rr.tag}</div>
                <div className="text-[10px] text-empire-mute mt-0.5">
                  stage {pet.stage} · MIT {pet.mintCount ?? 0}/{rr.mintLimit === Infinity ? "∞" : rr.mintLimit}
                  {pet.generation && pet.generation > 0 && <span className="ml-1">· Gen {pet.generation}</span>}
                </div>
                {pet.id && (pet.generation ?? 0) > 0 && (
                  <Link href={`/pet/${pet.id}/lineage`} className="text-[10px] text-empire-sky underline mt-0.5 inline-block">
                    🌳 血統樹
                  </Link>
                )}
              </div>

              <div className="flex gap-1 w-full">
                {isActive ? (
                  <Link
                    href="/pet"
                    className="flex-1 text-center text-[11px] py-1.5 rounded-full bg-empire-gold/20 text-empire-berry font-bold border border-empire-gold/60"
                  >
                    ✨ 目前活躍
                  </Link>
                ) : (
                  <button
                    onClick={() => pet.id && switchActivePet(pet.id)}
                    className="flex-1 text-[11px] py-1.5 rounded-full bg-empire-sky/15 text-empire-sky font-bold hover:bg-empire-sky/25 transition"
                  >
                    切換活躍
                  </button>
                )}
                {pets.length > 1 && !isActive && (
                  <button
                    onClick={() => pet.id && handleRemove(pet.id, pet.name)}
                    className="text-[11px] py-1.5 px-2 rounded-full bg-empire-cloud/60 text-empire-mute hover:bg-red-100 hover:text-red-600 transition"
                    aria-label="放走"
                  >
                    🕊
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {pets.length < 3 && (
          <button
            onClick={() => canMintAny ? setMintOpen(true) : toast.info("需要 2 隻以上 stage ≥ 3（傳說）的寵物才能繁殖")}
            className={`card p-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed min-h-[200px] transition ${
              canMintAny
                ? "border-empire-gold text-empire-berry hover:bg-empire-gold/10 cursor-pointer"
                : "border-empire-cloud text-empire-mute cursor-not-allowed opacity-60"
            }`}
          >
            <div className="text-4xl">✨</div>
            <div className="text-xs text-center">
              <div className="font-bold">MIT 繁殖</div>
              <div className="text-[10px] mt-1">
                {canMintAny ? "點這裡選雙親" : "需要 2 隻 stage ≥ 3"}
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="card p-4 bg-empire-cream text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">ℹ️ 多寵物與 MIT 繁殖</div>
        <div>· 每對情侶最多可擁有 <b>3 隻</b>寵物</div>
        <div>· 雙親需 <b>stage ≥ 3（傳說）</b>，且 MIT 次數未滿</div>
        <div>· 子代類型 50/50 隨父母 · 突變 5% · 雙 SSR+ 同類小機率出 <b>🌈 Lumen</b></div>
        <div>· 子代稀有度：基準取雙親較低，升格機率隨雙親稀有度增加</div>
        <div>· 消耗金幣：<b>200 × 2^(父A 已 MIT + 父B 已 MIT)</b></div>
        <div>· 雙親繁殖後冷卻 7 天</div>
      </div>

      {mintOpen && <MintModal pets={pets} coins={coins} onClose={() => setMintOpen(false)} onMint={mintPet} />}
    </main>
  );
}

// ============================================================
// MIT 雙親選擇 + 預覽 + 確認 modal
// ============================================================
function MintModal({
  pets,
  coins,
  onClose,
  onMint,
}: {
  pets: Pet[];
  coins: number;
  onClose: () => void;
  onMint: (aId: string, bId: string, name?: string) => { ok: boolean; reason?: string; childId?: string };
}) {
  const eligiblePets = pets.filter((p) => (p.stage ?? 0) >= 3);
  const [aId, setAId] = useState<string | undefined>(eligiblePets[0]?.id);
  const [bId, setBId] = useState<string | undefined>(eligiblePets[1]?.id);
  const [childName, setChildName] = useState("");

  const a = pets.find((p) => p.id === aId);
  const b = pets.find((p) => p.id === bId);

  const elig = useMemo(() => a && b ? checkEligibility(a, b) : { ok: false, reason: "請選 2 隻寵物" }, [a, b]);
  const expectation = useMemo(() => a && b && elig.ok ? getExpectation(a, b) : null, [a, b, elig.ok]);

  async function handleConfirm() {
    if (!a || !b || !elig.ok) return;
    const ok = await toast.confirm(
      `確定要讓「${a.name}」與「${b.name}」繁殖嗎？消耗 ${expectation?.coinCost} 金幣。`,
      { okLabel: "開始繁殖", cancelLabel: "再想想" },
    );
    if (!ok) return;
    const result = onMint(a.id!, b.id!, childName.trim() || undefined);
    if (!result.ok) {
      toast.error(result.reason ?? "繁殖失敗");
      return;
    }
    toast.success("🥚 新生命誕生！快去看看 /pets");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="max-w-md w-full card p-5 space-y-4"
          onClick={(e) => e.stopPropagation()}
          style={{ background: "linear-gradient(180deg, #fff9e6, #fef2ff)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-empire-ink">✨ MIT 繁殖</h3>
            <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ParentPicker label="雙親 A" value={aId} onChange={setAId} pool={eligiblePets} exclude={bId} />
            <ParentPicker label="雙親 B" value={bId} onChange={setBId} pool={eligiblePets} exclude={aId} />
          </div>

          {!elig.ok && (
            <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs">
              ⚠️ {elig.reason}
            </div>
          )}

          {expectation && a && b && (
            <div className="card p-3 bg-white/70 space-y-2 text-[12px]">
              <div className="font-bold text-empire-ink text-sm">🔮 期望分佈</div>

              <div>
                <div className="text-empire-mute mb-1">子代類型機率</div>
                <ProbBar label={`${SPECIES[resolveSpecies(a.species)].nameZh}（跟 A）`} pct={expectation.species.keepA} color="#ff7fa1" />
                {expectation.species.keepB > 0 && (
                  <ProbBar label={`${SPECIES[resolveSpecies(b.species)].nameZh}（跟 B）`} pct={expectation.species.keepB} color="#5aa4ff" />
                )}
                <ProbBar label="突變（其他系）" pct={expectation.species.mutate} color="#d280ff" />
                {expectation.lumenEligible && (
                  <ProbBar label="🌈 Lumen（傳說機率）" pct={expectation.species.lumen} color="#ffb947" />
                )}
              </div>

              <div className="pt-1 border-t border-empire-cloud">
                <div className="text-empire-mute mb-1">稀有度</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: RARITY[expectation.rarity.base].primaryColor }}>
                    基準 {RARITY[expectation.rarity.base].tag}
                  </span>
                  {expectation.rarity.upgradeTo && (
                    <span className="text-[11px] text-empire-mute">
                      {Math.round(expectation.rarity.upgradeChance * 100)}% 升格
                      <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: RARITY[expectation.rarity.upgradeTo].primaryColor }}>
                        {RARITY[expectation.rarity.upgradeTo].tag}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-1 border-t border-empire-cloud flex items-center justify-between">
                <div className="text-empire-mute">消耗金幣</div>
                <div className={`font-black ${coins >= expectation.coinCost ? "text-empire-ink" : "text-red-600"}`}>
                  💰 {expectation.coinCost} <span className="text-[10px] text-empire-mute">(現有 {coins})</span>
                </div>
              </div>
            </div>
          )}

          <label className="block text-[12px]">
            <span className="text-empire-mute">子代名字（選填）</span>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder={a && b ? `${a.name.slice(0,2)}${b.name.slice(0,2)}寶寶` : "自動取名"}
              maxLength={20}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-empire-cloud bg-white/80 text-empire-ink text-sm focus:outline-none focus:ring-2 focus:ring-empire-gold"
            />
          </label>

          <button
            onClick={handleConfirm}
            disabled={!elig.ok || !expectation || coins < (expectation?.coinCost ?? 0)}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-empire-berry to-empire-sunshine text-white font-black shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            🥚 開始繁殖
          </button>
        </div>
      </div>
    </div>
  );
}

function ParentPicker({
  label,
  value,
  onChange,
  pool,
  exclude,
}: {
  label: string;
  value?: string;
  onChange: (id: string) => void;
  pool: Pet[];
  exclude?: string;
}) {
  return (
    <div>
      <div className="text-[11px] text-empire-mute mb-1 font-bold">{label}</div>
      <div className="space-y-1">
        {pool.map((p) => {
          const disabled = p.id === exclude;
          const selected = p.id === value;
          const sp = SPECIES[resolveSpecies(p.species)];
          const rr = RARITY[resolveRarity(p.rarity)];
          return (
            <button
              key={p.id}
              disabled={disabled}
              onClick={() => p.id && onChange(p.id)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                selected ? "bg-empire-gold/30 ring-2 ring-empire-gold" : "bg-white/70 hover:bg-empire-cream"
              } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: sp.baseColor }}>
                <span className="text-sm">{sp.signatureEmoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-empire-ink truncate">{p.name}</div>
                <div className="text-[10px] text-empire-mute">
                  {sp.nameZh} · {rr.tag} · MIT {p.mintCount ?? 0}/{rr.mintLimit === Infinity ? "∞" : rr.mintLimit}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProbBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const widthPct = Math.max(1, Math.round(pct * 100));
  return (
    <div className="flex items-center gap-2 mb-0.5">
      <div className="flex-1 h-4 bg-empire-cloud/40 rounded-full overflow-hidden relative">
        <div className="h-full rounded-full" style={{ width: `${widthPct}%`, background: color }} />
        <div className="absolute inset-0 flex items-center px-2 text-[10px] text-empire-ink font-semibold">
          {label}
        </div>
      </div>
      <div className="w-10 text-right text-[10px] text-empire-mute">{(pct * 100).toFixed(1)}%</div>
    </div>
  );
}
