import * as Sentry from "@sentry/nextjs";

/**
 * Sentry 錯誤追蹤 — 只在 NEXT_PUBLIC_SENTRY_DSN 存在時啟動
 * 未設定時無任何額外 overhead
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === "production",
  });
}
