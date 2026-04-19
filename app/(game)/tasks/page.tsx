"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { CATEGORY_LABEL, ATTR_LABEL } from "@/lib/utils";
import type { Task, TaskDirection, RelationshipType } from "@/lib/types";
import { RELATIONSHIP_LABELS } from "@/lib/types";
import { TaskEditor } from "@/components/TaskEditor";
import { RejectModal } from "@/components/RejectModal";
import { PRESETS_COHABIT, PRESETS_NEARBY, PRESETS_LONGDISTANCE, PRESETS_MARRIED, PRESETS_ANY } from "@/lib/taskPresets";

const DIRECTION_BADGE: Record<TaskDirection, { label: string; className: string }> = {
  queenToPrince: { label: "對方做",  className: "bg-orange-100 text-orange-700" },
  princeToQueen: { label: "對方做",  className: "bg-orange-100 text-orange-700" },
  serve:         { label: "對方做",  className: "bg-orange-100 text-orange-700" },
  together:      { label: "一起做",  className: "bg-fuchsia-100 text-fuchsia-700" },
};

export default function TasksPage() {
  const tasks = useGame((s) => s.tasks);
  const couple = useGame((s) => s.couple);
  const submitTask = useGame((s) => s.submitTask);
  const submissions = useGame((s) => s.submissions);
  const reviewSubmission = useGame((s) => s.reviewSubmission);
  const removeTask = useGame((s) => s.removeTask);
  const addPresetTask = useGame((s) => s.addPresetTask);
  const setRelationshipType = useGame((s) => s.setRelationshipType);
  const role = useGame((s) => s.role);
  const [mode, setMode] = useState<"submit" | "review">("submit");
  const [editor, setEditor] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [justSent, setJustSent] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null);

  const nextLockedTask = tasks.find((t) => t.unlockLevel && t.unlockLevel > couple.kingdomLevel);
  const myNickname = role === "queen" ? couple.queen.nickname : couple.prince.nickname;
  const partnerNickname = role === "queen" ? couple.prince.nickname : couple.queen.nickname;

  const canSubmit = (t: Task) => {
    if (t.unlockLevel && couple.kingdomLevel < t.unlockLevel) return false;
    if (t.direction === "together") return true;
    if (t.direction === "serve") return true; // 對方做：任一方都可申報「我為對方做了」
    if (role === "queen" && t.direction === "queenToPrince") return true;
    if (role === "prince" && t.direction === "princeToQueen") return true;
    return false;
  };

  // 每個任務是否「有我剛送出未審」的申報
  const pendingByTask = useMemo(() => {
    const m = new Map<string, typeof submissions[number]>();
    for (const s of submissions) {
      if (s.status === "pending" && s.submittedBy === role) m.set(s.taskId, s);
    }
    return m;
  }, [submissions, role]);

  const grouped = useMemo(() => {
    const m: Record<string, Task[]> = {};
    for (const t of tasks) (m[t.category] ||= []).push(t);
    return m;
  }, [tasks]);

  // 審核區：只顯示「對方送來」的 (自己送的不能自己審，必須由伴侶審)
  const reviewList = submissions.filter((s) => s.status === "pending" && s.submittedBy !== role);
  const pendingMineCount = submissions.filter((s) => s.status === "pending" && s.submittedBy === role).length;
  const pendingPartnerCount = reviewList.length;

  const handleSubmit = (id: string) => {
    submitTask(id);
    setJustSent(id);
    setTimeout(() => setJustSent(null), 2400);
  };

  return (
    <div className="space-y-4">
      {/* 使用說明橫幅 */}
      <div className="card p-4 bg-empire-cream/60 border border-empire-gold/30 text-sm">
        <div className="font-bold text-empire-ink mb-1">🔔 任務流程</div>
        <div className="text-empire-mute text-xs leading-relaxed">
          1️⃣ 點任務右側 <b className="text-empire-sky">「送出審核」</b> → 通知對方<br />
          2️⃣ 對方到「審核」分頁按 <b className="text-emerald-600">准奏</b> 或 <b className="text-rose-500">駁回</b><br />
          3️⃣ 准奏 → 金幣入帳 + 愛意 +{5}~{15} XP + 有機率掉記憶卡
        </div>
      </div>

      <div className="card p-2 flex gap-1">
        <TabBtn active={mode === "submit"} onClick={() => setMode("submit")}>
          申報任務 {pendingMineCount > 0 && <span className="ml-1 text-xs bg-empire-sky/20 px-1.5 rounded-full">{pendingMineCount} 待審</span>}
        </TabBtn>
        <TabBtn active={mode === "review"} onClick={() => setMode("review")}>
          審核 ({reviewList.length})
        </TabBtn>
      </div>

      {mode === "submit" ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEditor(true)}
              className="card p-3 text-center font-semibold text-empire-sky hover:bg-white transition border-2 border-dashed border-empire-sky/40"
            >
              ✨ 新增自訂任務
            </button>
            <button
              onClick={() => setPresetsOpen(true)}
              className="card p-3 text-center font-semibold text-empire-gold hover:bg-white transition border-2 border-dashed border-empire-gold/40"
            >
              📚 從模板挑選
            </button>
          </div>

          {nextLockedTask && (
            <div className="card p-3 bg-empire-cream/60 border border-empire-gold/30 text-xs text-empire-ink flex items-center gap-2">
              🔒 <span>Lv.{nextLockedTask.unlockLevel} 將解鎖「{nextLockedTask.title}」— 現在 Lv.{couple.kingdomLevel}，還差 {nextLockedTask.unlockLevel! - couple.kingdomLevel} 級</span>
            </div>
          )}

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="card p-5">
              <h3 className="font-bold text-empire-sky border-l-4 border-empire-sky pl-2 mb-3">
                {CATEGORY_LABEL[cat]}
              </h3>
              <div className="space-y-2">
                {items.map((t) => {
                  const submittable = canSubmit(t);
                  const alreadyPending = pendingByTask.has(t.id);
                  const badge = DIRECTION_BADGE[t.direction];
                  const locked = !!(t.unlockLevel && couple.kingdomLevel < t.unlockLevel);

                  return (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                        alreadyPending ? "bg-empire-cream/60 border-empire-gold/40"
                        : submittable ? "bg-white border-empire-cloud hover:border-empire-sky/50"
                        : "bg-white border-empire-cloud opacity-55"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{t.title}</span>
                          {t.custom && <span className="tag bg-empire-cream text-empire-gold text-[10px] border-empire-gold/40">自訂</span>}
                          {locked && (
                            <span className="tag bg-slate-100 text-slate-500 text-[10px] border-slate-300">🔒 Lv.{t.unlockLevel}</span>
                          )}
                        </div>
                        <div className="text-xs text-empire-mute flex gap-1.5 flex-wrap mt-0.5 items-center">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${badge.className}`}>{badge.label}</span>
                          <span>+{ATTR_LABEL[t.attribute]} · XP {t.systemXp}</span>
                          <span className="text-empire-gold font-bold">💰 {t.reward}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {alreadyPending ? (
                          <span className="text-xs font-semibold text-empire-gold px-3 py-2 rounded-lg bg-white border border-empire-gold/40">
                            ⏳ 等 {partnerNickname} 審
                          </span>
                        ) : justSent === t.id ? (
                          <span className="text-xs font-semibold text-emerald-700 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 animate-pop">
                            ✓ 已送出！
                          </span>
                        ) : locked ? (
                          <span className="text-xs text-slate-400 px-3 py-2">尚未解鎖</span>
                        ) : !submittable ? (
                          <span className="text-xs text-empire-mute px-3 py-2">
                            等對方做
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSubmit(t.id)}
                            className="btn-primary px-3 py-2 text-xs font-semibold"
                          >
                            送出審核
                          </button>
                        )}
                        {t.custom && (
                          <button onClick={() => removeTask(t.id)} className="text-empire-mute hover:text-empire-crimson text-sm">🗑️</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="card p-4 text-xs text-empire-mute">
            你是 <b className="text-empire-ink">{myNickname}</b>，負責審核 <b>{partnerNickname}</b> 送來的申報。
            {pendingPartnerCount > 0 ? ` 目前 ${pendingPartnerCount} 筆待你准奏。` : ""}
            {pendingMineCount > 0 ? ` 你自己送出的 ${pendingMineCount} 筆由對方審核 (請用對方身份登入處理)。` : ""}
            {reviewList.length === 0 && pendingMineCount === 0 && " 目前沒有待審任務。到「申報任務」送出幾個試試。"}
          </div>

          {reviewList.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold mb-3">待審核 ({reviewList.length})</h3>
              <div className="space-y-2">
                {reviewList.map((s) => {
                  const from = s.submittedBy === "queen" ? couple.queen.nickname : couple.prince.nickname;
                  return (
                    <div key={s.id} className="p-3 rounded-xl border border-empire-cloud">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{s.taskTitle}</div>
                          <div className="text-xs text-empire-mute mt-0.5">
                            <b>{from}</b> 送出 · {s.createdAt}
                          </div>
                        </div>
                        <div className="text-empire-gold font-semibold text-sm">💰 {s.reward}</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => reviewSubmission(s.id, true)}
                          className="btn bg-empire-sky text-white px-4 py-1.5 text-sm flex-1"
                        >
                          准奏 ✓
                        </button>
                        <button
                          onClick={() => setRejectTarget({ id: s.id, title: s.taskTitle })}
                          className="btn bg-rose-300 text-white px-4 py-1.5 text-sm flex-1"
                        >
                          駁回 ✗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {editor && <TaskEditor onClose={() => setEditor(false)} />}
      {rejectTarget && (
        <RejectModal
          taskTitle={rejectTarget.title}
          onConfirm={(reason) => {
            reviewSubmission(rejectTarget.id, false, reason);
            setRejectTarget(null);
          }}
          onClose={() => setRejectTarget(null)}
        />
      )}

      {presetsOpen && (
        <PresetsDrawer
          currentType={couple.relationshipType}
          existingTitles={new Set(tasks.map((t) => t.title))}
          onAdd={(preset) => addPresetTask(preset)}
          onSetType={(t) => setRelationshipType(t)}
          onClose={() => setPresetsOpen(false)}
        />
      )}
    </div>
  );
}

function PresetsDrawer({
  currentType, existingTitles, onAdd, onSetType, onClose,
}: {
  currentType?: RelationshipType;
  existingTitles: Set<string>;
  onAdd: (p: any) => void;
  onSetType: (t: "cohabit" | "nearby" | "longdistance" | "married") => void;
  onClose: () => void;
}) {
  const [view, setView] = useState<"cohabit" | "nearby" | "longdistance" | "married" | "any">(
    currentType && currentType !== "any" ? currentType : "cohabit"
  );
  const list =
    view === "cohabit" ? PRESETS_COHABIT :
    view === "nearby" ? PRESETS_NEARBY :
    view === "longdistance" ? PRESETS_LONGDISTANCE :
    view === "married" ? PRESETS_MARRIED :
    PRESETS_ANY;

  const tabs: { key: "cohabit" | "nearby" | "longdistance" | "married" | "any"; emoji: string; label: string }[] = [
    { key: "cohabit",      emoji: RELATIONSHIP_LABELS.cohabit.emoji,      label: RELATIONSHIP_LABELS.cohabit.label },
    { key: "nearby",       emoji: RELATIONSHIP_LABELS.nearby.emoji,       label: RELATIONSHIP_LABELS.nearby.label },
    { key: "longdistance", emoji: RELATIONSHIP_LABELS.longdistance.emoji, label: RELATIONSHIP_LABELS.longdistance.label },
    { key: "married",      emoji: RELATIONSHIP_LABELS.married.emoji,      label: RELATIONSHIP_LABELS.married.label },
    { key: "any",          emoji: "💫",                                    label: "通用" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-empire-cream w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-empire-cloud flex items-center justify-between">
          <div>
            <h3 className="font-bold text-empire-ink">📚 任務模板庫</h3>
            <p className="text-[10px] text-empire-mute">按情侶相處類型推薦 · 點 + 加入自己的任務清單</p>
          </div>
          <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
        </div>

        {/* 類型切換 + 「設為我們的類型」快捷 */}
        <div className="p-3 border-b border-empire-cloud space-y-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  view === t.key ? "bg-empire-sky text-white" : "bg-white text-empire-mute border border-empire-cloud"
                }`}
              >
                {t.emoji} {t.label} ({
                  t.key === "cohabit" ? PRESETS_COHABIT.length :
                  t.key === "nearby" ? PRESETS_NEARBY.length :
                  t.key === "longdistance" ? PRESETS_LONGDISTANCE.length :
                  t.key === "married" ? PRESETS_MARRIED.length :
                  PRESETS_ANY.length
                })
              </button>
            ))}
          </div>
          {view !== "any" && currentType !== view && (
            <button
              onClick={() => onSetType(view as "cohabit" | "nearby" | "longdistance" | "married")}
              className="w-full text-[11px] text-empire-sky hover:underline py-1"
            >
              把我們設為「{RELATIONSHIP_LABELS[view as "cohabit" | "nearby" | "longdistance" | "married"].label}」情侶 →
            </button>
          )}
          {currentType === view && (
            <div className="text-[11px] text-emerald-600 text-center">✓ 這是你們目前的情侶類型</div>
          )}
        </div>

        {/* 模板清單 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {list.map((p) => {
            const added = existingTitles.has(p.title);
            return (
              <div
                key={p.title}
                className={`p-3 rounded-xl border-2 flex items-center gap-3 transition ${added ? "bg-empire-cloud/40 border-empire-cloud opacity-70" : "bg-white border-empire-cloud hover:border-empire-sky/40"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-empire-ink truncate">{p.title}</div>
                  <div className="text-[10px] text-empire-mute mt-0.5">
                    {CATEGORY_LABEL[p.category]} · 💰 {p.reward} · +{p.systemXp} XP
                    {p.unlockLevel ? ` · 🔒 Lv.${p.unlockLevel}+` : ""}
                  </div>
                </div>
                <button
                  disabled={added}
                  onClick={() => onAdd(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
                    added ? "bg-empire-cloud text-empire-mute" : "bg-empire-sky text-white hover:brightness-110"
                  }`}
                >
                  {added ? "已加入" : "+ 加入"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-empire-cloud bg-white">
          <button onClick={onClose} className="btn-primary w-full py-2 font-semibold">完成</button>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
        active ? "bg-empire-sky text-white" : "text-empire-ink hover:bg-empire-cloud"
      }`}
    >
      {children}
    </button>
  );
}
