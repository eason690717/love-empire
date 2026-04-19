"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";

/** 情侶活動時間軸：合併申報 / 動態 / 通知，按日期排序 */
export default function TimelinePage() {
  const submissions = useGame((s) => s.submissions);
  const moments = useGame((s) => s.moments);
  const notifications = useGame((s) => s.notifications);
  const couple = useGame((s) => s.couple);

  interface Entry {
    id: string;
    emoji: string;
    title: string;
    body?: string;
    ts: number;
    category: string;
    tone: "pos" | "neg" | "info";
  }

  const parseTs = (s: string) => {
    try { return new Date(s.replace(/\//g, "-")).getTime(); } catch { return 0; }
  };

  const entries: Entry[] = [
    ...submissions.map<Entry>((s) => ({
      id: "s" + s.id,
      emoji: s.status === "approved" ? "✅" : s.status === "rejected" ? "❌" : "⏳",
      title: s.taskTitle,
      body: `${s.reward} 金幣 · ${s.status === "approved" ? "已准奏" : s.status === "rejected" ? "被駁回" : "待審核"}`,
      ts: parseTs(s.reviewedAt ?? s.createdAt),
      category: "任務",
      tone: s.status === "approved" ? "pos" : s.status === "rejected" ? "neg" : "info",
    })),
    ...moments.filter((m) => m.isSelf).map<Entry>((m) => ({
      id: "m" + m.id,
      emoji: m.emoji,
      title: m.title,
      body: m.subtitle,
      ts: parseTs(m.createdAt),
      category: "動態",
      tone: "pos",
    })),
    ...notifications.filter((n) => n.type === "system" || n.type === "level" || n.type === "streak").map<Entry>((n) => ({
      id: "n" + n.id,
      emoji: n.emoji,
      title: n.title,
      body: n.body,
      ts: parseTs(n.createdAt),
      category: "里程碑",
      tone: "info",
    })),
  ];

  entries.sort((a, b) => b.ts - a.ts);

  // 按日期分群
  const grouped: Record<string, Entry[]> = {};
  for (const e of entries) {
    const d = new Date(e.ts);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    (grouped[key] ||= []).push(e);
  }
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      <PageBanner
        title="時間軸"
        subtitle={`${couple.name} · 所有申報 / 動態 / 里程碑`}
        emoji="📅"
        gradient="violet"
        stats={[
          { label: "申報", value: submissions.length },
          { label: "動態", value: moments.filter((m) => m.isSelf).length },
          { label: "總項", value: entries.length },
        ]}
      />

      {/* 電影感 CTA — 連到 recap 電影模式 */}
      <Link
        href="/recap"
        className="block p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 text-white font-black shadow-lg hover:shadow-xl hover:brightness-110 transition active:scale-95"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🎬</span>
          <div>
            <div className="text-lg">把這些日子拍成電影</div>
            <div className="text-xs opacity-90 font-semibold">8 幕全螢幕回顧 · 一起重溫</div>
          </div>
        </div>
      </Link>

      {dateKeys.length === 0 && (
        <p className="card p-8 text-center text-empire-mute">還沒有足夠的紀錄。快去申報幾個任務吧！</p>
      )}

      {dateKeys.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-empire-berry/20 flex items-center justify-center text-sm font-bold">
              {date.slice(8)}
            </div>
            <div className="text-xs text-empire-mute">{date}</div>
          </div>
          <div className="ml-5 space-y-2 border-l-2 border-empire-cloud pl-4">
            {grouped[date].map((e) => (
              <div key={e.id} className="card p-3 flex items-start gap-3">
                <div className="text-2xl shrink-0">{e.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{e.title}</span>
                    <span className={`tag text-[10px] ${
                      e.tone === "pos" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : e.tone === "neg" ? "bg-rose-100 text-rose-700 border-rose-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {e.category}
                    </span>
                  </div>
                  {e.body && <div className="text-xs text-empire-mute mt-0.5">{e.body}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
