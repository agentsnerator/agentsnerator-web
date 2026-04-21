"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2, X, type LucideIcon } from "lucide-react";

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

const ICON_MAP: Record<ToastType, LucideIcon> = {
  success: CheckCircle2,
  error:   AlertCircle,
  loading: Loader2,
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

  const IconComponent = ICON_MAP[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-start gap-3 bg-surface-container border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-xl px-5 py-4 min-w-[280px] max-w-sm">
        <IconComponent
          className={`mt-0.5 flex-shrink-0 ${COLORS[toast.type]} ${
            toast.type === "loading" ? "animate-spin" : ""
          }`}
          size={22}
        />
        <p className="font-body text-sm text-on-surface leading-relaxed flex-1">
          {toast.message}
        </p>
        {toast.type !== "loading" && (
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors ml-2 flex-shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
