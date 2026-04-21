"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getLibraryItems, deleteLibraryItem } from "@/lib/queries";
import { X, Copy, CheckCircle2, Trash2, Eye, Library, ImageIcon, Square, type LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type LibraryItem = {
  id:           string;
  user_id:      string;
  project_id:   string | null;
  title:        string | null;
  content_type: string;
  content:      string | null;
  file_url:     string | null;
  file_name:    string | null;
  tags:         string[];
  created_at:   string;
};

type FilterType = "all" | "text" | "image" | "video" | "file";

interface Props {
  userId: string;
}

// ─── Cleaners ─────────────────────────────────────────────────────────────────
function cleanTitle(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^=+\s*/gm, "")        // = أو ===== في بداية السطر
    .replace(/^#+\s*/gm, "")        // ## عناوين Markdown
    .replace(/\*{1,3}([^*]*)\*{1,3}/g, "$1")  // **bold** و*italic*
    .replace(/_{1,2}([^_]*)_{1,2}/g, "$1")     // __bold__ و_italic_
    .replace(/`([^`]*)`/g, "$1")    // `code`
    .replace(/~~([^~]*)~~/g, "$1")  // ~~strikethrough~~
    .replace(/\\n/g, " ")           // literal \n
    .replace(/\s+/g, " ")           // مسافات متعددة
    .trim();
}

function cleanPreview(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^=+\s*/gm, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*{1,3}([^*]*)\*{1,3}/g, "$1")
    .replace(/_{1,2}([^_]*)_{1,2}/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")  // إزالة code blocks
    .replace(/~~([^~]*)~~/g, "$1")
    .replace(/\\n/g, " ")           // literal \n → مسافة
    .replace(/\n+/g, " ")           // سطر جديد حقيقي → مسافة
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getTypeIconComponent(contentType: string): LucideIcon {
  if (contentType === "image") return ImageIcon;
  if (contentType === "video") return Square;
  if (contentType === "file")  return Square;
  return Square;
}

function getTypeLabel(contentType: string): string {
  if (contentType === "image") return "صورة";
  if (contentType === "video") return "فيديو";
  if (contentType === "file")  return "ملف";
  return "نص";
}

function getTypeBadgeColor(contentType: string): string {
  if (contentType === "image") return "bg-secondary/15 text-secondary";
  if (contentType === "video") return "bg-error/15 text-error";
  if (contentType === "file")  return "bg-primary/15 text-primary";
  return "bg-surface-container-high text-on-surface-variant";
}

// ─── ViewModal ────────────────────────────────────────────────────────────────
function ViewModal({ item, onClose }: { item: LibraryItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = item.title
      ? `${item.title}\n\n${item.content ?? ""}`
      : (item.content ?? "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant/10 flex-shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
              {getTypeLabel(item.content_type)} — {formatDate(item.created_at)}
            </span>
            {item.title && (
              <h2 className="font-headline text-xl font-bold text-on-surface mt-1 leading-snug">
                {item.title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {item.content_type === "image" ? (
            /* ── عرض الصورة ─────────────────────────────────────────────── */
            item.file_url ? (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.file_url}
                  alt={item.title || "preview"}
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-xl border border-outline-variant/10"
                />
                <p className="text-[10px] font-label text-on-surface-variant/60 text-center">
                  صورة مولّدة بالذكاء الاصطناعي
                </p>
              </div>
            ) : (
              <p className="text-on-surface-variant font-body text-sm">لا يوجد رابط للصورة.</p>
            )
          ) : item.content ? (
            /* ── عرض النص ───────────────────────────────────────────────── */
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
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-on-surface-variant font-body text-sm">لا يوجد محتوى.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-outline-variant/10 flex-shrink-0">
          <span className="font-label text-xs text-on-surface-variant">
            {item.content_type === "image" ? "صورة" : `${(item.content ?? "").length.toLocaleString()} حرف`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-2 rounded-lg font-headline font-bold text-xs transition-colors min-w-[90px] justify-center"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="text-secondary" size={15} />
                  تم النسخ ✓
                </>
              ) : (
                <>
                  <Copy size={15} />
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LibraryTab({ userId }: Props) {
  const [items,      setItems]      = useState<LibraryItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<FilterType>("all");
  const [viewItem,   setViewItem]   = useState<LibraryItem | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getLibraryItems(userId);
    setItems(data as LibraryItem[]);
    setLoading(false);
  }

  useEffect(() => {
    if (userId) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleDelete(id: string) {
    if (!window.confirm("هل تريد حذف هذا العنصر من المكتبة؟")) return;
    setDeleting(id);
    await deleteLibraryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleting(null);
  }

  // ─── Filter ────────────────────────────────────────────────────────────────
  const filtered = items.filter((item) => {
    if (filter === "all")   return true;
    if (filter === "text")  return item.content_type === "text";
    if (filter === "image") return item.content_type === "image";
    if (filter === "video") return item.content_type === "video";
    if (filter === "file")  return item.content_type === "file";
    return true;
  });

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "all",   label: "الكل"   },
    { key: "text",  label: "نصوص"   },
    { key: "image", label: "صور"    },
    { key: "video", label: "فيديو"  },
    { key: "file",  label: "ملفات"  },
  ];

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface-container-low rounded-xl p-5 h-44 animate-pulse" />
        ))}
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-surface-container-low p-1 rounded-xl w-fit flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg font-headline font-bold text-sm transition-all ${
              filter === f.key
                ? "bg-surface-container-high text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f.label}
            {f.key === "all" && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-label font-bold">
                {items.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6">
            <Library className="text-on-surface-variant" size={40} />
          </div>
          <h3 className="font-headline text-xl font-bold mb-2">المكتبة فارغة</h3>
          <p className="text-on-surface-variant font-body text-sm">
            {filter === "all"
              ? "لم تُحفظ أي عناصر في المكتبة بعد. قم بتشغيل مشروع لحفظ النتائج تلقائياً."
              : "لا توجد عناصر من هذا النوع."}
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const TypeIcon = getTypeIconComponent(item.content_type);
            return (
              <div
                key={item.id}
                className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-3 border border-outline-variant/5 hover:border-outline-variant/20 transition-all duration-200"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="text-primary" size={18} />
                    </div>
                    <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                      {cleanTitle(item.title) || "بدون عنوان"}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-error/60 hover:text-error hover:bg-error/10 transition-all disabled:opacity-40"
                    title="حذف"
                  >
                    {deleting === item.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>

                {/* Badge + date */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase tracking-wider ${getTypeBadgeColor(item.content_type)}`}>
                    {getTypeLabel(item.content_type)}
                  </span>
                  <span className="text-[10px] font-label text-on-surface-variant">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                {/* Preview (text only) */}
                {item.content_type === "text" && item.content && (() => {
                  const preview = cleanPreview(item.content);
                  return (
                    <p className="text-on-surface-variant text-xs font-body leading-relaxed line-clamp-3">
                      {preview.slice(0, 120)}{preview.length > 120 ? "..." : ""}
                    </p>
                  );
                })()}

                {/* Tags */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-surface-bright text-on-surface-variant rounded text-[9px] font-label uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* View button */}
                <button
                  onClick={() => setViewItem(item)}
                  className="mt-auto flex items-center justify-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-2 rounded-lg font-headline font-bold text-xs transition-colors w-full"
                >
                  <Eye size={15} />
                  عرض
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <ViewModal item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </>
  );
}
