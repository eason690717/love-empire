"use client";

import Link from "next/link";
import { useState } from "react";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { STORY_CHAPTERS, unlockedChapters, nextChapter, type StoryChapter } from "@/lib/story";

export default function StoryPage() {
  const couple = useGame((s) => s.couple);
  const unlocked = unlockedChapters(couple.kingdomLevel);
  const next = nextChapter(couple.kingdomLevel);
  const [selected, setSelected] = useState<StoryChapter | null>(null);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="愛的帝國 神話"
        subtitle="隨王國等級解鎖的 4 章主線故事"
        emoji="📜"
        gradient="violet"
        stats={[
          { label: "已解鎖", value: `${unlocked.length}/4` },
          { label: "王國", value: `Lv.${couple.kingdomLevel}` },
        ]}
      />

      <div className="space-y-3">
        {STORY_CHAPTERS.map((ch) => {
          const isUnlocked = couple.kingdomLevel >= ch.unlockLevel;
          return (
            <button
              key={ch.id}
              onClick={() => isUnlocked && setSelected(ch)}
              disabled={!isUnlocked}
              className={`w-full text-left card p-4 transition ${
                isUnlocked ? "hover:scale-[1.01] hover:shadow-lg" : "opacity-50 cursor-not-allowed"
              }`}
              style={{
                background: isUnlocked
                  ? `linear-gradient(135deg, #fff5fb 0%, #f0e8ff 100%)`
                  : "#f5f5f8",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-5xl">{isUnlocked ? ch.emoji : "🔒"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black text-empire-ink">{ch.title}</div>
                  <div className="text-xs text-empire-mute mt-1">{ch.subtitle}</div>
                  <div className="text-[10px] text-empire-gold font-bold mt-2">
                    {isUnlocked ? "✓ 已解鎖 · 點開閱讀" : `🔒 Lv.${ch.unlockLevel} 解鎖`}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {next && (
        <div className="card p-4 bg-empire-cream text-center text-[12px] text-empire-mute">
          💫 下一章「{next.title}」還差 <b className="text-empire-berry">{next.unlockLevel - couple.kingdomLevel}</b> 級
        </div>
      )}

      <div className="text-center pb-6">
        <Link href="/dashboard" className="text-xs text-empire-sky underline">← 回主殿</Link>
      </div>

      {selected && <ChapterModal chapter={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function ChapterModal({ chapter, onClose }: { chapter: StoryChapter; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(20,40,70,0.6)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="max-w-lg w-full card p-6 space-y-4 my-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ background: "linear-gradient(180deg, #fff9e6 0%, #fef2ff 50%, #f0e8ff 100%)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-4xl">{chapter.emoji}</span>
              <div>
                <div className="font-display font-black text-empire-ink">{chapter.title}</div>
                <div className="text-[11px] text-empire-mute">{chapter.subtitle}</div>
              </div>
            </div>
            <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
          </div>

          <article className="space-y-3 text-[13px] leading-loose text-empire-ink">
            {chapter.paragraphs.map((p, i) => (
              <p key={i} className="font-serif">{p}</p>
            ))}
          </article>

          <div className="p-3 rounded-xl bg-white/70 border border-empire-gold/40 text-[12px]">
            <div className="font-bold text-empire-gold">💎 章節獎勵</div>
            <div className="mt-1 text-empire-ink">
              💰 {chapter.reward.coins} 金 · 💞 {chapter.reward.loveXp} 愛意
              {chapter.reward.title && <span> · 🏅 稱號「{chapter.reward.title}」</span>}
              {chapter.reward.memoryCardId && <span> · 🎴 隱藏記憶卡</span>}
            </div>
          </div>

          <button onClick={onClose} className="w-full py-2.5 rounded-full bg-gradient-to-r from-empire-berry to-empire-sunshine text-white font-black">
            閱畢 ✨
          </button>
        </div>
      </div>
    </div>
  );
}
