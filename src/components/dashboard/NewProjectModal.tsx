"use client";

import { useState } from "react";
import { X, Info, AlertCircle, Plus } from "lucide-react";

type Props = {
  onClose:   () => void;
  onCreated?: () => void;
};

export default function NewProjectModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setErr(null);

    const { createProject } = await import("@/lib/queries");
    const { error } = await createProject(name.trim(), description.trim());

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-container rounded-xl border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest block mb-1">
              New Project
            </span>
            <h2 className="font-headline text-2xl font-bold">
              Initialize Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Project Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Content Production"
              maxLength={50}
              required
              className="bg-surface-container-low border-none outline-none focus:border-b-2 focus:border-secondary px-4 py-3 text-sm rounded-lg text-on-surface placeholder:text-white/30 transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
              Description{" "}
              <span className="text-outline normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this project's agent team do?"
              rows={3}
              maxLength={200}
              className="bg-surface-container-low border-none outline-none focus:border-b-2 focus:border-secondary px-4 py-3 text-sm rounded-lg text-on-surface placeholder:text-white/30 resize-none transition-all"
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-lg p-3">
            <Info className="text-primary mt-0.5 flex-shrink-0" size={16} />
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              After creation, you'll assign a{" "}
              <span className="text-primary font-medium">CEO Agent</span> to
              orchestrate the team. Sub-agents can be added at any time.
            </p>
          </div>

          {/* Error */}
          {err && (
            <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-lg p-3">
              <AlertCircle className="text-error mt-0.5 flex-shrink-0" size={16} />
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
              disabled={!name.trim() || submitting}
              className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-lg font-headline font-bold text-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
