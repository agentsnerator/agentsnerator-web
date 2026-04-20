import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "٧",   label: "وكلاء AI" },
  { value: "٣",   label: "لغات دعم" },
  { value: "١٤",  label: "يوم تجريبي مجاني" },
  { value: "٨٠٪", label: "توفير في الوقت" },
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
    <div dir="rtl" className="min-h-screen bg-[#0a0a0d] text-white overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-16">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />

          <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6">
            {/* Tag */}
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-label px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              مخصص لوكالات MENA الرقمية
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold leading-tight tracking-tight">
              فريق{" "}
              <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
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
                className="inline-flex items-center gap-2 bg-gradient-to-l from-primary to-primary-dim text-on-primary font-headline font-bold text-base px-7 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                ابدأ ١٤ يوم مجاناً
                <span className="text-lg">←</span>
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-headline font-bold text-base px-7 py-3.5 rounded-xl transition-all"
              >
                شاهد كيف يعمل
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </a>
            </div>

            {/* Badge */}
            <p className="text-xs text-white/35 font-label mt-1">
              بدون بطاقة ائتمان &nbsp;•&nbsp; ١٤ يوم مجاناً &nbsp;•&nbsp; إلغاء في أي وقت
            </p>
          </div>
        </section>

        {/* ── SOCIAL PROOF / STATS ─────────────────────────────────────── */}
        <section id="features" className="py-16 border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-4xl font-headline font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {value}
                </span>
                <span className="text-sm text-white/45 font-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY / PROBLEM ────────────────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                وكالتك تخسر ساعات كل أسبوع
              </h2>
              <p className="text-white/50 font-body text-base max-w-xl mx-auto">
                المشاكل التي تحلّها AgentsNerator يومياً لوكالات مثلك
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {PROBLEMS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="bg-surface-container border border-white/6 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/20 transition-colors"
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
        <section id="agents" className="py-24 px-6 bg-gradient-to-b from-transparent via-primary/3 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                الوكلاء{" "}
                <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
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
                  className="group bg-surface-container-high border border-white/6 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/25 hover:bg-surface-container transition-all cursor-default"
                >
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-headline font-bold text-white/90 group-hover:text-primary transition-colors">
                      {name}
                    </p>
                    <p className="text-xs text-white/45 font-body mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Coming soon filler */}
              <div className="bg-surface-container border border-dashed border-white/8 rounded-2xl p-5 flex flex-col gap-3 items-center justify-center text-center">
                <span className="text-2xl opacity-40">⚡</span>
                <p className="text-xs text-white/30 font-label">قريباً...</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                كيف يعمل؟
              </h2>
              <p className="text-white/50 font-body text-base">
                ٣ خطوات وفريقك AI جاهز للعمل
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {STEPS.map(({ num, title, body }, i) => (
                <div key={num} className="relative flex flex-col gap-4">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-0 w-full h-px bg-gradient-to-l from-white/0 via-white/10 to-white/0" />
                  )}
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/25 flex items-center justify-center">
                    <span className="text-xl font-headline font-bold text-primary">{num}</span>
                  </div>
                  <h3 className="text-base font-headline font-bold text-white/90">{title}</h3>
                  <p className="text-sm text-white/50 font-body leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
                باقات واضحة، بدون مفاجآت
              </h2>
              <p className="text-white/50 font-body text-base">
                ١٤ يوم تجريبي مجاني في كل باقة — بدون بطاقة ائتمان
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 items-start">
              {PLANS.map(({ name, price, per, clients, features, highlighted, badge }) => (
                <div
                  key={name}
                  className={`relative flex flex-col gap-6 rounded-2xl p-7 border transition-all ${
                    highlighted
                      ? "bg-gradient-to-b from-primary/8 to-secondary/4 border-primary/35 shadow-[0_0_50px_rgba(168,85,247,0.12)]"
                      : "bg-surface-container border-white/8 hover:border-white/15"
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-3 right-6 bg-gradient-to-l from-primary to-primary-dim text-on-primary text-xs font-headline font-bold px-3 py-1 rounded-full">
                      {badge}
                    </span>
                  )}

                  <div>
                    <p className="text-sm text-white/50 font-label mb-1">{name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-headline font-bold text-white">{price}</span>
                      <span className="text-sm text-white/40 font-label mb-1.5">{per}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1 font-label">{clients}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-body text-white/70">
                        <span className="text-secondary text-base leading-none">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sign-up"
                    className={`mt-auto text-center font-headline font-bold text-sm py-3 rounded-xl transition-all ${
                      highlighted
                        ? "bg-gradient-to-l from-primary to-primary-dim text-on-primary hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
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
        <section className="py-28 px-6 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/6 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-5xl font-headline font-bold leading-tight">
              جاهز تحوّل{" "}
              <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
                وكالتك؟
              </span>
            </h2>
            <p className="text-white/55 font-body text-base max-w-md">
              انضم لوكالات MENA التي تنتج محتوى أسرع، بجودة أعلى، بنصف التكلفة.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-gradient-to-l from-primary to-primary-dim text-on-primary font-headline font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(168,85,247,0.35)]"
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
      <footer dir="rtl" className="bg-[#080810] border-t border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/35 font-label">
            AgentsNerator © 2026 — جميع الحقوق محفوظة
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-white/35 hover:text-white/60 transition-colors font-label">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-white/35 hover:text-white/60 transition-colors font-label">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
