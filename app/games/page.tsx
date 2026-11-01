import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { STEAM_PATH } from "@/components/game/PlatformIcons";
import { GAMES, STEAM_URL, UPCOMING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Fourth Shadow / நான்காம் நிழல் and what comes after it, from ATTI Games.",
};

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-[128px] sm:px-8 sm:pt-[168px]">
      <p className="eyebrow">௦௩ / Games</p>
      <Reveal wipe>
        <h1 className="display mt-8 text-[clamp(2.4rem,7.2vw,5.6rem)] uppercase">
          The <span className="ember-text">slate</span>
        </h1>
      </Reveal>

      <div className="mt-20 space-y-6">
        {GAMES.map((game) => (
          <Reveal key={game.slug} className="relative">
            <Link
              href={game.href}
              className="group relative grid overflow-hidden border border-white/8 transition-colors duration-500 hover:border-ember/40 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[440px]">
                <Image
                  src={game.cover}
                  alt={`${game.title} key art`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/25 to-transparent lg:bg-linear-to-r" />
              </div>

              <div className="flex flex-col justify-between gap-10 p-7 sm:p-10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                    <span className="eyebrow">{game.status}</span>
                  </div>
                  <p className="tamil mt-8 text-[clamp(1.6rem,3.6vw,2.6rem)] leading-tight text-chalk">
                    {game.ta}
                  </p>
                  <h2 className="display mt-2 text-[clamp(1.3rem,2.6vw,1.9rem)] uppercase">
                    {game.title}
                  </h2>
                  <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-ash-300">
                    {game.logline}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="eyebrow">Genre</p>
                    <p className="mt-2 text-[0.8rem] text-bone">{game.genre}</p>
                  </div>
                  <span className="text-2xl text-ember transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </Link>
            <a
              href={STEAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${game.title} on Steam`}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center border border-white/15 bg-ink-900/80 text-bone backdrop-blur transition-colors duration-300 hover:border-ember hover:text-ember"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d={STEAM_PATH} />
              </svg>
            </a>
          </Reveal>
        ))}

        {UPCOMING.map((p, i) => (
          <Reveal key={p.code} delay={0.06 * (i + 1)}>
            <div className="flex flex-col gap-4 border border-dashed border-white/10 px-7 py-9 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-ash-500">
                {p.code}
              </p>
              <p className="text-[0.82rem] text-ash-500">{p.note}</p>
              <p className="eyebrow">Undisclosed</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
