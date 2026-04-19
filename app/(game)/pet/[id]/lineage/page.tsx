"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGame } from "@/lib/store";
import { PetAvatar } from "@/components/art/PetAvatar";
import { RarityFrame } from "@/components/art/RarityFrame";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";
import type { Pet } from "@/lib/types";

/**
 * /pet/[id]/lineage — 寵物血統樹
 *
 * 目前只顯示直系雙親（1 代回溯）。跨情侶父母顯示為「好友情侶家的寵物」佔位（C8 之後開放）。
 */
export default function LineagePage() {
  const params = useParams<{ id: string }>();
  const pets = useGame((s) => s.pets);
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    return (
      <main className="max-w-md mx-auto px-6 py-10 text-center">
        <p className="text-empire-mute">找不到這隻寵物</p>
        <Link href="/pets" className="mt-4 inline-block text-empire-sky underline">← 回寵物列表</Link>
      </main>
    );
  }

  const parentA = pet.parentAId ? pets.find((p) => p.id === pet.parentAId) : undefined;
  const parentB = pet.parentBId ? pets.find((p) => p.id === pet.parentBId) : undefined;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Link href="/pets" className="text-sm text-empire-sky">← 回寵物列表</Link>

      <h1 className="font-display font-black text-2xl text-empire-ink text-center">
        🌳 「{pet.name}」的血統樹
      </h1>

      {/* 雙親層 */}
      {(parentA || parentB) ? (
        <div className="grid grid-cols-2 gap-4">
          <LineageCard pet={parentA} label="父母 A" fallbackText="外家寵物（跨情侶繁殖，C8 開放）" />
          <LineageCard pet={parentB} label="父母 B" fallbackText="外家寵物（跨情侶繁殖，C8 開放）" />
        </div>
      ) : (
        <div className="card p-4 bg-empire-cream text-center text-empire-mute text-sm">
          這是 <b>初代寵物</b>（Generation 0）— 沒有父母血統
        </div>
      )}

      {/* 連線 + 向下箭頭 */}
      {(parentA || parentB) && (
        <div className="text-center text-3xl text-empire-berry opacity-60">↓</div>
      )}

      {/* 本隻 */}
      <div className="flex flex-col items-center gap-2">
        <RarityFrame rarity={pet.rarity ?? "common"} size={140} showTag>
          <PetAvatar
            stage={pet.stage}
            size={130}
            species={pet.species ?? "nuzzle"}
            rarity={pet.rarity ?? "common"}
          />
        </RarityFrame>
        <div className="text-center">
          <div className="font-display font-black text-empire-ink">{pet.name}</div>
          <div className="text-[11px] text-empire-mute">
            Gen {pet.generation ?? 0} · {SPECIES[resolveSpecies(pet.species)].nameZh} · {RARITY[resolveRarity(pet.rarity)].tag}
          </div>
        </div>
      </div>

      <div className="card p-4 bg-empire-cream text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">🧬 基因遺傳</div>
        <div>· 類型：{(parentA || parentB) ? `繼承自雙親 ± 突變` : `初代，由系統指定`}</div>
        <div>· 稀有度：{RARITY[resolveRarity(pet.rarity)].label}（{RARITY[resolveRarity(pet.rarity)].tag}）</div>
        {pet.gene && (
          <div className="pt-1 border-t border-empire-cloud">
            <div>· 顏色：{pet.gene.color ?? "—"}</div>
            <div>· 花紋：{pet.gene.pattern ?? "—"}</div>
            <div>· 表情：{pet.gene.face ?? "—"}</div>
            <div>· 配件：{pet.gene.accessory ?? "—"}</div>
          </div>
        )}
      </div>
    </main>
  );
}

function LineageCard({ pet, label, fallbackText }: { pet?: Pet; label: string; fallbackText: string }) {
  if (!pet) {
    return (
      <div className="card p-3 flex flex-col items-center gap-2 opacity-50 text-center min-h-[170px] justify-center">
        <div className="text-[10px] text-empire-mute font-bold">{label}</div>
        <div className="text-4xl">❓</div>
        <div className="text-[10px] text-empire-mute leading-tight">{fallbackText}</div>
      </div>
    );
  }
  return (
    <Link href={`/pet/${pet.id}/lineage`} className="card p-3 flex flex-col items-center gap-2 hover:bg-empire-cream transition">
      <div className="text-[10px] text-empire-mute font-bold">{label}</div>
      <RarityFrame rarity={pet.rarity ?? "common"} size={80} showTag={false}>
        <PetAvatar stage={pet.stage} size={72} species={pet.species ?? "nuzzle"} rarity={pet.rarity ?? "common"} animate={false} />
      </RarityFrame>
      <div className="text-center">
        <div className="text-[12px] font-bold text-empire-ink">{pet.name}</div>
        <div className="text-[10px] text-empire-mute">
          Gen {pet.generation ?? 0} · {SPECIES[resolveSpecies(pet.species)].nameZh} · {RARITY[resolveRarity(pet.rarity)].tag}
        </div>
      </div>
    </Link>
  );
}
