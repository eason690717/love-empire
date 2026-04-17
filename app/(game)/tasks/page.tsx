"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { CATEGORY_LABEL, ATTR_LABEL } from "@/lib/utils";
import type { Task, TaskDirection } from "@/lib/types";
import { TaskEditor } from "@/components/TaskEditor";

const DIRECTION_BADGE: Record<TaskDirection, { label: string; className: string }> = {
  queenToPrince: { label: "阿紅→阿藍", className: "bg-rose-100 text-rose-700" },
  princeToQueen: { label: "阿藍→阿紅", className: "bg-sky-100 text-sky-700" },
  together:      { label: "一起做",    className: "bg-fuchsia-100 text-fuchsia-700" },
};

export default function TasksPage() {
  const tasks = useGame((s) => s.tasks);
  const couple = useGame((s) => s.couple);
  const submitTask = useGame((s) => s.submitTask);
  const submissions = useGame((s) => s.submissions);
  const reviewSubmission = useGame((s) => s.reviewSubmission);
  const removeTask = useGame((s) => s.removeTask);
  const role = useGame((s) => s.role);
  const [mode, setMode] = useState<"submit" | "review">("submit");
  const [editor, setEditor] = useState(false);
  const [just, setJust] = useState<string | null>(null);

  // 哪些任務「我可以申報」？
  const canSubmit = (t: Task) => {
    if (t.direction === "together") return true;
    if (role === "queen" && t.direction === "queenToPrince") return true;
    if (role === "prince" && t.direction === "princeToQueen") return true;
    return false;
  };

  const grouped = useMemo(() => {
    const m: Record<string, Task[]> = {};
    for (const t of tasks) (m[t.category] ||= []).push(t);
    return m;
  }, [tasks]);

  // 我要審核的申報（對方做的，我是准奏方）
  const myPending = submissions.filter((s) => {
    if (s.status !== "pending") return false;
    const t = tasks.find((x) => x.id === s.taskId);
    if (!t) return s.submittedBy !== role; // 找不到任務，預設對方送的我來審
    if (t.direction === "together") return s.submittedBy !== role;
    if (t.direction === "queenToPrince") return role === "prince";
    if (t.direction === "princeToQueen") return role === "queen";
    return false;
  });

  const handleSubmit = (id: string) => {
    submitTask(id);
    setJust(id);
    setTimeout(() => setJust(null), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="card p-2 flex gap-1">
        <TabBtn active={mode === "submit"} onClick={() => setMode("submit")}>
          申報任務
        </TabBtn>
        <TabBtn active={mode === "review"} onClick={() => setMode("review")}>
          審核 ({myPending.length})
        </TabBtn>
      </div>

      {mode === "submit" ? (
        <div className="space-y-5">
          <button
            onClick={() => setEditor(true)}
            className="card w-full p-4 text-center font-semibold text-empire-sky hover:bg-white transition border-2 border-dashed border-empire-sky/40"
          >
            ✨ + 新增自訂任務
          </button>

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="card p-5">
              <h3 className="font-bold text-empire-sky border-l-4 border-empire-sky pl-2 mb-3">
                {CATEGORY_LABEL[cat]}
              </h3>
              <div className="space-y-2">
                {items.map((t) => {
                  const submittable = canSubmit(t);
                  const badge = DIRECTION_BADGE[t.direction];
                  return (
                    <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl bg-white border border-empire-cloud ${
                      submittable ? "hover:border-empire-sky/50" : "opacity-65"
                    }`}>
                      {submittable ? (
                        <input type="checkbox" className="w-5 h-5 accent-empire-sky shrink-0" onChange={() => handleSubmit(t.id)} />
                      ) : (
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center text-xs text-empire-mute">⏳</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{t.title}</span>
                          {t.custom && <span className="tag bg-empire-cream text-empire-gold text-[10px] border-empire-gold/40">自訂</span>}
                        </div>
                        <div className="text-xs text-empire-mute flex gap-1.5 flex-wrap mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${badge.className}`}>{badge.label}</span>
                          <span>+{ATTR_LABEL[t.attribute]} · XP {t.systemXp}</span>
                        </div>
                      </div>
                      <div className="text-empire-gold font-semibold text-sm shrink-0">💰 {t.reward}</div>
                      {t.custom && (
                        <button onClick={() => removeTask(t.id)} className="text-empire-mute hover:text-empire-crimson text-sm">🗑️</button>
                      )}
                      {just === t.id && <span className="text-xs text-emerald-600 font-semibold animate-pulse">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-5">
          <h3 className="font-bold mb-3">待審核申報</h3>
          {myPending.length === 0 ? (
            <p className="text-sm text-empire-mute text-center py-8">目前沒有對方送來等你准奏的任務</p>
          ) : (
            <div className="space-y-2">
              {myPending.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-empire-cloud">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{s.taskTitle}</div>
                      <div className="text-xs text-empire-mute mt-0.5">
                        {s.submittedBy === "queen" ? couple.queen.nickname : couple.prince.nickname} · {s.createdAt}
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
                      onClick={() => reviewSubmission(s.id, false, "審核駁回")}
                      className="btn bg-rose-300 text-white px-4 py-1.5 text-sm flex-1"
                    >
                      駁回 ✗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-empire-mute mt-4">
            你是 <b>{role === "queen" ? couple.queen.nickname : couple.prince.nickname}</b>，負責審核對方送來的申報
          </p>
        </div>
      )}

      {editor && <TaskEditor onClose={() => setEditor(false)} />}
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
