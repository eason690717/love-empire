"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/store";

interface Step {
  title: string;
  body: string;
  emoji: string;
  cta: string;
}

const STEPS: Step[] = [
  {
    emoji: "👑",
    title: "歡迎來到愛的帝國",
    body: "這是你跟另一半的專屬遊戲。\n做家事、說情話、一起經營，都會變成數值成長。",
    cta: "好，下一步",
  },
  {
    emoji: "📜",
    title: "怎麼賺金幣？",
    body: "到「任務申報」勾選你做過的事 → 傳給另一半准奏 → 金幣入帳、寵物屬性上升、有機會掉落 SSR 記憶卡。",
    cta: "了解",
  },
  {
    emoji: "🥚",
    title: "愛之寵物",
    body: "你們共同養育一隻寵物。五項屬性 (親密 / 溝通 / 浪漫 / 照顧 / 驚喜) 達標就會進化。48 小時沒互動牠會難過。",
    cta: "明白",
  },
  {
    emoji: "🌙",
    title: "每日儀式 · 連擊",
    body: "每天晨間簽到 + 睡前話語兩件事都完成 → 連擊 +1 天。連擊 7 / 14 / 30 / 100 天會解鎖節日限定記憶卡。",
    cta: "知道了",
  },
  {
    emoji: "🏆",
    title: "情侶排行榜 · 聯盟 · 廣場",
    body: "跟全世界的情侶比愛意指數、連擊天數；加入聯盟合作挑戰 BOSS；重大事件會自動發到「帝國廣場」，可一鍵分享到 LINE。",
    cta: "開始冒險 ✨",
  },
];

export function OnboardingModal() {
  const step = useGame((s) => s.onboardingStep);
  const advance = useGame((s) => s.advanceOnboarding);
  const skip = useGame((s) => s.skipOnboarding);

  useEffect(() => {
    if (step === 0) advance();
  }, [step, advance]);

  const idx = step - 1;
  if (step < 1 || idx >= STEPS.length) return null;
  const current = STEPS[idx];

  const isLast = idx === STEPS.length - 1;
  const onNext = () => {
    if (isLast) skip();
    else advance();
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

        <div className="text-7xl animate-bob">{current.emoji}</div>
        <h2 className="mt-4 font-display font-black text-2xl text-empire-ink">{current.title}</h2>
        <p className="mt-3 text-sm text-empire-mute whitespace-pre-line leading-relaxed">
          {current.body}
        </p>

        {/* 步驟指示點 */}
        <div className="mt-5 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-empire-berry" : "w-1.5 bg-empire-cloud"
              }`}
            />
          ))}
        </div>

        <button onClick={onNext} className="mt-6 btn-primary w-full py-3 text-base">
          {current.cta}
        </button>
      </div>
    </div>
  );
}
