"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initLiff, type LiffState } from "@/lib/liff";

const Ctx = createContext<LiffState>({ ready: false, inClient: false, loggedIn: false, profile: null });

export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiffState>({ ready: false, inClient: false, loggedIn: false, profile: null });

  useEffect(() => {
    let cancelled = false;
    initLiff().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => { cancelled = true; };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useLiff() {
  return useContext(Ctx);
}
