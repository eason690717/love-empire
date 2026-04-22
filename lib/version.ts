/**
 * App 版號 — 每次實質性修改（feat/fix）commit 前 bump patch，
 * 月份跨越或大功能併入時 bump minor。
 *
 * 顯示位置：
 *  - /login 頁底部
 *  - (game) layout 底部 footer
 *  - 任何 about / 關於 頁面
 *
 * 格式：major.minor.patch（semver）· 日期標籤（YYYY-MM-DD）
 */
export const APP_VERSION = "2.1.0";
export const BUILD_DATE = "2026-04-20";
export const VERSION_LABEL = `v${APP_VERSION} · ${BUILD_DATE}`;
export const VERSION_CHANNEL = "公測";

/** UI 常用的完整字串：「公測 v0.4.0 · 2026-04-20」 */
export const VERSION_STRING = `${VERSION_CHANNEL} ${VERSION_LABEL}`;

// ============================================================
// Feature flags — 控制尚未上線功能的 UI 顯示
// ============================================================
/** Premium 共購訂閱 — 等 LINE Pay 合約 + 金流接入完成才開放 */
export const FEATURE_PREMIUM_ENABLED = false;
