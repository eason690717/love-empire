"use client";

import { useEffect, useRef, useState } from "react";

export function InlineRename({
  value,
  onSave,
  maxLen = 20,
  className = "",
}: {
  value: string;
  onSave: (next: string) => void;
  maxLen?: number;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const clean = draft.trim();
    if (clean && clean !== value) onSave(clean);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        maxLength={maxLen}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(value); setEditing(false); }
        }}
        className={`bg-white border-2 border-empire-sky rounded-lg px-2 py-0.5 text-sm font-bold outline-none min-w-0 ${className}`}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="點擊改名"
      className={`inline-flex items-center gap-1 hover:underline decoration-dashed underline-offset-2 ${className}`}
    >
      <span className="truncate">{value}</span>
      <span className="text-xs opacity-50">✏️</span>
    </button>
  );
}
