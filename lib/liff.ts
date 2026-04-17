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

/** liff 是否已完成 init（避免 isApiAvailable 未 init 直接 throw） */
function liffInitialized(liff: Liff | null): boolean {
  if (!liff) return false;
  try {
    return typeof liff.getOS === "function" && !!liff.getOS();
  } catch {
    return false;
  }
}

/** 是否可以使用 shareTargetPicker (分享到朋友/群組) */
export async function canShare(): Promise<boolean> {
  const liff = await loadLiff();
  if (!liffInitialized(liff)) return false;
  try {
    return liff!.isApiAvailable("shareTargetPicker");
  } catch {
    return false;
  }
}

/** 分享配對邀請碼 — LIFF 可用則走 shareTargetPicker，否則 Web Share / Clipboard fallback */
export async function shareInvite(inviteCode: string, appUrl: string): Promise<boolean> {
  const liff = await loadLiff();

  let liffShareOk = false;
  try {
    liffShareOk = liffInitialized(liff) && liff!.isApiAvailable("shareTargetPicker");
  } catch {
    liffShareOk = false;
  }

  const text = `💞 加入我的愛的帝國！\n配對碼：${inviteCode}\n${appUrl}/pair?code=${inviteCode}`;

  if (!liffShareOk) {
    // 非 LIFF 環境：Web Share API > Clipboard
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "愛的帝國 · 配對邀請",
          text,
          url: `${appUrl}/pair?code=${inviteCode}`,
        });
        return true;
      } catch (e: any) {
        // 使用者取消不算失敗 → 繼續 clipboard
        if (e?.name !== "AbortError") console.warn("[share] web share failed", e);
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.warn("[share] clipboard failed", e);
      }
    }
    // 最後防線：製造一個 textarea 強制複製（舊瀏覽器 / 非 HTTPS）
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }

  if (!liff) return false; // 不可能發生，但幫 TS 收斂型別

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

/** 分享「時刻 / 成就」到社群 — LIFF → Web Share → Clipboard */
export async function shareMoment(
  args: { title: string; subtitle?: string; emoji: string; coupleName: string; appUrl: string },
): Promise<"liff" | "webshare" | "clipboard" | "failed"> {
  const { title, subtitle, emoji, coupleName, appUrl } = args;
  const text = `${emoji} ${title}\n${subtitle ?? ""}\n— 愛的帝國 · ${coupleName} —\n${appUrl}/plaza`;
  const liff = await loadLiff();

  let liffShareOk = false;
  try {
    liffShareOk = liffInitialized(liff) && liff!.isApiAvailable("shareTargetPicker");
  } catch { liffShareOk = false; }

  if (liffShareOk && liff) {
    try {
      await liff.shareTargetPicker([{
        type: "flex",
        altText: `${emoji} ${title}`,
        contents: {
          type: "bubble",
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: emoji, size: "4xl", align: "center" },
              { type: "text", text: title, size: "xl", weight: "bold", align: "center", color: "#2d4f6a", wrap: true },
              ...(subtitle ? [{ type: "text" as const, text: subtitle, size: "sm", align: "center" as const, color: "#6b8ca7", wrap: true }] : []),
            ],
            backgroundColor: "#fff5e0",
            paddingAll: "24px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: `— 愛的帝國 · ${coupleName} —`, size: "xs", color: "#6b8ca7", align: "center" },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "button", style: "primary", color: "#ff5f8d",
                action: { type: "uri", label: "看看廣場", uri: `${appUrl}/plaza` } },
            ],
          },
        },
      }]);
      return "liff";
    } catch { /* fall through */ }
  }

  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share({ title: `${emoji} ${title}`, text, url: `${appUrl}/plaza` });
      return "webshare";
    } catch (e: any) {
      if (e?.name !== "AbortError") console.warn("[shareMoment] webshare failed", e);
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "clipboard";
  } catch {
    return "failed";
  }
}

/** 在 LIFF 環境內關閉視窗 */
export async function closeLiffWindow() {
  const liff = await loadLiff();
  if (liff?.isInClient()) liff.closeWindow();
}
