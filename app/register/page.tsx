"use client";

import Link from "next/link";
import { useState } from "react";
import { useGame } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ShareInviteButton } from "@/components/ShareInviteButton";
import { signInAnon, isSupabaseEnabled } from "@/lib/auth";
import { ensureCoupleForUser } from "@/lib/supabaseAdapter";
import { writeDeviceBinding } from "@/lib/deviceBinding";

export default function RegisterPage() {
  const router = useRouter();
  const couple = useGame((s) => s.couple);
  const login = useGame((s) => s.login);
  const setNickname = useGame((s) => s.setNickname);
  const setKingdomName = useGame((s) => s.setKingdomName);
  const [step, setStep] = useState<"form" | "done">("form");
  const [kingdom, setKingdom] = useState("");
  const [nickname, setNick] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setErr(null);
    if (!nickname.trim()) { setErr("請先填你的稱號"); return; }
    if (kingdom.trim()) setKingdomName(kingdom);
    setNickname("queen", nickname);

    if (isSupabaseEnabled()) {
      setLoading(true);
      const { user, error } = await signInAnon();
      if (error || !user?.id) { setErr(error ?? "匿名登入失敗"); setLoading(false); return; }
      const result = await ensureCoupleForUser(user.id, {
        kingdomName: kingdom.trim() || undefined,
        nickname: nickname.trim() || undefined,
      });
      setLoading(false);
      if (result.error && !result.coupleId) {
        setErr(`王國建立失敗：${result.error}`);
        return;
      }
      if (result.inviteCode) setInviteCode(result.inviteCode);
      // 建國者 = queen；寫裝置綁定
      if (result.inviteCode) {
        writeDeviceBinding({
          role: "queen",
          kingdomKey: result.inviteCode,
          nickname: nickname.trim(),
        });
      }
    } else {
      setInviteCode(couple.inviteCode);
      writeDeviceBinding({
        role: "queen",
        kingdomKey: couple.inviteCode,
        nickname: nickname.trim() || "阿紅",
      });
    }
    setStep("done");
  };

  const code = inviteCode ?? couple.inviteCode;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full card p-8">
        {step === "form" ? (
          <>
            <h1 className="text-2xl font-bold text-empire-ink">建立新王國 👑</h1>
            <p className="text-sm text-slate-500 mt-1">取個名字 → 取得王國鑰匙 → 傳給另一半</p>
            <div className="mt-6 space-y-4">
              <Field
                label="王國名稱"
                placeholder="e.g. 波波帝國 / 甜蜜小窩 (自訂)"
                value={kingdom}
                onChange={setKingdom}
              />
              <Field
                label="你的稱號"
                placeholder="e.g. 阿紅 / 小澤 / 寶貝 (自訂)"
                value={nickname}
                onChange={setNick}
              />
              {!isSupabaseEnabled() && (
                <div className="text-[11px] text-empire-mute bg-empire-mist rounded-lg p-2">
                  ℹ️ 雲端尚未連線，資料僅存於這個瀏覽器。下次請從同一裝置登入。
                </div>
              )}
              {err && <div className="text-xs text-rose-600">{err}</div>}
              <button
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary w-full py-3.5 font-semibold"
              >
                {loading ? "建國中…" : "建國"}
              </button>
              <Link href="/login" className="block text-center text-sm text-empire-sky hover:underline pt-2">
                已有王國鑰匙？登入
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl text-center">✨</div>
            <h1 className="mt-3 text-2xl font-bold text-center">王國建立成功</h1>
            <p className="text-center text-sm text-slate-500 mt-1">
              「{kingdom.trim() || couple.name}」· 你是 <b>{nickname.trim() || couple.queen.nickname}</b>
            </p>

            <div className="mt-6 p-6 rounded-2xl bg-empire-cloud text-center">
              <div className="text-xs text-slate-500 mb-2">🔑 王國鑰匙（= 配對碼）</div>
              <div className="text-5xl font-bold tracking-[0.3em] text-empire-sky">{code}</div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-relaxed">
              <b>⚠️ 這是你唯一的憑證</b><br />
              下次登入、換裝置、另一半加入，都要這組鑰匙。弄丟就找不回來，請馬上截圖或分享到 LINE Keep。
            </div>

            <div className="mt-4">
              <ShareInviteButton inviteCode={code} />
              <p className="text-xs text-empire-mute text-center mt-1.5">
                一鍵送到 LINE 聊天，對方點開即加入
              </p>
            </div>

            <button
              onClick={() => {
                login("queen");
                router.push("/dashboard");
              }}
              className="mt-4 btn-primary w-full py-3.5 font-semibold"
            >
              先進城堡 (稍後再邀請)
            </button>
          </>
        )}
      </div>
    </main>
  );
}

function Field({
  label, placeholder, type = "text", value, onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-slate-500">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-2 w-full border border-empire-cloud rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-empire-sky"
      />
    </div>
  );
}
