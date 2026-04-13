"use client";

import { useState } from "react";

const ROLES = ["Writer", "SEO / Keywords", "Image Gen", "Proofreader", "Coder", "Researcher", "Analyst", "Custom"];
const SCORE_TIERS = [
  { label: "Beginner", range: "0–49", color: "text-on-surface-variant" },
  { label: "Skilled",  range: "50–74", color: "text-on-surface" },
  { label: "Expert",   range: "75–89", color: "text-secondary" },
  { label: "Master",   range: "90–100", color: "text-primary" },
];

type Props = {
  projectId:  string;
  onClose:    () => void;
  onCreated?: () => void;
};

export default function AddAgentModal({ projectId, onClose, onCreated }: Props) {
  const [name, setName]             = useState("");
  const [role, setRole]             = useState("");
  const [customRole, setCustomRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr]               = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalRole = role === "Custom" ? customRole.trim() : role;
    if (!name.trim() || !finalRole) return;
    setSubmitting(true);
    setErr(null);

    const { createAgent } = await import("@/lib/queries");
    const { error } = await createAgent(projectId, name.trim(), finalRole);

    if (error) {
      setErr(error);
      setSubmitting(false);
    } else {
      setSubmitting(false);
      onCreated?.();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface-container rounded-xl border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest block mb-1">
              Project Fleet
            </span>
            <h2 className="font-headline text-2xl font-bold">Add New Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Agent Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
              Agent Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Keyword-Hunter Pro"
              maxLength={40}
              required
              className="bg-surface-container-low border-none outline-none focus:border-b-2 focus:border-secondary px-4 py-3 text-sm rounded-lg text-on-surface placeholder:text-white/30 transition-all"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
              Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-lg text-sm font-label text-left transition-all border ${
                    role === r
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-outline-variant/30"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {role === "Custom" && (
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom role..."
                className="mt-2 bg-surface-container-low border-none outline-none focus:border-b-2 focus:border-secondary px-4 py-3 text-sm rounded-lg text-on-surface placeholder:text-white/30 transition-all"
              />
            )}
          </div>

          {/* Score info */}
          <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/5">
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-3">
              Score Tiers (auto-calculated)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SCORE_TIERS.map((t) => (
                <div key={t.label} className="text-center">
                  <p className={`text-xs font-headline font-bold ${t.color}`}>
                    {t.label}
                  </p>
                  <p className="text-[9px] font-label text-on-surface-variant mt-0.5">
                    {t.range}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Barcode note */}
          <div className="flex items-start gap-2 bg-secondary/5 border border-secondary/10 rounded-lg p-3">
            <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5 flex-shrink-0">
              qr_code
            </span>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              A unique <span className="text-secondary font-medium">AGT-</span> barcode will be generated automatically upon creation.
            </p>
          </div>

          {/* Error */}
          {err && (
            <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-lg p-3">
              <span className="material-symbols-outlined text-[16px] text-error mt-0.5 flex-shrink-0">error</span>
              <p className="text-xs font-body text-error">{err}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-lg font-headline font-bold text-sm hover:bg-surface-bright transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !role || submitting}
              className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-lg font-headline font-bold text-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  Add Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
