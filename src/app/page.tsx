import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "٧+",   label: "وكلاء AI" },
  { value: "٣+",   label: "لغات دعم" },
  { value: "١٤",   label: "يوم تجريبي مجاني" },
  { value: "٨٠٪+", label: "توفير في الوقت" },
];

const PROBLEMS = [
  {
    icon: "⏳",
    title: "كتابة المحتوى تأكل وقتك",
    body: "كل عميل يحتاج مقالات، بوستات، ونصوص — وفريقك يقضي ٥+ ساعات أسبوعياً لكل عميل واحد.",
  },
  {
    icon: "📋",
    title: "تقارير شهرية مملة ومرهقة",
    body: "تجميع الأرقام وتنسيق التقرير وإرساله لكل عميل يستنزف فريقك بدل التركيز على النمو.",
  },
  {
    icon: "💸",
    title: "SEO يحتاج متخصصاً بـ $1,500/شهر",
    body: "بحث الكلمات المفتاحية وتحليل المنافسين لكل عميل مكلف جداً — إلا مع وكيل AI متخصص.",
  },
];

const AGENTS = [
  { emoji: "📝", name: "Content Writer",  desc: "مقالات SEO باللغة التي تريد" },
  { emoji: "📱", name: "Social Media",    desc: "بوستات + صور AI لكل منصة" },
  { emoji: "🔍", name: "SEO Agent",       desc: "كلمات مفتاحية + خطة محتوى" },
  { emoji: "📊", name: "Monthly Report",  desc: "تقرير احترافي لعملائك" },
  { emoji: "🏆", name: "Market Research", desc: "تحليل منافسين شامل" },
  { emoji: "🎮", name: "Game Dev",        desc: "محتوى للألعاب والتطبيقات" },
  { emoji: "🎨", name: "Image Generator", desc: "صور AI احترافية" },
];

const STEPS = [
  {
    num: "١",
    title: "أضف عميلك",
    body: "اسم العميل + القطاع + النبرة — وكيل AI يتكيّف معه تلقائياً.",
  },
  {
    num: "٢",
    title: "اختر الوكيل",
    body: "Content / Social / SEO / Report — اضغط تشغيل وانتهى.",
  },
  {
    num: "٣",
    title: "احصل على النتائج",
    body: "المحتوى جاهز للنشر فوراً، بلغة عميلك ونبرته.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$99",
    per: "شهرياً",
    clients: "٣ عملاء",
    features: ["Content Writer", "Social Media Agent", "تقارير أساسية"],
    highlighted: false,
    badge: null,
  },
  {
    name: "Professional",
    price: "$249",
    per: "شهرياً",
    clients: "١٠ عملاء",
    features: ["كل الوكلاء السبعة", "Image Generator", "Monthly Report", "SEO Agent", "أولوية في الدعم"],
    highlighted: true,
    badge: "الأكثر شيوعاً",
  },
  {
    name: "Agency",
    price: "$499",
    per: "شهرياً",
    clients: "٣٠ عميل",
    features: ["كل شيء في Professional", "White-label التقارير", "Dedicated Account Manager", "API Access"],
    highlighted: false,
    badge: null,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-16">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 py-16">
          {/* Glow بنفسجي — أعلى يمين */}
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          {/* Glow سيان — أسفل يسار */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-label px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              🚀 الأداة #١ للوكالات العربية
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold leading-tight tracking-tight">
              فريق{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI كامل
              </span>
              <br />
              لوكالتك الرقمية
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-white/60 font-body max-w-2xl leading-relaxed">
              ٧ وكلاء AI يكتبون المحتوى، يصممون البوستات، يحللون SEO، ويولّدون التقارير
              —{" "}
              <span className="text-white/80">لكل عملائك من Dashboard واحد</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-headline font-bold text-base px-7 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.35)]"
              >
                ابدأ ١٤ يوم مجاناً
                <span className="text-lg">←</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-headline font-bold text-base px-7 py-3.5 rounded-xl transition-all"
              >
                شاهد كيف يعمل
                <span className="text-lg">▶</span>
              </a>
            </div>

            {/* Trust badge */}
            <p className="text-xs text-white/35 font-label mt-1">
              بدون بطاقة ائتمان &nbsp;•&nbsp; ١٤ يوم مجاناً &nbsp;•&nbsp; إلغاء في أي وقت
            </p>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <section id="features" className="py-14 border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-4xl font-headline font-bold text-white">
                  {value}
                </span>
                <span className="text-sm text-white/45 font-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY / PROBLEM ────────────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                لماذا تخسر وكالتك ساعات كل أسبوع؟
              </h2>
              <p className="text-white/50 font-body text-base max-w-xl mx-auto">
                المشاكل التي تحلّها AgentsNerator يومياً لوكالات مثلك
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {PROBLEMS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-4 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all"
                >
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-base font-headline font-bold text-white/90">{title}</h3>
                  <p className="text-sm text-white/50 font-body leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AGENTS ───────────────────────────────────────────────────── */}
        <section id="agents" className="py-20 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                الوكلاء{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  السبعة
                </span>
              </h2>
              <p className="text-white/50 font-body text-base max-w-xl mx-auto">
                كل وكيل متخصص في مهمة، وكلهم يعملون من Dashboard واحد
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {AGENTS.map(({ emoji, name, desc }) => (
                <div
                  key={name}
                  className="group bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-default"
                >
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-headline font-bold text-white/90 group-hover:text-purple-300 transition-colors">
                      {name}
                    </p>
                    <p className="text-xs text-white/45 font-body mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                ٣ خطوات فقط — ثم استرح
              </h2>
              <p className="text-white/50 font-body text-base">
                من التسجيل إلى أول محتوى في أقل من ٥ دقائق
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {STEPS.map(({ num, title, body }, i) => (
                <div key={num} className="relative flex flex-col gap-4">
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-0 w-full h-px bg-gradient-to-l from-white/0 via-white/10 to-white/0" />
                  )}
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center">
                    <span className="text-xl font-headline font-bold text-purple-400">{num}</span>
                  </div>
                  <h3 className="text-base font-headline font-bold text-white/90">{title}</h3>
                  <p className="text-sm text-white/50 font-body leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                باقات واضحة، بدون مفاجآت
              </h2>
              <p className="text-white/50 font-body text-base">
                ١٤ يوم تجريبي مجاني في كل باقة — بدون بطاقة ائتمان
              </p>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-6 items-start">
              {PLANS.map(({ name, price, per, clients, features, highlighted, badge }) => (
                <div
                  key={name}
                  className={`relative flex flex-col gap-6 rounded-2xl p-7 border transition-all w-full ${
                    highlighted
                      ? "bg-purple-500/5 border-purple-500/40 shadow-[0_0_40px_rgba(147,51,234,0.15)]"
                      : "bg-white/[0.03] border-white/8 hover:border-white/15"
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-headline font-bold px-3 py-1 rounded-full">
                      {badge}
                    </span>
                  )}

                  <div>
                    <p className="text-sm text-white/50 font-label mb-1">{name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-headline font-bold text-white">{price}</span>
                      <span className="text-sm text-white/40 font-label mb-1.5">{per}</span>
                    </div>
                    <p className="text-xs text-cyan-400 mt-1 font-label">{clients}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-body text-white/70">
                        <span className="text-cyan-400 text-base leading-none">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sign-up"
                    className={`mt-auto text-center font-headline font-bold text-sm py-3 rounded-xl transition-all ${
                      highlighted
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:brightness-110 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                        : "border border-white/15 text-white/80 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    ابدأ مجاناً
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-24 px-6 text-center relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-96 h-64 rounded-full bg-purple-600/15 blur-3xl" />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold leading-tight">
              جاهز تحوّل{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                وكالتك؟
              </span>
            </h2>
            <p className="text-white/55 font-body text-base max-w-md">
              انضم لوكالات MENA التي توفّر ٨٠٪ من وقت إنتاج المحتوى وتخدم عملاءها بجودة أعلى وتكلفة أقل.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-headline font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(147,51,234,0.35)]"
            >
              ابدأ ١٤ يوم مجاناً الآن
              <span className="text-xl">←</span>
            </Link>
            <p className="text-xs text-white/30 font-label">
              بدون بطاقة ائتمان &nbsp;•&nbsp; إلغاء في أي وقت
            </p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer dir="rtl" className="bg-[#07070b] border-t border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-base font-bold">
              <span className="text-white">Agents</span>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Nerator</span>
            </span>
            <p className="text-xs text-white/30 font-label">© 2026 — جميع الحقوق محفوظة</p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="https://x.com/agentsnerator"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/agentsnerator"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/agentsnerator"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors font-label">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors font-label">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
