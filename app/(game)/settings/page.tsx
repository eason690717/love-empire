"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { isSupabaseEnabled } from "@/lib/auth";
import { PageBanner } from "@/components/PageBanner";
import { InviteCodeCard } from "@/components/InviteCodeCard";
import { RELATIONSHIP_LABELS, getKingdomStatus, KINGDOM_PAUSE_DAYS } from "@/lib/types";

export default function SettingsPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const pet = useGame((s) => s.pet);
  const setKingdomName = useGame((s) => s.setKingdomName);
  const setNickname = useGame((s) => s.setNickname);
  const setPetName = useGame((s) => s.setPetName);
  const setPrivacy = useGame((s) => s.setPrivacy);
  const setRelationshipType = useGame((s) => s.setRelationshipType);
  const pauseKingdom = useGame((s) => s.pauseKingdom);
  const unpauseKingdom = useGame((s) => s.unpauseKingdom);
  const resetAllData = useGame((s) => s.resetAllData);
  const [pauseStep, setPauseStep] = useState<"hidden" | "form" | "confirm">("hidden");
  const [pauseReason, setPauseReason] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const status = getKingdomStatus(couple);
  const resetOnboarding = useGame((s) => s.resetOnboarding);

  const [kName, setKName] = useState(couple.name);
  const [meName, setMeName] = useState(role === "queen" ? couple.queen.nickname : couple.prince.nickname);
  const [petNm, setPetNm] = useState(pet.name);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-4">
      <PageBanner
        title="設定"
        subtitle="個人化 · 配對碼 · 隱私 · 資料管理"
        emoji="⚙️"
        gradient="sky"
        stats={[
          { label: "王國", value: couple.name },
          { label: "等級", value: `Lv.${couple.kingdomLevel}` },
        ]}
      />

      <div className="space-y-2">
        <InviteCodeCard />
        <div className="card p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          ⚠️ <b>請截圖保存配對碼</b>。換新裝置或清快取後，需要這 6 碼重新加入王國。
          <br />忘記了？請伴侶在 TA 的設定頁截圖傳給你（兩人看到同一個碼）。
        </div>
      </div>

      <Section title="📝 命名">
        <Field label="王國名稱" value={kName} onChange={setKName} onBlur={() => kName.trim() && setKingdomName(kName)} />
        <Field label="我的暱稱" value={meName} onChange={setMeName} onBlur={() => meName.trim() && setNickname(role, meName)} />
        <Field label="寵物名字" value={petNm} onChange={setPetNm} onBlur={() => petNm.trim() && setPetName(petNm)} />
      </Section>

      <Section title="💑 我們的相處類型">
        <p className="text-xs text-empire-mute mb-2">
          影響「任務模板庫」推薦哪類任務給你們 · 之後可隨時更改
        </p>
        <div className="space-y-2">
          {(["cohabit", "nearby", "longdistance", "married"] as const).map((type) => {
            const info = RELATIONSHIP_LABELS[type];
            const selected = couple.relationshipType === type;
            return (
              <button
                key={type}
                onClick={() => setRelationshipType(type)}
                className={`w-full p-3 rounded-xl border-2 text-left transition ${
                  selected ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white hover:border-empire-sky/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{info.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{info.label}</div>
                    <div className="text-xs text-empire-mute">{info.desc}</div>
                  </div>
                  {selected && <span className="text-empire-berry font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
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
              {isSupabaseEnabled() ? "✓ 已連線雲端" : "未連線（僅存本機）"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-empire-mute">LINE 綁定</span>
            <span className="text-empire-mute text-xs italic">尚未完成（開發中）</span>
          </div>
          <div className="flex justify-between">
            <span className="text-empire-mute">Service Worker</span>
            <span className="text-emerald-600 font-bold">✓ 已註冊 (PWA)</span>
          </div>
        </div>
      </Section>

      {/* 進階 — 預設摺疊，需點展開才看到（隱密） */}
      {status.state === "active" && !advancedOpen && (
        <div className="text-center pt-2 pb-6">
          <button
            onClick={() => setAdvancedOpen(true)}
            className="text-[11px] text-empire-mute hover:text-empire-ink underline underline-offset-2"
          >
            進階 · 王國狀態管理
          </button>
        </div>
      )}

      {((status.state === "active" && advancedOpen) || status.state !== "active") && (
      <Section title={status.state === "paused" ? "⏸️ 王國暫停中" : status.state === "archived" ? "📜 王國已封存" : "⚙️ 進階 · 王國狀態"}>
        {status.state === "active" && (
          <>
            {pauseStep === "hidden" && (
              <>
                <p className="text-xs text-empire-mute mb-2 leading-relaxed">
                  需要時間冷靜或不確定關係未來？「暫停王國」可以保留所有資料 {KINGDOM_PAUSE_DAYS} 天。
                  期間任務/獎勵停止，但任一方都能解除。{KINGDOM_PAUSE_DAYS} 天無人解除 → 自動封存（仍可隨時查看紀念）。
                </p>
                <button
                  onClick={() => setPauseStep("form")}
                  className="btn w-full py-2.5 text-sm bg-amber-50 text-amber-800 border-2 border-amber-200 hover:bg-amber-100"
                >
                  暫停王國 {KINGDOM_PAUSE_DAYS} 天 ⏸️
                </button>
                <button
                  onClick={() => setAdvancedOpen(false)}
                  className="mt-2 w-full text-[10px] text-empire-mute hover:text-empire-ink"
                >
                  收起
                </button>
              </>
            )}
            {pauseStep === "form" && (
              <div className="space-y-2">
                <textarea
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value.slice(0, 80))}
                  placeholder="留下原因（可選 · 80 字內）：例如「先給彼此一點空間」"
                  rows={3}
                  className="w-full border-2 border-amber-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-400"
                  maxLength={80}
                />
                <div className="text-[10px] text-right text-empire-mute">{pauseReason.length}/80</div>
                <div className="flex gap-2">
                  <button onClick={() => { setPauseStep("hidden"); setPauseReason(""); }} className="btn-ghost flex-1 py-2 text-sm">取消</button>
                  <button onClick={() => setPauseStep("confirm")} className="btn flex-1 py-2 text-sm bg-amber-500 text-white">下一步</button>
                </div>
              </div>
            )}
            {pauseStep === "confirm" && (
              <div className="space-y-2">
                <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-xl text-empire-ink space-y-1">
                  <div>📋 確認暫停？</div>
                  <ul className="ml-4 list-disc text-empire-mute">
                    <li>所有資料保留</li>
                    <li>{KINGDOM_PAUSE_DAYS} 天內任一方可在此頁解除</li>
                    <li>{KINGDOM_PAUSE_DAYS} 天到期自動封存（仍可看畢業紀念）</li>
                    <li>對方會收到通知</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPauseStep("form")} className="btn-ghost flex-1 py-2 text-sm">回去改</button>
                  <button
                    onClick={() => {
                      pauseKingdom(pauseReason);
                      setPauseStep("hidden");
                      setPauseReason("");
                    }}
                    className="btn flex-1 py-2 text-sm bg-amber-600 text-white font-bold"
                  >
                    確認暫停
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {status.state === "paused" && (
          <div className="space-y-3">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-200">
              <div className="text-4xl mb-2">⏸️</div>
              <div className="font-bold text-empire-ink">王國暫停中</div>
              <div className="text-sm text-empire-mute mt-1">
                還剩 <b className="text-empire-berry text-lg">{status.daysLeft}</b> 天到期封存
              </div>
              {couple.pauseReason && (
                <div className="text-xs italic text-empire-mute mt-2">「{couple.pauseReason}」</div>
              )}
              <div className="text-[10px] text-empire-mute mt-2">
                由 {couple.pauseInitiator === "queen" ? couple.queen.nickname : couple.prince.nickname} 發起
              </div>
            </div>
            <button
              onClick={unpauseKingdom}
              className="btn w-full py-2.5 text-sm bg-emerald-500 text-white font-bold"
            >
              🌱 解除暫停 · 我們繼續
            </button>
            <Link href="/archive" className="block text-center text-xs text-empire-sky hover:underline">
              先看一下到目前為止的紀念 →
            </Link>
          </div>
        )}
        {status.state === "archived" && (
          <div className="text-center p-4 rounded-xl bg-empire-cloud/40">
            <div className="text-4xl">📜</div>
            <div className="font-bold mt-2">王國已封存</div>
            <div className="text-xs text-empire-mute mt-1">所有紀念永久保留</div>
            <Link href="/archive" className="inline-block mt-3 btn-primary px-4 py-2 text-sm">
              查看畢業紀念
            </Link>
          </div>
        )}
      </Section>
      )}

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

  const PRESETS = [
    { label: "認識的日子",   emoji: "🌱" },
    { label: "交往紀念日",   emoji: "💞" },
    { label: "初吻那天",     emoji: "💋" },
    { label: "第一次旅行",   emoji: "✈️" },
    { label: "同居紀念日",   emoji: "🏡" },
    { label: "結婚紀念日",   emoji: "💍" },
    { label: "我的生日",     emoji: "🎂" },
    { label: "對方生日",     emoji: "🎂" },
    { label: "寶寶誕生日",   emoji: "👶" },
  ];

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

      {/* 快速選擇預設紀念日 */}
      <div className="mb-3 p-2 rounded-xl bg-empire-cream/60 border border-empire-gold/30">
        <div className="text-[10px] text-empire-mute mb-1.5">💡 常見紀念 · 點一下預填</div>
        <div className="flex gap-1 overflow-x-auto">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setLabel(p.label); setEmoji(p.emoji); }}
              className="shrink-0 px-2 py-1 rounded-full text-[11px] bg-white border border-empire-cloud hover:border-empire-sky/60"
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
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
