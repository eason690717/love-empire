"use client";

import { useGame } from "@/lib/store";
import { ShareMomentButton } from "@/components/ShareMomentButton";
import { ATTR_LABEL } from "@/lib/utils";

/**
 * Spotify Wrapped 風格年度回顧
 * 從現有 state 推導統計 — 未來接後端時改讀 Supabase
 */
export default function RecapPage() {
  const couple = useGame((s) => s.couple);
  const submissions = useGame((s) => s.submissions);
  const codex = useGame((s) => s.codex);
  const moments = useGame((s) => s.moments);
  const streak = useGame((s) => s.streak);
  const pet = useGame((s) => s.pet);
  const redemptions = useGame((s) => s.redemptions);

  const year = new Date().getFullYear();
  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);

  const approvedYear = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d.getFullYear() === year;
  });

  const totalCoins = approvedYear.reduce((a, s) => a + s.reward, 0);
  const cardsThisYear = codex.filter((c) => c.obtainedAt && c.obtainedAt.startsWith(String(year)));
  const ssrCount = cardsThisYear.filter((c) => c.rarity === "SSR").length;
  const momentsYear = moments.filter((m) => m.isSelf).length;

  const topAttr = (Object.entries(pet.attrs) as [keyof typeof pet.attrs, number][])
    .sort((a, b) => b[1] - a[1])[0];

  const topCategory = approvedYear.reduce((acc, s) => {
    // 粗略從標題猜分類 — 實際由 task catalog 反查
    const t = s.taskTitle;
    const cat = /幫忙|洗|垃圾|煮飯|床/.test(t) ? "chore" : /陪|運動|閱讀|健康/.test(t) ? "wellness" : /擁抱|情話|好話|心情/.test(t) ? "romance" : /驚喜|禮物/.test(t) ? "surprise" : "coop";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <div
        className="card p-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ffe3b3 0%, #ffbfd2 50%, #b8d8ff 100%)" }}
      >
        <div className="absolute top-3 left-4 text-2xl animate-float-slow">✨</div>
        <div className="absolute top-5 right-6 text-2xl animate-sparkle">💫</div>
        <div className="text-xs text-empire-ink font-semibold">{year} 年度回顧</div>
        <h2 className="mt-1 font-display text-3xl font-black text-empire-ink text-shadow-soft">{couple.name}</h2>
        <p className="text-sm text-empire-ink/80 mt-1">一年的甜蜜，濃縮成這一頁</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BigStat emoji="📜" label="完成任務" value={approvedYear.length} unit="個" />
        <BigStat emoji="💰" label="累積金幣" value={totalCoins} unit="枚" />
        <BigStat emoji="🎴" label="收集記憶" value={cardsThisYear.length} unit="張" />
        <BigStat emoji="✨" label="SSR 卡" value={ssrCount} unit="張" />
        <BigStat emoji="🔥" label="最長連擊" value={streak.longest} unit="天" />
        <BigStat emoji="🌸" label="紀念時刻" value={momentsYear} unit="則" />
      </div>

      <div className="card p-5 text-center">
        <div className="text-xs text-empire-mute">最擅長的屬性</div>
        <div className="mt-2 text-5xl animate-bob">
          {topAttr?.[0] === "intimacy" ? "💞"
          : topAttr?.[0] === "communication" ? "💬"
          : topAttr?.[0] === "romance" ? "🌹"
          : topAttr?.[0] === "care" ? "🫂"
          : "🎁"}
        </div>
        <div className="mt-2 font-bold text-lg">{ATTR_LABEL[topAttr?.[0] ?? "intimacy"]}</div>
        <div className="text-sm text-empire-mute">屬性值 {topAttr?.[1] ?? 0} / 100</div>
      </div>

      {topCat && (
        <div className="card p-5 text-center bg-gradient-to-br from-empire-cloud to-white">
          <div className="text-xs text-empire-mute">你們最常做的類型</div>
          <div className="mt-2 text-5xl">
            {topCat[0] === "chore" ? "🧺"
            : topCat[0] === "wellness" ? "🧘"
            : topCat[0] === "romance" ? "💕"
            : topCat[0] === "surprise" ? "🎁"
            : "🤝"}
          </div>
          <div className="mt-2 font-bold text-lg">
            {topCat[0] === "chore" ? "生活雜事"
            : topCat[0] === "wellness" ? "健康管理"
            : topCat[0] === "romance" ? "浪漫時刻"
            : topCat[0] === "surprise" ? "驚喜創意"
            : "雙人合作"}
          </div>
          <div className="text-sm text-empire-mute">共 {topCat[1]} 個任務</div>
        </div>
      )}

      <div className="card p-5">
        <h3 className="font-bold mb-3 text-center">📣 分享這份回顧</h3>
        <ShareMomentButton
          title={`${year} 年度回顧 · ${couple.name}`}
          subtitle={`完成 ${approvedYear.length} 個任務、收集 ${cardsThisYear.length} 張卡、最長連擊 ${streak.longest} 天`}
          emoji="✨"
          coupleName={couple.name}
        />
      </div>

      <p className="text-xs text-empire-mute text-center mt-4">
        提示：更多年度數據（禮物收送、聯盟貢獻、PK 戰績）將在 Supabase 後端串接後呈現
      </p>
    </div>
  );
}

function BigStat({ emoji, label, value, unit }: { emoji: string; label: string; value: number; unit: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-1 font-display font-black text-2xl text-empire-ink">{value.toLocaleString()}</div>
      <div className="text-xs text-empire-mute">{label} · {unit}</div>
    </div>
  );
}
