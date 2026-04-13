import Link from "next/link";

interface AgentBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "outline";
}

function AgentBadge({ label, variant = "primary" }: AgentBadgeProps) {
  const styles = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary/20 text-secondary",
    outline: "bg-outline text-white",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-sm text-[10px] font-label font-bold uppercase tracking-widest ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export default function EliteAgentsSection() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">
              Elite Agents
            </h2>
            <p className="text-on-surface-variant font-body text-lg">
              Curated high-performance models from top engineering squads.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-primary font-headline font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            View All Collections{" "}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[700px]">
          {/* Main Feature — col-span-2 row-span-2 */}
          <div className="md:col-span-2 md:row-span-2 bg-surface-container rounded-lg p-8 relative overflow-hidden group border border-transparent hover:border-primary/20 transition-all cursor-pointer">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container to-secondary/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent" />
            <div className="relative h-full flex flex-col justify-end">
              <div className="flex gap-2 mb-4 flex-wrap">
                <AgentBadge label="Master 98" variant="primary" />
                <AgentBadge label="Autonomous" variant="secondary" />
                <AgentBadge label="Multi-Modal" variant="secondary" />
              </div>
              <p className="text-[10px] font-label font-mono text-white/40 mb-1">
                AGT-CSP-001
              </p>
              <h3 className="text-3xl font-headline font-bold mb-3">
                Cyber-Scribe Prime
              </h3>
              <p className="text-on-surface-variant font-body mb-6 max-w-sm">
                Advanced semantic reasoning agent specializing in complex
                technical documentation and strategic analysis.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-headline font-bold text-white">
                  4.2 Neutrons
                </span>
                <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform">
                  Collect
                </button>
              </div>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="bg-surface-container rounded-lg p-6 flex flex-col justify-between border border-transparent hover:border-secondary/20 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-4 relative">
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-secondary text-on-secondary-fixed rounded-sm text-[8px] font-label font-bold uppercase">
                Expert 82
              </span>
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
            <div>
              <p className="text-[8px] font-label font-mono text-white/30 mb-0.5">
                AGT-ATV3-042
              </p>
              <h4 className="text-lg font-headline font-bold mb-2">
                Alpha Trader V3
              </h4>
              <p className="text-on-surface-variant text-sm font-body mb-4">
                Real-time market sentiment analysis and high-frequency
                execution.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-sm font-label text-on-surface">
                  Floor: 1.2 USDT
                </span>
                <span className="text-xs text-green-400 font-label">+14%</span>
              </div>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="bg-surface-container rounded-lg p-6 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-4 relative">
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-outline text-white rounded-sm text-[8px] font-label font-bold uppercase">
                Skilled 64
              </span>
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                code
              </span>
            </div>
            <div>
              <p className="text-[8px] font-label font-mono text-white/30 mb-0.5">
                AGT-CA-109
              </p>
              <h4 className="text-lg font-headline font-bold mb-2">
                CodeArchitect
              </h4>
              <p className="text-on-surface-variant text-sm font-body mb-4">
                Full-stack autonomous developer agent for legacy refactoring.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-sm font-label text-on-surface">
                  Floor: 0.8 USDT
                </span>
                <span className="text-xs text-secondary font-label">
                  Trending
                </span>
              </div>
            </div>
          </div>

          {/* Wide Feature — col-span-2 */}
          <div className="md:col-span-2 bg-surface-container rounded-lg p-6 flex gap-6 items-center border border-transparent hover:border-secondary/20 transition-all overflow-hidden relative cursor-pointer">
            {/* Avatar placeholder */}
            <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-surface-dim flex items-center justify-center border border-white/5">
              <span
                className="material-symbols-outlined text-5xl text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary">
                  verified_user
                </span>
                <span className="text-[10px] font-label text-tertiary uppercase tracking-tighter">
                  Verified Creator
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 bg-primary/30 text-primary rounded-sm text-[8px] font-label font-bold uppercase">
                  Master 95
                </span>
                <span className="text-[8px] font-label font-mono text-white/30">
                  AGT-SSB-772
                </span>
              </div>
              <h4 className="text-xl font-headline font-bold mb-2">
                Sentinel Security Bot
              </h4>
              <p className="text-on-surface-variant text-sm font-body line-clamp-2">
                Autonomous threat detection and proactive network shielding
                agent for enterprise clouds.
              </p>
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-full transition-colors flex-shrink-0">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
