"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { isSupabaseEnabled } from "@/lib/auth";
// useGame used inside AnniversarySection component

export default function SettingsPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const pet = useGame((s) => s.pet);
  const setKingdomName = useGame((s) => s.setKingdomName);
  const setNickname = useGame((s) => s.setNickname);
  const setPetName = useGame((s) => s.setPetName);
  const setPrivacy = useGame((s) => s.setPrivacy);
  const resetAllData = useGame((s) => s.resetAllData);
  const resetOnboarding = useGame((s) => s.resetOnboarding);

  const [kName, setKName] = useState(couple.name);
  const [meName, setMeName] = useState(role === "queen" ? couple.queen.nickname : couple.prince.nickname);
  const [petNm, setPetNm] = useState(pet.name);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="font-bold">⚙️ 設定</h2>
        <p className="text-xs text-empire-mute mt-1">個人化、隱私、資料管理</p>
      </div>

      <Section title="📝 命名">
        <Field label="王國名稱" value={kName} onChange={setKName} onBlur={() => kName.trim() && setKingdomName(kName)} />
        <Field label="我的暱稱" value={meName} onChange={setMeName} onBlur={() => meName.trim() && setNickname(role, meName)} />
        <Field label="寵物名字" value={petNm} onChange={setPetNm} onBlur={() => petNm.trim() && setPetName(petNm)} />
      </Section>

      <Section title="🔒 隱私">
        <div className="space-y-2">
          {(["public", "friends", "private"] as const).map((p) => (
            <PrivacyOption
              key={p}
              value={p}
              current={couple.privacy}
              onChange={setPrivacy}
              label={p === "public" ? "公開" : p === "friends" ? "僅限好友情侶" : "完全不公開"}
              desc={
                p === "public" ? "上排行榜、被其他情侶搜尋到、可被隨機配對"
                : p === "friends" ? "只有你們主動加的好友情侶能看到你們的資料"
                : "不上榜、不被搜尋；聯盟/廣場動態仍會顯示"
              }
            />
          ))}
        </div>
      </Section>

      <Section title="🛠️ 新手引導 / 通知">
        <button onClick={resetOnboarding} className="btn-ghost w-full py-2.5 text-sm">
          重新播放新手引導
        </button>
      </Section>

      <Section title="🌐 後端狀態">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-empire-mute">Supabase 後端</span>
            <span className={isSupabaseEnabled() ? "text-emerald-600 font-bold" : "text-empire-mute"}>
              {isSupabaseEnabled() ? "✓ 已連線" : "未啟用（demo 模式）"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-empire-mute">LIFF (LINE)</span>
            <span className={process.env.NEXT_PUBLIC_LIFF_ID ? "text-emerald-600 font-bold" : "text-empire-mute"}>
              {process.env.NEXT_PUBLIC_LIFF_ID ? "✓ 已綁定" : "未設定"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-empire-mute">Service Worker</span>
            <span className="text-emerald-600 font-bold">✓ 已註冊 (PWA)</span>
          </div>
        </div>
      </Section>

      <Section title="🗑️ 危險區">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="btn w-full py-2.5 text-sm bg-rose-100 text-rose-700 border-2 border-rose-200"
          >
            清除所有本地資料並重新開始
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded">
              ⚠️ 這會刪除所有金幣、任務、記憶卡、連擊、寵物屬性。**無法復原**。確定嗎？
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-ghost flex-1 py-2 text-sm">取消</button>
              <button onClick={() => resetAllData()} className="btn flex-1 py-2 text-sm bg-rose-500 text-white">確定刪除</button>
            </div>
          </div>
        )}
      </Section>

      <p className="text-xs text-empire-mute text-center">
        version v0.2 alpha · Love Empire · 2026
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="font-bold mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, onBlur }: { label: string; value: string; onChange: (v: string) => void; onBlur: () => void }) {
  return (
    <div>
      <label className="text-xs text-empire-mute">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 20))}
        onBlur={onBlur}
        className="mt-1 w-full border-2 border-empire-cloud rounded-xl px-3 py-2 focus:outline-none focus:border-empire-sky"
      />
    </div>
  );
}

function AnniversarySection() {
  const anniversaries = useGame((s) => s.anniversaries);
  const addAnniversary = useGame((s) => s.addAnniversary);
  const removeAnniversary = useGame((s) => s.removeAnniversary);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("💝");
  const [recurring, setRecurring] = useState(true);

  return (
    <div className="card p-5">
      <h3 className="font-bold mb-3">💎 紀念日</h3>
      <div className="space-y-2 mb-3">
        {anniversaries.map((a) => (
          <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-empire-mist">
            <div className="text-xl">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{a.label}</div>
              <div className="text-xs text-empire-mute">{a.date}{a.recurring ? " · 每年" : ""}</div>
            </div>
            <button onClick={() => removeAnniversary(a.id)} className="text-empire-mute hover:text-empire-crimson text-sm">🗑️</button>
          </div>
        ))}
        {anniversaries.length === 0 && (
          <p className="text-xs text-empire-mute text-center py-2">還沒有紀念日，加一個試試</p>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1.5 mb-2">
        {["💝", "💎", "🎂", "🌸", "💍", "🎆"].map((e) => (
          <button key={e} onClick={() => setEmoji(e)}
            className={`p-1.5 rounded-lg text-xl ${emoji === e ? "bg-empire-cloud" : "bg-white"}`}>
            {e}
          </button>
        ))}
      </div>
      <input value={label} onChange={(e) => setLabel(e.target.value.slice(0, 30))}
        placeholder="標題 (e.g. 初次相識)" className="w-full border-2 border-empire-cloud rounded-lg px-2 py-1.5 text-sm mb-2" />
      <div className="flex gap-2 mb-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="flex-1 border-2 border-empire-cloud rounded-lg px-2 py-1.5 text-sm" />
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} /> 每年
        </label>
      </div>
      <button
        onClick={() => {
          if (!label || !date) return;
          addAnniversary(label, date, recurring, emoji);
          setLabel(""); setDate("");
        }}
        className="btn-primary w-full py-2 text-sm font-semibold"
      >
        + 新增紀念日
      </button>
    </div>
  );
}

function PrivacyOption<T extends string>({ value, current, onChange, label, desc }: { value: T; current: T; onChange: (v: T) => void; label: string; desc: string }) {
  const active = value === current;
  return (
    <button
      onClick={() => onChange(value)}
      className={`w-full text-left p-3 rounded-xl border-2 transition ${
        active ? "border-empire-sky bg-empire-cloud" : "border-empire-cloud bg-white hover:border-empire-sky/50"
      }`}
    >
      <div className="font-bold text-sm flex items-center gap-2">
        <span className={`w-4 h-4 rounded-full border-2 ${active ? "bg-empire-sky border-empire-sky" : "border-empire-cloud"}`} />
        {label}
      </div>
      <div className="text-xs text-empire-mute mt-1">{desc}</div>
    </button>
  );
}
