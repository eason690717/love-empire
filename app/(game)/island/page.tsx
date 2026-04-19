"use client";

import { useRef, useState } from "react";
import { useGame } from "@/lib/store";
import { ISLAND_SHOP, getDailyFeatured } from "@/lib/demoData";
import { season, SEASON_LABEL } from "@/lib/utils";
import { getTodayVisitor, todaysFestival } from "@/lib/festival";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PikminSprite } from "@/components/art/PikminSprite";
import { ItemIcon } from "@/components/art/ItemIcon";

export default function IslandPage() {
  const island = useGame((s) => s.island);
  const couple = useGame((s) => s.couple);
  const pikmins = useGame((s) => s.pikmins);
  const moveIslandItem = useGame((s) => s.moveIslandItem);
  const buyIslandItem = useGame((s) => s.buyIslandItem);
  const removeIslandItem = useGame((s) => s.removeIslandItem);
  const greetVisitor = useGame((s) => s.greetVisitor);
  const lastGreet = useGame((s) => s.lastVisitorGreetDate);
  const petInteract = useGame((s) => s.petInteract);
  const router = useRouter();
  const [shop, setShop] = useState(false);
  const [greetResult, setGreetResult] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "ok" | "fail">("idle");
  const [snapOn, setSnapOn] = useState(false); // 格線對齊開關
  const [interactItem, setInteractItem] = useState<{ id: string; emoji: string; label: string; catalogId?: string } | null>(null);
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
      const text = `✨ ${couple.name} 的小窩 · Lv.${couple.kingdomLevel} ${couple.title}`;

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
          <h2 className="font-bold">🏡 我們的小窩</h2>
          <p className="text-xs text-empire-mute mt-0.5">
            {SEASON_LABEL[currentSeason]} · 💰 {couple.coins} · 拖曳移動 / 雙擊移除
            {festival && <span className="ml-2 text-empire-berry font-semibold">· {festival.emoji} {festival.label}</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSnapOn((v) => !v)}
            className={`px-3 py-2 text-sm rounded-lg border-2 font-semibold transition ${
              snapOn ? "bg-empire-sky text-white border-empire-sky" : "bg-white text-empire-mute border-empire-cloud"
            }`}
            title="拖曳時自動對齊格線"
          >
            {snapOn ? "🧲 對齊 ON" : "🧲 對齊"}
          </button>
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
        {/* 格線 overlay（snap 開時顯示） */}
        {snapOn && (
          <div
            className="absolute inset-0 pointer-events-none z-[1] opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "10% 10%",
            }}
          />
        )}
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
            snap={snapOn}
            onMove={(x, y) => moveIslandItem(it.id, x, y)}
            onRemove={() => removeIslandItem(it.id)}
            onClick={() => setInteractItem(it)}
          />
        ))}

        {/* 小精靈助手 */}
        {pikmins.map((p, idx) => (
          Array.from({ length: Math.min(5, p.count) }).map((_, i) => {
            const offset = (idx * 5 + i) * 37 % 90 + 5;
            const sprout = i === 0 ? "flower" : i === 1 ? "bud" : "leaf";
            return (
              <div
                key={`${p.color}-${i}`}
                className="absolute animate-bob"
                style={{
                  left: `${offset}%`,
                  bottom: `${8 + (i % 3) * 6}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
                title={`${p.label} x${p.count}`}
              >
                <PikminSprite color={p.color} size={28} sprouting={sprout as "leaf" | "bud" | "flower"} />
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

      {/* 小精靈統計 */}
      {pikmins.length > 0 && (
        <div className="card p-3">
          <h3 className="font-bold text-sm mb-2">🌱 小精靈助手隊</h3>
          <div className="flex gap-3 flex-wrap items-center">
            {pikmins.map((p) => (
              <div key={p.color} className="flex items-center gap-1.5 text-sm">
                <PikminSprite color={p.color} size={20} />
                <span className="text-empire-mute">{p.label}</span>
                <span className="font-bold">×{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {interactItem && (() => {
        const meta = ISLAND_SHOP.find((s) => s.id === interactItem.catalogId);
        const interaction = meta?.interaction;
        const doAction = () => {
          if (!interaction) return;
          switch (interaction) {
            case "petBond":
              petInteract("pet");
              break;
            case "feedTreat":
              petInteract("treat");
              break;
            case "loveBoost":
              useGame.setState((s) => ({ couple: { ...s.couple, loveIndex: s.couple.loveIndex + 5 } }));
              break;
            case "playMusic":
              // 純視覺/音效 — toast 會在 setInteractItem(null) 前顯示
              break;
            case "linkQuestions": router.push("/questions"); return;
            case "linkRituals":   router.push("/rituals"); return;
            case "linkBucket":    router.push("/bucket-list"); return;
            case "linkExchange":  router.push("/exchange"); return;
            case "linkRecap":     router.push("/recap"); return;
            case "linkArchive":   router.push("/archive"); return;
          }
          setInteractItem(null);
        };
        const actionLabel =
          interaction === "petBond" ? "✋ 撫摸一下 (+2 親密)" :
          interaction === "feedTreat" ? "🍬 餵零食 (-20 金 +5 親密)" :
          interaction === "loveBoost" ? "💞 使用 (+5 愛意)" :
          interaction === "playMusic" ? "🎵 彈奏一曲" :
          interaction === "linkQuestions" ? "💭 去寫深度問答 →" :
          interaction === "linkRituals" ? "🌅 去打晨/晚安卡 →" :
          interaction === "linkBucket" ? "💞 看人生清單 →" :
          interaction === "linkExchange" ? "💰 去兌換中心 →" :
          interaction === "linkRecap" ? "✨ 看年度回顧 →" :
          interaction === "linkArchive" ? "📜 看畢業紀念 →" :
          null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setInteractItem(null)}
          >
            <div className="max-w-sm w-full card p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-6xl mb-2">{interactItem.emoji}</div>
              <div className="font-display font-black text-xl">{interactItem.label}</div>
              {meta?.desc && <div className="text-xs text-empire-mute mt-1 italic">{meta.desc}</div>}
              {!interaction && (
                <div className="text-sm text-empire-mute mt-4">純裝飾，讓家更有溫度 🏡</div>
              )}
              {actionLabel && (
                <button onClick={doAction} className="mt-4 btn-primary w-full py-2.5 font-bold">
                  {actionLabel}
                </button>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { removeIslandItem(interactItem.id); setInteractItem(null); }}
                  className="btn-ghost flex-1 py-2 text-xs text-rose-600"
                >
                  移除家具
                </button>
                <button onClick={() => setInteractItem(null)} className="btn-ghost flex-1 py-2 text-xs">關閉</button>
              </div>
            </div>
          </div>
        );
      })()}

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

          <ShopByRoom couple={couple} buyIslandItem={buyIslandItem} />
          </>
      )}
    </div>
  );
}

function ShopByRoom({ couple, buyIslandItem }: { couple: any; buyIslandItem: any }) {
  const [room, setRoom] = useState<"all" | "living" | "bedroom" | "kitchen" | "bathroom" | "garden" | "deco">("all");
  const ROOM_TABS: { id: typeof room; label: string; emoji: string }[] = [
    { id: "all", label: "全部", emoji: "🏠" },
    { id: "living", label: "客廳", emoji: "🛋️" },
    { id: "bedroom", label: "臥室", emoji: "🛏️" },
    { id: "kitchen", label: "廚房", emoji: "🍳" },
    { id: "bathroom", label: "浴室", emoji: "🛁" },
    { id: "garden", label: "庭院", emoji: "🌿" },
    { id: "deco", label: "裝飾", emoji: "🖼️" },
  ];
  const filtered = room === "all" ? ISLAND_SHOP : ISLAND_SHOP.filter((i) => i.room === room);

  return (
    <div className="card p-5">
      <h3 className="font-bold mb-3">🛒 家具商店 ({ISLAND_SHOP.length} 件 · 點擊家具放進小窩可互動)</h3>
      <div className="flex gap-1 overflow-x-auto mb-3 -mx-1 px-1">
        {ROOM_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setRoom(t.id)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
              room === t.id ? "bg-empire-sky text-white" : "bg-white text-empire-mute border border-empire-cloud"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const afford = couple.coins >= item.price;
          return (
            <button
              key={item.id}
              disabled={!afford}
              onClick={() => buyIslandItem(item.id, item.label, item.emoji, item.price)}
              className={`p-3 rounded-xl border text-center transition ${
                afford ? "border-empire-sky hover:bg-empire-cloud" : "border-slate-200 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-3xl">{item.emoji}</div>
              <div className="text-sm font-bold mt-1 truncate">{item.label}</div>
              {item.desc && <div className="text-[9px] text-empire-mute mt-0.5 leading-tight">{item.desc}</div>}
              <div className="text-xs text-empire-gold mt-1 font-bold">💰 {item.price}</div>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sm text-empire-mute py-6">這個房間還沒有家具</p>
      )}
    </div>
  );
}

function DraggableItem({
  item, snap, onMove, onRemove, onClick,
}: {
  item: { id: string; emoji: string; label: string; x: number; y: number; catalogId?: string };
  snap: boolean;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
  onClick: () => void;
}) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const parent = (e.currentTarget.parentElement as HTMLDivElement);
    const rect = parent.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    const snapTo = (v: number) => snap ? Math.round(v / 10) * 10 : v;
    const move = (ev: PointerEvent) => {
      if (Math.abs(ev.clientX - startX) > 4 || Math.abs(ev.clientY - startY) > 4) moved = true;
      const rawX = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width) * 100));
      const rawY = Math.max(2, Math.min(98, ((ev.clientY - rect.top) / rect.height) * 100));
      onMove(snapTo(rawX), snapTo(rawY));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      // 沒拖動 → 視為單擊 → 觸發互動
      if (!moved) onClick();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none hover:scale-110 transition z-[2]"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      onPointerDown={handlePointerDown}
      onDoubleClick={onRemove}
      title={`${item.label} (單擊互動 / 雙擊移除)`}
    >
      <ItemIcon emoji={item.emoji} size={40} glow={item.catalogId === "fountain" || item.catalogId === "rainbow"} />
    </div>
  );
}
