import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HorrorTheme from "@/components/game/HorrorTheme";
import ShadowHero from "@/components/game/ShadowHero";
import BoardPanel from "@/components/game/BoardPanel";
import TrailerFrame from "@/components/game/TrailerFrame";
import PlatformIcons from "@/components/game/PlatformIcons";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Fourth Shadow / நான்காம் நிழல்",
  description:
    "A first-person psychological horror game set in a Tamil government school. Class 7-A. Twelve buds, three flowers, fifteen in total.",
  openGraph: { images: ["/game/poster-en.webp"] },
};

/* The couplet already chalked on the blackboard in the key art —
   Thirukkural 423, on discerning what is true regardless of who says it. */
const BOARD_KURAL = {
  lines: [
    "எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்",
    "மெய்ப்பொருள் காண்ப தறிவு.",
  ],
  meaning:
    "Wisdom is to discern the truth in a thing, no matter whose mouth it comes from.",
};

const ATTENDANCE = [
  { ta: "மொட்டு", en: "Buds", value: "12" },
  { ta: "மலர்", en: "Flowers", value: "03" },
  { ta: "மொத்தம்", en: "Total", value: "15" },
];

export default function FourthShadowPage() {
  return (
    <>
      <HorrorTheme />
      <ShadowHero />

      {/* ── synopsis ─────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <BoardPanel>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
              <div>
                {BOARD_KURAL.lines.map((l) => (
                  <p
                    key={l}
                    className="tamil chalk-text text-[clamp(0.95rem,1.7vw,1.15rem)] leading-[2]"
                  >
                    {l}
                  </p>
                ))}
                <p className="mt-6 max-w-xs text-[0.75rem] italic leading-relaxed text-chalk/35">
                  {BOARD_KURAL.meaning}
                </p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-chalk/25">
                  Thirukkural 423
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-[1.02rem] leading-relaxed text-chalk/85">
                  In 1997, a government school on the edge of a Kongu village
                  loses three children in a single term. The register is
                  corrected each time, in the same hand, in the same chalk.
                </p>
                <p className="text-[0.94rem] leading-relaxed text-chalk/55">
                  You are the substitute teacher sent to close the school down.
                  You have one night, one register, and a room that counts
                  fifteen when only fourteen answer. Class 7-A has always had a
                  fourth shadow on the back wall — the fluorescent tube throws
                  three.
                </p>
                <p className="text-[0.94rem] leading-relaxed text-chalk/55">
                  Fourth Shadow is a first-person horror game about attendance:
                  who is counted, who is quietly removed from the count, and
                  what a community agrees not to see. There is no weapon. There
                  is a register, a piece of chalk, and the truth of what
                  happened, which you can write down or leave blank.
                </p>
              </div>
            </div>

            {/* the register, as it appears on the board */}
            <dl className="mt-14 grid grid-cols-3 gap-px overflow-hidden border border-chalk/10 bg-chalk/10">
              {ATTENDANCE.map((a) => (
                <div key={a.en} className="bg-[#0d0b0a] px-4 py-7 text-center">
                  <dt className="tamil text-[0.78rem] tracking-[0.14em] text-chalk/45">
                    {a.ta}
                  </dt>
                  <dd className="chalk-text mt-3 font-display text-2xl sm:text-3xl">
                    {a.value}
                  </dd>
                  <dd className="mt-2 text-[0.58rem] uppercase tracking-[0.26em] text-chalk/25">
                    {a.en}
                  </dd>
                </div>
              ))}
            </dl>
          </BoardPanel>
        </Reveal>
      </section>

      {/* ── teaser ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mb-10 flex items-center gap-5">
          <p className="eyebrow text-chalk/40">Teaser</p>
          <span className="h-px flex-1 bg-chalk/10" />
        </div>
        <Reveal>
          <TrailerFrame />
        </Reveal>
      </section>

      {/* ── platforms ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mb-10 flex items-center gap-5">
          <p className="eyebrow text-chalk/40">Available on</p>
          <span className="h-px flex-1 bg-chalk/10" />
        </div>
        <Reveal>
          <PlatformIcons />
        </Reveal>
        <p className="mt-6 text-[0.66rem] uppercase tracking-[0.2em] text-chalk/25">
          Platforms are targets, not commitments. Store pages open when the
          build is stable.
        </p>
      </section>

      {/* ── key art ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mb-10 flex items-center gap-5">
          <p className="eyebrow text-chalk/40">Key art</p>
          <span className="h-px flex-1 bg-chalk/10" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { src: "/game/poster-ta.webp", label: "நான்காம் நிழல்" },
            { src: "/game/poster-en.webp", label: "Fourth Shadow" },
          ].map((art) => (
            <Reveal key={art.src}>
              <figure className="group relative aspect-4/3 overflow-hidden border border-chalk/10">
                <Image
                  src={art.src}
                  alt={`${art.label} title card`}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-5">
                  <span className="tamil text-[0.8rem] text-chalk/70">
                    {art.label}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── exit ─────────────────────────────────────────────────────── */}
      <section className="border-t border-chalk/8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="tamil text-lg text-chalk/70">வெளியேறு.</p>
            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.24em] text-chalk/30">
              Turn the light off on your way out
            </p>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-4 self-start border border-chalk/15 px-7 py-4 transition-colors duration-500 hover:border-blood-lit sm:self-auto"
          >
            <span className="text-[0.7rem] uppercase tracking-[0.24em] text-chalk/80">
              Back to the studio
            </span>
            <span className="text-blood-lit transition-transform duration-500 group-hover:-translate-x-1.5">
              ←
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
