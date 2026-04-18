"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updatePassword, isSupabaseEnabled } from "@/lib/auth";

/**
 * 使用者從 email 點重設連結會帶到這頁
 * Supabase redirect URL: /reset-password#access_token=...&type=recovery&refresh_token=...
 * Supabase JS SDK 自動處理 hash token → 建立 session，我們只要 updateUser({ password }) 即可
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "ready" | "updating" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  // 偵測 recovery session 是否有效
  useEffect(() => {
    (async () => {
      if (!isSupabaseEnabled()) {
        setErr("Demo 模式未啟用 Supabase，此頁僅在正式環境有效");
        return;
      }
      setState("checking");
      try {
        const { getSupabase } = await import("@/lib/supabase");
        const sb = await getSupabase();
        if (!sb) { setErr("Supabase 無法連線"); setState("idle"); return; }
        const client: any = sb;
        const { data } = await client.auth.getSession();
        if (data?.session) {
          setState("ready");
        } else {
          setErr("連結無效或已過期。請回「忘記密碼」重寄。");
          setState("idle");
        }
      } catch (e: any) {
        setErr(String(e));
        setState("idle");
      }
    })();
  }, []);

  const handleSubmit = async () => {
    setErr(null);
    if (pw.length < 6) { setErr("新密碼至少 6 碼"); return; }
    if (pw !== pw2) { setErr("兩次密碼不一致"); return; }
    setState("updating");
    const { error } = await updatePassword(pw);
    if (error) { setErr(error); setState("ready"); return; }
    setState("done");
    setTimeout(() => router.push("/login?reset=success"), 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full card p-8">
        <div className="text-6xl text-center">🔐</div>
        <h1 className="mt-3 text-center font-display text-2xl font-black text-empire-ink">
          設定新密碼
        </h1>

        {state === "checking" && (
          <p className="text-center text-empire-mute mt-4">驗證重設連結…</p>
        )}

        {state === "done" && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
            <div className="text-4xl">✨</div>
            <div className="mt-2 font-bold text-emerald-700">密碼已更新</div>
            <div className="text-xs text-emerald-700/80 mt-1">2 秒後自動跳轉登入…</div>
          </div>
        )}

        {(state === "ready" || state === "updating") && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-empire-mute">新密碼</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="至少 6 碼"
                className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
              />
            </div>
            <div>
              <label className="text-sm text-empire-mute">確認新密碼</label>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="再輸入一次"
                className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
              />
            </div>
            {err && <div className="text-sm text-rose-600">{err}</div>}
            <button
              onClick={handleSubmit}
              disabled={state === "updating"}
              className="btn-primary w-full py-3.5 text-base"
            >
              {state === "updating" ? "更新中…" : "🔒 更新密碼"}
            </button>
          </div>
        )}

        {err && state === "idle" && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center">
            <div className="text-sm text-rose-700">{err}</div>
            <Link href="/forgot" className="mt-3 inline-block btn-primary px-4 py-2 text-sm">
              重新寄送重設連結
            </Link>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-empire-sky font-semibold hover:underline">
            ← 返回登入
          </Link>
        </div>
      </div>
    </main>
  );
}
