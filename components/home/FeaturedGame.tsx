"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import WishlistButton from "@/components/game/WishlistButton";
import { GAMES } from "@/lib/site";

const game = GAMES[0];

export default function FeaturedGame() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The plate drifts against the scroll; the chalk title lags behind it, which
  // is the whole depth cue in a single flat photograph.
  const plateY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["14%", "-10%"]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[92svh] overflow-hidden border-y border-white/5"
    >
      <motion.div
        style={reduced ? undefined : { y: plateY }}
        className="absolute inset-0 -z-10 scale-110"
      >
        <Image
          src="/game/scene-plate.webp"
          alt=""
          fill
          unoptimized
          priority={false}
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
      </motion.div>

      {/* ink wash so the type has somewhere to live, plus a blood rim */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,7,10,0.96) 0%, rgba(8,7,10,0.82) 38%, rgba(8,7,10,0.35) 72%, rgba(8,7,10,0.85) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-ink-900 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <div className="flex items-center gap-4">
              <span className="eyebrow">௦௨ / Coming soon to Steam</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <p className="tamil mt-8 text-[clamp(1.7rem,4vw,2.9rem)] leading-tight text-chalk">
              {game.ta}
            </p>
            <h2 className="display mt-3 text-[clamp(1.6rem,4vw,2.7rem)] uppercase text-bone">
              {game.title}
            </h2>

            <p className="mt-7 max-w-lg text-[0.95rem] leading-relaxed text-ash-300">
              {game.logline}
            </p>

            <dl className="mt-9 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 border-t border-white/8 pt-7">
              {[
                ["Genre", game.genre],
                ["Platform", "Windows PC · Steam"],
                ["Release", game.release],
                ["Language", "தமிழ் · English"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-[0.82rem] text-bone">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-6">
              <Link
                href={game.href}
                className="group inline-flex items-center gap-4"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.24em] text-bone">
                  Open the case file
                </span>
                <span className="relative block h-px w-16 overflow-hidden bg-white/25">
                  <span className="absolute inset-0 -translate-x-full bg-ember transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                </span>
                <span className="text-ember transition-transform duration-500 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
              <WishlistButton />
            </div>
          </div>

          {/* the real chalk logotype, lifted off the poster */}
          <motion.div
            style={reduced ? undefined : { y: titleY }}
            className="relative hidden aspect-[1500/824] w-full lg:block"
          >
            <Image
              src="/game/title-en.webp"
              alt={`${game.title} title card`}
              fill
              unoptimized
              sizes="(max-width: 1024px) 0px, 45vw"
              className="object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
