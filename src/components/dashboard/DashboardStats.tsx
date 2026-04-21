import { FolderOpen, Bot, CheckCircle2, Wallet, type LucideIcon } from "lucide-react";

type Props = { totalProjects?: number };

const ICON_MAP: Record<string, LucideIcon> = {
  folder_special:       FolderOpen,
  smart_toy:            Bot,
  check_circle:         CheckCircle2,
  account_balance_wallet: Wallet,
};

export default function DashboardStats({ totalProjects = 0 }: Props) {
  const stats = [
    {
      label:     "Total Projects",
      value:     String(totalProjects),
      sub:       totalProjects > 0 ? "Your agent teams" : "Create one below",
      subColor:  "text-secondary",
      icon:      "folder_special",
      iconColor: "text-primary",
    },
    {
      label:     "Active Agents",
      value:     "—",
      sub:       "Live from DB",
      subColor:  "text-on-surface-variant",
      icon:      "smart_toy",
      iconColor: "text-secondary",
    },
    {
      label:     "Tasks Done",
      value:     "—",
      sub:       "Live from DB",
      subColor:  "text-on-surface-variant",
      icon:      "check_circle",
      iconColor: "text-primary",
    },
    {
      label:     "Neutrons",
      value:     "0",
      sub:       "Connect wallet",
      subColor:  "text-on-surface-variant",
      icon:      "account_balance_wallet",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => {
        const IconComponent = ICON_MAP[stat.icon] ?? FolderOpen;
        return (
          <div
            key={stat.label}
            className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </span>
              <IconComponent className={stat.iconColor} size={20} />
            </div>
            <p className="font-headline text-3xl font-bold text-on-background mb-1">
              {stat.value}
            </p>
            <p className={`text-[11px] font-label font-medium ${stat.subColor}`}>
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
