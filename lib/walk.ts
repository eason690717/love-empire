"use client";

/**
 * 步數追蹤 — 支援 3 層 fallback：
 *
 * 1. Capacitor Pedometer（行動 APP 打包後最穩）— 尚未接入
 * 2. DeviceMotionEvent + accelerometer 估算（手機瀏覽器走路可偵測）
 * 3. 手動輸入（web 端誠實模式 + 每日上限）
 *
 * 設計重點：
 *  - 每日計數（06:00 reset）
 *  - 上限防作弊：單日手動上限 20000 步，accelerometer 上限 30000 步
 *  - 雙人同步加成：若兩人在同 5 分鐘內都有步數，觸發情侶共鳴 +50%
 */

const STORAGE_KEY = "loveempire.walk.v1";
const DAILY_MANUAL_CAP = 20000;
const DAILY_AUTO_CAP = 30000;
const STEP_PER_XP = 1000; // 每 1000 步 = 1 pet XP

export interface WalkState {
  date: string;           // YYYY-MM-DD
  steps: number;
  startedAt?: string;     // 本次散步開始時間
  petXpEarned: number;    // 今日累積已發寵物 XP
  lastActiveAt?: string;  // 最後偵測到步數的時間（用於雙人同步判斷）
}

function getToday(): string {
  // 以 06:00 為一天分界（更符合生活作息）
  const now = new Date();
  if (now.getHours() < 6) now.setDate(now.getDate() - 1);
  return now.toISOString().slice(0, 10);
}

export function loadWalkState(): WalkState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as WalkState;
    // 隔日自動 reset
    if (parsed.date !== getToday()) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

function emptyState(): WalkState {
  return { date: getToday(), steps: 0, petXpEarned: 0 };
}

export function saveWalkState(state: WalkState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/** 增加步數（自動處理上限 + 回傳新 XP 應該加給寵物） */
export function addSteps(count: number, source: "auto" | "manual" = "auto"): { newState: WalkState; xpEarned: number } {
  const state = loadWalkState();
  const cap = source === "auto" ? DAILY_AUTO_CAP : DAILY_MANUAL_CAP;
  const newSteps = Math.min(cap, state.steps + count);
  const actualAdded = newSteps - state.steps;
  // 計算新增 XP（1000 步 = 1 XP）
  const totalXpShould = Math.floor(newSteps / STEP_PER_XP);
  const xpEarned = totalXpShould - state.petXpEarned;
  const next: WalkState = {
    ...state,
    steps: newSteps,
    petXpEarned: totalXpShould,
    lastActiveAt: new Date().toISOString(),
  };
  saveWalkState(next);
  return { newState: next, xpEarned };
}

export function resetWalkState(): void {
  saveWalkState(emptyState());
}

/** 每 1000 步 1 個寶箱碎片 */
export function treasureFragmentsFromSteps(steps: number): number {
  return Math.floor(steps / 1000);
}

/** 偵測對方是否在同時段活動（5 分鐘內有步數）→ 觸發雙人共鳴加成 */
export function isCoupleSync(partnerLastActiveIso?: string, windowMinutes = 5): boolean {
  if (!partnerLastActiveIso) return false;
  const partnerTs = new Date(partnerLastActiveIso).getTime();
  const now = Date.now();
  return (now - partnerTs) <= windowMinutes * 60 * 1000;
}

// ============================================================
// DeviceMotionEvent 簡易偵測器（web 端能用）
// ============================================================

export interface PedometerHandle {
  stop: () => void;
  isActive: () => boolean;
}

/**
 * 啟動簡易步數偵測器（依加速度變化峰值）
 *  onStep(newSteps) — 新增的步數（通常 1）
 *  onError(message) — 裝置不支援時回傳
 */
export function startPedometer(
  onStep: (delta: number) => void,
  onError?: (msg: string) => void,
): PedometerHandle | null {
  if (typeof window === "undefined") return null;
  if (!("DeviceMotionEvent" in window)) {
    onError?.("裝置不支援動作感測（請改用手動輸入）");
    return null;
  }

  let lastPeak = 0;
  let active = true;
  const PEAK_THRESHOLD = 12; // m/s² — 走路時約 10-15
  const MIN_INTERVAL_MS = 300; // 步伐最短間隔

  const handler = (e: DeviceMotionEvent) => {
    if (!active) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const x = acc.x ?? 0, y = acc.y ?? 0, z = acc.z ?? 0;
    const mag = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();
    if (mag > PEAK_THRESHOLD && (now - lastPeak) > MIN_INTERVAL_MS) {
      lastPeak = now;
      onStep(1);
    }
  };

  // iOS 13+ 需要使用者授權
  const maybeRequest = (DeviceMotionEvent as any).requestPermission;
  if (typeof maybeRequest === "function") {
    maybeRequest().then((perm: string) => {
      if (perm === "granted") {
        window.addEventListener("devicemotion", handler);
      } else {
        onError?.("需要授權動作感測（iOS 設定 → Safari → 動作感測）");
      }
    }).catch(() => onError?.("授權動作感測失敗"));
  } else {
    window.addEventListener("devicemotion", handler);
  }

  return {
    stop: () => {
      active = false;
      window.removeEventListener("devicemotion", handler);
    },
    isActive: () => active,
  };
}
