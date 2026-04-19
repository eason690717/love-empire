"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { getKingdomStatus } from "@/lib/types";
import { PET_STAGE_LABEL } from "@/lib/utils";
import { PetAvatar } from "@/components/art/PetAvatar";
import { BUCKET_LIST } from "@/lib/bucketList";
import { getQuestionById } from "@/lib/questions";

export default function ArchivePage() {
  const couple = useGame((s) => s.couple);
  const pet = useGame((s) => s.pet);
  const streak = useGame((s) => s.streak);
  const codex = useGame((s) => s.codex);
  const moments = useGame((s) => s.moments);
  const submissions = useGame((s) => s.submissions);
  const bucketList = useGame((s) => s.bucketList);
  const questionAnswers = useGame((s) => s.questionAnswers);
  const anniversaries = useGame((s) => s.anniversaries);

  const status = getKingdomStatus(couple);
  const approvedTasks = submissions.filter((s) => s.status === "approved");
  const ssrCards = codex.filter((c) => c.obtainedAt && c.rarity === "SSR");
  const srCards = codex.filter((c) => c.obtainedAt && c.rarity === "SR");
  const doneBucket = bucketList.length;

  const bucketById = useMemo(() => {
    const m = new Map<string, typeof BUCKET_LIST[number]>();
    BUCKET_LIST.forEach((b) => m.set(b.id, b));
    return m;
  }, []);

  // 精選最有代表性的問答（有評 4-5 星的，或最多字）
  const featuredAnswers = questionAnswers
    .filter((a) => (a.rating ?? 0) >= 4 || (a.text?.length ?? 0) >= 60)
    .slice(0, 10);

  return (
    <div className="space-y-5 pb-10">
      {/* 封面 */}
      <div
        className="card p-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fff1c4 0%, #ffb8de 50%, #b8d8ff 100%)",
        }}
      >
        <div className="absolute top-4 left-6 text-3xl animate-sparkle">✨</div>
        <div className="absolute top-4 right-6 text-3xl animate-sparkle" style={{ animationDelay: "0.8s" }}>💫</div>
        <div className="text-sm text-empire-ink/70 font-bold tracking-widest">愛的帝國 畢業紀念冊</div>
        <h1 className="mt-2 font-display font-black text-3xl text-empire-ink text-shadow-soft">
          {couple.name}
        </h1>
        <div className="mt-1 text-sm text-empire-ink/80">
          {couple.queen.nickname} × {couple.prince.nickname}
        </div>
        {status.state === "paused" ? (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-amber-700">
            ⏸️ 暫停中 · 還剩 {status.daysLeft} 天
          </div>
        ) : status.state === "archived" ? (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-slate-700">
            📜 已封存於 {couple.archivedAt?.slice(0, 10)}
          </div>
        ) : (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/80 text-[11px] font-bold text-emerald-700">
            🌱 王國運行中 · 目前為階段性紀念
          </div>
        )}
      </div>

      {/* 核心數字 */}
      <div className="grid grid-cols-2 gap-2">
        <Stat emoji="👑" label="王國等級" value={`Lv.${couple.kingdomLevel}`} />
        <Stat emoji="💞" label="愛意指數" value={couple.loveIndex.toLocaleString()} />
        <Stat emoji="🔥" label="最長連擊" value={`${streak.longest} 天`} />
        <Stat emoji="📜" label="完成任務" value={approvedTasks.length} />
      </div>

      {/* 寵物 */}
      <div className="card p-5 text-center">
        <div className="text-[10px] text-empire-mute tracking-widest">🐣 共同養大的寵物</div>
        <div className="mt-2 flex flex-col items-center">
          <PetAvatar stage={pet.stage} size={120} animate={false} />
          <div className="mt-2 font-display font-black text-lg">{pet.name}</div>
          <div className="text-xs text-empire-mute">最終形態：{PET_STAGE_LABEL[pet.stage]}</div>
          <div className="mt-2 text-[10px] text-empire-mute">
            {couple.queen.nickname} bond <b>{pet.bondQueen ?? 0}</b> · {couple.prince.nickname} bond <b>{pet.bondPrince ?? 0}</b>
          </div>
        </div>
      </div>

      {/* 人生清單完成 */}
      {doneBucket > 0 && (
        <div className="card p-5">
          <div className="text-[10px] text-empire-mute tracking-widest mb-2">💞 人生清單 · {doneBucket} / 100 完成</div>
          <div className="space-y-1.5">
            {bucketList.slice(0, 15).map((r) => {
              const item = bucketById.get(r.id);
              if (!item) return null;
              return (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <div className="text-xl shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-empire-ink">{item.title}</div>
                    {r.note && (
                      <div className="text-[10px] text-empire-mute italic truncate">&ldquo;{r.note}&rdquo;</div>
                    )}
                  </div>
                  <div className="text-[10px] text-empire-mute shrink-0">{r.doneAt}</div>
                </div>
              );
            })}
            {bucketList.length > 15 && (
              <div className="text-[10px] text-empire-mute text-center pt-2">⋯ 還有 {bucketList.length - 15} 件</div>
            )}
          </div>
        </div>
      )}

      {/* SSR 卡 */}
      {ssrCards.length > 0 && (
        <div className="card p-5">
          <div className="text-[10px] text-empire-mute tracking-widest mb-2">✨ SSR 記憶卡 · {ssrCards.length} 張</div>
          <div className="grid grid-cols-3 gap-2">
            {ssrCards.map((c) => (
              <div key={c.id} className="text-center p-2 rounded-xl bg-gradient-to-br from-amber-100 to-pink-100">
                <div className="text-3xl">{c.emoji}</div>
                <div className="text-[10px] font-bold mt-1 truncate">{c.name}</div>
                <div className="text-[9px] text-empire-mute">{c.obtainedAt}</div>
              </div>
            ))}
          </div>
          {srCards.length > 0 && (
            <div className="mt-3 text-[10px] text-empire-mute text-center">
              另有 {srCards.length} 張 SR 卡
            </div>
          )}
        </div>
      )}

      {/* 深度問答精選 */}
      {featuredAnswers.length > 0 && (
        <div className="card p-5">
          <div className="text-[10px] text-empire-mute tracking-widest mb-2">💭 靈魂拷問精選 · {featuredAnswers.length} 則</div>
          <div className="space-y-3">
            {featuredAnswers.map((a) => {
              const q = getQuestionById(a.questionId);
              if (!q) return null;
              const answerer = a.answeredBy === "queen" ? couple.queen.nickname : couple.prince.nickname;
              return (
                <div key={a.id} className="p-3 rounded-xl bg-empire-mist">
                  <div className="text-xs text-empire-mute">Q · {q.text}</div>
                  <div className="text-sm mt-1 text-empire-ink whitespace-pre-line">{a.text}</div>
                  <div className="text-[10px] text-empire-mute mt-1">
                    — {answerer} {a.rating ? `· ${"⭐".repeat(a.rating)}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 紀念日 */}
      {anniversaries.length > 0 && (
        <div className="card p-5">
          <div className="text-[10px] text-empire-mute tracking-widest mb-2">📅 紀念日</div>
          <div className="space-y-1 text-sm">
            {anniversaries.map((a) => (
              <div key={a.id} className="flex items-center gap-2">
                <span className="text-lg">{a.emoji}</span>
                <span className="font-medium">{a.label}</span>
                <span className="text-xs text-empire-mute ml-auto">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重要時刻 */}
      {moments.filter((m) => m.isSelf).length > 0 && (
        <div className="card p-5">
          <div className="text-[10px] text-empire-mute tracking-widest mb-2">🌸 紀念時刻 · 最近 10 則</div>
          <div className="space-y-2">
            {moments.filter((m) => m.isSelf).slice(0, 10).map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{m.title}</div>
                  {m.subtitle && <div className="text-[10px] text-empire-mute truncate">{m.subtitle}</div>}
                </div>
                <span className="text-[10px] text-empire-mute shrink-0">{m.createdAt?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 頁尾 */}
      <div className="text-center py-6 text-xs text-empire-mute leading-relaxed">
        這份紀念由你們一起寫成。<br />
        無論現在這一刻是暫停、繼續、還是結束 —<br />
        <b className="text-empire-ink">這些日子真的發生過。</b>
      </div>

      <div className="flex gap-2">
        <Link href="/settings" className="btn-ghost flex-1 py-2 text-center text-sm">返回設定</Link>
        {status.state === "paused" && (
          <Link href="/settings" className="btn-primary flex-1 py-2 text-center text-sm font-bold">
            🌱 回去解除暫停
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-0.5 font-display font-black text-empire-ink">{value}</div>
      <div className="text-[10px] text-empire-mute">{label}</div>
    </div>
  );
}
