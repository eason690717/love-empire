"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
    console.error("[boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full card p-8 text-center">
        <div className="text-6xl">🌧️</div>
        <h1 className="mt-4 font-display font-black text-2xl">出了點狀況</h1>
        <p className="mt-2 text-sm text-empire-mute">
          系統遇到錯誤。已自動回報，我們會盡快修。
        </p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-4 p-3 rounded-lg bg-rose-50 text-left text-xs overflow-auto max-h-40 text-rose-700">
            {error.message}
          </pre>
        )}
        <div className="mt-6 space-y-2">
          <button onClick={reset} className="btn-primary w-full py-3">
            再試一次
          </button>
          <Link href="/" className="btn-ghost w-full py-3 block">
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
