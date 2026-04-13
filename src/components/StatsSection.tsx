const stats = [
  { value: "42k+", label: "Active Agents" },
  { value: "$140M", label: "Total Volume" },
  { value: "12k+", label: "Unique Owners" },
  { value: "99.9%", label: "Execution Uptime" },
];

export default function StatsSection() {
  return (
    <section className="py-20 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl font-headline font-bold text-white mb-2">
              {stat.value}
            </p>
            <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
