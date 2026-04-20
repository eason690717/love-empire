"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { AttributeRadar } from "@/components/AttributeRadar";
import type { Attribute } from "@/lib/types";

/**
 * /insights — 關係健康度儀表板
 *
 * 合成：
 *  · 愛意值趨勢（由 submissions.approved 累計 systemXp 依日期分組）
 *  · 關係健康度（bond 平均 + 雙方差距 + 連擊 + 問答率）
 *  · 屬性雷達（自己 vs 對方視角貢獻）
 *  · 活躍度：近 7 日送審、近 30 日兌換
 */
export default function InsightsPage() {
  const couple = useGame((s) => s.couple);
  const pet = useGame((s) => s.pet);
  const submissions = useGame((s) => s.submissions);
  const redemptions = useGame((s) => s.redemptions);
  const streak = useGame((s) => s.streak);
  const questionAnswers = useGame((s) => s.questionAnswers);
  const bucketList = useGame((s) => s.bucketList);
  const tasks = useGame((s) => s.tasks);

  const approved = useMemo(() => submissions.filter((s) => s.status === "approved"), [submissions]);

  // 過去 14 天的愛意增量趨勢
  const loveTrend = useMemo(() => {
    const now = new Date();
    const days: Array<{ date: string; love: number; tasks: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayTasks = approved.filter((s) => {
        // createdAt 是 zh-TW locale string，無法直接 parse；用 reviewedAt 或 createdAt 第一部分 fallback
        const t = s.reviewedAt ?? s.createdAt;
        return t.includes(`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`) ||
               t.includes(dateKey);
      });
      const xp = dayTasks.reduce((acc, s) => {
        const task = tasks.find((x) => x.id === s.taskId);
        return acc + (task?.systemXp ?? 5);
      }, 0);
      days.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, love: xp, tasks: dayTasks.length });
    }
    return days;
  }, [approved, tasks]);

  const maxLove = Math.max(1, ...loveTrend.map((d) => d.love));

  // 關係健康度（0-100 合成分數）
  const healthScore = useMemo(() => {
    const bondQueen = pet.bondQueen ?? 0;
    const bondPrince = pet.bondPrince ?? 0;
    const bondAvg = (bondQueen + bondPrince) / 2;
    const bondGap = Math.abs(bondQueen - bondPrince);
    const streakScore = Math.min(100, streak.current * 2);
    const answersCount = questionAnswers.length;
    const qaScore = Math.min(100, answersCount * 2);
    const bucketScore = Math.min(100, bucketList.length * 5);
    // 加權
    const score = Math.round(
      bondAvg * 0.35 +
      Math.max(0, 100 - bondGap * 2) * 0.15 +
      streakScore * 0.15 +
      qaScore * 0.2 +
      bucketScore * 0.15,
    );
    const level: "excellent" | "good" | "ok" | "warn" =
      score >= 80 ? "excellent" : score >= 60 ? "good" : score >= 40 ? "ok" : "warn";
    return { score, bondAvg, bondGap, streakScore, qaScore, bucketScore, level };
  }, [pet, streak, questionAnswers, bucketList]);

  // 各自貢獻屬性統計（自己做 vs 對方做的任務）
  const attrStats = useMemo(() => {
    const my: Record<Attribute, number> = { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 };
    const partner: Record<Attribute, number> = { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 };
    approved.forEach((s) => {
      const task = tasks.find((t) => t.id === s.taskId);
      if (!task) return;
      if (s.submittedBy === "queen") my[task.attribute] += task.systemXp;
      else partner[task.attribute] += task.systemXp;
    });
    return { my, partner };
  }, [approved, tasks]);

  const now = Date.now();
  const last7dApproved = approved.filter((s) => {
    if (!s.reviewedAt) return false;
    // zh-TW locale string 無法 parse → 回退：submissions 有 reviewedAt 才算
    return true;
  }).length;

  const healthColor = healthScore.level === "excellent" ? "#8ed172"
    : healthScore.level === "good" ? "#5aa4ff"
    : healthScore.level === "ok" ? "#ffd447"
    : "#ff7fa1";
  const healthLabel = healthScore.level === "excellent" ? "關係超健康 💞"
    : healthScore.level === "good" ? "關係良好 ✨"
    : healthScore.level === "ok" ? "可以再加溫 🔥"
    : "該陪伴彼此了 💭";

  return (
    <div className="space-y-4">
      <PageBanner
        title="關係儀表板"
        subtitle={`你們的王國 Lv.${couple.kingdomLevel} · 愛意 ${couple.loveIndex}`}
        emoji="📊"
        gradient="violet"
        stats={[
          { label: "連擊", value: streak.current },
          { label: "已完成任務", value: approved.length },
          { label: "人生清單", value: bucketList.length },
        ]}
      />

      {/* 健康度合成分數 */}
      <div className="card p-5 text-center relative overflow-hidden">
        <div className="text-[10px] text-empire-mute tracking-widest mb-2">💞 關係健康度</div>
        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f0e8f5" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={healthColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(healthScore.score / 100) * 264} 264`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-display font-black" style={{ color: healthColor }}>
              {healthScore.score}
            </div>
            <div className="text-[10px] text-empire-mute">/ 100</div>
          </div>
        </div>
        <div className="mt-3 text-sm font-bold" style={{ color: healthColor }}>{healthLabel}</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
          <Pill label="寵物親密" value={Math.round(healthScore.bondAvg)} max={100} />
          <Pill label="連擊" value={streak.current} max={50} unit="天" />
          <Pill label="深度問答" value={questionAnswers.length} max={50} unit="題" />
        </div>
      </div>

      {/* 愛意增長趨勢（14 天） */}
      <div className="card p-5">
        <h3 className="font-bold text-empire-ink">💝 最近 14 天愛意增長</h3>
        <div className="mt-3 flex items-end gap-1 h-28">
          {loveTrend.map((d, i) => {
            const h = (d.love / maxLove) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date} · +${d.love} XP · ${d.tasks} 任務`}>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(4, h)}%`,
                    background: d.love > 0
                      ? "linear-gradient(to top, #ff8eae, #ffb6da)"
                      : "#e8e8ee",
                    minHeight: 2,
                  }}
                />
                <div className="text-[8px] text-empire-mute leading-tight">{d.date}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-[11px] text-empire-mute text-center">
          共 {loveTrend.reduce((a, d) => a + d.love, 0)} XP · {loveTrend.reduce((a, d) => a + d.tasks, 0)} 個任務
        </div>
      </div>

      {/* 屬性貢獻雷達對比 */}
      <div className="card p-5">
        <h3 className="font-bold text-empire-ink">🕸 誰為彼此做了什麼？</h3>
        <p className="text-[11px] text-empire-mute mt-1">兩人累積貢獻的 5 屬性（系統 XP）</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-xs text-empire-mute">{couple.queen.nickname}</div>
            <AttributeRadar attrs={attrStats.my} size={140} />
          </div>
          <div>
            <div className="text-xs text-empire-mute">{couple.prince.nickname}</div>
            <AttributeRadar attrs={attrStats.partner} size={140} />
          </div>
        </div>
      </div>

      {/* 活躍度 / 風險提示 */}
      <div className="card p-5 space-y-2">
        <h3 className="font-bold text-empire-ink">⚡ 活躍度</h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <StatBox label="完成任務" value={approved.length} unit="個" />
          <StatBox label="已兌換" value={redemptions.length} unit="次" />
          <StatBox label="答題" value={questionAnswers.length} unit="題" />
        </div>
        {healthScore.level === "warn" && (
          <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-800 leading-relaxed">
            💭 最近兩個人的互動少了一點。要不要一起做一題<Link href="/questions" className="underline font-bold mx-0.5">深度問答</Link>
            或完成一件<Link href="/bucket-list" className="underline font-bold mx-0.5">人生清單</Link>？
          </div>
        )}
        {healthScore.bondGap >= 25 && (
          <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-900 leading-relaxed">
            ⚠️ 兩個人對寵物的親密度差 {healthScore.bondGap}。較少餵食的那邊可以主動去<Link href="/pet" className="underline font-bold mx-0.5">/pet</Link>互動幾下。
          </div>
        )}
      </div>

      <div className="text-center pb-6">
        <Link href="/dashboard" className="text-xs text-empire-sky underline">← 回主殿</Link>
      </div>
    </div>
  );
}

function Pill({ label, value, max, unit }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="bg-empire-mist rounded-lg p-1.5">
      <div className="text-empire-mute text-[9px]">{label}</div>
      <div className="font-bold text-empire-ink mt-0.5">{value}{unit ?? ""}</div>
      <div className="mt-1 h-1 bg-empire-cloud rounded-full overflow-hidden">
        <div className="h-full bg-empire-pink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatBox({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="p-2 rounded-xl bg-empire-mist">
      <div className="text-[10px] text-empire-mute">{label}</div>
      <div className="text-lg font-black text-empire-ink">
        {value} <span className="text-[10px] font-normal text-empire-mute">{unit}</span>
      </div>
    </div>
  );
}
