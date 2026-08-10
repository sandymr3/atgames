"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";
import { MARK, MARK_VIEWBOX } from "@/lib/lockup";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    // One deferred read so a restored scroll position starts in the right
    // state, without calling setState synchronously inside the effect body.
    const id = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <header
      /* A near-opaque tint rather than a heavy backdrop-blur: blurring a
         backdrop that is itself moving means re-running the blur every scroll
         frame, and over a scene this dark the two are indistinguishable. */
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-[color-mix(in_oklab,var(--page)_94%,transparent)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="AT Games — home"
          className="group flex items-center gap-3"
        >
          <svg
            viewBox={MARK_VIEWBOX}
            className="h-8 w-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[18deg]"
          >
            <defs>
              <linearGradient
                id="hdr-grad"
                gradientUnits="userSpaceOnUse"
                x1="343"
                y1="179"
                x2="447"
                y2="282"
              >
                <stop offset="0" stopColor="#f2a020" />
                <stop offset=".48" stopColor="#ec6c24" />
                <stop offset="1" stopColor="#c83c27" />
              </linearGradient>
            </defs>
            <path d={MARK.d} transform={MARK.transform} fill="url(#hdr-grad)" />
          </svg>
          <span className="font-display text-[0.7rem] tracking-[0.32em] text-bone">
            AT&nbsp;GAMES
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2"
              >
                <span
                  className={`relative z-10 block overflow-hidden text-[0.72rem] uppercase tracking-[0.22em] transition-colors ${
                    active ? "text-bone" : "text-ash-400 hover:text-bone"
                  }`}
                >
                  {/* Latin slides up and out, Tamil slides in behind it */}
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                    {item.label}
                  </span>
                  <span className="tamil absolute inset-0 block translate-y-full text-[0.8rem] tracking-normal text-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    {item.ta}
                  </span>
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-ember to-transparent"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/5 bg-[color-mix(in_oklab,var(--page)_94%,transparent)] backdrop-blur-xl md:hidden"
          >
            <ul className="px-5 py-4">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.08 }}
                  className="border-b border-white/5 last:border-0"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="font-display text-sm tracking-[0.18em] uppercase">
                      {item.label}
                    </span>
                    <span className="tamil text-sm text-ember">{item.ta}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
