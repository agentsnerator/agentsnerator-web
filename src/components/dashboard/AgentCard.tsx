export type Agent = {
  id: string;
  name: string;
  barcode: string;
  role: string;
  score: number;
  isCEO: boolean;
  avatarIcon: string; // Material Symbol name
  tasksCompleted: number;
  status: "active" | "idle" | "training";
};

type ScoreTier = {
  label: string;
  color: string;         // text color class
  bgColor: string;       // badge bg class
  ringColor: string;     // SVG stroke color (hex)
  glowClass: string;
};

function getScoreTier(score: number): ScoreTier {
  if (score >= 90)
    return {
      label: "Master",
      color: "text-primary",
      bgColor: "bg-primary/20 border-primary/30",
      ringColor: "#db90ff",
      glowClass: "drop-shadow-[0_0_6px_#db90ff]",
    };
  if (score >= 75)
    return {
      label: "Expert",
      color: "text-secondary",
      bgColor: "bg-secondary/20 border-secondary/30",
      ringColor: "#00eefc",
      glowClass: "drop-shadow-[0_0_6px_#00eefc]",
    };
  if (score >= 50)
    return {
      label: "Skilled",
      color: "text-on-surface",
      bgColor: "bg-surface-bright border-outline-variant/30",
      ringColor: "#767578",
      glowClass: "",
    };
  return {
    label: "Beginner",
    color: "text-on-surface-variant",
    bgColor: "bg-surface-container border-outline-variant/20",
    ringColor: "#48474a",
    glowClass: "",
  };
}

const STATUS_CONFIG: Record<Agent["status"], { dot: string; tooltip: string }> = {
  active:   { dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]",           tooltip: "فعّال"   },
  idle:     { dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]",             tooltip: "متوقف"  },
  training: { dot: "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)] animate-pulse", tooltip: "تدريب" },
};

const CIRCUMFERENCE = 2 * Math.PI * 28; // r=28

export default function AgentCard({
  agent,
  featured = false,
}: {
  agent: Agent;
  featured?: boolean;
}) {
  const tier = getScoreTier(agent.score);
  const dashOffset = CIRCUMFERENCE * (1 - agent.score / 100);

  return (
    <div
      className={`
        relative flex flex-col bg-surface-container-low rounded-xl border transition-all duration-300 group overflow-hidden
        ${featured
          ? "border-primary/30 hover:border-primary/60 shadow-[0_0_40px_rgba(219,144,255,0.08)]"
          : "border-transparent hover:border-outline-variant/30"}
      `}
    >
      {/* CEO crown ribbon */}
      {agent.isCEO && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-dim to-secondary" />
      )}

      <div className="p-6 flex flex-col gap-4">
        {/* Top row: Avatar + Score circle */}
        <div className="flex items-start justify-between">
          {/* Avatar */}
          <div
            className={`
              w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative
              ${featured
                ? "bg-gradient-to-br from-primary/20 to-primary-dim/10 border border-primary/20"
                : "bg-surface-container-high border border-outline-variant/10"}
            `}
          >
            <span
              className={`material-symbols-outlined text-3xl ${featured ? "text-primary" : "text-on-surface-variant"}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {agent.avatarIcon}
            </span>
            {/* Status dot + tooltip */}
            <span className="absolute -bottom-1 -right-1 group/dot">
              <span
                className={`block w-3 h-3 rounded-full border-2 border-surface-container-low ${STATUS_CONFIG[agent.status].dot}`}
              />
              <span className="absolute bottom-full right-0 mb-1.5 px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] font-label rounded-md whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                {STATUS_CONFIG[agent.status].tooltip}
              </span>
            </span>
          </div>

          {/* Score circle */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              {/* Track */}
              <circle
                cx="32" cy="32" r="28"
                fill="transparent"
                stroke="#19191c"
                strokeWidth="4"
              />
              {/* Progress */}
              <circle
                cx="32" cy="32" r="28"
                fill="transparent"
                stroke={tier.ringColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className={tier.glowClass}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline font-bold text-sm leading-none">
                {agent.score}
              </span>
              <span className="text-[8px] font-label text-on-surface-variant uppercase leading-none mt-0.5">
                score
              </span>
            </div>
          </div>
        </div>

        {/* Role + CEO badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {agent.isCEO && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[9px] font-label font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              CEO
            </span>
          )}
          <span className="px-2 py-0.5 bg-surface-bright text-on-surface-variant rounded text-[9px] font-label uppercase tracking-wider">
            {agent.role}
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[9px] font-label font-bold uppercase tracking-wider ${tier.bgColor} ${tier.color}`}
          >
            {tier.label}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="font-headline font-bold text-lg leading-tight">
            {agent.name}
          </h3>
          <p className="text-[10px] font-mono text-on-surface-variant/50 mt-0.5">
            {agent.barcode}
          </p>
        </div>

        {/* Barcode visual */}
        <div className="flex items-end gap-px h-8 bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/5">
          {Array.from({ length: 22 }, (_, i) => {
            const widths = [1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2];
            return (
              <div
                key={i}
                className={featured ? "bg-primary/60" : "bg-on-surface-variant/30"}
                style={{ width: `${widths[i]}px`, height: "100%" }}
              />
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
          <div>
            <p className="text-[10px] font-label text-on-surface-variant uppercase">
              Tasks
            </p>
            <p className="text-sm font-headline font-bold">
              {agent.tasksCompleted.toLocaleString()}
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs font-label font-bold text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[14px]">
              settings
            </span>
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
