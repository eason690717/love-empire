"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { PetAvatar } from "@/components/art/PetAvatar";
import { RarityFrame } from "@/components/art/RarityFrame";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "@/components/Toast";

/**
 * /pets — 多寵物列表 + 切換活躍寵物
 *
 * C2 批次：基本列表；C5/C6 之後會加「MIT 繁殖」入口。
 * 目前：顯示所有寵物、切換活躍、刪除（至少留 1 隻）
 */
export default function PetsPage() {
  const pets = useGame((s) => s.pets);
  const activePetId = useGame((s) => s.activePetId);
  const switchActivePet = useGame((s) => s.switchActivePet);
  const removePet = useGame((s) => s.removePet);

  async function handleRemove(id: string, name: string) {
    const ok = await toast.confirm(`確定要放走「${name}」嗎？放走後無法復原。`, { okLabel: "放走", cancelLabel: "取消" });
    if (ok) removePet(id);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="我的寵物們"
        subtitle="目前最多 3 隻 · MIT 繁殖即將開放"
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
                </div>
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

        {/* 空格位顯示「未來可新增」 */}
        {pets.length < 3 && (
          <div className="card p-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-empire-cloud text-empire-mute min-h-[200px]">
            <div className="text-4xl opacity-50">✨</div>
            <div className="text-xs text-center">
              <div className="font-bold">MIT 繁殖中</div>
              <div className="text-[10px] mt-1">stage ≥ 3 的寵物可配對</div>
              <div className="text-[10px]">（即將開放）</div>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4 bg-empire-cream text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">ℹ️ 多寵物系統說明</div>
        <div>· 每對情侶最多可擁有 <b>3 隻</b>寵物</div>
        <div>· 切換「活躍寵物」後，餵食/互動都會作用在該隻身上</div>
        <div>· 新寵物只能透過 <b>MIT 繁殖</b>（雙親 stage ≥ 3 + coin 消耗）取得</div>
        <div>· 稀有度越高，屬性 cap 與可繁殖次數越多：N 60/2、R 75/3、SR 85/5、SSR 95/7、UR 100/∞</div>
      </div>
    </main>
  );
}
