"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "loading";

export interface ToastData {
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
  duration?: number; // ms — 0 = no auto-close
}

const ICONS: Record<ToastType, string> = {
  success: "check_circle",
  error:   "error",
  loading: "autorenew",
};

const COLORS: Record<ToastType, string> = {
  success: "text-secondary",
  error:   "text-error",
  loading: "text-primary",
};

export default function Toast({ toast, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!toast || toast.type === "loading" || duration === 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-start gap-3 bg-surface-container border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-xl px-5 py-4 min-w-[280px] max-w-sm">
        <span
          className={`material-symbols-outlined text-[22px] mt-0.5 flex-shrink-0 ${COLORS[toast.type]} ${
            toast.type === "loading" ? "animate-spin" : ""
          }`}
          style={toast.type !== "loading" ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {ICONS[toast.type]}
        </span>
        <p className="font-body text-sm text-on-surface leading-relaxed flex-1">
          {toast.message}
        </p>
        {toast.type !== "loading" && (
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors ml-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
