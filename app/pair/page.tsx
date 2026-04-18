"use client";

/**
 * /pair 已合併到 /login — 此頁僅作為舊連結相容，把 ?code= 參數轉發過去。
 */
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PairRedirect() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const code = search?.get("code");
    router.replace(code ? `/login?code=${encodeURIComponent(code)}` : "/login");
  }, [router, search]);

  return (
    <main className="min-h-screen flex items-center justify-center text-empire-mute">
      前往登入…
    </main>
  );
}

export default function PairPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-empire-mute">載入中…</div>}>
      <PairRedirect />
    </Suspense>
  );
}
