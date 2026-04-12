"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

const GlobalMappingPage = dynamic(
  () => import("@/app/Pages/Mapping/map"),
  { ssr: false },
);

const GlobalMappingContext = createContext(null);

export function useGlobalMapping() {
  const ctx = useContext(GlobalMappingContext);
  if (!ctx) {
    throw new Error("useGlobalMapping must be used within GlobalMappingProvider");
  }
  return ctx;
}

export function GlobalMappingProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openGlobalMapping = useCallback(() => setOpen(true), []);
  const closeGlobalMapping = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeGlobalMapping();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeGlobalMapping]);

  const value = useMemo(
    () => ({
      openGlobalMapping,
      closeGlobalMapping,
      isGlobalMappingOpen: open,
    }),
    [open, openGlobalMapping, closeGlobalMapping],
  );

  return (
    <GlobalMappingContext.Provider value={value}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-[10000] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Global mapping"
        >
          <button
            type="button"
            onClick={closeGlobalMapping}
            className="absolute right-4 top-4 z-[10001] rounded-md border border-white/20 bg-slate-900/90 px-3 py-1.5 text-sm text-white shadow hover:bg-slate-800"
          >
            Close
          </button>
          <div className="h-full w-full overflow-auto">
            <GlobalMappingPage />
          </div>
        </div>
      ) : null}
    </GlobalMappingContext.Provider>
  );
}
