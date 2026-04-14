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

// ─── تنظيف النص ───────────────────────────────────────────────────────────────
function cleanContent(raw: string): string {
  return raw
    // 1. إزالة = من بداية النص وبداية كل سطر
    .replace(/^=+/, "")
    .replace(/^=+\s*/gm, "")
    // 2. تحويل \n literal لسطر حقيقي
    .replace(/\\n/g, "\n")
    // 3. حذف روابط وهمية مثل (https://example.com) أو [text](https://example.com)
    .replace(/\[([^\]]*)\]\(https?:\/\/example\.[^\)]*\)/g, "$1")
    .replace(/\(https?:\/\/example\.[^\)]*\)/g, "")
    .replace(/https?:\/\/example\.[^\s)>\]"]*/g, "")
    // 4. حذف كلمات إنجليزية منفردة بشكل غريب في منتصف نص عربي (مثل DRAW أو PLACEHOLDER)
    .replace(/\b(DRAW|PLACEHOLDER|LOREM|IPSUM|TODO|FIXME|NULL|UNDEFINED)\b/gi, "")
    // 5. تنظيف رموز غريبة متكررة (مثل *** أو ___ أو ~~~ خارج Markdown)
    .replace(/(\*{4,}|_{4,}|~{3,})/g, "")
    // 6. تنظيف مسافات زائدة ناتجة عن الحذف
    .replace(/[ \t]{3,}/g, "  ")
    // 7. لا تترك أكثر من سطرين فارغين متتاليين
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── توليد اسم الملف ──────────────────────────────────────────────────────────
function makeFilename(projectName: string, ext: "txt" | "md"): string {
  const date  = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const safe  = projectName.replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-").slice(0, 40);
  return `${safe}-${date}.${ext}`;
}

export default function RunOutputModal({ output, projectName, onClose }: Props) {
  const content = cleanContent(output.content);
  const title   = output.title.replace(/^=+\s*/, "").trim();

  const [copied,       setCopied]       = useState(false);
  const [copiedLink,   setCopiedLink]   = useState(false);
  const [downloadFmt,  setDownloadFmt]  = useState<"txt" | "md">("md");

  // ── نسخ النص ──────────────────────────────────────────────────────────────
  function handleCopy() {
    const text = title ? `${title}\n\n${content}` : content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── نسخ الرابط الحالي ────────────────────────────────────────────────────
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  // ── تنزيل الملف ──────────────────────────────────────────────────────────
  function handleDownload(ext: "txt" | "md") {
    const fullText = title ? `# ${title}\n\n${content}` : content;
    const blob     = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement("a");
    a.href         = url;
    a.download     = makeFilename(projectName, ext);
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── مشاركة واتساب ────────────────────────────────────────────────────────
  function handleWhatsApp() {
    const preview = title
      ? `*${title}*\n\n${content.slice(0, 300)}${content.length > 300 ? "..." : ""}`
      : content.slice(0, 400);
    const url = `https://wa.me/?text=${encodeURIComponent(preview)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
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

        {/* ── Content ─────────────────────────────────────────────────────── */}
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

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-outline-variant/10 flex-shrink-0">

          {/* Row 1 — عداد + تنزيل */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-label text-xs text-on-surface-variant">
              {content.length.toLocaleString()} حرف
            </span>

            {/* تنزيل */}
            <div className="flex items-center gap-1">
              {/* اختيار الصيغة */}
              <div className="flex rounded-lg overflow-hidden ring-1 ring-white/10">
                {(["md", "txt"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setDownloadFmt(fmt)}
                    className={`px-2.5 py-1.5 font-label text-xs transition-colors ${
                      downloadFmt === fmt
                        ? "bg-primary/20 text-primary font-bold"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleDownload(downloadFmt)}
                className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded-lg font-headline font-bold text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                تنزيل
              </button>
            </div>
          </div>

          {/* Row 2 — مشاركة + نسخ + إغلاق */}
          <div className="flex items-center gap-2">

            {/* نسخ الرابط */}
            <button
              onClick={handleCopyLink}
              title="نسخ رابط الصفحة"
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-lg font-headline font-bold text-xs transition-all min-w-[100px] justify-center"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copiedLink ? "check" : "link"}
              </span>
              {copiedLink ? "تم النسخ" : "نسخ الرابط"}
            </button>

            {/* واتساب */}
            <button
              onClick={handleWhatsApp}
              title="مشاركة عبر واتساب"
              className="flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-2 rounded-lg font-headline font-bold text-xs transition-all border border-[#25D366]/20"
            >
              {/* WhatsApp SVG icon */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.1 1.509 5.831L.057 23.985l6.305-1.435A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.732.85.882-3.626-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              واتساب
            </button>

            <div className="flex-1" />

            {/* نسخ النص */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-2 rounded-lg font-headline font-bold text-xs transition-colors min-w-[90px] justify-center"
            >
              {copied ? (
                <>
                  <span className="material-symbols-outlined text-[15px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  تم النسخ ✓
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  نسخ
                </>
              )}
            </button>

            {/* إغلاق */}
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
