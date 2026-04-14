"use client";

import Link from "next/link";

export type Project = {
  id: string;
  name: string;
  description: string;
  ceoAgent: string;
  ceoBarcode: string;
  agentCount: number;
  status: "active" | "paused" | "building" | "coming";
  tags: string[];
  tasksCompleted: number;
  neutronEarned: number;
};

const STATUS_CONFIG = {
  active: {
    label:   "Active",
    tooltip: "فعّال",
    dot:     "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]",
    text:    "text-green-400",
    border:  "hover:border-green-500/20",
  },
  paused: {
    label:   "Paused",
    tooltip: "متوقف",
    dot:     "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]",
    text:    "text-red-400",
    border:  "hover:border-red-500/20",
  },
  building: {
    label:   "Building",
    tooltip: "قيد الإنشاء",
    dot:     "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.7)] animate-pulse",
    text:    "text-orange-400",
    border:  "hover:border-orange-400/20",
  },
  coming: {
    label:   "Coming Soon",
    tooltip: "قريباً",
    dot:     "bg-purple-400/70",
    text:    "text-purple-400",
    border:  "hover:border-purple-400/20",
  },
};

export default function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status];

  return (
    <div
      className={`bg-surface-container-low rounded-xl p-6 border border-transparent ${status.border} transition-all duration-300 flex flex-col gap-5 group`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              folder_special
            </span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg leading-tight">
              {project.name}
            </h3>
            <div className="relative group/status flex items-center gap-1.5 mt-0.5 cursor-default">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className={`text-[10px] font-label uppercase tracking-widest ${status.text}`}>
                {status.label}
              </span>
              {/* Tooltip عند hover */}
              <span className="absolute bottom-full left-0 mb-1.5 px-2 py-0.5 bg-surface-container-highest text-on-surface text-[10px] font-label rounded-md whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                {status.tooltip}
              </span>
            </div>
          </div>
        </div>
        {/* Agent count badge */}
        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/10">
          <span className="material-symbols-outlined text-[14px] text-primary">
            smart_toy
          </span>
          <span className="font-headline font-bold text-sm text-on-surface">
            {project.agentCount}
          </span>
          <span className="text-[10px] font-label text-on-surface-variant">
            Agents
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-body text-on-surface-variant leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* CEO Agent */}
      <div className="flex items-center gap-2 bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/5">
        <span className="material-symbols-outlined text-[14px] text-secondary">
          star
        </span>
        <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
          CEO:
        </span>
        <span className="text-xs font-headline font-bold text-on-surface">
          {project.ceoAgent}
        </span>
        <span className="ml-auto text-[9px] font-mono text-on-surface-variant/50">
          {project.ceoBarcode}
        </span>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-surface-bright text-on-surface-variant rounded text-[10px] font-label uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
        <div className="flex gap-5">
          <div>
            <p className="text-[10px] font-label text-on-surface-variant uppercase">
              Tasks
            </p>
            <p className="text-sm font-headline font-bold">
              {project.tasksCompleted.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-label text-on-surface-variant uppercase">
              Earned
            </p>
            <p className="text-sm font-headline font-bold text-secondary">
              +{project.neutronEarned}N
            </p>
          </div>
        </div>
        <Link
          href={`/dashboard/${project.id}`}
          className="flex items-center gap-1.5 text-primary font-headline font-bold text-sm hover:gap-2.5 transition-all"
        >
          Open
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
