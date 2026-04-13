"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/wallet", label: "Wallet" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 navbar-bg backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-b border-outline-variant/10 h-20">
      <div className="flex justify-between items-center px-8 h-full w-full max-w-7xl mx-auto">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo width={330} height={90} />
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-headline text-sm tracking-tight transition-colors duration-300 ${
                    isActive
                      ? "text-secondary border-b-2 border-secondary pb-1"
                      : "text-white/60 hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search + Auth */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search Agents..."
              className="bg-surface-container-high ring-1 ring-white/10 hover:ring-white/20 focus:ring-secondary/50 outline-none transition-all duration-200 pl-10 pr-4 py-2 text-sm w-56 rounded-lg text-on-surface placeholder:text-white/30 font-label"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Auth section */}
          {!isLoaded ? (
            /* Loading skeleton */
            <div className="w-9 h-9 rounded-full bg-surface-container-high animate-pulse" />
          ) : isSignedIn ? (
            /* Signed in — wallet balance + Clerk UserButton */
            <div className="flex items-center gap-3">
              {/* Neutron balance chip */}
              <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg">
                <span className="text-primary text-xs font-headline font-bold">⚡</span>
                <span className="text-on-surface font-label text-xs font-bold">1,250</span>
                <span className="text-on-surface-variant font-label text-xs">NTR</span>
              </div>

              {/* User greeting */}
              <span className="hidden md:block text-on-surface-variant font-label text-sm">
                {user.firstName ?? user.emailAddresses[0]?.emailAddress?.split("@")[0]}
              </span>

              {/* Clerk UserButton — handles avatar + sign-out dropdown */}
              <UserButton
                appearance={{
                  variables: {
                    colorPrimary: "#db90ff",
                    colorBackground: "#19191c",
                    colorText: "#fffbfe",
                    colorTextSecondary: "#adaaad",
                    borderRadius: "0.5rem",
                  },
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-primary/40 hover:ring-primary transition-all",
                    userButtonPopoverCard: "bg-surface-container border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
                    userButtonPopoverActionButton: "hover:bg-surface-container-high text-on-surface",
                    userButtonPopoverActionButtonText: "font-label text-sm",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          ) : (
            /* Signed out — Sign In + Get Started */
            <div className="flex items-center gap-3">
              <SignInButton mode="redirect">
                <button className="text-on-surface-variant font-headline text-sm hover:text-on-surface transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-5 py-2 rounded-lg font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform hover:brightness-110"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
