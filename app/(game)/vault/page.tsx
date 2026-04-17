"use client";

import { useGame } from "@/lib/store";

export default function VaultPage() {
  const redemptions = useGame((s) => s.redemptions);
  const useRedemption = useGame((s) => s.useRedemption);

  const unused = redemptions.filter((r) => r.status === "unused");
  const used = redemptions.filter((r) => r.status === "used");

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="font-bold">🎁 我的寶庫</h2>
        <p className="text-sm text-slate-500 mt-1">
          已兌換 {redemptions.length} 張 · 未使用 {unused.length} 張
        </p>
      </div>

      {unused.length > 0 && (
        <div>
          <div className="text-sm text-slate-500 mb-2">未使用</div>
          <div className="space-y-2">
            {unused.map((r) => (
              <div key={r.id} className="card p-4 flex items-center justify-between border-l-4 border-empire-pink">
                <div>
                  <div className="font-bold">{r.rewardTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.createdAt} 兌換</div>
                </div>
                <button
                  onClick={() => useRedemption(r.id)}
                  className="btn bg-empire-pink/80 text-white px-4 py-1.5 text-sm font-semibold"
                >
                  使用
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {used.length > 0 && (
        <div>
          <div className="text-sm text-slate-500 mb-2">已使用</div>
          <div className="space-y-2">
            {used.map((r) => (
              <div key={r.id} className="card p-4 opacity-60 flex items-center justify-between">
                <div>
                  <div className="line-through">{r.rewardTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.createdAt}</div>
                </div>
                <span className="text-xs text-slate-400">已使用</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {redemptions.length === 0 && (
        <p className="card p-8 text-center text-slate-500">還沒有兌換任何東西，去國庫兌換逛逛吧～</p>
      )}
    </div>
  );
}
