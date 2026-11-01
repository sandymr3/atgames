import Link from "next/link";
import { NAV, STUDIO } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{STUDIO.location}</p>
            <p className="display mt-4 text-3xl sm:text-4xl">
              <span className="ember-text">ATTI</span> GAMES
            </p>
            <p className="tamil mt-3 max-w-xs text-sm leading-relaxed text-ash-400">
              எண்ணித் துணிக கருமம்.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.72rem] uppercase tracking-[0.2em] text-ash-400 transition-colors hover:text-ember"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/5 pt-6 text-[0.68rem] uppercase tracking-[0.18em] text-ash-500 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {STUDIO.name}. All rights reserved.
          </span>
          <span>
            Est. {STUDIO.founded} · Made in Tamil Nadu
          </span>
        </div>
      </div>
    </footer>
  );
}
