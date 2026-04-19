"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { ATTR_LABEL, ATTR_COLOR, PET_STAGE_LABEL } from "@/lib/utils";
import { InlineRename } from "@/components/InlineRename";
import { PetAvatar } from "@/components/art/PetAvatar";
import { PageBanner } from "@/components/PageBanner";

// 進化條件（新規則 — 雙主人 bond + 屬性門檻；孵化極簡）
const STAGE_REQ = [
  { stage: 0, name: "蛋",    attr: 0,  bond: 0,  hint: "剛送來的蛋，等你們第一次摸摸" },
  { stage: 1, name: "幼體",  attr: 0,  bond: 0,  hint: "任一人餵 2 次即可破殼", minFeeds: 2 },
  { stage: 2, name: "成型",  attr: 30, bond: 15, hint: "屬性 30+ 且雙方親密都 15+" },
  { stage: 3, name: "傳說",  attr: 60, bond: 50, hint: "屬性 60+ 且雙方親密都 50+ (SSR 光暈)" },
  { stage: 4, name: "神話",  attr: 85, bond: 80, hint: "屬性 85+ 且雙方親密都 80+ (畢生養成)" },
];

export default function PetPage() {
  const pet = useGame((s) => s.pet);
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const feedPet = useGame((s) => s.feedPet);
  const petInteract = useGame((s) => s.petInteract);
  const setPetName = useGame((s) => s.setPetName);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const doInteract = (kind: "pet" | "treat", msg?: string) => {
    const r = petInteract(kind, msg);
    if (r.ok) {
      setToast(kind === "pet" ? "🫳 摸摸，舒服..." : kind === "treat" ? "🍬 好好吃！" : "");
      setTimeout(() => setToast(null), 1400);
    } else {
      setToast(`❌ ${r.reason}`);
      setTimeout(() => setToast(null), 1500);
    }
  };

  const avg = Object.values(pet.attrs).reduce((a, b) => a + b, 0) / 5;
  const hoursSinceFed = (Date.now() - new Date(pet.lastFedAt).getTime()) / 36e5;
  const hungry = hoursSinceFed > 24;
  const bondQueen = pet.bondQueen ?? 0;
  const bondPrince = pet.bondPrince ?? 0;
  const minBond = Math.min(bondQueen, bondPrince);
  const laggingSide = bondQueen < bondPrince ? "queen" : bondQueen > bondPrince ? "prince" : null;
  const laggingName = laggingSide === "queen" ? couple.queen.nickname : couple.prince.nickname;

  const isMaxStage = pet.stage >= 4;
  const nextStageIdx = Math.min(4, pet.stage + 1);
  const nextReq = STAGE_REQ[nextStageIdx];

  // 下一階還差什麼
  const missingAttr = isMaxStage ? 0 : Math.max(0, Math.ceil(nextReq.attr - avg));
  const missingBondQueen = isMaxStage ? 0 : Math.max(0, nextReq.bond - bondQueen);
  const missingBondPrince = isMaxStage ? 0 : Math.max(0, nextReq.bond - bondPrince);
  const attrProgressPct = nextReq.attr > 0 ? Math.min(100, (avg / nextReq.attr) * 100) : 100;

  return (
    <div className="space-y-4">
      <PageBanner
        title="愛之寵物"
        subtitle={isMaxStage ? "已達神話等級！🌟" : `${nextReq.hint}`}
        emoji="🐣"
        gradient="leaf"
        stats={[
          { label: "階段", value: PET_STAGE_LABEL[pet.stage] },
          { label: "屬性", value: `${avg.toFixed(0)}` },
          { label: "親密 min", value: minBond },
        ]}
      />

      <div
        className="card p-8 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #d8eefd 0%, #e7f4d5 60%, #cfe9b4 100%)" }}
      >
        <div className="absolute -top-6 -left-4 text-4xl opacity-60 select-none">🌿</div>
        <div className="absolute -top-4 right-6 text-4xl opacity-60 animate-float-slow select-none">🌼</div>
        <div className="absolute bottom-4 left-10 text-3xl opacity-60 select-none">🌱</div>
        <div className="absolute bottom-2 right-8 text-3xl opacity-60 select-none">🍄</div>

        {/* 點擊可偷看 5 階預覽 — touch-pan-y 讓手機仍可垂直捲動 */}
        <button
          onClick={() => setPreviewOpen(true)}
          className="relative inline-block cursor-pointer active:scale-95 transition touch-pan-y"
          style={{ touchAction: "pan-y" }}
          aria-label="點擊看 5 階段預覽"
        >
          <div
            className="absolute inset-0 -m-6 rounded-full animate-sparkle pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,212,71,0.5) 0%, transparent 65%)" }}
          />
          <PetAvatar stage={pet.stage} size={180} />
          <div className="absolute -bottom-1 right-0 text-[10px] px-2 py-0.5 rounded-full bg-white/90 border border-empire-cloud font-bold text-empire-berry">
            👁️ 偷看未來
          </div>
        </button>

        <div className="mt-4 font-display text-2xl font-black text-empire-ink text-shadow-soft">
          <InlineRename value={pet.name} onSave={setPetName} />
        </div>
        <div className="text-sm text-empire-mute mt-1">
          <span className="tag rarity-sr">{PET_STAGE_LABEL[pet.stage]}</span>
          <span className="ml-2">平均屬性 <b className="text-empire-ink">{avg.toFixed(0)}</b> / 100</span>
        </div>
        {hungry && (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-empire-sunshine/30 border border-empire-sunshine/60 text-empire-ink text-xs font-semibold animate-bob">
            有點餓了，陪我玩嘛 🥺
          </div>
        )}

        {/* 雙主人親密度條 */}
        <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <BondBar
            label={couple.queen.nickname}
            value={bondQueen}
            isSelf={role === "queen"}
            color="from-rose-400 to-empire-berry"
          />
          <BondBar
            label={couple.prince.nickname}
            value={bondPrince}
            isSelf={role === "prince"}
            color="from-sky-400 to-empire-sky"
          />
        </div>
        {laggingSide && Math.abs(bondQueen - bondPrince) >= 20 && (
          <div className="mt-2 text-[11px] text-empire-berry font-semibold">
            🥺「{laggingName} 好久沒來餵我了…」
          </div>
        )}

        {/* 下一階條件 */}
        {!isMaxStage && (
          <div className="mt-5 mx-auto max-w-sm bg-white/70 rounded-2xl p-3 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-empire-mute">距離 <b className="text-empire-ink">{PET_STAGE_LABEL[nextStageIdx]}</b> 還差</div>
              <div className="w-8 h-8 rounded-full bg-empire-cream ring-2 ring-empire-gold/60 overflow-hidden animate-pulse">
                <PetAvatar stage={nextStageIdx as 0 | 1 | 2 | 3 | 4} size={32} animate={false} />
              </div>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <ReqLine label="平均屬性" current={avg} target={nextReq.attr} unit="" />
              {nextReq.bond > 0 && (
                <>
                  <ReqLine label={`${couple.queen.nickname} 的親密度`} current={bondQueen} target={nextReq.bond} unit="" />
                  <ReqLine label={`${couple.prince.nickname} 的親密度`} current={bondPrince} target={nextReq.bond} unit="" />
                </>
              )}
              {nextReq.minFeeds && (
                <div className="text-[10px] text-empire-mute italic">
                  · 或累積餵食 {nextReq.minFeeds} 次即可破殼 (目前 {(pet.feedCountQueen ?? 0) + (pet.feedCountPrince ?? 0)} 次)
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 快速互動區 — 不用開屬性也能加 bond */}
      <div className="card p-4 relative">
        <h3 className="font-bold text-sm mb-3">💫 快速互動 · 提升親密度</h3>
        <div className="grid grid-cols-3 gap-2">
          <InteractBtn
            emoji="🫳"
            label="撫摸"
            sub="+2 親密"
            onClick={() => doInteract("pet")}
          />
          <InteractBtn
            emoji="🍬"
            label="餵零食"
            sub="-20 金 · +5 親密 · 隨機屬性 +3"
            onClick={() => doInteract("treat")}
            disabled={couple.coins < 20}
          />
          <InteractBtn
            emoji="💬"
            label="說說話"
            sub="+3 親密 · +3 溝通"
            onClick={() => setTalkOpen(true)}
          />
        </div>
        {toast && (
          <div className="absolute top-2 right-3 px-2.5 py-1 rounded-full bg-empire-ink text-white text-xs font-bold animate-pop shadow-lg">
            {toast}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">
          五項屬性 · 點擊餵養 +5 屬性 · +4 親密
          {pet.lastFedBy && (
            <span className="ml-2 text-[10px] text-empire-mute font-normal">
              最後由 {pet.lastFedBy === "queen" ? couple.queen.nickname : couple.prince.nickname} 餵
            </span>
          )}
        </h3>
        <div className="space-y-3">
          {(Object.keys(pet.attrs) as Array<keyof typeof pet.attrs>).map((k) => (
            <button
              key={k}
              onClick={() => feedPet(k)}
              className="w-full text-left hover:bg-empire-cloud/50 rounded-xl p-2 transition"
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{ATTR_LABEL[k]}</span>
                <span className="text-slate-500">{pet.attrs[k]} / 100</span>
              </div>
              <div className="h-2.5 bg-empire-cloud rounded-full overflow-hidden">
                <motion.div
                  className={`${ATTR_COLOR[k]} h-full rounded-full`}
                  initial={false}
                  animate={{ width: `${pet.attrs[k]}%` }}
                  transition={{ type: "spring", stiffness: 120 }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">進化階段</h3>
        <div className="flex items-center justify-between gap-1">
          {([0, 1, 2, 3, 4] as const).map((i) => {
            const active = i <= pet.stage;
            const isNext = i === nextStageIdx && !isMaxStage;
            return (
              <button
                key={i}
                onClick={() => setPreviewOpen(true)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition ${
                  active ? "bg-empire-pink/20 ring-2 ring-empire-berry/40" : isNext ? "bg-empire-cream ring-2 ring-empire-gold/60 animate-pulse" : "bg-empire-cloud opacity-35 grayscale"
                }`}>
                  <PetAvatar stage={i} size={48} animate={false} />
                </div>
                <div className={`text-xs ${active ? "text-empire-ink font-semibold" : isNext ? "text-empire-gold font-bold" : "text-empire-mute"}`}>
                  {PET_STAGE_LABEL[i]}
                </div>
                <div className="text-[9px] text-empire-mute">
                  {STAGE_REQ[i].bond > 0 ? `bond ${STAGE_REQ[i].bond}+` : i === 0 ? "起點" : "餵 2 次"}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-empire-mute mt-4 text-center leading-relaxed">
          孵化極簡：餵 2 次就破殼 · 成長要雙方一起來
          <br />
          點上方寵物或任一階段都可以開啟完整預覽
        </p>
      </div>

      {previewOpen && <StagePreviewModal currentStage={pet.stage} onClose={() => setPreviewOpen(false)} />}
      {talkOpen && (
        <TalkModal
          petName={pet.name}
          onSend={(msg) => {
            const r = petInteract("talk", msg);
            if (r.ok) {
              setToast("💬 牠聽到了，尾巴搖搖");
              setTimeout(() => setToast(null), 1500);
            }
            setTalkOpen(false);
          }}
          onClose={() => setTalkOpen(false)}
        />
      )}
    </div>
  );
}

function InteractBtn({ emoji, label, sub, onClick, disabled }: { emoji: string; label: string; sub: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-2xl border-2 text-center transition active:scale-95 ${
        disabled
          ? "bg-empire-cloud/40 border-empire-cloud opacity-50 cursor-not-allowed"
          : "bg-white border-empire-cloud hover:border-empire-berry/60 hover:shadow-md"
      }`}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="text-xs font-bold mt-1 text-empire-ink">{label}</div>
      <div className="text-[9px] text-empire-mute mt-0.5 leading-tight">{sub}</div>
    </button>
  );
}

function TalkModal({ petName, onSend, onClose }: { petName: string; onSend: (msg: string) => void; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-sm w-full card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-5xl mb-2">💬</div>
          <div className="font-display font-black text-lg text-empire-ink">跟 {petName} 說句話</div>
          <div className="text-xs text-empire-mute mt-1">+3 親密度 · +3 溝通屬性 · 訊息會存成紀念時刻</div>
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value.slice(0, 40))}
          placeholder="例：今天很乖哦，晚點陪你玩～"
          rows={3}
          autoFocus
          className="mt-4 w-full border-2 border-empire-cloud rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
          maxLength={40}
        />
        <div className="text-[10px] text-right text-empire-mute">{msg.length}/40</div>
        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2 text-sm">取消</button>
          <button
            onClick={() => msg.trim() && onSend(msg)}
            disabled={!msg.trim()}
            className="btn-primary flex-1 py-2 font-bold disabled:opacity-40"
          >
            傳送 💕
          </button>
        </div>
      </div>
    </div>
  );
}

function BondBar({ label, value, isSelf, color }: { label: string; value: number; isSelf: boolean; color: string }) {
  return (
    <div className={`p-2 rounded-xl ${isSelf ? "bg-white/80 ring-2 ring-empire-berry/40" : "bg-white/60"}`}>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-bold truncate">{label}{isSelf && " (我)"}</span>
        <span className="text-empire-mute font-black">{value}</span>
      </div>
      <div className="h-2 bg-empire-cloud rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ReqLine({ label, current, target, unit }: { label: string; current: number; target: number; unit: string }) {
  const done = current >= target;
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div>
      <div className="flex justify-between">
        <span className={done ? "text-emerald-700 font-semibold" : "text-empire-ink"}>
          {done && "✓ "}{label}
        </span>
        <span className={done ? "text-emerald-700" : "text-empire-mute"}>
          {Math.floor(current)}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-1 mt-0.5 bg-empire-cloud rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${done ? "bg-emerald-500" : "bg-empire-berry"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StagePreviewModal({ currentStage, onClose }: { currentStage: 0 | 1 | 2 | 3 | 4; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="max-w-md w-full card p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(180deg, #fff9e6, #fef2ff)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-black text-lg text-empire-ink">🔮 5 階段預覽</h3>
          <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
        </div>
        <p className="text-[11px] text-empire-mute mb-4">從蛋到神話的完整旅程 · 未解鎖的半透明顯示</p>

        <div className="space-y-3">
          {([0, 1, 2, 3, 4] as const).map((i) => {
            const unlocked = i <= currentStage;
            const isCurrent = i === currentStage;
            const req = STAGE_REQ[i];
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isCurrent
                    ? "bg-empire-cream ring-2 ring-empire-gold shadow-md"
                    : unlocked
                    ? "bg-white"
                    : "bg-white/40 opacity-70"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
                  unlocked ? "bg-empire-pink/20" : "bg-empire-cloud grayscale"
                }`}>
                  <PetAvatar stage={i} size={60} animate={isCurrent} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-display font-black text-empire-ink">{PET_STAGE_LABEL[i]}</span>
                    {isCurrent && <span className="text-[9px] px-1.5 py-0.5 bg-empire-gold text-white rounded-full font-bold">現在</span>}
                    {!unlocked && <span className="text-[9px] px-1.5 py-0.5 bg-empire-cloud text-empire-mute rounded-full font-bold">🔒</span>}
                  </div>
                  <div className="text-[11px] text-empire-mute mt-0.5">{req.hint}</div>
                  {i > 0 && (
                    <div className="text-[10px] text-empire-mute mt-1">
                      {i === 1 ? `餵食 ${req.minFeeds} 次` : `屬性 ${req.attr}+ · 雙方親密 ${req.bond}+`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="mt-5 btn-primary w-full py-2.5 font-bold">
          繼續養
        </button>
      </div>
    </div>
  );
}
