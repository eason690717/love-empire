"use client";

import { useGame } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

/**
 * 參觀其他情侶的公開頁 (動森串門 DNA)
 * 顯示：島嶼快照、基本資料、成就、留言 / 按讚
 */
export default function CoupleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leaderboard = useGame((s) => s.leaderboard);
  const moments = useGame((s) => s.moments);
  const sendGift = useGame((s) => s.sendGift);
  const recordVisit = useGame((s) => s.recordVisit);
  const checkAchievements = useGame((s) => s.checkAchievements);

  // 記錄訪問 + 檢查成就
  if (typeof window !== "undefined") {
    setTimeout(() => {
      recordVisit();
      checkAchievements();
    }, 0);
  }

  const id = params?.id as string;
  const couple = leaderboard.find((c) => c.id === id);
  const theirMoments = useMemo(
    () => moments.filter((m) => m.coupleId === id).slice(0, 5),
    [moments, id],
  );

  if (!couple) {
    return (
      <div className="card p-8 text-center">
        <p>找不到這對情侶</p>
        <button onClick={() => router.back()} className="btn-ghost mt-4 px-4 py-2">返回</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => router.back()} className="text-sm text-empire-sky">← 返回</button>

      <div className="card p-6 bg-gradient-to-br from-empire-cream/60 to-white text-center">
        <div className="text-6xl">{couple.emoji}</div>
        <h2 className="mt-2 font-display font-black text-2xl text-empire-ink">{couple.name}</h2>
        <div className="text-sm text-empire-mute mt-1">
          Lv.{couple.kingdomLevel} · {couple.title}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniStat emoji="💞" label="愛意" value={couple.loveIndex.toLocaleString()} />
          <MiniStat emoji="🔥" label="連擊" value={`${couple.streak} 天`} />
          <MiniStat emoji="🖼️" label="圖鑑" value={`${couple.codexCompletion}%`} />
        </div>
      </div>

      {/* 參觀島嶼 (模擬 — 其他情侶島嶼尚未同步，顯示 placeholder) */}
      <div className="card p-4">
        <h3 className="font-bold mb-2">🏝️ 他們的島嶼</h3>
        <div
          className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-white"
          style={{ background: "linear-gradient(180deg, #b3d9f2 0%, #c9e6f8 55%, #cfe9b4 60%, #8ed172 100%)" }}
        >
          <div className="absolute top-3 right-4 text-3xl">☀️</div>
          <div className="absolute top-4 left-6 text-xl opacity-80">☁️</div>
          <div className="absolute" style={{ left: "50%", top: "45%", transform: "translate(-50%,-50%)" }}>
            <div className="text-5xl">🏰</div>
          </div>
          <div className="absolute bottom-6 left-8 text-2xl">{couple.emoji}</div>
          <div className="absolute bottom-4 right-8 text-2xl">🌸</div>
          <div className="absolute bottom-4 left-1/3 text-2xl">🌷</div>
        </div>
        <p className="text-xs text-empire-mute text-center mt-2">等 Supabase 後端上線，將顯示真實島嶼佈置</p>
      </div>

      <div className="card p-4">
        <h3 className="font-bold mb-3">✨ 他們的動態 ({theirMoments.length})</h3>
        {theirMoments.length === 0 ? (
          <p className="text-sm text-empire-mute text-center py-4">還沒有公開動態</p>
        ) : (
          <div className="space-y-2">
            {theirMoments.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-empire-mist flex gap-3 items-center">
                <div className="text-2xl">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{m.title}</div>
                  <div className="text-xs text-empire-mute truncate">{m.subtitle}</div>
                </div>
                <div className="text-xs text-empire-mute">❤️ {m.likes}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => sendGift()} className="btn-pink py-3 text-sm">🎁 送禮</button>
        <button className="btn-ghost py-3 text-sm">⚔️ 發起 PK</button>
      </div>
    </div>
  );
}

function MiniStat({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-xl p-2 bg-empire-mist text-center">
      <div className="text-lg">{emoji}</div>
      <div className="text-xs text-empire-mute">{label}</div>
      <div className="font-bold text-sm text-empire-ink">{value}</div>
    </div>
  );
}
