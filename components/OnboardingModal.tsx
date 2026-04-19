"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";

interface Step {
  title: string;
  body: string;
  emoji: string;
  cta: string;
  /** 「試試看」快捷連結 — 點了會直接導頁，同時推進 onboarding */
  tryLink?: { label: string; href: string };
  /** 最終步的開局獎勵 */
  reward?: { coins: number; label: string };
}

const STEPS: Step[] = [
  {
    emoji: "👑",
    title: "歡迎來到愛的帝國",
    body: "這是你跟另一半的專屬經營遊戲。\n做家事、說情話、一起儀式化日常 — 全部會變成數值、寵物、卡牌成長。",
    cta: "好，下一步",
  },
  {
    emoji: "📜",
    title: "怎麼賺金幣？",
    body: "到「任務申報」勾選你做過的事，送出後由另一半准奏 → 金幣入帳、寵物屬性上升，還有機會掉落 SSR 記憶卡。\n送審越難的任務報酬越高。",
    cta: "了解",
    tryLink: { label: "👀 先去看任務清單", href: "/tasks" },
  },
  {
    emoji: "🥚",
    title: "愛之寵物",
    body: "你們共同養育一隻寵物。五項屬性 (親密 / 溝通 / 浪漫 / 照顧 / 驚喜) 各達 80+ 就會進化。\n48 小時沒互動牠會難過、屬性倒扣。",
    cta: "明白",
    tryLink: { label: "🐣 看一眼寵物", href: "/pet" },
  },
  {
    emoji: "🌙",
    title: "每日儀式 · 連擊",
    body: "每天晨間簽到 + 睡前話語都完成 → 連擊 +1 天。\n連擊 7 / 14 / 30 / 100 天會解鎖節日限定記憶卡。斷擊有「騎士盾」保護一次。",
    cta: "知道了",
    tryLink: { label: "🌅 晨/晚儀式頁", href: "/rituals" },
  },
  {
    emoji: "💬",
    title: "深度問答 · 對方會看到",
    body: "抽一題 → 寫答案 → 對方看到後打星評分。\n410 題涵蓋童年、家庭、浪漫、聆聽、未說出口 … 認真答，默契會以看得見的速度增長。",
    cta: "想試",
    tryLink: { label: "💭 抽一題試試", href: "/questions" },
  },
  {
    emoji: "🎁",
    title: "開局禮物 — 歡迎入境",
    body: "建國順利！\n送你 100 金、2 張新手 N 卡、開啟廣場/聯盟/排行榜權限。\n一切都已就位 — 去吧。",
    cta: "領取 100 金並開始冒險 ✨",
    reward: { coins: 100, label: "100 金 + 入境禮" },
  },
];

export function OnboardingModal() {
  const step = useGame((s) => s.onboardingStep);
  const advance = useGame((s) => s.advanceOnboarding);
  const skip = useGame((s) => s.skipOnboarding);
  const couple = useGame((s) => s.couple);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (step === 0) advance();
  }, [step, advance]);

  const idx = step - 1;
  if (step < 1 || idx >= STEPS.length) return null;
  const current = STEPS[idx];

  const isLast = idx === STEPS.length - 1;

  const claimReward = () => {
    if (claimed || !current.reward) return;
    useGame.setState((s) => ({
      couple: { ...s.couple, coins: s.couple.coins + current.reward!.coins },
    }));
    setClaimed(true);
  };

  const onNext = () => {
    if (isLast) {
      if (current.reward && !claimed) claimReward();
      skip();
    } else {
      advance();
    }
  };

  const goTry = (href: string) => {
    advance();
    if (typeof window !== "undefined") window.location.href = href;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(6px)" }}
    >
      <div className="max-w-sm w-full card p-7 text-center relative animate-pop">
        <button
          onClick={skip}
          className="absolute top-3 right-4 text-empire-mute hover:text-empire-ink text-sm"
        >
          略過
        </button>

        <div className="absolute top-3 left-4 text-[11px] text-empire-mute font-bold">
          {idx + 1} / {STEPS.length}
        </div>

        <div className="text-7xl animate-bob">{current.emoji}</div>
        <h2 className="mt-4 font-display font-black text-2xl text-empire-ink">{current.title}</h2>
        <p className="mt-3 text-sm text-empire-mute whitespace-pre-line leading-relaxed">
          {current.body}
        </p>

        {/* 進度條 */}
        <div className="mt-5 h-2 bg-empire-cloud rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-empire-berry to-empire-sunshine transition-all"
            style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* 獎勵卡片 (最終步) */}
        {current.reward && (
          <div className={`mt-4 p-3 rounded-xl border-2 ${claimed ? "bg-emerald-50 border-emerald-400" : "bg-empire-cream border-empire-gold"}`}>
            <div className="text-xs text-empire-mute">{claimed ? "已收下" : "點右下 CTA 即可領取"}</div>
            <div className="font-bold text-empire-gold text-lg">💰 {current.reward.label}</div>
            {claimed && <div className="text-[10px] text-emerald-600 mt-1">現有金幣：{couple.coins}</div>}
          </div>
        )}

        <button onClick={onNext} className="mt-6 btn-primary w-full py-3 text-base font-bold">
          {current.cta}
        </button>

        {current.tryLink && (
          <button
            onClick={() => goTry(current.tryLink!.href)}
            className="mt-2 w-full py-2 text-xs text-empire-sky hover:underline"
          >
            {current.tryLink.label} →
          </button>
        )}
      </div>
    </div>
  );
}
