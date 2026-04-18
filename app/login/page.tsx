"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { useLiff } from "@/components/LiffProvider";
import { loginLiff } from "@/lib/liff";
import { signInAnon, getSession, isSupabaseEnabled } from "@/lib/auth";
import { joinCoupleByCode } from "@/lib/supabaseAdapter";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const login = useGame((s) => s.login);
  const setNickname = useGame((s) => s.setNickname);
  const liff = useLiff();
  const [role, setRole] = useState<"queen" | "prince">("prince");
  const [code, setCode] = useState("");
  const [nickname, setNick] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // URL 帶 ?code=XXXXXX（分享連結）時自動填入
  useEffect(() => {
    const q = search?.get("code");
    if (q) setCode(q.toUpperCase().slice(0, 8));
  }, [search]);

  // LIFF 內自動登入（demo 角色；真實情境仍走鑰匙）
  useEffect(() => {
    if (liff.inClient && liff.loggedIn && liff.profile) {
      const isQueen = (liff.profile.userId.charCodeAt(0) % 2) === 0;
      login(isQueen ? "queen" : "prince");
      router.push("/dashboard");
    }
  }, [liff, login, router]);

  // 已有 session？直接進城堡（anonymous session 被 persistSession 存在 localStorage）
  useEffect(() => {
    if (!isSupabaseEnabled()) return;
    (async () => {
      const u = await getSession();
      if (u) router.push("/dashboard");
    })();
  }, [router]);

  const handleEnter = async () => {
    setErr(null);
    if (isSupabaseEnabled()) {
      if (!code.trim()) { setErr("請輸入王國鑰匙"); return; }
      if (!nickname.trim()) { setErr("請輸入你的稱號"); return; }
      setLoading(true);
      const { user, error } = await signInAnon();
      if (error || !user?.id) { setErr(error ?? "匿名登入失敗"); setLoading(false); return; }
      const coupleId = await joinCoupleByCode(user.id, code.trim(), nickname.trim());
      setLoading(false);
      if (!coupleId) { setErr("找不到這組王國鑰匙。請確認對方分享的鑰匙正確。"); return; }
      setNickname(role, nickname);
      login(role);
      router.push("/dashboard");
      return;
    }
    // Demo 模式
    if (nickname.trim()) setNickname(role, nickname);
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
              或用王國鑰匙登入
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
          <div>
            <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 王國鑰匙</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="A1B2C3"
              className="mt-2 w-full text-center tracking-[0.4em] text-2xl font-bold py-3 border-2 border-empire-cloud rounded-2xl bg-white focus:outline-none focus:border-empire-sky"
            />
          </div>
          <div>
            <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 你的稱號</label>
            <input
              value={nickname}
              onChange={(e) => setNick(e.target.value)}
              placeholder="e.g. 阿紅 / 阿藍 / 寶貝"
              maxLength={20}
              className="mt-2 w-full border-2 border-empire-cloud rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
            />
          </div>

          {isSupabaseEnabled() && (
            <div>
              <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 你在這段關係的角色</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <RoleBtn active={role === "queen"} onClick={() => setRole("queen")}>
                  <span className="text-xl">🌸</span> 我是阿紅
                </RoleBtn>
                <RoleBtn active={role === "prince"} onClick={() => setRole("prince")}>
                  <span className="text-xl">💎</span> 我是阿藍
                </RoleBtn>
              </div>
            </div>
          )}

          {err && <div className="text-sm text-rose-600">{err}</div>}

          <button onClick={handleEnter} disabled={loading} className="btn-primary w-full py-4 text-base">
            {loading ? "進城堡中…" : "✨ 進入城堡"}
          </button>

          <div className="text-center text-sm pt-2">
            <Link href="/register" className="text-empire-berry font-semibold hover:underline">
              還沒有王國？建立一個 👑
            </Link>
          </div>
        </div>
      </div>
    </main>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-empire-mute">載入中…</div>}>
      <LoginInner />
    </Suspense>
  );
}
