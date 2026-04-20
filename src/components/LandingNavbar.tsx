"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "#features", label: "المميزات" },
  { href: "#agents",   label: "الوكلاء" },
  { href: "#pricing",  label: "التسعير" },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      dir="rtl"
      className="fixed top-0 w-full z-50 navbar-bg backdrop-blur-xl border-b border-white/5 h-16"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-4">
        {/* Logo — shrink-0 + overflow-visible prevents clipping in RTL flex */}
        <Link href="/" className="flex items-center shrink-0 overflow-visible whitespace-nowrap">
          <Logo width={210} height={46} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 min-w-0">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-white/60 hover:text-primary transition-colors font-label"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden md:block text-sm text-white/50 hover:text-white/80 transition-colors font-label"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/sign-up"
            className="bg-gradient-to-l from-primary to-primary-dim text-on-primary text-sm font-headline font-bold px-5 py-2 rounded-xl hover:brightness-110 active:scale-95 transition-all"
          >
            ابدأ مجاناً
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            <span className={`block w-5 h-0.5 bg-white/70 transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0e0e10] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/70 hover:text-primary transition-colors font-label"
            >
              {label}
            </a>
          ))}
          <Link
            href="/sign-up"
            onClick={() => setOpen(false)}
            className="text-sm text-primary font-headline font-bold"
          >
            ابدأ مجاناً ←
          </Link>
        </div>
      )}
    </nav>
  );
}
