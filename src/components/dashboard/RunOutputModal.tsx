"use client";

export type RunOutput = {
  title:   string;
  content: string;
};

interface Props {
  output:    RunOutput;
  projectName: string;
  onClose:   () => void;
}

export default function RunOutputModal({ output, projectName, onClose }: Props) {
  function handleCopy() {
    const text = output.title
      ? `${output.title}\n\n${output.content}`
      : output.content;
    navigator.clipboard.writeText(text);
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant/10 flex-shrink-0">
          <div>
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
              نتيجة التشغيل — {projectName}
            </span>
            {output.title && (
              <h2 className="font-headline text-xl font-bold text-on-surface mt-1 leading-snug">
                {output.title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="font-body text-sm text-on-surface/90 leading-relaxed whitespace-pre-wrap">
            {output.content || "لا يوجد محتوى في الرد."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/10 flex-shrink-0">
          <span className="font-label text-xs text-on-surface-variant">
            {output.content.length.toLocaleString()} حرف
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-4 py-2 rounded-lg font-headline font-bold text-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              نسخ
            </button>
            <button
              onClick={onClose}
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-4 py-2 rounded-lg font-headline font-bold text-xs hover:shadow-[0_0_20px_rgba(219,144,255,0.3)] transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
