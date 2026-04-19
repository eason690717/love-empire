"use client";

/**
 * 通用 Toast / Confirm 系統 — 取代原生 alert() / confirm()
 *
 * 用法：
 *   import { toast } from "@/components/Toast";
 *   toast.info("訊息");
 *   toast.success("成功");
 *   toast.error("錯誤");
 *   toast.warn("警告");
 *   const ok = await toast.confirm("確定要離開嗎？", { okLabel: "離開", cancelLabel: "取消" });
 *
 *   // Render: 在 root layout 放 <ToastHost />
 */

import { useEffect, useState } from "react";

type ToastKind = "info" | "success" | "error" | "warn";

interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
  duration?: number;
}

interface ConfirmItem {
  id: string;
  message: string;
  okLabel: string;
  cancelLabel: string;
  resolve: (ok: boolean) => void;
}

// 簡易 event bus
type Listener = (toasts: ToastItem[], confirms: ConfirmItem[]) => void;
const listeners = new Set<Listener>();
let toastQueue: ToastItem[] = [];
let confirmQueue: ConfirmItem[] = [];

function emit() {
  listeners.forEach((fn) => fn([...toastQueue], [...confirmQueue]));
}

function push(kind: ToastKind, message: string, duration = 2600) {
  const id = Math.random().toString(36).slice(2, 8);
  toastQueue.push({ id, kind, message, duration });
  emit();
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    emit();
  }, duration);
}

export const toast = {
  info:    (msg: string) => push("info", msg),
  success: (msg: string) => push("success", msg),
  error:   (msg: string) => push("error", msg, 3400),
  warn:    (msg: string) => push("warn", msg, 3000),
  confirm: (message: string, opts?: { okLabel?: string; cancelLabel?: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2, 8);
      confirmQueue.push({
        id,
        message,
        okLabel: opts?.okLabel ?? "確定",
        cancelLabel: opts?.cancelLabel ?? "取消",
        resolve,
      });
      emit();
    });
  },
};

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirms, setConfirms] = useState<ConfirmItem[]>([]);

  useEffect(() => {
    const fn: Listener = (t, c) => {
      setToasts(t);
      setConfirms(c);
    };
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const resolveConfirm = (id: string, ok: boolean) => {
    const item = confirmQueue.find((c) => c.id === id);
    if (item) {
      item.resolve(ok);
      confirmQueue = confirmQueue.filter((c) => c.id !== id);
      emit();
    }
  };

  return (
    <>
      {/* Toast stack */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-2xl shadow-lg text-sm font-semibold border-2 animate-pop ${
              t.kind === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : t.kind === "error"  ? "bg-rose-50 border-rose-300 text-rose-800"
              : t.kind === "warn"   ? "bg-amber-50 border-amber-300 text-amber-800"
                                    : "bg-white border-empire-cloud text-empire-ink"
            }`}
          >
            {t.kind === "success" ? "✓ " : t.kind === "error" ? "⚠️ " : t.kind === "warn" ? "⚠️ " : "ℹ️ "}
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm modals (stacked) */}
      {confirms.map((c) => (
        <div
          key={c.id}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ background: "rgba(20,40,70,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => resolveConfirm(c.id, false)}
        >
          <div
            className="max-w-sm w-full card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm text-empire-ink whitespace-pre-line leading-relaxed">{c.message}</div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => resolveConfirm(c.id, false)}
                className="btn-ghost flex-1 py-2 text-sm"
              >{c.cancelLabel}</button>
              <button
                onClick={() => resolveConfirm(c.id, true)}
                className="btn-primary flex-1 py-2 font-bold"
              >{c.okLabel}</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
