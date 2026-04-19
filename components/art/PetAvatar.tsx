"use client";

import { PetSprite } from "./PetSprite";
import type { PetSpecies, PetGeneRarity } from "@/lib/types";

/**
 * 寵物頭像 — 舊 API 相容層
 *
 * 舊版用 <Image src={`/art/pet/stage-${stage}.svg`} />；C1 批次後改走 <PetSprite />
 * （5 系吉伊卡哇風 SVG）。所有舊呼叫點仍可用（只傳 stage），會預設 nuzzle/common。
 */
interface Props {
  stage: 0 | 1 | 2 | 3 | 4;
  size?: number;
  animate?: boolean;
  className?: string;
  species?: PetSpecies;
  rarity?: PetGeneRarity;
}

export function PetAvatar({ stage, size = 120, animate = true, className = "", species = "nuzzle", rarity = "common" }: Props) {
  return <PetSprite species={species} stage={stage} rarity={rarity} size={size} animate={animate} className={className} />;
}

export const PET_STAGE_LABEL = ["蛋", "幼體", "成型", "傳說", "神話"] as const;
