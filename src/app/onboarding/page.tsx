"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { upsertAgencyProfile, createProject } from "@/lib/queries";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm placeholder:text-on-surface-variant/40";
const selectCls =
  "w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 px-4 py-3 rounded-xl text-on-surface font-body text-sm";
const labelCls =
  "block font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5";

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    key:      "starter",
    name:     "Starter",
    price:    "$99",
    clients:  "٣ عملاء",
    features: ["Content Agent", "Social Media Agent", "مكتبة المحتوى"],
    accent:   "border-outline-variant/20 hover:border-secondary/40",
    badge:    null,
  },
  {
    key:      "professional",
    name:     "Professional",
    price:    "$249",
    clients:  "١٠ عملاء",
    features: ["كل وكلاء Starter", "SEO Agent", "Monthly Report Agent", "Image Generation"],
    accent:   "border-primary/50 hover:border-primary shadow-[0_0_40px_rgba(219,144,255,0.12)]",
    badge:    "الأكثر شيوعاً",
  },
  {
    key:      "agency",
    name:     "Agency",
    price:    "$499",
    clients:  "٣٠ عميل",
    features: ["كل شيء في Professional", "White-label", "API Access", "Priority Support"],
    accent:   "border-secondary/30 hover:border-secondary/60",
    badge:    null,
  },
];

export default function OnboardingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [step,       setStep]       = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Step 1
  const [agencyName,    setAgencyName]    = useState("");
  const [country,       setCountry]       = useState("السعودية");
  const [clientsCount,  setClientsCount]  = useState("1-5");

  // Step 2
  const [clientName,     setClientName]     = useState("");
  const [clientIndustry, setClientIndustry] = useState("");
  const [clientLanguage, setClientLanguage] = useState("Arabic");
  const [clientTone,     setClientTone]     = useState("professional");

  // Step 3
  const [selectedPlan, setSelectedPlan] = useState("professional");

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  // ── خطوة 1 → 2 ─────────────────────────────────────────────────────────────
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!agencyName.trim()) return;
    setStep(2);
  }

  // ── خطوة 2 → 3 ─────────────────────────────────────────────────────────────
  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim()) return;
    setStep(3);
  }

  // ── إنهاء Onboarding ─────────────────────────────────────────────────────────
  async function handleFinish(plan: string) {
    if (!user) return;
    setSelectedPlan(plan);
    setSubmitting(true);
    setError(null);

    console.log("Step 1: Starting onboarding completion");

    try {
      console.log("Step 2: Upserting agency profile...");
      const profileRes = await upsertAgencyProfile(user.id, agencyName.trim(), country, clientsCount);
      console.log("profileRes:", profileRes);

      console.log("Step 3: Creating project...");
      const projectRes = await createProject(
        clientName.trim(),
        clientIndustry.trim() ? `${clientIndustry.trim()} — ${clientTone} — ${clientLanguage}` : "",
        user.id,
        "",
      );
      console.log("projectRes:", projectRes);

      if (profileRes.error || projectRes.error) {
        const errMsg = profileRes.error ?? projectRes.error;
        console.error("Supabase error:", errMsg);
        setError(errMsg);
        setSubmitting(false);
        return;
      }
    } catch (e) {
      console.error("Supabase operations failed:", e);
      setError("حدث خطأ أثناء حفظ البيانات");
      setSubmitting(false);
      return;
    }

    console.log("Step 4: Calling complete-onboarding API...");
    try {
      const apiRes = await fetch("/api/complete-onboarding", { method: "POST" });
      const apiJson = await apiRes.json();
      console.log("complete-onboarding response:", apiJson);
    } catch (e) {
      console.error("complete-onboarding failed:", e);
      // redirect بغض النظر
    }

    console.log("Step 5: Redirecting to dashboard...");
    router.push("/dashboard");
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant/10">
        <Logo width={180} height={50} />
        <span className="text-[11px] font-label text-on-surface-variant uppercase tracking-widest">
          إعداد الوكالة
        </span>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      <div className="px-8 pt-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex-1 flex flex-col gap-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${
                  s < step  ? "bg-primary" :
                  s === step ? "bg-primary/60" :
                  "bg-surface-container-high"
                }`} />
                <span className={`text-[9px] font-label uppercase tracking-wider text-center transition-colors ${
                  s <= step ? "text-primary" : "text-on-surface-variant/40"
                }`}>
                  {s === 1 ? "وكالتك" : s === 2 ? "أول عميل" : "الباقة"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className={`w-full ${step === 3 ? "max-w-3xl" : "max-w-lg"}`}>

          {/* ══ Step 1 ══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="bg-surface-container rounded-2xl border border-outline-variant/10 p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div>
                <p className="text-[10px] font-label text-secondary uppercase tracking-widest mb-1">خطوة ١ من ٣</p>
                <h1 className="font-headline text-3xl font-bold">مرحباً بوكالتك 🚀</h1>
                <p className="text-on-surface-variant font-body text-sm mt-2">
                  أخبرنا عن وكالتك لنُعِدّ المنصة لك.
                </p>
              </div>

              <div>
                <label className={labelCls}>اسم الوكالة <span className="text-error">*</span></label>
                <input
                  autoFocus
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="مثال: وكالة إبداع الرقمية"
                  maxLength={100}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>الدولة <span className="text-error">*</span></label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
                    {["السعودية", "الإمارات", "مصر", "المغرب", "الكويت", "قطر", "البحرين", "الأردن", "أخرى"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>عدد عملائك تقريباً</label>
                  <select value={clientsCount} onChange={(e) => setClientsCount(e.target.value)} className={selectCls}>
                    {["1-5", "6-15", "16-30", "30+"].map((c) => (
                      <option key={c} value={c}>{c} عملاء</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!agencyName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3.5 rounded-xl font-headline font-bold hover:shadow-[0_0_30px_rgba(219,144,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                التالي
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* ══ Step 2 ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="bg-surface-container rounded-2xl border border-outline-variant/10 p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div>
                <p className="text-[10px] font-label text-secondary uppercase tracking-widest mb-1">خطوة ٢ من ٣</p>
                <h1 className="font-headline text-3xl font-bold">أضف أول عميل ✨</h1>
                <p className="text-on-surface-variant font-body text-sm mt-2">
                  سيُنشأ له مشروع في الـ Dashboard تلقائياً.
                </p>
              </div>

              <div>
                <label className={labelCls}>اسم العميل <span className="text-error">*</span></label>
                <input
                  autoFocus
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: مطعم ليلى"
                  maxLength={100}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>القطاع</label>
                <input
                  type="text"
                  value={clientIndustry}
                  onChange={(e) => setClientIndustry(e.target.value)}
                  placeholder="مثال: مطاعم، عقارات، تقنية..."
                  maxLength={80}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>اللغة</label>
                  <select value={clientLanguage} onChange={(e) => setClientLanguage(e.target.value)} className={selectCls}>
                    <option value="Arabic">🇸🇦 العربية</option>
                    <option value="English">🇬🇧 English</option>
                    <option value="French">🇫🇷 Français</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>النبرة</label>
                  <select value={clientTone} onChange={(e) => setClientTone(e.target.value)} className={selectCls}>
                    <option value="professional">احترافي</option>
                    <option value="friendly">ودي</option>
                    <option value="luxury">فاخر</option>
                    <option value="casual">كاجوال</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright py-3 rounded-xl font-headline font-bold text-sm transition-all"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={!clientName.trim()}
                  className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-xl font-headline font-bold hover:shadow-[0_0_30px_rgba(219,144,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالي
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* ══ Step 3 ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-[10px] font-label text-secondary uppercase tracking-widest mb-1">خطوة ٣ من ٣</p>
                <h1 className="font-headline text-3xl font-bold">اختر باقتك 🎯</h1>
                <p className="text-on-surface-variant font-body text-sm mt-2">
                  ١٤ يوم مجاناً — لا يُطلب منك بطاقة ائتمان الآن.
                </p>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-error text-sm font-body text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANS.map((plan) => (
                  <div
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className={`relative bg-surface-container rounded-2xl border-2 p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 ${plan.accent} ${
                      selectedPlan === plan.key ? "ring-2 ring-primary/60" : ""
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-on-primary rounded-full text-[10px] font-label font-bold uppercase tracking-wider whitespace-nowrap">
                        {plan.badge}
                      </div>
                    )}

                    {/* Plan name + price */}
                    <div>
                      <h3 className="font-headline text-xl font-bold mb-1">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline text-3xl font-bold text-primary">{plan.price}</span>
                        <span className="text-on-surface-variant text-xs font-label">/شهر</span>
                      </div>
                      <p className="text-secondary text-xs font-label mt-1">{plan.clients}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs font-body text-on-surface/90">
                          <CheckCircle2 className="text-green-400 flex-shrink-0" size={14} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFinish(plan.key); }}
                      disabled={submitting}
                      className={`w-full py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.key === "professional"
                          ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary hover:shadow-[0_0_24px_rgba(219,144,255,0.35)]"
                          : "bg-surface-container-high text-on-surface hover:bg-surface-bright"
                      }`}
                    >
                      {submitting && selectedPlan === plan.key ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          جارٍ الإعداد...
                        </span>
                      ) : (
                        "ابدأ مجاناً ١٤ يوم"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-on-surface-variant hover:text-on-surface text-sm font-label transition-colors"
                >
                  ← رجوع
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="px-8 py-5 border-t border-outline-variant/10 flex items-center justify-between">
        <span className="text-[10px] font-label text-on-surface-variant/40">
          © 2026 AgentsNerator
        </span>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[11px] font-label text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
        >
          تخطي الإعداد →
        </button>
      </div>

    </div>
  );
}
