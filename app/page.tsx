import Link from "next/link";
import Hero from "@/components/home/Hero";
import FeaturedGame from "@/components/home/FeaturedGame";
import LetterMarquee from "@/components/home/LetterMarquee";
import KuralBlock from "@/components/KuralBlock";
import Reveal from "@/components/Reveal";
import { STUDIO } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── the motto ────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-40">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <p className="eyebrow">Our one rule</p>
            <p className="mt-8 max-w-xs text-[0.92rem] leading-relaxed text-ash-300">
              Two lines written some two thousand years ago that we treat as a
              production process, not a decoration.
            </p>
          </Reveal>

          {/* pulled out of the grid on the right so the couplet sits off-axis */}
          <div className="lg:-mt-6 lg:pl-8">
            <KuralBlock />
          </div>
        </div>
      </section>

      <LetterMarquee />

      <FeaturedGame />

      {/* ── studio brief ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal wipe>
            <h2 className="display text-[clamp(2rem,5.6vw,4.2rem)] uppercase">
              A studio, <br />
              <span className="ember-text">not a factory.</span>
            </h2>
          </Reveal>

          <div className="space-y-7">
            <Reveal delay={0.1}>
              <p className="text-[0.98rem] leading-relaxed text-ash-300">
                {STUDIO.name} makes games out of the things Tamil culture has
                always been good at — dread, obligation, memory, and the weight
                of a decision already made. We build in Tamil first and localise
                outward, because a story translated into its own language is a
                story that never had one.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-[0.98rem] leading-relaxed text-ash-300">
                We are small on purpose. Every frame, every line of chalk on a
                blackboard, is made by someone who can explain why it is there.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <Link
                href="/about"
                className="group inline-flex items-center gap-4 pt-2"
              >
                <span className="text-[0.72rem] uppercase tracking-[0.24em] text-bone">
                  What we believe
                </span>
                <span className="relative block h-px w-14 overflow-hidden bg-white/25">
                  <span className="absolute inset-0 -translate-x-full bg-ember transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden border border-white/8 bg-white/8 md:grid-cols-4">
          {[
            ["௧", "Title in production"],
            ["௨", "More in pre-production"],
            ["100%", "Tamil-first writing"],
            ["2026", "First release window"],
          ].map(([n, label], i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="h-full bg-ink-900 px-6 py-10">
                <p
                  className={`${
                    i < 2 ? "tamil" : "display"
                  } text-3xl text-ember-gold sm:text-4xl`}
                >
                  {n}
                </p>
                <p className="mt-4 text-[0.72rem] uppercase leading-relaxed tracking-[0.16em] text-ash-400">
                  {label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
