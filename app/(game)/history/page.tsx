"use client";

import { useGame } from "@/lib/store";

export default function HistoryPage() {
  const submissions = useGame((s) => s.submissions);

  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <div key={s.id} className="card p-4 flex items-center justify-between">
          <div className="min-w-0">
            <div className="font-bold truncate">{s.taskTitle}</div>
            <div className="text-xs text-slate-500 mt-1">{s.createdAt}</div>
            {s.note && <div className="text-xs text-rose-500 mt-1">{s.note}</div>}
          </div>
          <div className="text-right shrink-0 ml-3">
            <div className={`text-sm font-bold ${
              s.status === "approved" ? "text-empire-sky"
              : s.status === "rejected" ? "text-rose-500"
              : "text-amber-500"
            }`}>
              {s.status === "approved" ? "准奏" : s.status === "rejected" ? "駁回" : "待審"}
            </div>
            <div className="text-empire-gold font-semibold text-sm mt-1">{s.reward} 金幣</div>
          </div>
        </div>
      ))}
      {submissions.length === 0 && (
        <p className="card p-8 text-center text-slate-500">尚無歷程紀錄</p>
      )}
    </div>
  );
}
