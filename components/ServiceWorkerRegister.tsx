"use client";

import { useEffect } from "react";

/** 客戶端註冊 Service Worker，開啟 PWA 安裝 + Web Push 能力 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // 開發模式不註冊（避免 Next dev HMR 衝突）
    if (window.location.hostname === "localhost") return;

    navigator.serviceWorker.register("/sw.js").catch((e) => {
      console.warn("[sw] register failed", e);
    });
  }, []);

  return null;
}
