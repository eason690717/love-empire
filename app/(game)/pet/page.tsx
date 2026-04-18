"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { ATTR_LABEL, ATTR_COLOR, PET_STAGE_LABEL } from "@/lib/utils";
import { InlineRename } from "@/components/InlineRename";
import { PetAvatar } from "@/components/art/PetAvatar";

export default function PetPage() {
  const pet = useGame((s) => s.pet);
  const feedPet = useGame((s) => s.feedPet);
  const setPetName = useGame((s) => s.setPetName);

  const avg = Object.values(pet.attrs).reduce((a, b) => a + b, 0) / 5;
  const hoursSinceFed = (Date.now() - new Date(pet.lastFedAt).getTime()) / 36e5;
  const hungry = hoursSinceFed > 24;

  return (
    <div className="space-y-4">
      <div className="card p-8 text-center relative overflow-hidden"
           style={{ background: "linear-gradient(180deg, #d8eefd 0%, #e7f4d5 60%, #cfe9b4 100%)" }}>
        {/* 環繞光暈 + 浮葉 */}
        <div className="absolute -top-6 -left-4 text-4xl opacity-60 select-none">🌿</div>
        <div className="absolute -top-4 right-6 text-4xl opacity-60 animate-float-slow select-none">🌼</div>
        <div className="absolute bottom-4 left-10 text-3xl opacity-60 select-none">🌱</div>
        <div className="absolute bottom-2 right-8 text-3xl opacity-60 select-none">🍄</div>

        <div className="relative inline-block">
          <div className="absolute inset-0 -m-6 rounded-full animate-sparkle"
               style={{ background: "radial-gradient(circle, rgba(255,212,71,0.5) 0%, transparent 65%)" }} />
          <PetAvatar stage={pet.stage} size={180} />
        </div>
        <div className="mt-4 font-display text-2xl font-black text-empire-ink text-shadow-soft">
          <InlineRename value={pet.name} onSave={setPetName} />
        </div>
        <div className="text-sm text-empire-mute mt-1">
          <span className="tag rarity-sr">{PET_STAGE_LABEL[pet.stage]}</span>
          <span className="ml-2">平均屬性 <b className="text-empire-ink">{avg.toFixed(0)}</b> / 100</span>
        </div>
        {hungry && (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-empire-sunshine/30 border border-empire-sunshine/60 text-empire-ink text-xs font-semibold animate-bob">
            有點餓了，陪我玩嘛 🥺
          </div>
        )}
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">五項屬性 · 點擊餵養 +5</h3>
        <div className="space-y-3">
          {(Object.keys(pet.attrs) as Array<keyof typeof pet.attrs>).map((k) => (
            <button
              key={k}
              onClick={() => feedPet(k)}
              className="w-full text-left hover:bg-empire-cloud/50 rounded-xl p-2 transition"
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{ATTR_LABEL[k]}</span>
                <span className="text-slate-500">{pet.attrs[k]} / 100</span>
              </div>
              <div className="h-2.5 bg-empire-cloud rounded-full overflow-hidden">
                <motion.div
                  className={`${ATTR_COLOR[k]} h-full rounded-full`}
                  initial={false}
                  animate={{ width: `${pet.attrs[k]}%` }}
                  transition={{ type: "spring", stiffness: 120 }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">進化階段</h3>
        <div className="flex items-center justify-between gap-1">
          {([0, 1, 2, 3, 4] as const).map((i) => {
            const active = i <= pet.stage;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${
                  active ? "bg-empire-pink/20" : "bg-empire-cloud opacity-35 grayscale"
                }`}>
                  <PetAvatar stage={i} size={48} animate={false} />
                </div>
                <div className="text-xs text-empire-mute">{PET_STAGE_LABEL[i]}</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-empire-mute mt-4 text-center">
          所有屬性達 80 → 進化「傳說」· 達 100 → 進化「神話」
        </p>
      </div>
    </div>
  );
}
