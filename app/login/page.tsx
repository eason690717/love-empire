"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { useLiff } from "@/components/LiffProvider";
import { loginLiff } from "@/lib/liff";
import { signInAnon, isSupabaseEnabled } from "@/lib/auth";
import { joinCoupleByCode } from "@/lib/supabaseAdapter";
import { readDeviceBinding, writeDeviceBinding, clearDeviceBinding } from "@/lib/deviceBinding";
import { VERSION_STRING } from "@/lib/version";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const login = useGame((s) => s.login);
  const loggedIn = useGame((s) => s.loggedIn);
  const setNickname = useGame((s) => s.setNickname);
  const liff = useLiff();
  const [role, setRole] = useState<"queen" | "prince">("prince");
  const [code, setCode] = useState("");
  const [nickname, setNick] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);  // 此裝置是否已綁定角色
  const [invited, setInvited] = useState(false); // 是否從分享連結進來（?code=XXX）
  const [invitedKingdomName, setInvitedKingdomName] = useState<string | null>(null);

  // 讀裝置綁定 → 預填 + 鎖定角色
  useEffect(() => {
    const b = readDeviceBinding();
    if (b) {
      setRole(b.role);
      setCode(b.kingdomKey);
      setNick(b.nickname);
      setLocked(true);
    }
  }, []);

  // URL 帶 ?code=XXXXXX（分享連結）→ 啟用邀請模式 + 預填 code
  useEffect(() => {
    const q = search?.get("code");
    if (q) {
      setCode(q.toUpperCase().slice(0, 6));
      setInvited(true);
      // 若當前裝置已綁 queen，對方應該是 prince（反之亦然）
      const b = readDeviceBinding();
      if (!b) {
        // 沒綁過 → 預設先選 prince（queen 通常是建國的那位）
        setRole("prince");
      }
      // 嘗試查王國名（匿名權限讀 public_couples view）
      (async () => {
        try {
          const { getSupabase } = await import("@/lib/supabase");
          const sb = await getSupabase();
          if (!sb) return;
          const client: any = sb;
          const { data } = await client
            .from("couples")
            .select("name")
            .eq("invite_code", q.toUpperCase().slice(0, 6))
            .maybeSingle();
          if (data?.name) setInvitedKingdomName(data.name);
        } catch { /* ignore */ }
      })();
    }
  }, [search]);

  // LIFF 內自動登入：僅 demo 模式（Supabase 啟用時仍需打鑰匙加入王國）
  useEffect(() => {
    if (isSupabaseEnabled()) return;
    if (liff.inClient && liff.loggedIn && liff.profile) {
      const isQueen = (liff.profile.userId.charCodeAt(0) % 2) === 0;
      login(isQueen ? "queen" : "prince");
      router.push("/dashboard");
    }
  }, [liff, login, router]);

  // Zustand loggedIn 為 true（AuthResume 或手動登入完成）→ 直接進城堡
  useEffect(() => {
    if (loggedIn) router.push("/dashboard");
  }, [loggedIn, router]);

  const handleEnter = async () => {
    setErr(null);
    if (isSupabaseEnabled()) {
      if (!code.trim()) { setErr("請輸入王國鑰匙"); return; }
      if (!nickname.trim()) { setErr("請輸入你的稱號"); return; }
      setLoading(true);
      const { user, error } = await signInAnon();
      if (error || !user?.id) { setErr(error ?? "匿名登入失敗"); setLoading(false); return; }
      const coupleId = await joinCoupleByCode(user.id, code.trim(), nickname.trim(), role);
      setLoading(false);
      if (!coupleId) { setErr("找不到這組王國鑰匙。請確認對方分享的鑰匙正確。"); return; }
      setNickname(role, nickname);
      writeDeviceBinding({ role, kingdomKey: code.trim().toUpperCase(), nickname: nickname.trim() });
      login(role);
      router.push("/dashboard");
      return;
    }
    // Demo 模式
    if (nickname.trim()) setNickname(role, nickname);
    writeDeviceBinding({ role, kingdomKey: code.trim().toUpperCase() || "DEMO", nickname: nickname.trim() || "玩家" });
    login(role);
    router.push("/dashboard");
  };

  const handleUnbind = () => {
    clearDeviceBinding();
    setLocked(false);
    setRole("prince");
    setCode("");
    setNick("");
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

        {/* 被邀請橫幅 — 從分享連結進來時顯示 */}
        {invited && !locked && (
          <div className="mt-5 p-3 rounded-2xl bg-gradient-to-br from-rose-100 via-amber-50 to-rose-50 border-2 border-empire-berry/30">
            <div className="text-xs text-empire-berry font-bold text-center">💞 你被邀請加入一個王國</div>
            {invitedKingdomName && (
              <div className="font-display font-black text-lg text-empire-ink text-center mt-0.5">
                「{invitedKingdomName}」
              </div>
            )}
            <div className="text-[11px] text-empire-mute text-center mt-1 leading-relaxed">
              ✨ 這是你加入的<b className="text-empire-ink">全新角色</b>，不是對方的帳號。
              <br />輸入你自己的稱號，選擇你要扮演的角色 → 進入城堡。
            </div>
          </div>
        )}

        {liff.ready && !liff.inClient && (
          <div className="mt-6">
            <button
              onClick={handleLineLogin}
              className="btn w-full py-3.5 text-base font-bold text-white shadow-lg hover:shadow-xl active:scale-95 transition"
              style={{ background: "linear-gradient(135deg, #00C300 0%, #00B900 100%)" }}
            >
              💚 使用 LINE 登入
            </button>
            <div className="text-[11px] text-empire-mute text-center mt-1.5">
              一鍵用你的 LINE 帳號登入（會記住你的暱稱 / 大頭貼）
            </div>
            <div className="my-4 flex items-center gap-3 text-xs text-empire-mute">
              <div className="flex-1 h-px bg-empire-cloud" />
              或用王國鑰匙登入
              <div className="flex-1 h-px bg-empire-cloud" />
            </div>
          </div>
        )}

        {liff.inClient && !liff.loggedIn && (
          <div className="mt-6">
            <button
              onClick={handleLineLogin}
              className="btn w-full py-3.5 font-bold text-white shadow-lg active:scale-95 transition"
              style={{ background: "linear-gradient(135deg, #00C300 0%, #00B900 100%)" }}
            >
              💚 用 LINE 登入（你已在 LINE 裡）
            </button>
            <div className="text-[11px] text-empire-mute text-center mt-1.5">
              在 LINE 內打開可一鍵登入
            </div>
          </div>
        )}

        {liff.inClient && liff.loggedIn && liff.profile && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-green-200">
            <div className="flex items-center gap-3">
              {liff.profile.pictureUrl && (
                <img src={liff.profile.pictureUrl} alt="" className="w-12 h-12 rounded-full" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-green-700 font-bold">💚 LINE 已登入</div>
                <div className="font-bold text-empire-ink truncate">{liff.profile.displayName}</div>
              </div>
            </div>
            <div className="text-[10px] text-empire-mute mt-2">
              繼續輸入配對碼即可加入/建立王國
            </div>
          </div>
        )}

        {locked && (
          <div className="mt-4 p-3 rounded-xl bg-empire-mist border border-empire-cloud text-xs text-empire-mute">
            🔒 此裝置已綁定為 <b className="text-empire-ink">{role === "queen" ? "🌸 阿紅" : "💎 阿藍"}</b>。
            角色已鎖定，下次開啟 app 會自動登入。
            <button onClick={handleUnbind} className="ml-1 underline decoration-dotted hover:text-empire-berry">
              換角色
            </button>
          </div>
        )}

        <div className="mt-4 space-y-5">
          <div>
            <label className="text-sm text-empire-mute flex items-center gap-2"><span className="sprout-dot" /> 王國鑰匙</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="A1B2C3"
              maxLength={6}
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
              <label className="text-sm text-empire-mute flex items-center gap-2">
                <span className="sprout-dot" /> 你在這段關係的角色
                {locked && <span className="text-[11px] text-empire-mute/70">（此裝置已鎖定）</span>}
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <RoleBtn active={role === "queen"} disabled={locked} onClick={() => setRole("queen")}>
                  <span className="text-xl">🌸</span> 我是阿紅
                </RoleBtn>
                <RoleBtn active={role === "prince"} disabled={locked} onClick={() => setRole("prince")}>
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
        <div className="mt-5 text-center text-[10px] text-empire-mute opacity-70 tracking-wider">
          {VERSION_STRING}
        </div>
      </div>
    </main>
  );
}

function RoleBtn({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
        disabled
          ? active
            ? "border-empire-sky/60 bg-empire-cloud/60 text-empire-ink/80 cursor-not-allowed"
            : "border-empire-cloud/60 bg-white/60 text-empire-mute/50 cursor-not-allowed opacity-50"
          : active
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
