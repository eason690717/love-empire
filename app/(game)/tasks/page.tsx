"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { CATEGORY_LABEL, ATTR_LABEL } from "@/lib/utils";
import type { Task } from "@/lib/types";

export default function TasksPage() {
  const tasks = useGame((s) => s.tasks);
  const submitTask = useGame((s) => s.submitTask);
  const submissions = useGame((s) => s.submissions);
  const reviewSubmission = useGame((s) => s.reviewSubmission);
  const role = useGame((s) => s.role);
  const [mode, setMode] = useState<"submit" | "review">("submit");
  const [just, setJust] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const m: Record<string, Task[]> = {};
    for (const t of tasks) (m[t.category] ||= []).push(t);
    return m;
  }, [tasks]);

  const pending = submissions.filter((s) => s.status === "pending");

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
          審核 ({pending.length})
        </TabBtn>
      </div>

      {mode === "submit" ? (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="card p-5">
              <h3 className="font-bold text-empire-sky border-l-4 border-empire-sky pl-2 mb-3">
                {CATEGORY_LABEL[cat]}
              </h3>
              <div className="space-y-2">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-empire-cloud hover:border-empire-sky/50">
                    <input type="checkbox" className="w-5 h-5 accent-empire-sky" onChange={() => handleSubmit(t.id)} />
                    <div className="flex-1">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-slate-500">
                        +{ATTR_LABEL[t.attribute]} 屬性 {t.coop && "· 合作任務 🤝"}
                      </div>
                    </div>
                    <div className="text-empire-gold font-semibold text-sm">{t.reward} 金幣</div>
                    {just === t.id && (
                      <span className="text-xs text-emerald-600 font-semibold animate-pulse">已送出 ✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-5">
          <h3 className="font-bold mb-3">待審核申報</h3>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">目前沒有待審的任務</p>
          ) : (
            <div className="space-y-2">
              {pending.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-empire-cloud">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{s.taskTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {s.submittedBy === "queen" ? "阿紅" : "阿藍"} · {s.createdAt}
                      </div>
                    </div>
                    <div className="text-empire-gold font-semibold text-sm">{s.reward} 金幣</div>
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
          <p className="text-xs text-slate-400 mt-4">
            提示：實際使用時由伴侶審核，這裡 demo 為方便你可同時當雙方。目前登入身份：
            <b>{role === "queen" ? "阿紅" : "阿藍"}</b>
          </p>
        </div>
      )}
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
