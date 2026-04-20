/**
 * 情侶 Premium 共購系統（變現 45→80）
 *
 * 核心設計（全球獨家）：**雙方都付費才解鎖**
 *  - 消除單方付費另一方嫉妒 / 內疚問題
 *  - 共購 = 共同承諾，降低退訂率（要退雙方都要退）
 *  - 若一方退訂 → 先降級為試用（保留 Premium 資料 7 天），7 天後收回權益
 *
 * 價格：NT$ 149 / 月（約 USD 5）per couple（兩人都 $149 才解鎖，實際是兩人共 NT$ 298）
 *   替代方案：NT$ 1,490 / 年（一次付省 16%）
 *
 * Premium 權益（本階段 UI only，金流稍後接）：
 *  1. MIT 無限次數（不受稀有度上限）
 *  2. 寵物高級 skin / accessories
 *  3. /insights 進階儀表板（月趨勢 / 屬性 heatmap）
 *  4. 沒有廣告（之後加廣告）
 *  5. 每月專屬記憶卡（SSR 保底）
 *  6. 專屬稱號「Premium 帝國」
 */

export type PremiumStatus = "free" | "trial" | "active_single" | "active_dual" | "expired";

export interface PremiumState {
  queenPaid: boolean;
  queenPaidAt?: string;
  princePaid: boolean;
  princePaidAt?: string;
  status: PremiumStatus;
  trialEndsAt?: string;
  tier: "monthly" | "yearly";
}

export const PREMIUM_PRICES = {
  monthly: { perPerson: 149, total: 298, label: "月費" },
  yearly:  { perPerson: 1490, total: 2980, label: "年費（省 16%）" },
};

export const PREMIUM_PERKS = [
  { emoji: "♾️", title: "MIT 無限次數", desc: "不受稀有度 mint 上限" },
  { emoji: "👗", title: "寵物高級 skin", desc: "月月更新 12+ 新裝飾" },
  { emoji: "📊", title: "進階儀表板", desc: "月趨勢 / 屬性 heatmap / 預測圖" },
  { emoji: "🚫", title: "無廣告", desc: "保持純淨情侶時間" },
  { emoji: "💎", title: "每月專屬 SSR 卡", desc: "每 30 天送一張 SSR 記憶卡" },
  { emoji: "👑", title: "Premium 稱號", desc: "排行榜特殊金框" },
];

export function isPremiumActive(state: PremiumState | undefined): boolean {
  if (!state) return false;
  return state.status === "active_dual" || state.status === "trial";
}

export function computePremiumStatus(state: Partial<PremiumState>): PremiumStatus {
  if (state.queenPaid && state.princePaid) return "active_dual";
  if (state.queenPaid || state.princePaid) return "active_single";
  return "free";
}
