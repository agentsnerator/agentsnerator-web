import Link from "next/link";
import Logo from "@/components/Logo";

export default function HeroSection() {
  return (
    <section className="relative min-h-[921px] flex items-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left — Copy */}
        <div className="lg:col-span-7 z-10">
          {/* Logo */}
          <div className="mb-8">
            <Logo width={300} height={68} />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-surface-bright text-on-surface rounded-sm text-xs font-label uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#00eefc]" />
            Next-Gen Neural Marketplace
          </span>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[0.9] tracking-tighter mb-8">
            Buy, Sell &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">
              Rent AI
            </span>{" "}
            Agents
          </h1>

          {/* Sub-copy */}
          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-body leading-relaxed mb-10">
            The premiere destination for high-performance AI agents. Secure,
            verified, and ready to deploy into your ecosystem as digital assets.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="/marketplace">
              <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-10 py-4 rounded-lg font-headline font-bold text-lg tracking-tight hover:shadow-[0_0_30px_rgba(219,144,255,0.3)] transition-all active:scale-95">
                Explore Marketplace
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="bg-surface-container-highest text-secondary border border-outline-variant/15 px-10 py-4 rounded-lg font-headline font-bold text-lg tracking-tight hover:bg-surface-container transition-all active:scale-95">
                Mint Agent
              </button>
            </Link>
          </div>
        </div>

        {/* Right — Visual Monolith */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-2xl border border-white/5">
            {/* Placeholder visual — replace with actual image */}
            <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-dim flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(219,144,255,0.2)]">
                  <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
                  AI Agent Network
                </p>
              </div>
            </div>
            {/* Fade overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            {/* Info card */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-label text-secondary uppercase tracking-widest mb-1">
                    Active Asset
                  </p>
                  <h3 className="text-xl font-headline font-bold">
                    Project NEURAL-X
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-label text-on-surface-variant mb-1">
                    Floor Price
                  </p>
                  <p className="text-lg font-headline font-bold text-primary">
                    2.45 Neutrons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
