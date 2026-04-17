"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { ISLAND_SHOP } from "@/lib/demoData";
import { season, SEASON_LABEL } from "@/lib/utils";

export default function IslandPage() {
  const island = useGame((s) => s.island);
  const couple = useGame((s) => s.couple);
  const moveIslandItem = useGame((s) => s.moveIslandItem);
  const buyIslandItem = useGame((s) => s.buyIslandItem);
  const removeIslandItem = useGame((s) => s.removeIslandItem);
  const [shop, setShop] = useState(false);

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold">🏝️ 帝國島嶼</h2>
          <p className="text-xs text-slate-500 mt-0.5">{SEASON_LABEL[season()]} · 金幣 {couple.coins} · 拖曳家具移動 · 雙擊移除</p>
        </div>
        <button onClick={() => setShop((v) => !v)} className="btn-primary px-4 py-2 text-sm">
          {shop ? "關閉商店" : "家具商店"}
        </button>
      </div>

      <div
        className="relative w-full h-[440px] rounded-[28px] overflow-hidden border-[3px] border-white shadow-lift"
        style={{
          background: "linear-gradient(180deg, #b3d9f2 0%, #c9e6f8 50%, #cfe9b4 55%, #8ed172 100%)",
        }}
      >
        {/* 太陽 + 光暈 */}
        <div className="absolute top-5 right-8 text-5xl animate-sparkle">☀️</div>
        {/* 雲朵 */}
        <div className="absolute top-6 left-10 text-3xl opacity-85 animate-float-slow">☁️</div>
        <div className="absolute top-14 left-40 text-2xl opacity-75 animate-float-slow" style={{ animationDelay: "1s" }}>☁️</div>
        {/* 遠山 */}
        <div className="absolute bottom-[45%] left-0 right-0 text-center text-6xl opacity-30 tracking-[-0.1em]">⛰️⛰️⛰️</div>
        {/* 草地小花 */}
        <div className="absolute bottom-3 left-4 text-lg">🌸</div>
        <div className="absolute bottom-2 right-6 text-lg">🌼</div>
        <div className="absolute bottom-6 left-1/3 text-sm">🌷</div>

        {island.map((it) => (
          <DraggableItem
            key={it.id}
            item={it}
            onMove={(x, y) => moveIslandItem(it.id, x, y)}
            onRemove={() => removeIslandItem(it.id)}
          />
        ))}
      </div>

      {shop && (
        <div className="card p-5">
          <h3 className="font-bold mb-3">🛒 家具商店 (Nook)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ISLAND_SHOP.map((item) => {
              const afford = couple.coins >= item.price;
              return (
                <button
                  key={item.id}
                  disabled={!afford}
                  onClick={() => buyIslandItem(item.id, item.label, item.emoji, item.price)}
                  className={`p-4 rounded-xl border text-center ${
                    afford ? "border-empire-sky hover:bg-empire-cloud" : "border-slate-200 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <div className="text-sm font-medium mt-1">{item.label}</div>
                  <div className="text-xs text-empire-gold mt-0.5">{item.price} 金幣</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableItem({
  item, onMove, onRemove,
}: {
  item: { id: string; emoji: string; label: string; x: number; y: number };
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
}) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const parent = (e.currentTarget.parentElement as HTMLDivElement);
    const rect = parent.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const x = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(2, Math.min(98, ((ev.clientY - rect.top) / rect.height) * 100));
      onMove(x, y);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none text-4xl hover:scale-110 transition"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      onPointerDown={handlePointerDown}
      onDoubleClick={onRemove}
      title={`${item.label} (雙擊移除)`}
    >
      {item.emoji}
    </div>
  );
}
