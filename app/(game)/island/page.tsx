"use client";

import { useRef, useState } from "react";
import { useGame } from "@/lib/store";
import { ISLAND_SHOP, getDailyFeatured } from "@/lib/demoData";
import { season, SEASON_LABEL } from "@/lib/utils";
import { getTodayVisitor, todaysFestival } from "@/lib/festival";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PikminSprite } from "@/components/art/PikminSprite";
import { toast } from "@/components/Toast";
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
  // 小窩室內背景：上半壁紙 + 下半木地板（多層合成 - v2.1 升級）
  const skyBg: Record<string, string> = {
    spring: "linear-gradient(180deg, #fff4e4 0%, #ffeacc 55%, #c8966a 60%, #8b6846 100%)",
    summer: "linear-gradient(180deg, #fef0dc 0%, #ffe3b8 55%, #b88658 60%, #7a5436 100%)",
    autumn: "linear-gradient(180deg, #ffe5c5 0%, #ffd8a5 55%, #a87048 60%, #6e4828 100%)",
    winter: "linear-gradient(180deg, #f0f4f8 0%, #e4eaf0 55%, #a88860 60%, #705c3c 100%)",
  };
  // 季節家飾：窗外景色/牆上掛飾
  const seasonFlora: Record<string, { emoji: string; positions: { x: number; y: number }[] }> = {
    spring: { emoji: "🌸", positions: [{ x: 85, y: 18 }, { x: 15, y: 20 }] },
    summer: { emoji: "🌻", positions: [{ x: 85, y: 18 }, { x: 15, y: 20 }] },
    autumn: { emoji: "🍁", positions: [{ x: 85, y: 18 }, { x: 15, y: 20 }] },
    winter: { emoji: "❄️", positions: [{ x: 85, y: 18 }, { x: 15, y: 20 }] },
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
        className="relative w-full h-[480px] rounded-[28px] overflow-hidden border-[3px] border-white shadow-lift"
        style={{ background: skyBg[currentSeason] }}
      >
        {/* 壁紙圖案 overlay（上半牆） */}
        <div
          className="absolute left-0 right-0 pointer-events-none opacity-25"
          style={{
            top: 0, height: "55%",
            backgroundImage: "radial-gradient(circle at 25% 35%, rgba(255,255,255,0.5) 2px, transparent 2.5px), radial-gradient(circle at 75% 65%, rgba(255,255,255,0.4) 1.5px, transparent 2px)",
            backgroundSize: "40px 40px, 30px 30px",
          }}
        />
        {/* 地板木紋（下半，真實木板感） */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: "55%",
            backgroundImage: "repeating-linear-gradient(90deg, rgba(30,15,5,0.18) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 80px), repeating-linear-gradient(180deg, rgba(30,15,5,0.08) 0 18px, transparent 18px 20px)",
          }}
        />
        {/* 地板透視陰影（近深遠淺） */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: "55%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        {/* 踢腳線（白色線條） */}
        <div className="absolute left-0 right-0 h-[4px] pointer-events-none" style={{ top: "55%", background: "linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.35), rgba(0,0,0,0.2))", boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset" }} />

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

        {/* 內建裝飾場景（v2.1 新）— 非互動美術佈景，給小窩真實感 */}
        <RoomDecor season={currentSeason} flora={seasonFlora[currentSeason].emoji} />

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
                    onClick={() => { buyIslandItem(item.id, item.label, item.emoji, item.price); toast.success(`${item.emoji} 已擺進小窩「${item.label}」 -${item.price} 金`); }}
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
              onClick={() => { buyIslandItem(item.id, item.label, item.emoji, item.price); toast.success(`${item.emoji} 已擺進小窩「${item.label}」 -${item.price} 金`); }}
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

// ============================================================
// 小窩內建美術佈景（v2.1）— 非互動，給空間層次與真實感
// ============================================================
function RoomDecor({ season, flora }: { season: string; flora: string }) {
  return (
    <>
      {/* 窗戶 L — 明亮的雙扉框 */}
      <div
        className="absolute w-[86px] h-[102px] rounded-md shadow-inner z-[1]"
        style={{
          top: "8%", left: "6%",
          background: "linear-gradient(180deg, #bfe3f9 0%, #e8f4fd 55%, #fbe8d4 100%)",
          border: "5px solid rgba(60,40,30,0.55)",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6), 0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* 窗框十字 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[rgba(60,40,30,0.55)]" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(60,40,30,0.55)]" />
        <div className="absolute left-0 right-0 text-center text-2xl select-none pointer-events-none" style={{ bottom: 8 }}>{flora}</div>
      </div>
      {/* 窗戶 R */}
      <div
        className="absolute w-[86px] h-[102px] rounded-md shadow-inner z-[1]"
        style={{
          top: "8%", right: "6%",
          background: "linear-gradient(180deg, #bfe3f9 0%, #e8f4fd 55%, #fbe8d4 100%)",
          border: "5px solid rgba(60,40,30,0.55)",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6), 0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[rgba(60,40,30,0.55)]" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(60,40,30,0.55)]" />
        <div className="absolute left-0 right-0 text-center text-2xl select-none pointer-events-none" style={{ bottom: 8 }}>{flora}</div>
      </div>

      {/* 窗簾（左右兩片） */}
      <div className="absolute z-[1] pointer-events-none" style={{ top: "6%", left: "3%", width: "26px", height: "118px", background: "linear-gradient(180deg, #ff8eae, #e6729a)", borderRadius: "0 6px 12px 0", boxShadow: "2px 0 6px rgba(0,0,0,0.15)" }} />
      <div className="absolute z-[1] pointer-events-none" style={{ top: "6%", right: "3%", width: "26px", height: "118px", background: "linear-gradient(180deg, #ff8eae, #e6729a)", borderRadius: "6px 0 0 12px", boxShadow: "-2px 0 6px rgba(0,0,0,0.15)" }} />

      {/* 吊燈（天花板下垂） */}
      <div className="absolute left-1/2 -translate-x-1/2 z-[1]" style={{ top: "0%" }}>
        <div className="w-[2px] h-[22px] bg-[rgba(60,40,30,0.6)] mx-auto" />
        <div className="w-[36px] h-[18px] rounded-b-full -mt-[2px]" style={{ background: "radial-gradient(ellipse at top, #fff5c8 10%, #ffd76a 60%, #c89628 100%)", boxShadow: "0 12px 24px rgba(255,215,106,0.5), 0 0 24px rgba(255,215,106,0.35)" }} />
      </div>

      {/* 牆上掛畫（一張大一張小） */}
      <div className="absolute z-[1] pointer-events-none" style={{ top: "10%", left: "35%", width: "54px", height: "42px", background: "linear-gradient(135deg, #ffd1dc, #ffeaa7)", border: "3px solid #3a2a1a", borderRadius: "3px", boxShadow: "0 3px 6px rgba(0,0,0,0.25)" }}>
        <div className="w-full h-full flex items-center justify-center text-lg">💞</div>
      </div>
      <div className="absolute z-[1] pointer-events-none" style={{ top: "14%", left: "58%", width: "38px", height: "38px", background: "linear-gradient(135deg, #c8f0d0, #a4d8f4)", border: "3px solid #3a2a1a", borderRadius: "50%", boxShadow: "0 3px 6px rgba(0,0,0,0.25)" }}>
        <div className="w-full h-full flex items-center justify-center text-base">🌿</div>
      </div>

      {/* 左區：沙發（客廳） */}
      <div className="absolute z-[2] pointer-events-none" style={{ left: "5%", top: "62%", width: "140px", height: "70px" }}>
        {/* 靠背 */}
        <div className="absolute left-0 right-0 top-0 h-[32px] rounded-t-xl" style={{ background: "linear-gradient(180deg, #ff9fb5, #ee7591)", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.15)" }} />
        {/* 坐墊 */}
        <div className="absolute left-0 right-0 top-[28px] h-[28px] rounded-lg" style={{ background: "linear-gradient(180deg, #ffb8c8, #f28fa4)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)" }} />
        {/* 扶手 */}
        <div className="absolute left-0 top-[8px] w-[18px] h-[54px] rounded-lg" style={{ background: "#e67591", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }} />
        <div className="absolute right-0 top-[8px] w-[18px] h-[54px] rounded-lg" style={{ background: "#e67591", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }} />
        {/* 抱枕 */}
        <div className="absolute left-[24px] top-[20px] w-[20px] h-[18px] rounded" style={{ background: "#fff5c8", boxShadow: "0 2px 3px rgba(0,0,0,0.2)" }} />
        <div className="absolute right-[24px] top-[20px] w-[20px] h-[18px] rounded" style={{ background: "#c8f0d0", boxShadow: "0 2px 3px rgba(0,0,0,0.2)" }} />
      </div>

      {/* 中間：地毯 */}
      <div className="absolute z-[1] pointer-events-none" style={{ left: "32%", top: "75%", width: "36%", height: "70px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,175,200,0.65), rgba(255,175,200,0.2) 70%, transparent 85%)", transform: "scaleY(0.6)" }} />
      <div className="absolute z-[1] pointer-events-none" style={{ left: "36%", top: "77%", width: "28%", height: "56px", borderRadius: "50%", border: "3px dashed rgba(255,255,255,0.8)", transform: "scaleY(0.6)" }} />

      {/* 茶几（地毯上面） */}
      <div className="absolute z-[2] pointer-events-none" style={{ left: "40%", top: "74%", width: "80px", height: "30px" }}>
        <div className="absolute inset-0 rounded-md" style={{ background: "linear-gradient(180deg, #d4a878 0%, #a87848 100%)", boxShadow: "0 6px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)" }} />
        {/* 桌腳 */}
        <div className="absolute left-[4px] bottom-[-10px] w-[6px] h-[12px]" style={{ background: "#704830" }} />
        <div className="absolute right-[4px] bottom-[-10px] w-[6px] h-[12px]" style={{ background: "#704830" }} />
        {/* 桌上的小物 */}
        <div className="absolute left-[12px] top-[-8px] text-sm">☕</div>
        <div className="absolute right-[16px] top-[-10px] text-sm">📖</div>
      </div>

      {/* 右區：床（臥室） */}
      <div className="absolute z-[2] pointer-events-none" style={{ right: "5%", top: "58%", width: "140px", height: "82px" }}>
        {/* 床頭板 */}
        <div className="absolute left-0 top-0 bottom-0 w-[18px] rounded-l-xl" style={{ background: "linear-gradient(90deg, #9b7858, #7a5c42)", boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }} />
        {/* 床墊 */}
        <div className="absolute left-[16px] top-[14px] right-0 h-[32px] rounded" style={{ background: "linear-gradient(180deg, #fff9e6, #f5ebd0)", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }} />
        {/* 被子（粉色大波浪） */}
        <div className="absolute left-[20px] top-[24px] right-[6px] h-[44px] rounded-xl" style={{ background: "linear-gradient(180deg, #ffcbe0, #f2a6c5 60%, #e88aaa)", boxShadow: "0 6px 10px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.4)" }} />
        {/* 枕頭 */}
        <div className="absolute left-[20px] top-[16px] w-[44px] h-[16px] rounded-full" style={{ background: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
        {/* 心心 logo */}
        <div className="absolute right-[22px] bottom-[12px] text-base">💕</div>
      </div>

      {/* 床頭櫃 + 檯燈 */}
      <div className="absolute z-[2] pointer-events-none" style={{ right: "40%", top: "60%", width: "30px", height: "38px", background: "linear-gradient(180deg, #b8906c 0%, #8a6848 100%)", borderRadius: "3px", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }}>
        <div className="absolute -top-[16px] left-1/2 -translate-x-1/2 text-base">💡</div>
      </div>

      {/* 盆栽（客廳邊） */}
      <div className="absolute z-[2] pointer-events-none text-4xl" style={{ left: "26%", top: "68%", filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>
        🪴
      </div>

      {/* 書架 + 植物（牆角） */}
      <div className="absolute z-[1] pointer-events-none" style={{ left: "22%", top: "40%", width: "16px", height: "30px", background: "linear-gradient(180deg, #9b7858, #7a5c42)", borderRadius: "2px" }}>
        <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 text-xs">🌿</div>
      </div>
    </>
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

  // 依 y 座標算 z-index（2.5D 透視 — 下方物件擋住上方）
  // y 範圍 2-98，z-index 10-108
  const zIndex = Math.round(10 + item.y);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none transition"
      style={{ left: `${item.x}%`, top: `${item.y}%`, zIndex }}
      onPointerDown={handlePointerDown}
      onDoubleClick={onRemove}
      title={`${item.label} (單擊互動 / 雙擊移除)`}
    >
      <ItemIcon emoji={item.emoji} size={40} glow={item.catalogId === "fountain" || item.catalogId === "rainbow"} catalogId={item.catalogId} />
    </div>
  );
}
