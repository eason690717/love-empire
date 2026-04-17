"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { CATEGORY_META, type Task, type TaskCategory, type TaskDirection, type Attribute } from "@/lib/types";
import { CATEGORY_LABEL, ATTR_LABEL } from "@/lib/utils";

const CATEGORIES: TaskCategory[] = ["chore", "wellness", "romance", "surprise", "coop"];
const ATTRS: Attribute[] = ["intimacy", "communication", "romance", "care", "surprise"];

export function TaskEditor({ onClose }: { onClose: () => void }) {
  const role = useGame((s) => s.role);
  const couple = useGame((s) => s.couple);
  const addCustomTask = useGame((s) => s.addCustomTask);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("chore");
  const [attr, setAttr] = useState<Attribute>("care");
  const [reward, setReward] = useState(20);
  const [direction, setDirection] = useState<TaskDirection>("together");

  const meta = CATEGORY_META[category];
  const queenName = couple.queen.nickname;
  const princeName = couple.prince.nickname;

  const handleSave = () => {
    if (!title.trim()) return;
    addCustomTask({
      title,
      category,
      attribute: attr,
      reward,
      direction,
    } as Omit<Task, "id" | "systemXp" | "custom">);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-md w-full card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">✨ 新增任務</h2>
          <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
        </div>

        {/* 標題 */}
        <div className="mb-3">
          <label className="text-xs text-empire-mute">任務名稱</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 40))}
            placeholder="e.g. 幫我買咖啡"
            className="mt-1 w-full border-2 border-empire-cloud rounded-xl px-3 py-2 focus:outline-none focus:border-empire-sky"
            autoFocus
          />
        </div>

        {/* 分類 */}
        <div className="mb-3">
          <label className="text-xs text-empire-mute">分類</label>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {CATEGORIES.map((c) => {
              const m = CATEGORY_META[c];
              return (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setAttr(m.defaultAttr); if (reward > m.rewardCap) setReward(Math.min(reward, m.rewardCap)); }}
                  className={`px-2 py-2 rounded-lg text-xs font-medium border-2 transition ${
                    category === c ? "bg-empire-sky text-white border-empire-sky" : "bg-white border-empire-cloud"
                  }`}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-empire-mute mt-1">
            系統 XP：{meta.xp} · 金幣上限：{meta.rewardCap}
          </p>
        </div>

        {/* 方向 */}
        <div className="mb-3">
          <label className="text-xs text-empire-mute">誰做這件事？</label>
          <div className="mt-1 space-y-1.5">
            <RadioRow
              active={direction === (role === "queen" ? "queenToPrince" : "princeToQueen")}
              onClick={() => setDirection(role === "queen" ? "queenToPrince" : "princeToQueen")}
              label={`🧺 我做給對方 (${role === "queen" ? queenName : princeName} 申報、${role === "queen" ? princeName : queenName} 准奏)`}
            />
            <RadioRow
              active={direction === (role === "queen" ? "princeToQueen" : "queenToPrince")}
              onClick={() => setDirection(role === "queen" ? "princeToQueen" : "queenToPrince")}
              label={`🎁 對方做給我 (${role === "queen" ? princeName : queenName} 申報、${role === "queen" ? queenName : princeName} 准奏)`}
            />
            <RadioRow
              active={direction === "together"}
              onClick={() => setDirection("together")}
              label="💞 一起做 (任一方申報、另一方准奏)"
            />
          </div>
        </div>

        {/* 屬性 */}
        <div className="mb-3">
          <label className="text-xs text-empire-mute">加哪個屬性？</label>
          <div className="mt-1 flex gap-1.5 flex-wrap">
            {ATTRS.map((a) => (
              <button
                key={a}
                onClick={() => setAttr(a)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  attr === a ? "bg-empire-pink/40 border-empire-pink" : "bg-white border-empire-cloud"
                }`}
              >
                {ATTR_LABEL[a]}
              </button>
            ))}
          </div>
        </div>

        {/* 金幣 */}
        <div className="mb-4">
          <div className="flex justify-between">
            <label className="text-xs text-empire-mute">金幣獎勵 (自訂)</label>
            <span className="text-xs text-empire-mute">上限 {meta.rewardCap}</span>
          </div>
          <input
            type="range"
            min={0}
            max={meta.rewardCap}
            step={5}
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            className="mt-1 w-full accent-empire-sky"
          />
          <div className="text-center text-lg font-bold text-empire-gold mt-1">💰 {reward}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">取消</button>
          <button onClick={handleSave} disabled={!title.trim()} className="btn-primary flex-1 py-2.5 font-semibold">
            新增
          </button>
        </div>

        <p className="text-[10px] text-empire-mute mt-3 leading-relaxed">
          💡 愛意指數由系統 XP 決定（公平跨情侶排行）· 金幣只在你家國庫使用，不影響排行榜
        </p>
      </div>
    </div>
  );
}

function RadioRow({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2.5 rounded-xl border-2 text-xs transition ${
        active ? "border-empire-sky bg-empire-cloud" : "border-empire-cloud bg-white hover:border-empire-sky/50"
      }`}
    >
      {label}
    </button>
  );
}
