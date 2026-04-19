"use client";

/**
 * 寵物主動提醒 — 監聽狀態 + 每小時檢查，適當時機彈 toast
 *
 * 觸發條件（每條每日最多 1 次）：
 * 1. hungry (24hr 未餵) → 我餓了…陪我玩嘛
 * 2. bond 雙方差 ≥ 20 → XXX 好久沒餵我了
 * 3. stage 0 + totalFeeds < 2 → 只要餵 2 次就能破殼，快來摸我！
 */

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/store";
import { toast } from "./Toast";

const NUDGE_STORAGE_KEY = "loveempire.petnudge.v1";

function readNudgeState(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NUDGE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function writeNudgeState(state: Record<string, string>) {
  try { localStorage.setItem(NUDGE_STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function PetNudge() {
  const pet = useGame((s) => s.pet);
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const loggedIn = useGame((s) => s.loggedIn);
  const lastCheckedAt = useRef<number>(0);

  useEffect(() => {
    if (!loggedIn) return;

    const check = () => {
      // 節流：10 分鐘內不重複檢查
      if (Date.now() - lastCheckedAt.current < 10 * 60 * 1000) return;
      lastCheckedAt.current = Date.now();

      const today = new Date().toISOString().slice(0, 10);
      const state = readNudgeState();

      const myName = role === "queen" ? couple.queen.nickname : couple.prince.nickname;
      const partnerName = role === "queen" ? couple.prince.nickname : couple.queen.nickname;
      const myBond = role === "queen" ? (pet.bondQueen ?? 0) : (pet.bondPrince ?? 0);
      const partnerBond = role === "queen" ? (pet.bondPrince ?? 0) : (pet.bondQueen ?? 0);

      // 1. hungry（24hr 未餵）
      const hoursSinceFed = (Date.now() - new Date(pet.lastFedAt).getTime()) / 36e5;
      if (hoursSinceFed > 24 && state["hungry"] !== today) {
        toast.warn(`🥺 ${pet.name} 已經 ${Math.floor(hoursSinceFed)} 小時沒被餵了…陪我玩嘛`);
        writeNudgeState({ ...state, hungry: today });
        return;
      }

      // 2. bond 差 ≥ 20（我這邊比對方多，表示對方冷落寵物）
      const bondGap = myBond - partnerBond;
      if (bondGap >= 20 && state["bond_gap"] !== today) {
        toast.info(`💭 ${pet.name} 說：「${partnerName} 好久沒來摸我了…」`);
        writeNudgeState({ ...state, bond_gap: today });
        return;
      }

      // 3. stage 0 + totalFeeds < 2
      const totalFeeds = (pet.feedCountQueen ?? 0) + (pet.feedCountPrince ?? 0);
      if (pet.stage === 0 && totalFeeds < 2 && state["hatch_hint"] !== today) {
        toast.info(`🥚 ${pet.name}：再餵 ${2 - totalFeeds} 次就能破殼！`);
        writeNudgeState({ ...state, hatch_hint: today });
        return;
      }
    };

    // 進頁面 3 秒後檢查一次（讓 state 先 hydrate）
    const t1 = setTimeout(check, 3000);
    // 之後每 30 分鐘檢查
    const t2 = setInterval(check, 30 * 60 * 1000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, [loggedIn, pet, couple, role]);

  return null;
}
