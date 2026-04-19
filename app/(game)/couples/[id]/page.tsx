"use client";

import { useGame } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

// 用 couple.id hash 產生穩定的島嶼裝飾 — 每對情侶看到同一套
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}
function seededRand(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
}
const ISLAND_DECO_POOL = ["🌸", "🌷", "🌻", "🌹", "🌵", "🌳", "🌲", "🌴", "🍄", "🌾", "🎠", "⛲", "🪵", "🪨", "🦋", "🐿️", "🐇"];
const WEATHER_POOL = [["☀️", "☁️"], ["🌤️", "🌥️"], ["⛅", "🌸"], ["🌙", "⭐"]];

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

  // seed-based 島嶼佈置 — 基於 couple.id，同一對情侶每次看都一樣
  const island = useMemo(() => {
    if (!id) return null;
    const seed = hashSeed(id);
    const rand = seededRand(seed);
    const weather = WEATHER_POOL[Math.floor(rand() * WEATHER_POOL.length)];
    const decoCount = 4 + Math.floor(rand() * 4); // 4-7 個
    const decos = Array.from({ length: decoCount }).map((_, i) => ({
      emoji: ISLAND_DECO_POOL[Math.floor(rand() * ISLAND_DECO_POOL.length)],
      left: 10 + rand() * 80,   // 10% - 90%
      top: 55 + rand() * 35,    // 55% - 90% (下半部)
      size: 18 + Math.floor(rand() * 16), // 18-33px
      key: i,
    }));
    // 城堡是中心錨點，偶爾換成帳篷 / 樹屋
    const centerIcons = ["🏰", "⛺", "🛖", "🏯", "🏡"];
    const centerIcon = centerIcons[Math.floor(rand() * centerIcons.length)];
    return { weather, decos, centerIcon };
  }, [id]);

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

      {/* 參觀島嶼 — 基於 couple.id seed 生成的公開快照；真實佈置同步待 RLS 公開欄位擴充 */}
      <div className="card p-4">
        <h3 className="font-bold mb-2">🏝️ 他們的島嶼</h3>
        <div
          className="relative w-full h-56 rounded-2xl overflow-hidden border-2 border-white shadow-inner"
          style={{ background: "linear-gradient(180deg, #b3d9f2 0%, #c9e6f8 55%, #cfe9b4 60%, #8ed172 100%)" }}
        >
          {island && (
            <>
              <div className="absolute top-3 right-4 text-3xl">{island.weather[0]}</div>
              <div className="absolute top-4 left-6 text-xl opacity-80">{island.weather[1]}</div>
              <div className="absolute" style={{ left: "50%", top: "42%", transform: "translate(-50%,-50%)" }}>
                <div className="text-5xl">{island.centerIcon}</div>
              </div>
              <div className="absolute bottom-6 left-8 text-3xl">{couple.emoji}</div>
              {island.decos.map((d) => (
                <div
                  key={d.key}
                  className="absolute"
                  style={{ left: `${d.left}%`, top: `${d.top}%`, fontSize: d.size, transform: "translate(-50%, -50%)" }}
                >
                  {d.emoji}
                </div>
              ))}
            </>
          )}
        </div>
        <p className="text-[10px] text-empire-mute text-center mt-2">公開島嶼快照 · 基於他們的王國識別碼生成</p>
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
        <button onClick={() => router.push(`/pk?target=${id}`)} className="btn-ghost py-3 text-sm">⚔️ 發起 PK</button>
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
