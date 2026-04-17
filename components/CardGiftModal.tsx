"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { RARITY_CLASS } from "@/lib/utils";

export function CardGiftModal({
  toCoupleId, toCoupleName, onClose,
}: {
  toCoupleId: string;
  toCoupleName: string;
  onClose: () => void;
}) {
  const codex = useGame((s) => s.codex);
  const sendCardGift = useGame((s) => s.sendCardGift);
  const [picked, setPicked] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const owned = codex.filter((c) => c.obtainedAt);

  const handleSend = () => {
    if (!picked) return;
    sendCardGift(picked, toCoupleId, toCoupleName, msg);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 40, 70, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="max-w-md w-full card p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg">🎴 送卡給「{toCoupleName}」</h2>
          <button onClick={onClose} className="text-empire-mute">✕</button>
        </div>
        <p className="text-xs text-empire-mute mb-3">
          ⚠️ 送出後卡片會從你的圖鑑移除（有代價的禮物更珍貴）
        </p>

        {owned.length === 0 ? (
          <p className="text-sm text-empire-mute text-center py-8">你還沒有任何記憶卡可以送</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {owned.map((c) => (
              <button
                key={c.id}
                onClick={() => setPicked(c.id)}
                className={`p-2 rounded-xl border-2 text-center transition ${
                  picked === c.id ? "border-empire-berry bg-rose-50" : "border-empire-cloud bg-white hover:border-empire-sky/50"
                }`}
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="text-xs font-bold truncate mt-0.5">{c.name}</div>
                <div className={`inline-block tag ${RARITY_CLASS[c.rarity]} text-[10px] mt-0.5`}>{c.rarity}</div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <label className="text-xs text-empire-mute">附上訊息</label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value.slice(0, 100))}
            placeholder="送給你們，祝你們幸福～"
            rows={2}
            className="mt-1 w-full border-2 border-empire-cloud rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-empire-sky"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">取消</button>
          <button
            onClick={handleSend}
            disabled={!picked}
            className="btn-pink flex-1 py-2.5 font-semibold"
          >
            送出 💕
          </button>
        </div>
      </div>
    </div>
  );
}
