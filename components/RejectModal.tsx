"use client";

import { useState } from "react";

const QUICK_REASONS = [
  "其實是我自己做的 😂",
  "時間不對吧",
  "做得不夠徹底",
  "你這次要不算",
  "等你補救後再申報",
];

export function RejectModal({
  taskTitle,
  onConfirm,
  onClose,
}: {
  taskTitle: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-md w-full card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">❌ 駁回申報</h2>
          <button onClick={onClose} className="text-empire-mute hover:text-empire-ink">✕</button>
        </div>
        <p className="text-sm text-empire-mute mb-3">
          「<b className="text-empire-ink">{taskTitle}</b>」— 告訴對方為什麼駁回，保持溝通 💬
        </p>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {QUICK_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className="text-xs px-2.5 py-1 rounded-full border border-empire-cloud bg-white hover:bg-empire-cloud"
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 100))}
          placeholder="或自己寫一句…"
          rows={3}
          autoFocus
          className="w-full border-2 border-empire-cloud rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
        />
        <div className="text-right text-[10px] text-empire-mute mt-1">{reason.length} / 100</div>

        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">取消</button>
          <button
            onClick={() => onConfirm(reason.trim() || "審核駁回")}
            className="btn bg-rose-400 text-white flex-1 py-2.5 text-sm font-semibold"
          >
            確定駁回
          </button>
        </div>
      </div>
    </div>
  );
}
