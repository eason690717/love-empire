import type { Pet } from "@/lib/types";

/**
 * 寵物情緒狀態 — 依最近 48h 互動密度 + 雙人親密度差距計算
 *
 * happy     開心：48h 內餵過、雙人親密度接近（差距 ≤ 15）
 * content   滿足：24-48h 內餵過，一般狀態
 * hungry    餓：48-72h 沒餵
 * sad       難過：雙方親密度差距 ≥ 30（一方被冷落）
 * lonely    想念：>72h 沒餵（會觸發 bond 衰減）
 * starving  快餓死：>120h (5 天) 沒餵（嚴重衰減）
 */
export type PetMood = "happy" | "content" | "hungry" | "sad" | "lonely" | "starving";

export interface PetMoodInfo {
  mood: PetMood;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  hoursSinceLastFed: number;
  bondGap: number;
  decayRate: number; // 每 24h 衰減的 bond（0 = 不衰減）
}

const MOOD_META: Record<PetMood, { emoji: string; label: string; desc: string; color: string; decayRate: number }> = {
  happy:    { emoji: "😊", label: "超開心", desc: "最近被兩個人疼愛，心滿意足",       color: "#8ed172", decayRate: 0 },
  content:  { emoji: "🙂", label: "滿足",   desc: "狀態不錯，可以再加溫一下",         color: "#5aa4ff", decayRate: 0 },
  hungry:   { emoji: "🥺", label: "有點餓", desc: "快超過一天沒餵了，該互動囉",       color: "#ffd447", decayRate: 0 },
  sad:      { emoji: "😔", label: "有點失落", desc: "感受到兩個主人的關愛差太多",     color: "#b0b0c8", decayRate: 1 },
  lonely:   { emoji: "😿", label: "好想念", desc: "超過 3 天沒人陪，親密度開始下降",  color: "#e89ac7", decayRate: 2 },
  starving: { emoji: "💔", label: "心碎中", desc: "超過 5 天沒人陪，親密度快速下降",  color: "#ff7fa1", decayRate: 4 },
};

export function calcMood(pet: Pet): PetMoodInfo {
  const now = Date.now();
  const lastFed = pet.lastFedAt ? new Date(pet.lastFedAt).getTime() : now;
  const hoursSince = Math.max(0, (now - lastFed) / 3600000);
  const bondGap = Math.abs((pet.bondQueen ?? 0) - (pet.bondPrince ?? 0));

  let mood: PetMood;
  if (hoursSince >= 120) mood = "starving";
  else if (hoursSince >= 72) mood = "lonely";
  else if (hoursSince >= 48) mood = "hungry";
  else if (bondGap >= 30) mood = "sad";
  else if (hoursSince <= 24 && bondGap <= 15) mood = "happy";
  else mood = "content";

  const meta = MOOD_META[mood];
  return {
    mood,
    ...meta,
    hoursSinceLastFed: Math.floor(hoursSince),
    bondGap,
  };
}

/**
 * 依情緒衰減 bond — 每 24h 呼叫一次會合理
 *  sad/lonely/starving 會降低雙方 bond（讓使用者有壓力再來互動）
 *  衰減最低到 0，不會變負
 */
export function applyBondDecay(pet: Pet): Pet {
  const info = calcMood(pet);
  if (info.decayRate === 0) return pet;
  // 若超過 72h 沒餵，每 24h 扣 decayRate
  const daysSince = info.hoursSinceLastFed / 24;
  const decay = Math.floor(daysSince) * info.decayRate;
  if (decay <= 0) return pet;
  return {
    ...pet,
    bondQueen: Math.max(0, (pet.bondQueen ?? 0) - decay),
    bondPrince: Math.max(0, (pet.bondPrince ?? 0) - decay),
  };
}
