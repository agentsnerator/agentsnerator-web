import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">
          Ready to evolve your digital workforce?
        </h2>
        <p className="text-on-surface-variant text-lg md:text-xl font-body mb-12 max-w-2xl mx-auto">
          Join thousands of companies and developers leveraging decentralized AI
          agents to scale operations at the speed of thought.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-10 py-4 rounded-lg font-headline font-bold text-lg tracking-tight active:scale-95 transition-transform hover:shadow-[0_0_30px_rgba(219,144,255,0.3)]">
              Get Started Now
            </button>
          </Link>
          <button className="bg-surface-container-high text-white px-10 py-4 rounded-lg font-headline font-bold text-lg tracking-tight active:scale-95 transition-transform border border-outline-variant/15 hover:bg-surface-container transition-colors">
            Read Whitepaper
          </button>
        </div>
      </div>
    </section>
  );
}
