"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useGame } from "@/lib/store";

function PairForm() {
  const router = useRouter();
  const search = useSearchParams();
  const login = useGame((s) => s.login);
  const [code, setCode] = useState("");

  useEffect(() => {
    const q = search?.get("code");
    if (q) setCode(q.toUpperCase().slice(0, 6));
  }, [search]);

  return (
    <div className="max-w-md w-full card p-8">
      <div className="text-6xl text-center">💑</div>
      <h1 className="mt-3 text-2xl font-bold text-center">輸入配對碼</h1>
      <p className="text-center text-sm text-slate-500 mt-1">請輸入另一半給你的 6 碼邀請碼</p>

      <div className="mt-8">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="LV4817"
          className="w-full text-center tracking-[0.5em] text-3xl font-bold py-4 border-2 border-empire-cloud rounded-2xl focus:outline-none focus:border-empire-sky"
        />
      </div>

      <button
        onClick={() => {
          login("prince");
          router.push("/dashboard");
        }}
        disabled={code.length < 4}
        className="mt-6 btn-primary w-full py-3.5 font-semibold"
      >
        加入王國
      </button>

      <Link href="/login" className="block text-center text-sm text-empire-sky hover:underline mt-4">
        返回登入
      </Link>
    </div>
  );
}

export default function PairPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <Suspense fallback={<div className="card p-8">載入中…</div>}>
        <PairForm />
      </Suspense>
    </main>
  );
}
