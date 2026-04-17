"use client";

import Link from "next/link";
import { useState } from "react";
import { useGame } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ShareInviteButton } from "@/components/ShareInviteButton";

export default function RegisterPage() {
  const router = useRouter();
  const couple = useGame((s) => s.couple);
  const login = useGame((s) => s.login);
  const setNickname = useGame((s) => s.setNickname);
  const setKingdomName = useGame((s) => s.setKingdomName);
  const [step, setStep] = useState<"form" | "done">("form");
  const [kingdom, setKingdom] = useState("");
  const [nickname, setNick] = useState("");
  const [email, setEmail] = useState("");

  const handleCreate = () => {
    if (kingdom.trim()) setKingdomName(kingdom);
    if (nickname.trim()) setNickname("queen", nickname);
    setStep("done");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full card p-8">
        {step === "form" ? (
          <>
            <h1 className="text-2xl font-bold text-empire-ink">建立新王國 👑</h1>
            <p className="text-sm text-slate-500 mt-1">取個名字 → 取得配對碼 → 傳給另一半</p>
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
              <Field
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
              <Field label="密碼" placeholder="至少 8 碼" type="password" />
              <button
                onClick={handleCreate}
                className="btn-primary w-full py-3.5 font-semibold"
              >
                建國
              </button>
              <Link href="/login" className="block text-center text-sm text-empire-sky hover:underline pt-2">
                已有帳號？登入
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl text-center">✨</div>
            <h1 className="mt-3 text-2xl font-bold text-center">王國建立成功</h1>
            <p className="text-center text-sm text-slate-500 mt-1">
              「{couple.name}」· 你是 <b>{couple.queen.nickname}</b>
            </p>
            <p className="text-center text-sm text-slate-500">把配對碼傳給另一半：</p>
            <div className="mt-6 p-6 rounded-2xl bg-empire-cloud text-center">
              <div className="text-xs text-slate-500 mb-2">配對邀請碼</div>
              <div className="text-5xl font-bold tracking-[0.3em] text-empire-sky">{couple.inviteCode}</div>
            </div>

            <div className="mt-4">
              <ShareInviteButton inviteCode={couple.inviteCode} />
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
