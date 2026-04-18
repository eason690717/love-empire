"use client";

/**
 * 裝置綁定 — 一個瀏覽器只會綁到一對王國的一個角色。
 *
 * 儲存：localStorage（per-origin）
 *  - 鑰匙 + 暱稱 + 角色
 *
 * 邏輯：
 *  - 登入/建國成功 → 寫入
 *  - 下次進 /login 頁 → 讀出 → 預填 + 角色鎖定（灰色不可改）
 *  - 登出（logout action）→ 清除，允許重新綁定
 */

const KEY = "loveempire.device.v1";

export interface DeviceBinding {
  role: "queen" | "prince";
  kingdomKey: string;
  nickname: string;
  boundAt: string;
}

export function readDeviceBinding(): DeviceBinding | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeviceBinding;
    if (!parsed?.role || !parsed?.kingdomKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDeviceBinding(b: Omit<DeviceBinding, "boundAt">): void {
  if (typeof window === "undefined") return;
  try {
    const full: DeviceBinding = { ...b, boundAt: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(full));
  } catch { /* ignore */ }
}

export function clearDeviceBinding(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
