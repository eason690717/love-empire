"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { useLiff } from "@/components/LiffProvider";
import { loginLiff } from "@/lib/liff";
import { signIn, isSupabaseEnabled } from "@/lib/auth";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const login = useGame((s) => s.login);
  const couple = useGame((s) => s.couple);
  const liff = useLiff();
  const resetSuccess = search?.get("reset") === "success";
  const [role, setRole] = useState<"queen" | "prince">("queen");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (liff.inClient && liff.loggedIn && liff.profile) {
      const isQueen = (liff.profile.userId.charCodeAt(0) % 2) === 0;
      login(isQueen ? "queen" : "prince");
      router.push("/dashboard");
    }
  }, [liff, login, router]);

  const handleEnter = async () => {
    setErr(null);
    // 有 Supabase + 填 email → 真實登入
    if (isSupabaseEnabled() && email.trim() && pw.trim()) {
      setLoading(true);
      const { error } = await signIn(email.trim(), pw);
      setLoading(false);
      if (error) { setErr(error); return; }
      // 讀 users 表決定 role
      const { getCurrentUser } = await import("@/lib/supabaseAdapter");
      const u = await getCurrentUser();
      if (u?.id) {
        const { getSupabase } = await import("@/lib/supabase");
        const sb = await getSupabase();
        if (sb) {
          const client: any = sb;
          const { data: urow } = await client.from("users").select("role").eq("id", u.id).maybeSingle();
          login((urow?.role as "queen" | "prince") ?? "queen");
        } else {
          login("queen");
        }
      }
      router.push("/dashboard");
      return;
    }
    // Demo 模式
    login(role);
    router.push("/dashboard");
  };

  const handleLineLogin = async () => {
    const redirect = typeof window !== "undefined" ? window.location.origin + "/login" : undefined;
    await loginLiff(redirect);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full card p-8 relative overflow-hidden">
        <div className="absolute -left-3 top-4 text-4xl opacity-60 animate-float-slow">🌸</div>
        <div className="absolute right-2 top-10 text-3xl opacity-70 animate-bob">🦋</div>

        <div className="w-40 h-40 mx-auto animate-bob">
          <img src="/art/hero-couple.svg" alt="愛的帝國" width={160} height={160}
               style={{ filter: "drop-shadow(0 6px 14px rgba(255,127,161,0.25))" }} />
        </div>
        <h1 className="mt-5 text-center font-display text-4xl font-black text-empire-ink tracking-wider text-shadow-soft">
          愛的帝國
        </h1>
        <p className="text-center text-xs tracking-[0.4em] text-empire-berry/80 font-bold mt-1">LOVE EMPIRE</p>

        {liff.ready && !liff.inClient && (
          <div className="mt-6">
            <button
              onClick={handleLineLogin}
              className="btn w-full py-3.5 text-base font-semibold text-white"
              style={{ background: "linear-gradient(180deg, #06C755 0%, #04a546 100%)", border: "2px solid #038a3a", boxShadow: "0 4px 0 #025a25" }}
            >
              💚 使用 LINE 登入
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-empire-mute">
              <div className="flex-1 h-px bg-empire-cloud" />
              或用密碼登入 (demo)
              <div className="flex-1 h-px bg-empire-cloud" />
            </div>
          </div>
        )}

        {liff.inClient && !liff.loggedIn && (
          <div className="mt-6">
            <button onClick={handleLineLogin} className="btn-primary w-full py-3.5">
              💚 以 LINE 身份進入
            </button>
          </div>
        )}

        <div className="mt-4 space-y-5">
          {isSupabaseEnabled() ? (
            <>
              <div>
                <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
                />
              </div>
              <div>
                <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 密碼</label>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="至少 6 碼"
                  className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 身份選擇 (demo)</label>
                <div className="mt-2 relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "queen" | "prince")}
                    className="w-full appearance-none border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky text-base font-medium"
                  >
                    <option value="queen">{couple.queen.nickname}</option>
                    <option value="prince">{couple.prince.nickname}</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-empire-sky">⇅</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 通關密語 (demo)</label>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="請輸入密碼"
                  className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
                />
              </div>
            </>
          )}

          {err && <div className="text-sm text-rose-600">{err}</div>}

          <button onClick={handleEnter} disabled={loading} className="btn-primary w-full py-4 text-base">
            {loading ? "登入中…" : "✨ 進入城堡"}
          </button>

          <div className="flex items-center justify-between text-sm pt-2">
            <Link href="/register" className="text-empire-berry font-semibold hover:underline">
              建立新王國
            </Link>
            <Link href="/pair" className="text-empire-azure font-semibold hover:underline">
              我有配對碼
            </Link>
          </div>

          {isSupabaseEnabled() && (
            <div className="text-center pt-1">
              <Link href="/forgot" className="text-xs text-empire-mute hover:text-empire-sky underline decoration-dotted">
                忘記密碼？
              </Link>
            </div>
          )}

          {resetSuccess && (
            <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 text-center">
              ✨ 密碼更新成功，請用新密碼登入
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-empire-mute">載入中…</div>}>
      <LoginInner />
    </Suspense>
  );
}
