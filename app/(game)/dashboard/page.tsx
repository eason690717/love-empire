"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { titleByLevel, PET_STAGE_EMOJI, PET_STAGE_LABEL } from "@/lib/utils";
import { PASSIVE_SKILLS, isSpecialDay, SPECIAL_DAY_LABEL, SPECIAL_DAY_MULTIPLIER } from "@/lib/passive";
import { AttributeRadar } from "@/components/AttributeRadar";
import Link from "next/link";

export default function DashboardPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const streak = useGame((s) => s.streak);
  const pet = useGame((s) => s.pet);
  const codex = useGame((s) => s.codex);
  const submissions = useGame((s) => s.submissions);
  const redemptions = useGame((s) => s.redemptions);
  const moments = useGame((s) => s.moments);
  const leaderboard = useGame((s) => s.leaderboard);
  const checkKnightShield = useGame((s) => s.checkKnightShield);

  // 首次進 dashboard 觸發騎士盾檢查（對應連擊中斷保護）
  useEffect(() => {
    checkKnightShield();
  }, [checkKnightShield]);

  const pending = submissions.filter((s) => s.status === "pending").length;
  const collected = codex.filter((c) => c.obtainedAt).length;
  const rank = leaderboard.findIndex((c) => c.isSelf) + 1;
  const skill = PASSIVE_SKILLS[role];
  const special = isSpecialDay();

  // 本月 / 本週 / 今年統計
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);

  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);
  const approvedThisMonth = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const approvedThisWeek = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d >= oneWeekAgo;
  }).length;
  const approvedThisYear = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d.getFullYear() === thisYear;
  }).length;
  const momentsThisMonth = moments.filter((m) => {
    if (!m.isSelf) return false;
    const d = parseDate(m.createdAt);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const unusedRedemptions = redemptions.filter((r) => r.status === "unused").length;

  return (
    <div className="space-y-4">
      {/* 特別日橫幅 */}
      {special && (
        <div className="card p-4 bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 border-2 border-empire-berry/40 animate-pop">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bob">💝</div>
            <div className="flex-1">
              <div className="font-bold text-empire-ink">{SPECIAL_DAY_LABEL}</div>
              <div className="text-xs text-empire-mute">
                今天所有任務**愛意指數 {SPECIAL_DAY_MULTIPLIER}× 加倍**，別浪費
              </div>
            </div>
          </div>
        </div>
      )}

      <Section title="🏰 帝國概況">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="王國等級" value={`Lv. ${couple.kingdomLevel}`} sub={titleByLevel(couple.kingdomLevel)} />
          <Stat label="愛意指數" value={couple.loveIndex.toLocaleString()} sub="系統 XP (排行榜用)" />
          <Stat label="連擊天數" value={`🔥 ${streak.current}`} sub={`最長 ${streak.longest} 天${(streak.knightShields ?? 0) > 0 ? ` · 🛡 ${streak.knightShields}` : ""}`} />
          <Stat label="金幣" value={`💰 ${couple.coins}`} sub="國庫兌換真實獎勵" />
        </div>
      </Section>

      <Section title="💞 五屬性雷達">
        <AttributeRadar attrs={pet.attrs} size={280} />
      </Section>

      {/* 被動技能卡 */}
      <div className="card p-4 bg-gradient-to-br from-empire-cloud to-white">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{skill.emoji}</div>
          <div className="flex-1">
            <div className="text-xs text-empire-mute">{role === "queen" ? "王妃" : "王子"} 被動</div>
            <div className="font-bold text-empire-ink">{skill.name}</div>
            <div className="text-xs text-empire-mute mt-0.5">{skill.description}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickCard href="/pet" label="愛之寵物" sub={`${PET_STAGE_LABEL[pet.stage]} 階段`} emoji={PET_STAGE_EMOJI[pet.stage]} />
        <QuickCard href="/codex" label="記憶圖鑑" sub={`${collected} / ${codex.length}`} emoji="🖼️" />
        <QuickCard href="/tasks" label="待審申報" sub={`${pending} 筆`} emoji="📜" />
        <QuickCard href="/leaderboard" label="全球排行" sub={`第 ${rank} 名`} emoji="🏆" />
      </div>

      <Section title="📊 統計總覽">
        <div className="grid grid-cols-3 gap-2 text-center">
          <TinyStat label="本週任務" value={approvedThisWeek} />
          <TinyStat label="本月任務" value={approvedThisMonth} />
          <TinyStat label="今年任務" value={approvedThisYear} />
          <TinyStat label="本月紀念" value={momentsThisMonth} />
          <TinyStat label="金幣" value={couple.coins} />
          <TinyStat label="待用券" value={unusedRedemptions} />
        </div>
      </Section>

      <Section title="🎯 下個里程碑">
        <ul className="text-sm space-y-1 text-empire-mute">
          <li>· 升至 Lv.{couple.kingdomLevel + 1}：還需 {50 - (couple.loveIndex % 50)} 愛意</li>
          <li>· 下個稱號：{
            couple.kingdomLevel < 5 ? "Lv.5 熱戀勇者"
            : couple.kingdomLevel < 15 ? "Lv.15 愛的大師"
            : couple.kingdomLevel < 30 ? "Lv.30 神話級靈魂伴侶"
            : "已達最高稱號 ✨"
          }</li>
          <li>· 圖鑑完成度：{Math.round(collected / codex.length * 100)}%</li>
          <li>· 連擊里程碑：{
            streak.current < 7 ? `再 ${7 - streak.current} 天到 7 日連擊`
            : streak.current < 14 ? `再 ${14 - streak.current} 天到 14 日連擊`
            : streak.current < 30 ? `再 ${30 - streak.current} 天到 30 日連擊`
            : streak.current < 100 ? `再 ${100 - streak.current} 天到百日連擊`
            : "已達百日神話 🔥"
          }</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="font-bold text-empire-ink mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl p-3 border-2 border-white bg-gradient-to-br from-white to-empire-cloud shadow-sm">
      <div className="text-xs text-empire-mute">{label}</div>
      <div className="text-xl font-black text-empire-ink mt-1 font-display">{value}</div>
      <div className="text-xs text-empire-mute mt-1">{sub}</div>
    </div>
  );
}

function TinyStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl p-2 bg-empire-mist">
      <div className="text-[11px] text-empire-mute">{label}</div>
      <div className="text-base font-bold text-empire-ink mt-0.5">{value}</div>
    </div>
  );
}

function QuickCard({ href, label, sub, emoji }: { href: string; label: string; sub: string; emoji: string }) {
  return (
    <Link href={href} className="card p-4 hover:shadow-lift hover:-translate-y-0.5 transition flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-empire-cloud to-empire-leaf shadow-sm">
        {emoji}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-empire-ink truncate">{label}</div>
        <div className="text-xs text-empire-mute truncate">{sub}</div>
      </div>
    </Link>
  );
}
