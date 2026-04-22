"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { PageBanner } from "@/components/PageBanner";
import { PetAvatar } from "@/components/art/PetAvatar";
import { toast } from "@/components/Toast";
import { loadWalkState, addSteps, startPedometer, type PedometerHandle } from "@/lib/walk";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { useLiff } from "@/components/LiffProvider";

/**
 * /walk — 寵物散步系統（戶外互動）
 *
 * 記步方式：DeviceMotion 加速度計（LIFF + Web 通用）
 * 之後反響好再用 Capacitor 接 HealthKit / Google Fit
 *
 * 每 1000 步 = 1 pet XP + 1 寶箱碎片
 */
export default function WalkPage() {
  const pet = useGame((s) => s.pet);
  const liff = useLiff();
  const [walkState, setWalkState] = useState(() => loadWalkState());
  const [pedometer, setPedometer] = useState<PedometerHandle | null>(null);

  // 每 3 秒刷新狀態（pedometer tick）
  useEffect(() => {
    if (!pedometer) return;
    const id = setInterval(() => setWalkState(loadWalkState()), 3000);
    return () => clearInterval(id);
  }, [pedometer]);

  function startWalk() {
    if (pedometer) return;
    const h = startPedometer(
      () => {
        const r = addSteps(1, "auto");
        if (r.xpEarned > 0) {
          toast.info(`🐾 寵物 +${r.xpEarned} XP！繼續走！`);
        }
      },
      (err) => toast.error(err),
    );
    if (h) {
      setPedometer(h);
      toast.success("🚶 散步開始！手機帶在身上就會記步");
    }
  }

  function stopWalk() {
    if (!pedometer) return;
    pedometer.stop();
    setPedometer(null);
    setWalkState(loadWalkState());
    toast.success(`🏁 散步結束 · 今日 ${walkState.steps} 步`);
  }

  const sp = SPECIES[resolveSpecies(pet.species)];
  const dailyGoal = 4000;
  const progress = Math.min(100, (walkState.steps / dailyGoal) * 100);
  const fragments = Math.floor(walkState.steps / 1000);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <PageBanner
        title="帶寵物散步"
        subtitle={`每 1000 步 = 1 pet XP + 1 寶箱碎片`}
        emoji="🚶"
        gradient="leaf"
        stats={[
          { label: "今日步數", value: walkState.steps },
          { label: "寶箱碎片", value: fragments },
        ]}
      />

      {/* 寵物散步畫面 */}
      <div className="card p-5 bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 relative overflow-hidden">
        <div className="absolute top-2 right-2 text-4xl opacity-60">☁️</div>
        <div className="absolute bottom-2 left-2 text-4xl opacity-60">🌳</div>
        <div className="absolute bottom-2 right-6 text-3xl opacity-60">🌿</div>

        <div className="text-center">
          <div className="text-[10px] text-empire-mute tracking-[0.3em]">DAILY WALK</div>
          <div className="mt-2">
            <PetAvatar
              stage={pet.stage}
              size={140}
              species={pet.species ?? "nuzzle"}
              rarity={pet.rarity ?? "common"}
              animate={pedometer !== null}
            />
          </div>
          <div className="text-sm mt-2 text-empire-ink font-bold">{pet.name}{pedometer ? " 正在跟著你走 🚶" : " 想出去走走"}</div>
          <div className="text-[11px] text-empire-mute">「{sp.nameZh} · {sp.idleMotion}」</div>
        </div>

        {/* 進度條 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-empire-mute">每日目標 {dailyGoal} 步</span>
            <span className="font-bold text-empire-ink">{walkState.steps} / {dailyGoal}</span>
          </div>
          <div className="h-3 rounded-full bg-empire-cloud overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          {progress >= 100 && <div className="text-[10px] text-emerald-700 font-bold mt-1">✨ 達成每日目標！</div>}
        </div>
      </div>

      {/* 散步控制 */}
      <div className="card p-5 space-y-3">
        {!pedometer ? (
          <button onClick={startWalk} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 text-white font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition">
            🚶 開始散步
          </button>
        ) : (
          <button onClick={stopWalk} className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-black text-lg shadow-xl animate-pulse">
            🏁 結束散步（記步中）
          </button>
        )}

        <div className="text-center text-[11px] text-empire-mute leading-relaxed">
          {liff.inClient
            ? <>💚 <b>LINE 內模式</b>：此頁面在 LINE 內持續運作，記步較穩定</>
            : <>📱 <b>網頁模式</b>：把此頁面保持前景且不鎖屏，才會持續記步</>}
          <br />帶著手機散步（放口袋 / 手上都可）
        </div>
      </div>

      {/* 寶箱碎片進度 */}
      <div className="card p-4 bg-amber-50/50 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-amber-800">🎁 今日寶箱碎片</div>
            <div className="text-[11px] text-amber-700 mt-0.5">每 1000 步 = 1 碎片 · 集 10 片可換一次尋寶</div>
          </div>
          <div className="text-3xl font-black text-amber-700">{fragments} / 10</div>
        </div>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < fragments ? "bg-amber-400" : "bg-amber-100"}`} />
          ))}
        </div>
      </div>

      <div className="card p-4 bg-empire-cream text-[12px] text-empire-mute space-y-1">
        <div className="font-bold text-empire-ink">💡 散步的好處</div>
        <div>· 每 1000 步：寵物 +1 XP + 1 寶箱碎片</div>
        <div>· 雙人同時散步（5 分鐘內都活動）：XP ×1.5 情侶共鳴</div>
        <div>· 每日目標 4000 步（單人）/ 8000 步（雙人合計）</div>
        <div>· 達標額外：+50 金幣 + 解鎖隨機寶箱</div>
      </div>

      <div className="text-center pb-6">
        <Link href="/pet" className="text-xs text-empire-sky underline">← 回寵物頁</Link>
      </div>
    </main>
  );
}
