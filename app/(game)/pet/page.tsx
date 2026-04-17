"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { ATTR_LABEL, ATTR_COLOR, PET_STAGE_EMOJI, PET_STAGE_LABEL } from "@/lib/utils";

export default function PetPage() {
  const pet = useGame((s) => s.pet);
  const feedPet = useGame((s) => s.feedPet);

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
          {/* 地面陰影 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-28 h-4 rounded-full bg-black/15 blur-sm" />
          {/* 圓形光暈 */}
          <div className="absolute inset-0 -m-6 rounded-full animate-sparkle"
               style={{ background: "radial-gradient(circle, rgba(255,212,71,0.5) 0%, transparent 65%)" }} />
          <motion.div
            className="relative text-[7rem] inline-block"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {PET_STAGE_EMOJI[pet.stage]}
          </motion.div>
        </div>
        <div className="mt-4 font-display text-2xl font-black text-empire-ink text-shadow-soft">{pet.name}</div>
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
        <div className="flex items-center justify-between">
          {PET_STAGE_EMOJI.map((e, i) => {
            const active = i <= pet.stage;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  active ? "bg-empire-pink/30" : "bg-empire-cloud opacity-40"
                }`}>
                  {e}
                </div>
                <div className="text-xs text-slate-500">{PET_STAGE_LABEL[i]}</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          所有屬性達 80 → 進化「傳說」· 達 100 → 進化「神話」
        </p>
      </div>
    </div>
  );
}
