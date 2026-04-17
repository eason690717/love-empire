"use client";

/**
 * LINE LIFF integration helper.
 *
 * 模組包袱：
 *  - 非 LIFF 環境 (正常瀏覽器) 也可安全呼叫，所有 API 會 gracefully no-op
 *  - 只有設定了 NEXT_PUBLIC_LIFF_ID 才會真正初始化
 *  - 動態 import @line/liff 避免 SSR 錯誤
 */

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffState {
  ready: boolean;
  inClient: boolean;     // 是否在 LINE app 內打開 (LIFF 環境)
  loggedIn: boolean;
  profile: LiffProfile | null;
  error?: string;
}

type Liff = typeof import("@line/liff").default;
let liffCache: Liff | null = null;

async function loadLiff(): Promise<Liff | null> {
  if (typeof window === "undefined") return null;
  if (liffCache) return liffCache;
  try {
    const mod = await import("@line/liff");
    liffCache = mod.default;
    return liffCache;
  } catch (e) {
    console.warn("[liff] SDK load failed", e);
    return null;
  }
}

export async function initLiff(): Promise<LiffState> {
  const liff = await loadLiff();
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liff || !liffId) {
    return { ready: true, inClient: false, loggedIn: false, profile: null };
  }

  try {
    await liff.init({ liffId });
    const inClient = liff.isInClient();
    const loggedIn = liff.isLoggedIn();

    let profile: LiffProfile | null = null;
    if (loggedIn) {
      const p = await liff.getProfile();
      profile = {
        userId: p.userId,
        displayName: p.displayName,
        pictureUrl: p.pictureUrl,
        statusMessage: p.statusMessage,
      };
    }
    return { ready: true, inClient, loggedIn, profile };
  } catch (e) {
    console.error("[liff] init failed", e);
    return { ready: true, inClient: false, loggedIn: false, profile: null, error: String(e) };
  }
}

export async function loginLiff(redirectUri?: string) {
  const liff = await loadLiff();
  if (!liff) return;
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri });
  }
}

export async function logoutLiff() {
  const liff = await loadLiff();
  if (!liff) return;
  if (liff.isLoggedIn()) liff.logout();
}

/** 是否可以使用 shareTargetPicker (分享到朋友/群組) */
export async function canShare(): Promise<boolean> {
  const liff = await loadLiff();
  if (!liff) return false;
  try {
    return liff.isApiAvailable("shareTargetPicker");
  } catch {
    return false;
  }
}

/** 分享配對邀請碼到 LINE 朋友 / 群組 */
export async function shareInvite(inviteCode: string, appUrl: string): Promise<boolean> {
  const liff = await loadLiff();
  if (!liff || !liff.isApiAvailable("shareTargetPicker")) {
    // fallback：複製連結 + Web Share API
    const text = `💞 加入我的愛的帝國！\n配對碼：${inviteCode}\n${appUrl}/pair`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as any).share({ title: "愛的帝國 · 配對邀請", text, url: `${appUrl}/pair` });
        return true;
      } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  try {
    await liff.shareTargetPicker([
      {
        type: "flex",
        altText: `💞 愛的帝國配對邀請 — ${inviteCode}`,
        contents: {
          type: "bubble",
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "💞 愛的帝國", size: "xl", weight: "bold", align: "center", color: "#ff5f8d" },
              { type: "text", text: "配對邀請", size: "sm", align: "center", color: "#6b8ca7" },
            ],
            backgroundColor: "#fff5e0",
            paddingAll: "20px",
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              { type: "text", text: "另一半邀請你一起建立帝國", wrap: true, size: "sm", color: "#2d4f6a" },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  { type: "text", text: "配對碼", size: "xs", color: "#6b8ca7", align: "center" },
                  { type: "text", text: inviteCode, size: "xxl", weight: "bold", align: "center", color: "#2d4f6a" },
                ],
                backgroundColor: "#e6f3fc",
                cornerRadius: "md",
                paddingAll: "16px",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                color: "#ff5f8d",
                action: { type: "uri", label: "加入帝國", uri: `${appUrl}/pair?code=${inviteCode}` },
              },
            ],
          },
        },
      },
    ]);
    return true;
  } catch (e) {
    console.warn("[liff] share failed", e);
    return false;
  }
}

/** 在 LIFF 環境內關閉視窗 */
export async function closeLiffWindow() {
  const liff = await loadLiff();
  if (liff?.isInClient()) liff.closeWindow();
}
