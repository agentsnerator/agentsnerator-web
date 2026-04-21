"use client";

import { useState, useRef, useEffect } from "react";
import { X, FileText, KeyRound, Globe, PlayCircle } from "lucide-react";

export type RunConfig = {
  language:           string;
  // Standard agent
  topic?:             string;
  keyword?:           string;
  // Social media agent
  client_name?:       string;
  brand_description?: string;
  platform?:          string;
  occasion?:          string;
  tone?:              string;
  industry?:          string;
  post_count?:        string;
  extra_info?:        string;
  // Monthly Report agent
  month?:             string;
  posts_count?:       string;
  articles_count?:    string;
  images_count?:      string;
  achievements?:      string;
  challenges?:        string;
  goals_next_month?:  string;
  // SEO agent
  website_url?:       string;
  target_keywords?:   string;
  competitors?:       string;
  target_country?:    string;
};

interface Props {
  projectName: string;
  webhookUrl:  string | null;
  onConfirm:   (config: RunConfig) => void;
  onClose:     () => void;
}

type Mode = "standard" | "social" | "report" | "seo";

const LANGUAGES = [
  { value: "Arabic",  label: "العربية", flag: "🇸🇦" },
  { value: "English", label: "English",  flag: "🇬🇧" },
  { value: "French",  label: "Français", flag: "🇫🇷" },
  { value: "Spanish", label: "Español",  flag: "🇪🇸" },
];

const PLATFORMS = [
  { value: "Instagram", label: "Instagram", icon: "📸" },
  { value: "Facebook",  label: "Facebook",  icon: "📘" },
  { value: "Twitter",   label: "Twitter/X", icon: "🐦" },
  { value: "LinkedIn",  label: "LinkedIn",  icon: "💼" },
];

const OCCASIONS = [
  "عادي", "رمضان", "عيد", "عرض خاص", "يوم وطني",
];

const TONES = [
  { value: "professional", label: "احترافي" },
  { value: "friendly",     label: "ودي"     },
  { value: "luxury",       label: "فاخر"    },
  { value: "casual",       label: "كاجوال"  },
];

const POST_COUNTS = ["3", "5", "10"];

// ─── Shared field styles ───────────────────────────────────────────────────────
const inputCls = "w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm placeholder:text-on-surface-variant/40";
const selectCls = "w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm";
const labelCls = "block font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5";

export default function RunConfigModal({ projectName, webhookUrl, onConfirm, onClose }: Props) {
  const mode: Mode = webhookUrl?.includes("seo-agent")    ? "seo"
    : webhookUrl?.includes("report-agent") ? "report"
    : webhookUrl?.includes("social-agent") ? "social"
    : "standard";

  // ── Standard fields ──────────────────────────────────────────────────────
  const [topic,    setTopic]    = useState("");
  const [keyword,  setKeyword]  = useState("");

  // ── Social fields ────────────────────────────────────────────────────────
  const [clientName,       setClientName]       = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [platform,         setPlatform]         = useState("Instagram");
  const [occasion,         setOccasion]         = useState("عادي");
  const [tone,             setTone]             = useState("professional");
  const [industry,         setIndustry]         = useState("");
  const [postCount,        setPostCount]        = useState("5");
  const [extraInfo,        setExtraInfo]        = useState("");

  // ── Report fields ────────────────────────────────────────────────────────
  const [reportClient,    setReportClient]    = useState("");
  const [month,           setMonth]           = useState("");
  const [reportIndustry,  setReportIndustry]  = useState("");
  const [postsCount,      setPostsCount]      = useState("");
  const [articlesCount,   setArticlesCount]   = useState("");
  const [imagesCount,     setImagesCount]     = useState("");
  const [achievements,    setAchievements]    = useState("");
  const [challenges,      setChallenges]      = useState("");
  const [goalsNextMonth,  setGoalsNextMonth]  = useState("");

  // ── SEO fields ───────────────────────────────────────────────────────────
  const [seoClient,       setSeoClient]       = useState("");
  const [websiteUrl,      setWebsiteUrl]      = useState("");
  const [seoIndustry,     setSeoIndustry]     = useState("");
  const [targetKeywords,  setTargetKeywords]  = useState("");
  const [competitors,     setCompetitors]     = useState("");
  const [targetCountry,   setTargetCountry]   = useState("");

  // ── Common ───────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState("Arabic");
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const canSubmit =
    mode === "social"  ? clientName.trim().length > 0 :
    mode === "report"  ? reportClient.trim().length > 0 && month.trim().length > 0 :
    mode === "seo"     ? seoClient.trim().length > 0 && seoIndustry.trim().length > 0 :
    topic.trim().length > 0 && keyword.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (mode === "social") {
      onConfirm({
        language,
        client_name:       clientName.trim(),
        brand_description: brandDescription.trim(),
        platform, occasion, tone,
        industry:          industry.trim(),
        post_count:        postCount,
        extra_info:        extraInfo.trim(),
      });
    } else if (mode === "report") {
      onConfirm({
        language,
        client_name:      reportClient.trim(),
        month:            month.trim(),
        industry:         reportIndustry.trim(),
        posts_count:      postsCount,
        articles_count:   articlesCount,
        images_count:     imagesCount,
        achievements:     achievements.trim(),
        challenges:       challenges.trim(),
        goals_next_month: goalsNextMonth.trim(),
      });
    } else if (mode === "seo") {
      onConfirm({
        language,
        client_name:     seoClient.trim(),
        website_url:     websiteUrl.trim(),
        industry:        seoIndustry.trim(),
        target_keywords: targetKeywords.trim(),
        competitors:     competitors.trim(),
        target_country:  targetCountry.trim(),
      });
    } else {
      onConfirm({ topic: topic.trim(), keyword: keyword.trim(), language });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-container rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-outline-variant/10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/10 flex-shrink-0">
          <div>
            <p className="text-[10px] font-label text-secondary uppercase tracking-widest mb-0.5">
              {projectName}
            </p>
            <h2 className="font-headline text-lg font-bold text-on-surface">
              {mode === "social" ? "إعداد البوستات" : mode === "report" ? "التقرير الشهري" : mode === "seo" ? "تحليل SEO" : "إعداد التشغيل"}
            </h2>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

          {mode === "social" ? (
            /* ── Social Media Fields ─────────────────────────────────── */
            <>
              {/* client_name */}
              <div>
                <label className={labelCls}>
                  اسم العميل <span className="text-error">*</span>
                </label>
                <input ref={firstRef} type="text" value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: مطعم ليلى"
                  maxLength={100} className={inputCls}
                />
              </div>

              {/* brand_description */}
              <div>
                <label className={labelCls}>وصف البراند</label>
                <textarea value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="صف البراند ونشاطه التجاري باختصار..."
                  rows={3} maxLength={500}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* platform */}
              <div>
                <label className={labelCls}>المنصة</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p.value} type="button"
                      onClick={() => setPlatform(p.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all ${
                        platform === p.value
                          ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                          : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                      }`}
                    >
                      <span>{p.icon}</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* occasion + tone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>المناسبة</label>
                  <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={selectCls}>
                    {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>النبرة</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className={selectCls}>
                    {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* industry + post_count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>القطاع</label>
                  <input type="text" value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="مثال: مطاعم"
                    maxLength={80} className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>عدد البوستات</label>
                  <select value={postCount} onChange={(e) => setPostCount(e.target.value)} className={selectCls}>
                    {POST_COUNTS.map((n) => <option key={n} value={n}>{n} بوستات</option>)}
                  </select>
                </div>
              </div>

              {/* language */}
              <div>
                <label className={labelCls}>اللغة</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.value} type="button"
                      onClick={() => setLanguage(lang.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all ${
                        language === lang.value
                          ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                          : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>{lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* extra_info */}
              <div>
                <label className={labelCls}>معلومات إضافية</label>
                <textarea value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  placeholder="أي تفاصيل إضافية تريد مراعاتها..."
                  rows={2} maxLength={300}
                  className={inputCls + " resize-none"}
                />
              </div>
            </>
          ) : mode === "report" ? (
            /* ── Monthly Report Fields ───────────────────────────────── */
            <>
              {/* client_name */}
              <div>
                <label className={labelCls}>اسم العميل <span className="text-error">*</span></label>
                <input ref={firstRef} type="text" value={reportClient}
                  onChange={(e) => setReportClient(e.target.value)}
                  placeholder="مثال: شركة النجاح"
                  maxLength={100} className={inputCls}
                />
              </div>

              {/* month + industry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>الشهر <span className="text-error">*</span></label>
                  <input type="text" value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="أبريل 2026"
                    maxLength={30} className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>القطاع</label>
                  <input type="text" value={reportIndustry}
                    onChange={(e) => setReportIndustry(e.target.value)}
                    placeholder="مثال: تقنية"
                    maxLength={60} className={inputCls}
                  />
                </div>
              </div>

              {/* counts row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>البوستات</label>
                  <input type="number" min="0" value={postsCount}
                    onChange={(e) => setPostsCount(e.target.value)}
                    placeholder="0" className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>المقالات</label>
                  <input type="number" min="0" value={articlesCount}
                    onChange={(e) => setArticlesCount(e.target.value)}
                    placeholder="0" className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>الصور</label>
                  <input type="number" min="0" value={imagesCount}
                    onChange={(e) => setImagesCount(e.target.value)}
                    placeholder="0" className={inputCls}
                  />
                </div>
              </div>

              {/* achievements */}
              <div>
                <label className={labelCls}>أبرز الإنجازات</label>
                <textarea value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="ما الذي حققناه هذا الشهر..."
                  rows={3} maxLength={600}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* challenges */}
              <div>
                <label className={labelCls}>التحديات</label>
                <textarea value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="ما هي التحديات التي واجهناها..."
                  rows={2} maxLength={400}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* goals_next_month */}
              <div>
                <label className={labelCls}>أهداف الشهر القادم</label>
                <textarea value={goalsNextMonth}
                  onChange={(e) => setGoalsNextMonth(e.target.value)}
                  placeholder="ما الذي نسعى لتحقيقه..."
                  rows={2} maxLength={400}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* language */}
              <div>
                <label className={labelCls}>لغة التقرير</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.value} type="button"
                      onClick={() => setLanguage(lang.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all ${
                        language === lang.value
                          ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                          : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>{lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : mode === "seo" ? (
            /* ── SEO Fields ──────────────────────────────────────────── */
            <>
              {/* client_name + industry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>اسم العميل <span className="text-error">*</span></label>
                  <input ref={firstRef} type="text" value={seoClient}
                    onChange={(e) => setSeoClient(e.target.value)}
                    placeholder="مثال: شركة ريادة"
                    maxLength={100} className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>القطاع <span className="text-error">*</span></label>
                  <input type="text" value={seoIndustry}
                    onChange={(e) => setSeoIndustry(e.target.value)}
                    placeholder="مثال: عقارات"
                    maxLength={60} className={inputCls}
                  />
                </div>
              </div>

              {/* website_url + target_country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>رابط الموقع</label>
                  <input type="url" value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    maxLength={200} className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>الدولة المستهدفة</label>
                  <input type="text" value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    placeholder="السعودية"
                    maxLength={60} className={inputCls}
                  />
                </div>
              </div>

              {/* target_keywords */}
              <div>
                <label className={labelCls}>الكلمات المفتاحية الحالية</label>
                <textarea value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  placeholder="كل كلمة أو عبارة في سطر منفصل..."
                  rows={3} maxLength={600}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* competitors */}
              <div>
                <label className={labelCls}>المنافسون (URLs)</label>
                <textarea value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="https://competitor1.com&#10;https://competitor2.com"
                  rows={3} maxLength={500}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* language */}
              <div>
                <label className={labelCls}>لغة التقرير</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.value} type="button"
                      onClick={() => setLanguage(lang.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all ${
                        language === lang.value
                          ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                          : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>{lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── Standard Fields ─────────────────────────────────────── */
            <>
              {/* Topic */}
              <div>
                <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5">
                  <FileText className="text-primary" size={14} />
                  الموضوع <span className="text-error">*</span>
                </label>
                <input ref={firstRef} type="text" value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: فوائد الذكاء الاصطناعي في التعليم"
                  maxLength={200} className={inputCls}
                />
              </div>

              {/* Keyword */}
              <div>
                <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5">
                  <KeyRound className="text-secondary" size={14} />
                  الكلمة الدلالية <span className="text-error">*</span>
                </label>
                <input type="text" value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="مثال: AI education"
                  maxLength={100} className={inputCls}
                />
              </div>

              {/* Language */}
              <div>
                <label className="flex items-center gap-1.5 font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5">
                  <Globe className="text-on-surface-variant" size={14} />
                  اللغة
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.value} type="button"
                      onClick={() => setLanguage(lang.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label text-sm transition-all ${
                        language === lang.value
                          ? "bg-primary/15 ring-1 ring-primary/60 text-primary font-bold"
                          : "bg-surface-container-high ring-1 ring-white/10 text-on-surface-variant hover:ring-white/20 hover:text-on-surface"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>{lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright py-3 rounded-xl font-headline font-bold text-sm transition-all"
            >
              إلغاء
            </button>
            <button type="submit" disabled={!canSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-xl font-headline font-bold text-sm hover:shadow-[0_0_24px_rgba(219,144,255,0.35)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PlayCircle size={18} />
              تشغيل
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
