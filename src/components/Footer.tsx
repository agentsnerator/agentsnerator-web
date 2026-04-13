import Link from "next/link";
import Logo from "@/components/Logo";

const links = [
  { label: "Twitter / X", href: "https://x.com/agentsnerator" },
  { label: "Telegram", href: "https://t.me/agentsnerator" },
  { label: "YouTube", href: "https://youtube.com/@agentsnerator" },
  { label: "Docs", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0e0e10] w-full py-12 border-t border-outline-variant/5">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo width={180} height={40} />
          <p className="font-body text-sm text-white/40">
            © {new Date().getFullYear()} AgentsNerator. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm text-white/40 hover:text-secondary transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
