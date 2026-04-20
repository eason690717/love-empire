"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { PetAvatar } from "@/components/art/PetAvatar";
import { RarityFrame } from "@/components/art/RarityFrame";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";
import { fetchBreedablePublicPets, createMatingRequest, listMatingRequestsForCouple, approveMatingRequest } from "@/lib/supabaseAdapter";
import { toast } from "@/components/Toast";
import type { Pet } from "@/lib/types";

/**
 * /market — 跨情侶 MIT 繁殖市集
 *
 * 功能：
 *  - 列出所有公開情侶的可配對寵物（stage ≥ 3 + 未過冷卻）
 *  - 從自己寵物挑一隻發起配對邀請（自動同意發起方 role 的一票）
 *  - 另一半看到通知 → 在這裡看到 pending → 點「我方同意」
 *  - 對方情侶兩人都在 /market 看到邀請 → 雙簽
 *  - 4 簽齊 → 自動生成子代（歸屬發起方 couple）
 */
export default function MarketPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const pets = useGame((s) => s.pets);
  const mintPet = useGame((s) => s.mintPet);
  const [remotePets, setRemotePets] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<any>(null);

  useEffect(() => {
    if (!couple.id || couple.id === "me") return;
    (async () => {
      setLoading(true);
      const [breedable, requests] = await Promise.all([
        fetchBreedablePublicPets(couple.id),
        listMatingRequestsForCouple(couple.id),
      ]);
      setRemotePets(breedable);
      setMyRequests(requests);
      setLoading(false);
    })();
  }, [couple.id]);

  const myBreedable = pets.filter((p) => (p.stage ?? 0) >= 3 && p.remoteId);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="繁殖市集"
        subtitle="跨情侶 MIT · 4 方雙簽才能成"
        emoji="💞"
        gradient="rose"
        stats={[
          { label: "可配對", value: remotePets.length },
          { label: "進行中", value: myRequests.length },
        ]}
      />

      {myRequests.length > 0 && (
        <section>
          <h3 className="font-bold text-empire-ink mb-2">📬 配對邀請中</h3>
          <div className="space-y-2">
            {myRequests.map((r) => (
              <RequestCard key={r.id} request={r} myCoupleId={couple.id} myRole={role} onRefresh={() => listMatingRequestsForCouple(couple.id).then(setMyRequests)} mintPet={mintPet} myPets={pets} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-bold text-empire-ink mb-2">🐾 可配對的公開寵物</h3>
        {loading && <p className="text-center text-empire-mute text-sm py-6">載入中...</p>}
        {!loading && remotePets.length === 0 && (
          <div className="card p-5 text-center text-empire-mute text-sm">
            暫無公開情侶的可配對寵物。
            <br />要你的寵物被看到？到<Link href="/settings" className="text-empire-sky underline mx-1">設定</Link>
            改隱私為「公開」，養一隻 stage ≥ 3 的寵物吧。
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {remotePets.map((p) => {
            const sp = SPECIES[resolveSpecies(p.species)];
            const rr = RARITY[resolveRarity(p.gene_rarity)];
            return (
              <button key={p.id} onClick={() => setTarget(p)} className="card p-3 flex flex-col items-center gap-2 hover:ring-2 hover:ring-empire-berry active:scale-98 transition">
                <RarityFrame rarity={p.gene_rarity} size={100} showTag>
                  <PetAvatar stage={p.stage} size={88} species={p.species} rarity={p.gene_rarity} animate={false} />
                </RarityFrame>
                <div className="text-center">
                  <div className="text-xs font-bold text-empire-ink">{p.name}</div>
                  <div className="text-[10px] text-empire-mute">{sp.nameZh} · {rr.tag}</div>
                  <div className="text-[10px] text-empire-mute">來自「{p._couple?.name ?? "未知"}」王國</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="card p-4 bg-empire-cream text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">ℹ️ 4 方雙簽規則</div>
        <div>1. 你選一隻自己的寵物（stage ≥ 3） → 對另一對情侶的公開寵物發邀請</div>
        <div>2. 你方另一半同意（queen + prince 兩票）</div>
        <div>3. 對方情侶兩人也都同意（4 票齊）</div>
        <div>4. 自動生成子代，歸屬發起方情侶；雙親 cooldown 7 天</div>
        <div>5. 雙親若都 SSR+ 且同種系 → 0.5% 機率生出 🌈 Lumen UR</div>
      </div>

      {target && (
        <InviteModal
          target={target}
          myPets={myBreedable}
          myCoupleId={couple.id}
          myRole={role}
          onClose={() => setTarget(null)}
          onSent={() => {
            setTarget(null);
            listMatingRequestsForCouple(couple.id).then(setMyRequests);
          }}
        />
      )}
    </main>
  );
}

function InviteModal({ target, myPets, myCoupleId, myRole, onClose, onSent }: {
  target: any;
  myPets: Pet[];
  myCoupleId: string;
  myRole: "queen" | "prince";
  onClose: () => void;
  onSent: () => void;
}) {
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(myPets[0]?.id);
  const selected = myPets.find((p) => p.id === selectedPetId);

  async function handleSend() {
    if (!selected?.remoteId) {
      toast.error("需要選一隻已同步的寵物（stage ≥ 3）");
      return;
    }
    const id = await createMatingRequest({
      fromPetId: selected.remoteId,
      fromCoupleId: myCoupleId,
      toPetId: target.id,
      toCoupleId: target.couple_id,
      byRole: myRole,
    });
    if (!id) {
      toast.error("送出邀請失敗");
      return;
    }
    toast.success(`💞 已邀請「${target.name}」配對，等 4 方雙簽`);
    onSent();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-5 space-y-3" onClick={(e) => e.stopPropagation()} style={{ background: "linear-gradient(180deg, #fff9e6, #fef2ff)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-lg">💞 發起配對邀請</h3>
            <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
          </div>
          <div className="text-[12px] text-empire-mute">
            對方寵物：<b className="text-empire-ink">{target.name}</b>（{SPECIES[resolveSpecies(target.species)].nameZh} · {RARITY[resolveRarity(target.gene_rarity)].tag}）
          </div>

          <div>
            <div className="text-[11px] font-bold text-empire-mute mb-1">選一隻自己的寵物</div>
            {myPets.length === 0 && <div className="text-xs text-rose-600">你還沒有 stage ≥ 3 的寵物可配對</div>}
            {myPets.map((p) => (
              <button key={p.id} onClick={() => setSelectedPetId(p.id)} className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                selectedPetId === p.id ? "bg-empire-gold/30 ring-2 ring-empire-gold" : "bg-white hover:bg-empire-cream"
              }`}>
                <span className="text-lg">{SPECIES[resolveSpecies(p.species)].signatureEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-empire-mute">{SPECIES[resolveSpecies(p.species)].nameZh} · {RARITY[resolveRarity(p.rarity)].tag} · stage {p.stage}</div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={handleSend} disabled={!selected} className="w-full py-2.5 rounded-full bg-gradient-to-r from-empire-berry to-empire-sunshine text-white font-black shadow disabled:opacity-40">
            💌 發送邀請
          </button>
          <div className="text-[10px] text-empire-mute text-center">你按下會自動同意你這邊的 1 票，還需 3 票：你方另一半 + 對方情侶 2 人</div>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request, myCoupleId, myRole, onRefresh, mintPet: _mintPet, myPets: _myPets }: {
  request: any;
  myCoupleId: string;
  myRole: "queen" | "prince";
  onRefresh: () => void;
  mintPet: any;
  myPets: Pet[];
}) {
  const isFromMe = request.from_couple_id === myCoupleId;
  const mySide: "from" | "to" = isFromMe ? "from" : "to";
  const myApproved = request[`${mySide}_${myRole}_approved`];
  const totalApproved = [
    request.from_queen_approved, request.from_prince_approved,
    request.to_queen_approved, request.to_prince_approved,
  ].filter(Boolean).length;

  async function handleApprove() {
    const ok = await approveMatingRequest(request.id, mySide, myRole);
    if (!ok) { toast.error("同意失敗"); return; }
    toast.success(`✓ 已同意（目前 ${totalApproved + 1}/4）`);
    onRefresh();
  }

  return (
    <div className="card p-3 text-[12px]">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-empire-ink">{isFromMe ? "➡️ 我方發起" : "⬅️ 收到邀請"}</div>
        <div className="text-[10px] px-2 py-0.5 rounded-full bg-empire-cream text-empire-berry">{totalApproved}/4 同意</div>
      </div>
      <div className="text-empire-mute text-[11px]">狀態：{request.status}</div>
      {request.message && <div className="text-[11px] mt-1">💬 {request.message}</div>}
      <div className="mt-2 flex gap-2">
        {!myApproved ? (
          <button onClick={handleApprove} className="flex-1 py-1.5 rounded-full bg-empire-berry text-white text-xs font-bold">
            ✓ 我（{myRole === "queen" ? "阿紅" : "阿藍"}）同意
          </button>
        ) : (
          <div className="flex-1 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs text-center font-bold">
            我已同意 ✓
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[9px] text-center">
        <Check label="A 紅" on={request.from_queen_approved} />
        <Check label="A 藍" on={request.from_prince_approved} />
        <Check label="B 紅" on={request.to_queen_approved} />
        <Check label="B 藍" on={request.to_prince_approved} />
      </div>
      {totalApproved === 4 && request.status === "pending" && (
        <div className="mt-2 p-2 rounded-lg bg-amber-50 text-[10px] text-amber-900">
          4 票齊 ✨ 正在生成子代...（請稍候）
          {/* TODO: 4 票齊時觸發 mintPet 並更新 request.status = 'completed' */}
        </div>
      )}
    </div>
  );
}

function Check({ label, on }: { label: string; on: boolean }) {
  return (
    <div className={`px-1 py-0.5 rounded ${on ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-empire-cloud text-empire-mute"}`}>
      {on ? "✓" : "·"} {label}
    </div>
  );
}
