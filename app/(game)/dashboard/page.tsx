"use client";

import { useGame } from "@/lib/store";
import { ATTR_LABEL, ATTR_COLOR, titleByLevel, PET_STAGE_EMOJI, PET_STAGE_LABEL } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const couple = useGame((s) => s.couple);
  const streak = useGame((s) => s.streak);
  const pet = useGame((s) => s.pet);
  const codex = useGame((s) => s.codex);
  const submissions = useGame((s) => s.submissions);
  const leaderboard = useGame((s) => s.leaderboard);

  const pending = submissions.filter((s) => s.status === "pending").length;
  const collected = codex.filter((c) => c.obtainedAt).length;
  const rank = leaderboard.findIndex((c) => c.isSelf) + 1;

  return (
    <div className="space-y-4">
      <Section title="🏰 帝國概況">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="王國等級" value={`Lv. ${couple.kingdomLevel}`} sub={titleByLevel(couple.kingdomLevel)} />
          <Stat label="愛意指數" value={couple.loveIndex.toLocaleString()} sub="五屬性總和" />
          <Stat label="連擊天數" value={`🔥 ${streak.current}`} sub={`最長 ${streak.longest} 天`} />
          <Stat label="金幣" value={`💰 ${couple.coins}`} sub="可兌換真實獎勵" />
        </div>
      </Section>

      <Section title="💞 五屬性雷達">
        <div className="space-y-2">
          {(Object.keys(pet.attrs) as Array<keyof typeof pet.attrs>).map((k) => (
            <div key={k}>
              <div className="flex justify-between text-sm">
                <span>{ATTR_LABEL[k]}</span>
                <span className="text-slate-500">{pet.attrs[k]} / 100</span>
              </div>
              <div className="h-2 bg-empire-cloud rounded-full overflow-hidden">
                <div className={`${ATTR_COLOR[k]} h-full rounded-full transition-all`} style={{ width: `${pet.attrs[k]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <QuickCard href="/pet" label="愛之寵物" sub={`${PET_STAGE_LABEL[pet.stage]} 階段`} emoji={PET_STAGE_EMOJI[pet.stage]} />
        <QuickCard href="/codex" label="記憶圖鑑" sub={`${collected} / ${codex.length}`} emoji="🖼️" />
        <QuickCard href="/tasks" label="待審申報" sub={`${pending} 筆`} emoji="📜" />
        <QuickCard href="/leaderboard" label="全球排行" sub={`第 ${rank} 名`} emoji="🏆" />
      </div>

      <Section title="📊 本週摘要">
        <ul className="text-sm space-y-1 text-slate-600">
          <li>· 本週完成任務：{submissions.filter((s) => s.status === "approved").length} 個</li>
          <li>· 本月記憶卡掉落：{collected} 張</li>
          <li>· 連擊維持中 🔥</li>
          <li>· 下個目標：升至 Lv.15 → 解鎖「愛的大師」稱號</li>
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
