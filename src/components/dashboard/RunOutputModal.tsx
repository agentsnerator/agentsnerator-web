"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export type RunOutput = {
  title?:   string;
  content?: string;
  imageUrl?: string;
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
  const isImage = Boolean(output.imageUrl);
  const content = cleanContent(output.content ?? "");
  const title   = (output.title ?? "").replace(/^=+\s*/, "").trim();

  const [copied,      setCopied]      = useState(false);
  const [copiedText,  setCopiedText]  = useState(false);
  const [shareOpen,   setShareOpen]   = useState(false);
  const [downloadFmt, setDownloadFmt] = useState<"txt" | "md">("md");
  const [imgLoaded,   setImgLoaded]   = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    if (!shareOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);

  // ── نسخ النص أو الرابط (footer) ─────────────────────────────────────────
  function handleCopy() {
    const text = isImage
      ? (output.imageUrl ?? "")
      : (title ? `${title}\n\n${content}` : content);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── مشاركة: نسخ النص كاملاً من القائمة ───────────────────────────────────
  function handleShareCopy() {
    const text = title ? `${title}\n\n${content}` : content;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => { setCopiedText(false); setShareOpen(false); }, 1800);
  }

  // ── مشاركة: واتساب ───────────────────────────────────────────────────────
  function handleWhatsApp() {
    const preview = title
      ? `*${title}*\n\n${content.slice(0, 300)}${content.length > 300 ? "..." : ""}`
      : content.slice(0, 400);
    window.open(`https://wa.me/?text=${encodeURIComponent(preview)}`, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  // ── مشاركة: تويتر/X ──────────────────────────────────────────────────────
  function handleTwitter() {
    const preview = (title ? `${title}\n\n` : "") + content.slice(0, 200);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(preview)}`, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  // ── مشاركة: تيليغرام ─────────────────────────────────────────────────────
  function handleTelegram() {
    const preview = (title ? `${title}\n\n` : "") + content.slice(0, 200);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(preview)}`, "_blank", "noopener,noreferrer");
    setShareOpen(false);
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
          {isImage ? (
            /* ── وضع الصورة ─────────────────────────────────────────────── */
            <div className="flex flex-col items-center gap-3">
              {!imgLoaded && (
                <div className="w-full h-64 bg-surface-container-low rounded-xl animate-pulse flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
                    progress_activity
                  </span>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={output.imageUrl}
                alt={title || "Generated Image"}
                onLoad={() => setImgLoaded(true)}
                className={`w-full max-h-[55vh] object-contain rounded-xl border border-outline-variant/10 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
              />
              {imgLoaded && output.imageUrl && (
                <p className="text-[10px] font-mono text-on-surface-variant/40 break-all text-center px-2">
                  {output.imageUrl}
                </p>
              )}
            </div>
          ) : (
            /* ── وضع النص ───────────────────────────────────────────────── */
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
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-outline-variant/10 flex-shrink-0">

          {/* Row 1 — عداد + تنزيل */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-label text-xs text-on-surface-variant">
              {isImage ? "صورة مُولَّدة" : `${content.length.toLocaleString()} حرف`}
            </span>

            {isImage ? (
              /* تنزيل الصورة */
              <a
                href={output.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded-lg font-headline font-bold text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                تنزيل الصورة
              </a>
            ) : (
              /* تنزيل النص */
              <div className="flex items-center gap-1">
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
            )}
          </div>

          {/* Row 2 — مشاركة + نسخ + إغلاق */}
          <div className="flex items-center gap-2">

            {/* ── زر المشاركة مع Dropdown ─────────────────────────────── */}
            <div ref={shareRef} className="relative">
              <button
                onClick={() => setShareOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface px-3 py-2 rounded-lg font-headline font-bold text-xs transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">share</span>
                مشاركة
                <span className="material-symbols-outlined text-[13px]">
                  {shareOpen ? "expand_more" : "expand_less"}
                </span>
              </button>

              {/* القائمة — تظهر فوق الزر */}
              {shareOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-44 bg-surface-container-high border border-outline-variant/15 rounded-xl shadow-[0_-8px_30px_rgba(0,0,0,0.4)] overflow-hidden z-10">

                  {/* واتساب */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-bright transition-colors font-label text-sm text-on-surface"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.1 1.509 5.831L.057 23.985l6.305-1.435A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.732.85.882-3.626-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    واتساب
                  </button>

                  {/* تويتر / X */}
                  <button
                    onClick={handleTwitter}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-bright transition-colors font-label text-sm text-on-surface"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    تويتر / X
                  </button>

                  {/* تيليغرام */}
                  <button
                    onClick={handleTelegram}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-bright transition-colors font-label text-sm text-on-surface"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#2CA5E0] flex-shrink-0">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    تيليغرام
                  </button>

                  <div className="border-t border-outline-variant/10 mx-2" />

                  {/* نسخ النص كاملاً */}
                  <button
                    onClick={handleShareCopy}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-bright transition-colors font-label text-sm text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px] flex-shrink-0"
                      style={copiedText ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {copiedText ? "check_circle" : "content_copy"}
                    </span>
                    {copiedText ? "تم النسخ ✓" : "نسخ النص كاملاً"}
                  </button>

                </div>
              )}
            </div>

            <div className="flex-1" />

            {/* نسخ النص / الرابط */}
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
                  {isImage ? "نسخ الرابط" : "نسخ"}
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
