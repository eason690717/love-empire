"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useGame } from "@/lib/store";

function PairForm() {
  const router = useRouter();
  const search = useSearchParams();
  const login = useGame((s) => s.login);
  const setNickname = useGame((s) => s.setNickname);
  const [code, setCode] = useState("");
  const [nickname, setNick] = useState("");
  const [role, setRole] = useState<"queen" | "prince">("prince");

  useEffect(() => {
    const q = search?.get("code");
    if (q) setCode(q.toUpperCase().slice(0, 6));
  }, [search]);

  const handleJoin = () => {
    if (nickname.trim()) setNickname(role, nickname);
    login(role);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md w-full card p-8">
      <div className="text-6xl text-center">💑</div>
      <h1 className="mt-3 text-2xl font-bold text-center">加入王國</h1>
      <p className="text-center text-sm text-slate-500 mt-1">輸入另一半給你的 6 碼邀請碼</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-slate-500">配對碼</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="LV4817"
            className="mt-2 w-full text-center tracking-[0.5em] text-3xl font-bold py-4 border-2 border-empire-cloud rounded-2xl focus:outline-none focus:border-empire-sky"
          />
        </div>

        <div>
          <label className="text-sm text-slate-500">你的稱號</label>
          <input
            value={nickname}
            onChange={(e) => setNick(e.target.value)}
            placeholder="e.g. 阿藍 / 小澤 / 寶貝"
            maxLength={20}
            className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
          />
        </div>

        <div>
          <label className="text-sm text-slate-500">你在這段關係的角色</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <RoleBtn active={role === "queen"} onClick={() => setRole("queen")}>
              <span className="text-xl">🌸</span> 我是阿紅 (建議先建國那位)
            </RoleBtn>
            <RoleBtn active={role === "prince"} onClick={() => setRole("prince")}>
              <span className="text-xl">💎</span> 我是阿藍 (用配對碼加入)
            </RoleBtn>
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={code.length < 4}
          className="btn-primary w-full py-3.5 font-semibold"
        >
          加入王國
        </button>

        <Link href="/login" className="block text-center text-sm text-empire-sky hover:underline">
          返回登入
        </Link>
      </div>
    </div>
  );
}

function RoleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
        active
          ? "border-empire-sky bg-empire-cloud text-empire-ink"
          : "border-empire-cloud bg-white text-empire-mute hover:border-empire-sky/50"
      }`}
    >
      {children}
    </button>
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
