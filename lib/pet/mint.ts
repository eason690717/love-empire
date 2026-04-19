import type { Pet, PetSpecies, PetGeneRarity, PetGeneColor, PetGenePattern, PetGeneFace, PetGeneAccessory } from "@/lib/types";
import { SPECIES, resolveSpecies } from "./species";
import { RARITY, RARITY_ORDER, rarityRank, resolveRarity } from "./rarity";

/**
 * MIT 繁殖引擎 — 類似 StepN 的雙鞋 mint
 *
 * 規則：
 *  - 雙親 stage ≥ 3（傳說級才能繁殖）
 *  - 雙親 mintCount < 稀有度上限（N 2 / R 3 / SR 5 / SSR 7 / UR ∞）
 *  - 雙親間 cooldown 7 天（最後一次繁殖時間）
 *  - 消耗 coin = base 200 × 2^(父A mintCount + 父B mintCount)
 *
 * 子代生成：
 *  - 類型：50/50 從父母，5% 突變（隨機基本系），
 *          若父母皆 SSR+ 且同類 → 0.5% 機率出 Lumen
 *  - 稀有度：基準 min(父A, 父B)，升格機率 = (A rank + B rank) × 3%
 *  - 基因 4 軸：每軸 50/50 從父母，5% 突變到隨機新值
 */

const MINT_BASE_COIN = 200;
const MINT_COOLDOWN_DAYS = 7;
const MUTATION_RATE = 0.05;
const LUMEN_CHANCE_WHEN_BOTH_SSR_SAME_SPECIES = 0.005;
const UPGRADE_PER_RANK = 0.03;

const BASIC_SPECIES: PetSpecies[] = ["nuzzle", "spark", "sturdy", "glide"];
const COLORS: PetGeneColor[] = ["pink", "blue", "yellow", "purple", "green", "rainbow"];
const PATTERNS: PetGenePattern[] = ["plain", "spot", "star", "heart"];
const FACES: PetGeneFace[] = ["smile", "sleepy", "shock", "cool"];
const ACCESSORIES: PetGeneAccessory[] = ["none", "crown", "ribbon", "glasses", "wings"];

export interface MintEligibility {
  ok: boolean;
  reason?: string;
}

export interface MintExpectation {
  coinCost: number;
  parentACooldownLeftDays: number;
  parentBCooldownLeftDays: number;
  species: {
    /** 機率 0-1 */
    keepA: number;
    keepB: number;
    mutate: number;
    lumen: number;
  };
  rarity: {
    base: PetGeneRarity;
    upgradeChance: number;
    upgradeTo?: PetGeneRarity;
  };
  lumenEligible: boolean;
}

export interface MintResult {
  species: PetSpecies;
  rarity: PetGeneRarity;
  gene: {
    color: PetGeneColor;
    pattern: PetGenePattern;
    face: PetGeneFace;
    accessory: PetGeneAccessory;
  };
  coinCost: number;
}

/** 檢查兩隻寵物是否可繁殖 */
export function checkEligibility(a: Pet, b: Pet): MintEligibility {
  if (!a.id || !b.id) return { ok: false, reason: "寵物資料不完整" };
  if (a.id === b.id) return { ok: false, reason: "同一隻寵物不能繁殖" };
  if (a.stage < 3) return { ok: false, reason: `「${a.name}」還沒到傳說階段（stage 3）` };
  if (b.stage < 3) return { ok: false, reason: `「${b.name}」還沒到傳說階段（stage 3）` };

  const aLimit = RARITY[resolveRarity(a.rarity)].mintLimit;
  const bLimit = RARITY[resolveRarity(b.rarity)].mintLimit;
  if ((a.mintCount ?? 0) >= aLimit) return { ok: false, reason: `「${a.name}」繁殖次數已滿 (${aLimit} 次)` };
  if ((b.mintCount ?? 0) >= bLimit) return { ok: false, reason: `「${b.name}」繁殖次數已滿 (${bLimit} 次)` };

  const cooldownA = cooldownLeftDays(a);
  const cooldownB = cooldownLeftDays(b);
  if (cooldownA > 0) return { ok: false, reason: `「${a.name}」冷卻中，還要 ${cooldownA} 天` };
  if (cooldownB > 0) return { ok: false, reason: `「${b.name}」冷卻中，還要 ${cooldownB} 天` };

  return { ok: true };
}

/** 父母最後一次繁殖後剩餘冷卻天數（0 = 可繁殖） */
function cooldownLeftDays(pet: Pet): number {
  if (!pet.lastMatedAt) return 0;
  const last = new Date(pet.lastMatedAt).getTime();
  const now = Date.now();
  const daysSince = (now - last) / 86400000;
  const left = MINT_COOLDOWN_DAYS - daysSince;
  return left > 0 ? Math.ceil(left) : 0;
}

export function calcCoinCost(a: Pet, b: Pet): number {
  const total = (a.mintCount ?? 0) + (b.mintCount ?? 0);
  return MINT_BASE_COIN * Math.pow(2, total);
}

/** 顯示給玩家的期望值（機率分佈 + 費用） */
export function getExpectation(a: Pet, b: Pet): MintExpectation {
  const aSp = resolveSpecies(a.species);
  const bSp = resolveSpecies(b.species);
  const aRank = rarityRank(resolveRarity(a.rarity));
  const bRank = rarityRank(resolveRarity(b.rarity));
  const bothSsrPlus = aRank >= 3 && bRank >= 3;
  const sameSpecies = aSp === bSp;
  const lumenChance = bothSsrPlus && sameSpecies ? LUMEN_CHANCE_WHEN_BOTH_SSR_SAME_SPECIES : 0;

  const mutateChance = MUTATION_RATE;
  const remain = 1 - lumenChance - mutateChance;
  const keepA = sameSpecies ? remain : remain * 0.5;
  const keepB = sameSpecies ? 0 : remain * 0.5;

  const baseRank = Math.min(aRank, bRank);
  const upgradeChance = Math.min(1, (aRank + bRank) * UPGRADE_PER_RANK);

  return {
    coinCost: calcCoinCost(a, b),
    parentACooldownLeftDays: cooldownLeftDays(a),
    parentBCooldownLeftDays: cooldownLeftDays(b),
    species: {
      keepA,
      keepB,
      mutate: mutateChance,
      lumen: lumenChance,
    },
    rarity: {
      base: RARITY_ORDER[baseRank],
      upgradeChance,
      upgradeTo: baseRank < 4 ? RARITY_ORDER[baseRank + 1] : undefined,
    },
    lumenEligible: bothSsrPlus && sameSpecies,
  };
}

/** 真正 roll 結果（扣錢後呼叫） */
export function executeMint(a: Pet, b: Pet): MintResult {
  const aSp = resolveSpecies(a.species);
  const bSp = resolveSpecies(b.species);
  const aRank = rarityRank(resolveRarity(a.rarity));
  const bRank = rarityRank(resolveRarity(b.rarity));

  // 類型
  let species: PetSpecies;
  const roll = Math.random();
  const bothSsrPlus = aRank >= 3 && bRank >= 3;
  const sameSpecies = aSp === bSp;
  if (bothSsrPlus && sameSpecies && roll < LUMEN_CHANCE_WHEN_BOTH_SSR_SAME_SPECIES) {
    species = "lumen";
  } else if (roll < LUMEN_CHANCE_WHEN_BOTH_SSR_SAME_SPECIES + MUTATION_RATE) {
    // 突變：從基本系挑（排除父母的系）
    const pool = BASIC_SPECIES.filter((s) => s !== aSp && s !== bSp);
    species = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (Math.random() < 0.5 ? aSp : bSp);
  } else {
    species = Math.random() < 0.5 ? aSp : bSp;
  }

  // 稀有度
  const baseRank = Math.min(aRank, bRank);
  const upgradeChance = Math.min(1, (aRank + bRank) * UPGRADE_PER_RANK);
  const upgraded = Math.random() < upgradeChance;
  let rarityIdx = upgraded ? Math.min(baseRank + 1, 4) : baseRank;
  // 出 Lumen 時稀有度至少 SSR
  if (species === "lumen" && rarityIdx < 3) rarityIdx = 3;
  const rarity = RARITY_ORDER[rarityIdx];

  // 基因
  const gene = {
    color: pick(a.gene?.color ?? "pink", b.gene?.color ?? "pink", COLORS),
    pattern: pick(a.gene?.pattern ?? "plain", b.gene?.pattern ?? "plain", PATTERNS),
    face: pick(a.gene?.face ?? "smile", b.gene?.face ?? "smile", FACES),
    accessory: pick(a.gene?.accessory ?? "none", b.gene?.accessory ?? "none", ACCESSORIES),
  };

  return {
    species,
    rarity,
    gene,
    coinCost: calcCoinCost(a, b),
  };
}

function pick<T>(x: T, y: T, pool: readonly T[]): T {
  const r = Math.random();
  if (r < MUTATION_RATE) return pool[Math.floor(Math.random() * pool.length)];
  return r < (MUTATION_RATE + (1 - MUTATION_RATE) / 2) ? x : y;
}
