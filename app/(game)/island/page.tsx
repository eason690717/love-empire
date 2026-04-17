"use client";

import { useRef, useState } from "react";
import { useGame } from "@/lib/store";
import { ISLAND_SHOP, getDailyFeatured } from "@/lib/demoData";
import { season, SEASON_LABEL } from "@/lib/utils";
import { getTodayVisitor, todaysFestival } from "@/lib/festival";

export default function IslandPage() {
  const island = useGame((s) => s.island);
  const couple = useGame((s) => s.couple);
  const pikmins = useGame((s) => s.pikmins);
  const moveIslandItem = useGame((s) => s.moveIslandItem);
  const buyIslandItem = useGame((s) => s.buyIslandItem);
  const removeIslandItem = useGame((s) => s.removeIslandItem);
  const greetVisitor = useGame((s) => s.greetVisitor);
  const lastGreet = useGame((s) => s.lastVisitorGreetDate);
  const [shop, setShop] = useState(false);
  const [greetResult, setGreetResult] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "ok" | "fail">("idle");
  const islandRef = useRef<HTMLDivElement>(null);

  const visitor = getTodayVisitor();
  const festival = todaysFestival();
  const today = new Date().toISOString().slice(0, 10);
  const greeted = lastGreet === today;

  // 季節背景
  const currentSeason = season();
  const skyBg: Record<string, string> = {
    spring: "linear-gradient(180deg, #cee7f5 0%, #e8f5ce 55%, #a6d18a 100%)",
    summer: "linear-gradient(180deg, #9ed0f5 0%, #d4f0ff 50%, #8ed172 100%)",
    autumn: "linear-gradient(180deg, #ffd5a8 0%, #ffe8c8 50%, #e0b87a 100%)",
    winter: "linear-gradient(180deg, #c8dbeb 0%, #e8efef 50%, #c8d2d2 100%)",
  };
  const seasonFlora: Record<string, { emoji: string; positions: { x: number; y: number }[] }> = {
    spring: { emoji: "🌸", positions: [{ x: 8, y: 94 }, { x: 92, y: 96 }, { x: 40, y: 97 }] },
    summer: { emoji: "🌻", positions: [{ x: 10, y: 92 }, { x: 90, y: 95 }, { x: 35, y: 96 }] },
    autumn: { emoji: "🍁", positions: [{ x: 12, y: 94 }, { x: 88, y: 96 }, { x: 45, y: 96 }] },
    winter: { emoji: "❄️", positions: [{ x: 15, y: 93 }, { x: 85, y: 95 }, { x: 50, y: 96 }] },
  };

  const handleGreet = () => {
    const r = greetVisitor();
    if (r.success) setGreetResult(`${visitor.emoji} ${visitor.greeting} (獲得 ${r.reward})`);
    else setGreetResult("今天已經打過招呼了，明天再來唷");
    setTimeout(() => setGreetResult(null), 3200);
  };

  const handleShare = async () => {
    if (!islandRef.current) return;
    setShareStatus("sharing");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(islandRef.current, { cacheBust: true, pixelRatio: 2 });
      const text = `✨ ${couple.name} 的島嶼 · Lv.${couple.kingdomLevel} ${couple.title}`;

      // 嘗試 Web Share with file
      if (typeof navigator !== "undefined" && (navigator as any).canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], "island.png", { type: "image/png" });
          const sharePayload: any = { title: "愛的帝國", text, files: [file] };
          if ((navigator as any).canShare(sharePayload)) {
            await (navigator as any).share(sharePayload);
            setShareStatus("ok");
            setTimeout(() => setShareStatus("idle"), 2500);
            return;
          }
        } catch { /* fallthrough */ }
      }

      // Fallback：下載圖片
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${couple.name}-island-${Date.now()}.png`;
      a.click();
      setShareStatus("ok");
    } catch (e) {
      console.error("[island-share]", e);
      setShareStatus("fail");
    }
    setTimeout(() => setShareStatus("idle"), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-bold">🏝️ 帝國島嶼</h2>
          <p className="text-xs text-empire-mute mt-0.5">
            {SEASON_LABEL[currentSeason]} · 💰 {couple.coins} · 拖曳移動 / 雙擊移除
            {festival && <span className="ml-2 text-empire-berry font-semibold">· {festival.emoji} {festival.label}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} disabled={shareStatus === "sharing"} className="btn-ghost px-3 py-2 text-sm">
            {shareStatus === "sharing" ? "截圖中…" : shareStatus === "ok" ? "✓ 已分享" : shareStatus === "fail" ? "失敗" : "📸 分享快照"}
          </button>
          <button onClick={() => setShop((v) => !v)} className="btn-primary px-3 py-2 text-sm">
            {shop ? "關閉商店" : "家具商店"}
          </button>
        </div>
      </div>

      <div
        ref={islandRef}
        className="relative w-full h-[440px] rounded-[28px] overflow-hidden border-[3px] border-white shadow-lift"
        style={{ background: skyBg[currentSeason] }}
      >
        <div className="absolute top-5 right-8 text-5xl animate-sparkle">☀️</div>
        <div className="absolute top-6 left-10 text-3xl opacity-85 animate-float-slow">☁️</div>
        <div className="absolute top-14 left-40 text-2xl opacity-75 animate-float-slow" style={{ animationDelay: "1s" }}>☁️</div>
        <div className="absolute bottom-[45%] left-0 right-0 text-center text-6xl opacity-30 tracking-[-0.1em]">⛰️⛰️⛰️</div>

        {/* 季節花草 */}
        {seasonFlora[currentSeason].positions.map((pos, i) => (
          <div key={i} className="absolute text-xl" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
            {seasonFlora[currentSeason].emoji}
          </div>
        ))}

        {/* NPC 訪客 */}
        <div
          className={`absolute animate-float-slow cursor-pointer ${greeted ? "opacity-50" : ""}`}
          style={{ left: "78%", top: "62%" }}
          onClick={handleGreet}
          title={visitor.greeting}
        >
          <div className="text-4xl">{visitor.emoji}</div>
          {!greeted && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-1.5 py-0.5 bg-empire-sunshine/80 rounded-full font-bold animate-bob">
              點我！
            </div>
          )}
        </div>

        {/* 家具 */}
        {island.map((it) => (
          <DraggableItem
            key={it.id}
            item={it}
            onMove={(x, y) => moveIslandItem(it.id, x, y)}
            onRemove={() => removeIslandItem(it.id)}
          />
        ))}

        {/* Pikmin 助手 */}
        {pikmins.map((p, idx) => (
          Array.from({ length: Math.min(5, p.count) }).map((_, i) => {
            const offset = (idx * 5 + i) * 37 % 90 + 5;
            return (
              <div
                key={`${p.color}-${i}`}
                className="absolute text-base animate-bob"
                style={{
                  left: `${offset}%`,
                  bottom: `${8 + (i % 3) * 6}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
                title={`${p.label} x${p.count}`}
              >
                {p.emoji}
              </div>
            );
          })
        ))}

        {greetResult && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[80%] bg-white/95 rounded-2xl px-4 py-2 text-sm shadow-lg animate-pop">
            {greetResult}
          </div>
        )}
      </div>

      {/* Pikmin 統計 */}
      {pikmins.length > 0 && (
        <div className="card p-3">
          <h3 className="font-bold text-sm mb-2">🌱 Pikmin 助手隊</h3>
          <div className="flex gap-3 flex-wrap">
            {pikmins.map((p) => (
              <div key={p.color} className="flex items-center gap-1.5 text-sm">
                <span className="text-lg">{p.emoji}</span>
                <span className="text-empire-mute">{p.label}</span>
                <span className="font-bold">×{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {shop && (
        <>
          <div className="card p-5 bg-gradient-to-br from-empire-cream/80 to-white border-2 border-empire-gold/30">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              ⭐ 今日限定特惠
              <span className="text-xs font-normal text-empire-mute">(7 折、每日 rotate)</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {getDailyFeatured().map((item) => {
                const afford = couple.coins >= item.price;
                return (
                  <button
                    key={item.id}
                    disabled={!afford}
                    onClick={() => buyIslandItem(item.id, item.label, item.emoji, item.price)}
                    className={`p-4 rounded-xl border-2 text-center ${
                      afford ? "border-empire-gold hover:bg-empire-cream" : "border-slate-200 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-4xl">{item.emoji}</div>
                    <div className="text-sm font-medium mt-1">{item.label}</div>
                    <div className="text-xs text-empire-gold mt-0.5 font-semibold">{item.price} 金幣</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3">🛒 家具商店</h3>
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
        </>
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
