"use client";

import { useState, useRef, useEffect } from "react";

export type RunConfig = {
  topic:    string;
  keyword:  string;
  language: string;
};

interface Props {
  projectName: string;
  onConfirm:   (config: RunConfig) => void;
  onClose:     () => void;
}

const LANGUAGES = [
  { value: "Arabic",   label: "العربية",  flag: "🇸🇦" },
  { value: "English",  label: "English",   flag: "🇬🇧" },
  { value: "French",   label: "Français",  flag: "🇫🇷" },
  { value: "Spanish",  label: "Español",   flag: "🇪🇸" },
];

export default function RunConfigModal({ projectName, onConfirm, onClose }: Props) {
  const [topic,    setTopic]    = useState("");
  const [keyword,  setKeyword]  = useState("");
  const [language, setLanguage] = useState("Arabic");
  const topicRef = useRef<HTMLInputElement>(null);

  // Focus أول حقل عند الفتح
  useEffect(() => { topicRef.current?.focus(); }, []);

  const canSubmit = topic.trim().length > 0 && keyword.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirm({ topic: topic.trim(), keyword: keyword.trim(), language });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/10">
          <div>
            <p className="text-[10px] font-label text-secondary uppercase tracking-widest mb-0.5">
              {projectName}
            </p>
            <h2 className="font-headline text-lg font-bold text-on-surface">
              إعداد التشغيل
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-primary">topic</span>
              الموضوع
              <span className="text-error">*</span>
            </label>
            <input
              ref={topicRef}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: فوائد الذكاء الاصطناعي في التعليم"
              maxLength={200}
              className="w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm placeholder:text-on-surface-variant/40"
            />
          </div>

          {/* Keyword */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-secondary">key</span>
              الكلمة الدلالية
              <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="مثال: AI education"
              maxLength={100}
              className="w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-secondary/30 focus:ring-secondary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm placeholder:text-on-surface-variant/40"
            />
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">language</span>
              اللغة
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all duration-200 ${
                    language === lang.value
                      ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                      : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright py-3 rounded-xl font-headline font-bold text-sm transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-xl font-headline font-bold text-sm hover:shadow-[0_0_24px_rgba(219,144,255,0.35)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              تشغيل
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
