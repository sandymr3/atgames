"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import TamilParticleBackground from "@/components/TamilParticleBackground";
import WishlistButton from "@/components/game/WishlistButton";

/* ============================================================================
   The classroom, taken apart.

   The source art is one flat 5760x4320 render. tools/prepare_assets.py cuts
   the chalk title, the silhouette and the handprint out of it and *erases them
   from the plate* — so these planes are not sliding over baked-in copies of
   themselves, which is what makes fake parallax read as a printing error.

   Every plane is positioned as a percentage of the plate, inside one box that
   emulates object-cover, so the registration holds at any viewport.

   The tube light runs its own blackout cycle, and the title changes language
   *in the dark*: Tamil is what the room says until the light cuts out, and
   English is what is on the board when it comes back.
   ========================================================================== */

const PLANES = {
  // left / top / width / height, as fractions of the 5760x4320 plate
  ghost: { l: 13.194, t: 28.704, w: 22.917, h: 41.204 },
  title: { l: 26.042, t: 33.565, w: 47.569, h: 33.102 },
  hand: { l: 59.028, t: 24.537, w: 8.16, h: 13.889 },
} as const;

const pct = (p: { l: number; t: number; w: number; h: number }) => ({
  left: `${p.l}%`,
  top: `${p.t}%`,
  width: `${p.w}%`,
  height: `${p.h}%`,
});

/** seconds the room stays lit between failures */
const LIT_MIN = 4.5;
const LIT_MAX = 9;

export default function ShadowHero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const q = gsap.utils.selector(root);
      const lamp = q("[data-lamp]");
      const dark = q("[data-fx='blackout']");
      const titles = q("[data-title]");
      const titleWrap = q("[data-plane='title']");

      /* ---------------------------------------------------- scroll parallax */
      // force3D keeps every plane on its own compositor layer, so the scrub
      // only ever hands the GPU a new matrix instead of repainting.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=125%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Blend modes have to sample the backdrop; the global grain is the
          // one overlay that is genuinely expensive over a moving scene.
          onToggle: (self) => {
            document.documentElement.dataset.pinned = self.isActive ? "1" : "0";
          },
        },
        defaults: { ease: "none", force3D: true },
      });

      // Viewport units, not yPercent: yPercent is relative to each element's
      // own height, so the small handprint would travel fewer pixels than the
      // huge title and the depth order would come out backwards.
      tl.to("[data-plane='plate']", { y: "-3vh", scale: 1.08 }, 0)
        .to("[data-plane='ghost']", { y: "-8vh" }, 0)
        .to(titleWrap, { y: "-14vh" }, 0)
        .to("[data-plane='hand']", { y: "-19vh" }, 0)
        .to("[data-fx='blood']", { opacity: 0.7 }, 0)
        .to("[data-fx='falloff']", { opacity: 1 }, 0)
        .to("[data-hud]", { opacity: 0, y: -40 }, 0);

      // The silhouette breathes on its own clock, unhooked from scroll. It
      // lives on an inner node so this scale never fights the scrubbed y.
      gsap.to("[data-breathe]", {
        scale: 1.04,
        opacity: 0.84,
        duration: 7.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* ------------------------------------------------------ the bad tube */
      // Tamil first. Every blackout hands the board to the other language.
      let lit = 0;

      const swap = () => {
        lit = lit === 0 ? 1 : 0;
        gsap.set(titles, { autoAlpha: (i: number) => (i === lit ? 1 : 0) });
      };

      const strike = () => {
        // A failing ballast stutters before it dies and gropes for the arc on
        // the way back. Even intervals read as a heartbeat, not a fault.
        const tlLight = gsap.timeline({ onComplete: schedule });
        const cut = (lampTo: number, darkTo: number, d: number) =>
          tlLight
            .to(lamp, { opacity: lampTo, duration: d, ease: "none" })
            .to(dark, { opacity: darkTo, duration: d, ease: "none" }, "<");

        cut(0.22, 0.58, 0.05);
        cut(1, 0, 0.06);
        cut(0.08, 0.82, 0.04);
        cut(0.78, 0.14, 0.07);
        cut(0, 0.97, 0.09);

        // pitch dark: the board changes underneath the blackout
        tlLight.add(swap).to({}, { duration: gsap.utils.random(0.34, 0.6) });

        // false start, then the arc catches
        cut(0.5, 0.42, 0.05);
        cut(0.06, 0.9, 0.07);
        tlLight
          .to(lamp, { opacity: 1, duration: 0.55, ease: "power2.out" })
          .to(dark, { opacity: 0, duration: 0.55, ease: "power2.out" }, "<")
          // The new word jitters as the tube catches, like a bad frame hold.
          // Both land on the wrapper, not on titles[lit] — `lit` would be read
          // when the timeline is *built*, which is before swap() has flipped
          // it, so that would stutter the language we just left.
          .fromTo(
            titleWrap,
            { x: -7 },
            { x: 0, duration: 0.16, ease: "steps(3)" },
            "<",
          )
          .fromTo(
            titleWrap,
            { opacity: 0.4 },
            { opacity: 1, duration: 0.24, ease: "steps(4)" },
            "<",
          );
      };

      const schedule = () =>
        gsap.delayedCall(gsap.utils.random(LIT_MIN, LIT_MAX), strike);

      schedule();
      ScrollTrigger.refresh();

      return () => {
        delete document.documentElement.dataset.pinned;
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      className="relative h-[100svh] overflow-hidden bg-[#050404]"
    >
      {/* The room's name, for anything that cannot see the chalk. */}
      <h1 className="sr-only">Fourth Shadow — நான்காம் நிழல்</h1>

      {/* object-cover, hand-rolled, so the planes stay registered to the plate */}
      <div className="absolute left-1/2 top-1/2 aspect-4/3 w-[max(100vw,133.4svh)] -translate-x-1/2 -translate-y-1/2">
        <div
          data-plane="plate"
          className="absolute inset-0 will-change-transform [backface-visibility:hidden]"
        >
          {/* unoptimized on purpose: tools/prepare_assets.py already emits
              these at web size, quality *and colour grade* — the grade used to
              be a CSS filter here, which re-filtered the whole image on every
              scrub frame. */}
          <Image
            src="/game/scene-plate.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="120vw"
            className="object-cover"
          />
        </div>

        <div
          data-plane="ghost"
          className="absolute will-change-transform [backface-visibility:hidden]"
          style={pct(PLANES.ghost)}
        >
          <div data-breathe className="absolute inset-0">
            <Image
              src="/game/ghost.png"
              alt=""
              fill
              unoptimized
              sizes="30vw"
              className="object-contain"
            />
          </div>
        </div>

        <div
          data-plane="hand"
          className="absolute will-change-transform [backface-visibility:hidden]"
          style={pct(PLANES.hand)}
        >
          <Image
            src="/game/handprint.png"
            alt=""
            fill
            unoptimized
            sizes="12vw"
            className="object-contain"
          />
        </div>

        {/* Both logotypes are mounted from the start and cross-cut by opacity.
            Swapping the src instead would refetch mid-blackout and flash. */}
        <div
          data-plane="title"
          className="absolute will-change-transform [backface-visibility:hidden]"
          style={pct(PLANES.title)}
        >
          <div data-title className="absolute inset-0">
            <Image
              src="/game/title-ta.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="60vw"
              className="object-contain"
            />
          </div>
          <div
            data-title
            className="absolute inset-0"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <Image
              src="/game/title-en.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="60vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* the failing tube, blown out over the ceiling fitting */}
        <div
          data-lamp
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          {/* screen-blended, because a light source adds rather than covers.
              It is a small element, so the backdrop readback is cheap — unlike
              the full-screen overlays, which are all normal-blend now. */}
          <div
            className="hum absolute left-1/2 top-[2%] h-[22%] w-[40%] -translate-x-1/2 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse at 50% 32%, rgba(255,236,196,0.26) 0%, rgba(255,190,110,0.08) 36%, transparent 68%)",
            }}
          />
        </div>

        {/* the room is lit by one failing tube: everything away from it falls off */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 62% at 50% 26%, transparent 0%, rgba(4,3,3,0.35) 58%, rgba(4,3,3,0.72) 100%)",
          }}
        />
      </div>

      {/* chalk dust — the studio's letter field, inverted. Capped at 30fps so
          it isn't fighting the scrub for the main thread. */}
      <TamilParticleBackground
        mode="chalk"
        density={0.45}
        speed={0.7}
        opacity={0.55}
        fps={30}
        interactive={false}
      />

      {/* blood bloom, ramped by scroll */}
      <div
        aria-hidden
        data-fx="blood"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(120% 95% at 78% 92%, rgba(150,26,30,0.34) 0%, rgba(70,8,12,0.2) 40%, transparent 74%)",
        }}
      />
      <div
        aria-hidden
        data-fx="falloff"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(105% 78% at 50% 46%, transparent 22%, rgba(0,0,0,0.72) 72%, #000 100%)",
        }}
      />

      {/* scrim so the fixed nav and the HUD never sit on the blown-out wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-linear-to-b from-black/75 via-black/30 to-transparent"
      />

      {/* ── HUD ─────────────────────────────────────────────────────── */}
      <div
        data-hud
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8"
      >
        <div className="pt-[74px]">
          <p className="tamil text-[0.85rem] tracking-[0.2em] text-chalk/70">
            வகுப்பு: ௭-அ
          </p>
          <p className="mt-2 text-[0.62rem] uppercase tracking-[0.32em] text-chalk/35">
            Class 7-A · Attendance 15
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="max-w-xs text-[0.68rem] uppercase leading-relaxed tracking-[0.2em] text-chalk/40">
              First-person survival horror · Coming soon
            </p>
            <WishlistButton className="pointer-events-auto mt-4" />
          </div>
          <p className="hidden text-[0.62rem] uppercase tracking-[0.32em] text-chalk/35 sm:block">
            Scroll into the room
          </p>
        </div>
      </div>

      {/* the blackout sits over everything in the room, HUD included */}
      <div
        aria-hidden
        data-fx="blackout"
        className="pointer-events-none absolute inset-0 z-30 bg-black opacity-0"
      />
    </section>
  );
}
