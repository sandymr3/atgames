import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HorrorTheme from "@/components/game/HorrorTheme";
import ShadowHero from "@/components/game/ShadowHero";
import BoardPanel from "@/components/game/BoardPanel";
import FeatureClip from "@/components/game/FeatureClip";
import GameFacts from "@/components/game/GameFacts";
import PlatformIcons from "@/components/game/PlatformIcons";
import ScreenshotGallery from "@/components/game/ScreenshotGallery";
import SystemRequirements from "@/components/game/SystemRequirements";
import WishlistButton from "@/components/game/WishlistButton";
import Reveal from "@/components/Reveal";
import { FOURTH_SHADOW, GAMES, STEAM_URL } from "@/lib/site";

const game = GAMES[0];

export const metadata: Metadata = {
  title: "Fourth Shadow / நான்காம் நிழல்",
  description: FOURTH_SHADOW.description,
  openGraph: { images: ["/game/capsule.jpg"] },
};

/* Search engines read this; every value comes from the Steam page. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: game.title,
  alternateName: game.ta,
  description: FOURTH_SHADOW.description,
  url: "https://atgames.studio/games/fourth-shadow",
  image: "https://atgames.studio/game/capsule.jpg",
  genre: ["Horror", "Survival Horror", "Adventure"],
  gamePlatform: "PC",
  operatingSystem: "Windows",
  applicationCategory: "Game",
  playMode: "SinglePlayer",
  inLanguage: ["en", "ta"],
  author: { "@type": "Organization", name: "Atti Games" },
  publisher: { "@type": "Organization", name: "Atti Games" },
  sameAs: STEAM_URL,
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

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-10 flex items-center gap-5">
      <h2 className="eyebrow text-chalk/40">{children}</h2>
      <span className="h-px flex-1 bg-chalk/10" />
    </div>
  );
}

export default function FourthShadowPage() {
  return (
    <>
      <HorrorTheme />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <ShadowHero />

      {/* ── about ────────────────────────────────────────────────────── */}
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

              <div className="space-y-5">
                {FOURTH_SHADOW.story.map((line, i) => (
                  <p
                    key={line}
                    className={
                      i === 0
                        ? "text-[1.02rem] leading-relaxed text-chalk/85"
                        : "text-[0.94rem] leading-relaxed text-chalk/60"
                    }
                  >
                    {line}
                  </p>
                ))}
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

      {/* ── at a glance ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>At a glance</SectionLabel>
        <Reveal>
          <GameFacts />
        </Reveal>
      </section>

      {/* ── escape the school ────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>Escape the school</SectionLabel>
        <div className="space-y-20 sm:space-y-28">
          {FOURTH_SHADOW.features.map((feature) => (
            <Reveal key={feature.slug}>
              <article>
                <Image
                  src={`/game/banners/${feature.slug}.webp`}
                  alt={feature.title}
                  width={1500}
                  height={250}
                  unoptimized
                  className="h-auto w-full"
                />
                <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <p className="text-[0.98rem] leading-relaxed text-chalk/70">
                    {feature.body}
                  </p>
                  <FeatureClip
                    slug={feature.slug}
                    label={`Gameplay clip: ${feature.title}`}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── screenshots ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>Screenshots</SectionLabel>
        <Reveal>
          <ScreenshotGallery captions={FOURTH_SHADOW.screenshots} />
        </Reveal>
      </section>

      {/* ── platforms ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>Platforms</SectionLabel>
        <Reveal>
          <PlatformIcons />
        </Reveal>
        <p className="mt-6 text-[0.66rem] uppercase tracking-[0.2em] text-chalk/25">
          Coming to Windows PC on Steam. Console versions have not been
          announced.
        </p>
      </section>

      {/* ── key art ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>Key art</SectionLabel>
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

      {/* ── system requirements ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>System requirements</SectionLabel>
        <Reveal>
          <SystemRequirements />
        </Reveal>
      </section>

      {/* ── mature content ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionLabel>Mature content</SectionLabel>
        <p className="max-w-3xl text-[0.9rem] leading-relaxed text-chalk/55">
          {FOURTH_SHADOW.mature}
        </p>
      </section>

      {/* ── wishlist ─────────────────────────────────────────────────── */}
      <section className="border-t border-chalk/8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-5 py-20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="tamil text-lg text-chalk/70">{game.ta}</p>
            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.24em] text-chalk/30">
              Coming soon to Steam
            </p>
          </div>
          <WishlistButton />
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
