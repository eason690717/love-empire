"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { ATTR_LABEL, ATTR_COLOR, PET_STAGE_LABEL } from "@/lib/utils";
import { InlineRename } from "@/components/InlineRename";
import { PetAvatar } from "@/components/art/PetAvatar";
import { PageBanner } from "@/components/PageBanner";

const STAGE_THRESHOLDS = [0, 15, 35, 65, 90]; // stage 0-4 的 avg 進入門檻
const STAGE_HINT = [
  "剛破殼的蛋，軟軟的、等你第一次摸摸",
  "幼體階段，每多 1 點屬性都能看見牠變亮",
  "成型期，個性開始顯現 — 繼續餵就會更獨特",
  "傳說等級，身邊會散發 SSR 光暈",
  "神話 — 你們把一隻寵物養到極致了 🌟",
];

export default function PetPage() {
  const pet = useGame((s) => s.pet);
  const feedPet = useGame((s) => s.feedPet);
  const setPetName = useGame((s) => s.setPetName);

  const avg = Object.values(pet.attrs).reduce((a, b) => a + b, 0) / 5;
  const hoursSinceFed = (Date.now() - new Date(pet.lastFedAt).getTime()) / 36e5;
  const hungry = hoursSinceFed > 24;

  // 下一階段進度
  const nextStageIdx = Math.min(4, pet.stage + 1);
  const nextThreshold = STAGE_THRESHOLDS[nextStageIdx] ?? 100;
  const prevThreshold = STAGE_THRESHOLDS[pet.stage] ?? 0;
  const isMaxStage = pet.stage >= 4;
  const progressToNext = isMaxStage
    ? 100
    : Math.max(0, Math.min(100, ((avg - prevThreshold) / (nextThreshold - prevThreshold)) * 100));
  const pointsToNext = isMaxStage ? 0 : Math.max(0, Math.ceil(nextThreshold - avg));

  return (
    <div className="space-y-4">
      <PageBanner
        title="愛之寵物"
        subtitle={isMaxStage ? "已達神話等級！🌟" : `距離下一階還差 ${pointsToNext} 點平均屬性`}
        emoji="🐣"
        gradient="leaf"
        stats={[
          { label: "階段", value: PET_STAGE_LABEL[pet.stage] },
          { label: "平均", value: `${avg.toFixed(0)}/100` },
          { label: "下一階", value: isMaxStage ? "—" : PET_STAGE_LABEL[nextStageIdx] },
        ]}
      />

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

        {/* 下一階段進度 — 鼓勵前期達成 */}
        {!isMaxStage && (
          <div className="mt-5 mx-auto max-w-xs">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-xs text-empire-mute">下一階</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center ring-2 ring-empire-berry/40 overflow-hidden opacity-70 grayscale">
                  <PetAvatar stage={nextStageIdx as 0 | 1 | 2 | 3 | 4} size={40} animate={false} />
                </div>
                <div className="absolute -top-1 -right-2 text-[10px] bg-empire-berry text-white px-1.5 py-0.5 rounded-full font-bold">
                  ?
                </div>
              </div>
              <div className="text-xs font-bold text-empire-ink">{PET_STAGE_LABEL[nextStageIdx]}</div>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-empire-berry to-empire-sunshine transition-all"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="text-[10px] text-empire-mute text-center mt-1">
              還差 <b className="text-empire-ink">{pointsToNext}</b> 點平均屬性 · {STAGE_HINT[nextStageIdx]}
            </div>
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
            const isNext = i === nextStageIdx && !isMaxStage;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition ${
                  active ? "bg-empire-pink/20 ring-2 ring-empire-berry/40" : isNext ? "bg-empire-cream ring-2 ring-empire-gold/60 animate-pulse" : "bg-empire-cloud opacity-35 grayscale"
                }`}>
                  <PetAvatar stage={i} size={48} animate={false} />
                </div>
                <div className={`text-xs ${active ? "text-empire-ink font-semibold" : isNext ? "text-empire-gold font-bold" : "text-empire-mute"}`}>
                  {PET_STAGE_LABEL[i]}
                </div>
                <div className="text-[9px] text-empire-mute">
                  {i === 0 ? "起點" : `平均 ${STAGE_THRESHOLDS[i]}+`}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-empire-mute mt-4 text-center leading-relaxed">
          五屬性平均達門檻就進化 · 新手友善曲線：15 / 35 / 65 / 90
          <br />前兩階段隨便餵幾次就能看到變化 · 最終階段挑戰性高
        </p>
      </div>
    </div>
  );
}
