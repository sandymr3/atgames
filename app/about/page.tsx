import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import KuralBlock from "@/components/KuralBlock";
import TamilParticleBackground from "@/components/TamilParticleBackground";
import { STUDIO, VALUES } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "AT Games builds games out of Tamil literature, folklore and fear — written in Tamil first, localised outward.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-[128px] pb-24 sm:pt-[168px]">
        <TamilParticleBackground
          className="z-0"
          density={0.55}
          opacity={0.55}
        />
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="eyebrow">௦௧ / About</p>
          <Reveal wipe>
            <h1 className="display mt-8 max-w-4xl text-[clamp(2.4rem,7.2vw,5.6rem)] uppercase">
              We make games <br className="hidden sm:block" />
              in <span className="ember-text">Tamil</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-2xl text-[1.02rem] leading-relaxed text-ash-300">
              {STUDIO.name} is a small studio in {STUDIO.location}. We take the
              oldest living literary tradition in the world and put it where it
              has hardly been — inside a game engine, at 60 frames a second,
              with the lights off.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── mission ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8">
        <div className="grid gap-14 border-t border-white/8 pt-16 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <Reveal>
            <h2 className="display text-xl uppercase leading-snug">
              The mission
            </h2>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={0.08}>
              <p className="text-[1.05rem] leading-relaxed text-bone">
                To build games that a Tamil player recognises in their bones,
                and that anyone else can still fall into.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-[0.95rem] leading-relaxed text-ash-300">
                Heritage is not a skin we drape over a familiar shooter. It is
                structure. The Thirukkural is a design document about decisions
                and their cost. Sangam poetry is a masterclass in showing
                interior states through landscape. Village folklore already knew
                how to build a monster out of what a community refuses to say
                out loud. We are reading these as game designers, not as
                curators.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="text-[0.95rem] leading-relaxed text-ash-300">
                Practically, that means Tamil is the source language for every
                script we write, every sign in every level, and every name in
                every credit roll. English is the translation. Not the other way
                around.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── bento values ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8">
        <div className="flex items-center gap-5 pb-10">
          <p className="eyebrow">௦௨ / What we hold</p>
          <span className="h-px flex-1 bg-white/8" />
        </div>

        <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {VALUES.map((v, i) => (
            <Reveal key={v.en} delay={i * 0.06} className={v.span}>
              <article
                className={`group relative flex h-full flex-col justify-between overflow-hidden border p-7 transition-colors duration-500 ${
                  v.tone === "ember"
                    ? "border-ember/25 bg-linear-to-br from-ember-deep/12 via-ink-800 to-ink-900 hover:border-ember/50"
                    : "border-white/8 bg-ink-850 hover:border-white/20"
                }`}
              >
                {/* the Tamil word ghosts up out of the corner on hover */}
                <span
                  aria-hidden
                  className="tamil pointer-events-none absolute -right-3 -bottom-7 text-[7rem] leading-none text-white/[0.025] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-bottom-4 group-hover:text-white/[0.06]"
                >
                  {v.ta}
                </span>

                <div className="relative">
                  <p className="tamil text-2xl text-ember-gold sm:text-3xl">
                    {v.ta}
                  </p>
                  <p className="eyebrow mt-3">{v.en}</p>
                </div>
                <p className="relative mt-8 max-w-sm text-[0.88rem] leading-relaxed text-ash-300">
                  {v.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── the kural, again, as the closing statement ───────────────── */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-3xl">
            <KuralBlock />
          </div>
        </div>
      </section>
    </>
  );
}
