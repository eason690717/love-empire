"use client";

import { useGame } from "@/lib/store";

export default function AlliancePage() {
  const alliances = useGame((s) => s.alliances);
  const leaderboard = useGame((s) => s.leaderboard);
  const joinAlliance = useGame((s) => s.joinAlliance);

  const myAlliance = alliances.find((a) => a.members.includes("me"));
  const otherAlliances = alliances.filter((a) => !a.members.includes("me"));

  const getMember = (id: string) => leaderboard.find((c) => c.id === id);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="font-bold">🤝 情侶聯盟</h2>
        <p className="text-xs text-slate-500 mt-1">
          2-5 對情侶組成聯盟，一起完成週任務、挑戰聯盟 BOSS、裝飾共同空間
        </p>
      </div>

      {myAlliance ? (
        <>
          <div className="card p-5 bg-gradient-to-br from-empire-cream/60 to-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">我的聯盟</div>
                <h3 className="text-xl font-bold mt-0.5">{myAlliance.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{myAlliance.description}</p>
              </div>
              <div className="text-4xl">🏛️</div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{myAlliance.questTitle}</span>
                <span className="text-slate-500">
                  {myAlliance.weeklyProgress} / {myAlliance.weeklyTarget}
                </span>
              </div>
              <div className="h-3 bg-empire-cloud rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-empire-pink to-empire-sky rounded-full transition-all"
                  style={{ width: `${Math.min(100, (myAlliance.weeklyProgress / myAlliance.weeklyTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3">聯盟成員 ({myAlliance.members.length})</h3>
            <div className="space-y-2">
              {myAlliance.members.map((id) => {
                const c = getMember(id);
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-empire-mist">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">
                        {c.name}
                        {c.isSelf && <span className="ml-2 text-xs text-empire-pink">(我們)</span>}
                      </div>
                      <div className="text-xs text-slate-500">Lv.{c.kingdomLevel} · 🔥{c.streak} 天</div>
                    </div>
                    <div className="text-xs text-empire-gold font-semibold">本週 {c.weeklyTasks} 任務</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3">🐉 聯盟 BOSS 戰 (下週開放)</h3>
            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 p-6 text-center">
              <div className="text-6xl">🐲</div>
              <div className="mt-2 font-bold">孤單巨龍</div>
              <div className="text-xs text-slate-500 mt-1">每對情侶貢獻屬性點，合力擊敗 BOSS 獲得 SSR 記憶卡</div>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-5xl">🌱</div>
          <h3 className="font-bold mt-2">你們還沒加入聯盟</h3>
          <p className="text-sm text-slate-500 mt-1">加入下方聯盟，一起升級！</p>
        </div>
      )}

      <div>
        <h3 className="font-bold mb-2 text-sm">🔍 瀏覽其他聯盟</h3>
        <div className="space-y-2">
          {otherAlliances.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold truncate">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.description}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {a.members.length} 對情侶 · 本週進度 {a.weeklyProgress}/{a.weeklyTarget}
                  </div>
                </div>
                <button
                  onClick={() => joinAlliance(a.id)}
                  className="btn-primary px-4 py-1.5 text-sm shrink-0 ml-2"
                >
                  加入
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="card w-full p-4 text-center font-semibold text-empire-sky hover:bg-white transition">
        + 建立新聯盟
      </button>
    </div>
  );
}
