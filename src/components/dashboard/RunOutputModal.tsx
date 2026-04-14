"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export type RunOutput = {
  title:   string;
  content: string;
};

interface Props {
  output:      RunOutput;
  projectName: string;
  onClose:     () => void;
}

/** تنظيف النص: إزالة = من بداية النص كله + من بداية كل سطر + تحويل \n literal */
function cleanContent(raw: string): string {
  return raw
    .replace(/^=+/, "")               // احذف = من بداية النص كاملاً (قبل أي شيء)
    .replace(/^=+\s*/gm, "")          // احذف = من بداية أي سطر
    .replace(/\\n/g, "\n")             // حوّل \n literal لسطر حقيقي
    .trim();
}

export default function RunOutputModal({ output, projectName, onClose }: Props) {
  const content = cleanContent(output.content);
  const title   = output.title.replace(/^=+\s*/, "").trim();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = title ? `${title}\n\n${content}` : content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant/10 flex-shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
              نتيجة التشغيل — {projectName}
            </span>
            {title && (
              <h2 className="font-headline text-xl font-bold text-on-surface mt-1 leading-snug">
                {title}
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

        {/* Content — scrollable markdown */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="prose prose-sm prose-invert max-w-none
            prose-headings:font-headline prose-headings:text-on-surface prose-headings:font-bold
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-p:text-on-surface/90 prose-p:leading-relaxed prose-p:font-body
            prose-strong:text-primary prose-strong:font-bold
            prose-em:text-on-surface-variant
            prose-code:text-secondary prose-code:bg-surface-container-high prose-code:px-1 prose-code:rounded prose-code:text-xs
            prose-pre:bg-surface-container-low prose-pre:rounded-xl prose-pre:border prose-pre:border-outline-variant/10
            prose-ul:text-on-surface/90 prose-ol:text-on-surface/90
            prose-li:marker:text-primary
            prose-blockquote:border-primary/40 prose-blockquote:text-on-surface-variant
            prose-hr:border-outline-variant/20
            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{content || "لا يوجد محتوى في الرد."}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/10 flex-shrink-0">
          <span className="font-label text-xs text-on-surface-variant">
            {content.length.toLocaleString()} حرف
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-4 py-2 rounded-lg font-headline font-bold text-xs transition-colors min-w-[80px] justify-center"
            >
              {copied ? (
                <>
                  <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  تم النسخ ✓
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  نسخ
                </>
              )}
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
