"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import AtLockup from "@/components/AtLockup";
import TamilParticleBackground from "@/components/TamilParticleBackground";
import { STUDIO } from "@/lib/site";

export default function Hero() {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      {/* the letterform field lives behind everything in the hero */}
      <TamilParticleBackground className="z-0" />

      {/* a single warm bloom so the black isn't flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #ec6c24 0%, #d44426 38%, transparent 68%)",
        }}
      />

      {/* left rail — grid-breaking vertical label */}
      <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 lg:block">
        <p
          className="eyebrow whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {STUDIO.location} · Est. {STUDIO.founded}
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="mx-auto w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[560px]"
        >
          <AtLockup className="w-full" />
        </motion.div>

        {/* Delays here trail AtLockup's own timeline (dot lands ~3.1s) by the
            same offsets as before — only shifted later to match the mark's
            slower, fully-completing draw-in. */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.75, ease }}
          className="mx-auto mt-10 max-w-md text-center text-[0.78rem] uppercase leading-relaxed tracking-[0.28em] text-ash-400"
        >
          {STUDIO.tagline}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.95, ease }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/games/fourth-shadow"
            className="group relative overflow-hidden border border-ember/40 px-8 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-bone transition-colors duration-500 hover:border-ember"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-ink-900">
              Enter the classroom
            </span>
            {/* ember floods up from the baseline on hover */}
            <span className="absolute inset-0 translate-y-full bg-linear-to-t from-ember-deep via-ember to-ember-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          </Link>
          <Link
            href="/about"
            className="px-4 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-ash-400 underline-offset-8 transition-colors hover:text-bone hover:underline"
          >
            About the studio
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.3 }}
        className="absolute inset-x-0 bottom-8 z-10 flex items-end justify-between px-5 sm:px-8"
      >
        <span className="eyebrow hidden sm:block">Scroll</span>
        <div aria-hidden className="relative h-14 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-5 animate-[scrollcue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-ember" />
        </div>
        <span className="eyebrow hidden sm:block">௦௧ / ஸ்டுடியோ</span>
      </motion.div>
    </section>
  );
}
