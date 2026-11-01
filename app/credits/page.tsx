import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TamilParticleBackground from "@/components/TamilParticleBackground";
import ContributorAvatar from "@/components/credits/ContributorAvatar";
import { CREDITS, SOCIALS, STUDIO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Credits",
  description: "The people behind ATTI Games, and where to find the studio.",
};

export default function CreditsPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-[128px] sm:pt-[168px]">
        <TamilParticleBackground className="z-0" density={0.5} opacity={0.5} />
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="eyebrow">௦௪ / Credits</p>
          <Reveal wipe>
            <h1 className="display mt-8 text-[clamp(2.4rem,7.2vw,5.6rem)] uppercase">
              Made by <span className="ember-text">hand</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="tamil mt-8 max-w-xl text-lg leading-relaxed text-ash-300">
              நன்றி.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── the roll ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8">
        <ul className="border-t border-white/8">
          {CREDITS.map((c, i) => (
            <Reveal key={c.role} delay={Math.min(i * 0.05, 0.3)}>
              <li className="group relative flex items-center gap-5 border-b border-white/8 py-6 transition-colors duration-500 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-8">
                {/* ember wash sweeps in behind the row */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-linear-to-r from-ember/8 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <ContributorAvatar
                  photo={c.photo}
                  label={c.name !== "—" ? c.name : c.role}
                />
                {/* display:contents at sm+ so these three lines drop straight
                    into the row's grid columns instead of staying stacked */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:contents">
                  <span className="text-[0.78rem] uppercase tracking-[0.2em] text-ash-400 transition-colors duration-500 group-hover:text-ember">
                    {c.role}
                  </span>
                  <span className="tamil text-[0.85rem] text-ash-500 sm:text-[0.95rem]">
                    {c.ta}
                  </span>
                  <span className="font-display text-sm text-bone sm:text-right">
                    {c.name}
                  </span>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-[0.8rem] leading-relaxed text-ash-500">
            Names — and faces — go up when the people behind them are ready to
            have them up. Everyone credited above is credited by role in the
            meantime.
          </p>
        </Reveal>
      </section>

      {/* ── contact ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <p className="eyebrow">௦௫ / Contact</p>
              <Reveal>
                <h2 className="display mt-8 text-[clamp(1.8rem,4.4vw,3.2rem)] uppercase">
                  Say <span className="ember-text">something</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-sm text-[0.9rem] leading-relaxed text-ash-300">
                  Press, publishing, or a portfolio you think we should see. One
                  inbox, read by a person.
                </p>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <a
                  href={`mailto:${STUDIO.email}`}
                  className="group block border-b border-white/12 pb-6 transition-colors duration-500 hover:border-ember"
                >
                  <span className="eyebrow">Email</span>
                  <span className="mt-4 flex items-center justify-between gap-6">
                    <span className="text-[clamp(1.05rem,2.6vw,1.7rem)] text-bone transition-colors duration-500 group-hover:text-ember-gold">
                      {STUDIO.email}
                    </span>
                    <span className="text-ember transition-transform duration-500 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </a>
              </Reveal>

              <ul className="mt-12 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2">
                {SOCIALS.map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.05}>
                    <a
                      href={s.href}
                      className="group relative flex h-full items-center justify-between gap-4 bg-ink-900 px-6 py-6 transition-colors duration-500 hover:bg-ink-800"
                    >
                      <span>
                        <span className="eyebrow block">{s.label}</span>
                        <span className="mt-2 block text-[0.86rem] text-bone">
                          {s.handle}
                        </span>
                      </span>
                      <span className="relative block h-px w-8 overflow-hidden bg-white/20">
                        <span className="absolute inset-0 -translate-x-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </ul>

              <p className="mt-6 text-[0.72rem] uppercase tracking-[0.16em] text-ash-500">
                Handles are placeholders until the accounts are live.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
