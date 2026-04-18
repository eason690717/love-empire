"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requestPasswordReset, isSupabaseEnabled } from "@/lib/auth";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async () => {
    if (!email.trim()) { setErr("請輸入 email"); return; }
    if (!isSupabaseEnabled()) {
      setErr("Demo 模式不需要密碼，換 email 重新建國即可");
      return;
    }
    setState("sending");
    setErr(null);
    const { error } = await requestPasswordReset(email.trim());
    if (error) {
      setState("error");
      setErr(error);
      return;
    }
    setState("sent");
    setCooldown(60);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full card p-8 relative overflow-hidden">
        <div className="absolute -left-3 top-4 text-4xl opacity-60 animate-float-slow">🔑</div>
        <div className="absolute right-2 top-10 text-3xl opacity-70 animate-bob">💌</div>

        <div className="text-6xl text-center">🔑</div>
        <h1 className="mt-3 text-center font-display text-2xl font-black text-empire-ink">忘記密碼</h1>
        <p className="text-center text-sm text-empire-mute mt-1">輸入註冊時的 email，我們會寄重設連結</p>

        {state === "sent" ? (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
            <div className="text-4xl">📬</div>
            <div className="mt-2 font-bold text-emerald-700">重設信已寄出</div>
            <div className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
              到 <b>{email}</b> 收信<br />
              連結 1 小時內有效 · 若沒收到請檢查垃圾郵件
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={handleSubmit}
                disabled={cooldown > 0}
                className="btn-ghost px-4 py-2 text-sm font-semibold"
              >
                {cooldown > 0 ? `${cooldown} 秒後可重寄` : "重新寄送"}
              </button>
              <Link href="/login" className="btn-primary px-4 py-2 text-sm">返回登入</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-empire-mute flex items-center gap-2">
                  <span className="sprout-dot" /> 註冊信箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
                />
              </div>

              {err && <div className="text-sm text-rose-600">{err}</div>}

              <button
                onClick={handleSubmit}
                disabled={state === "sending"}
                className="btn-primary w-full py-3.5 text-base"
              >
                {state === "sending" ? "寄送中…" : "✉️ 寄重設連結"}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-empire-cloud text-xs text-empire-mute leading-relaxed">
              💡 <b>忘記註冊哪個 email？</b><br />
              如果完全找不回：用另一個 email 重新建國，原有的資料暫時無法救回（未來會加「帳號綁定配對碼」回找機制）。
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <Link href="/login" className="text-empire-sky font-semibold hover:underline">
                ← 返回登入
              </Link>
              <Link href="/register" className="text-empire-berry font-semibold hover:underline">
                建立新王國
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
