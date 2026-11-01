# ATTI Games — studio site

Next.js 16 (App Router) · Tailwind v4 · Motion (Framer Motion) · GSAP ScrollTrigger · Canvas 2D.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Studio hero, the Thirukkural motto, featured game |
| `/about` | Mission + bento grid of studio values |
| `/games` | Slate — Fourth Shadow plus undisclosed projects |
| `/games/fourth-shadow` | The game page. Swaps the whole shell into `data-theme="horror"` |
| `/credits` | Credit roll, email and social handles (placeholders) |

## Where the design lives

- **`app/globals.css`** — the entire design system. Tailwind v4 is CSS-first, so the
  `@theme` block *is* the config; there is no `tailwind.config.js`. Colours, fonts,
  easings, the grain/vignette/flicker utilities and the horror theme override are all here.
- **`lib/site.ts`** — all copy, nav, credits, socials, game metadata. Edit content here,
  not in the components. To give a credit a photo: drop a square image (≥256px) in
  `public/credits/` and set that entry's `photo` field to its path — entries with
  `photo: null` fall back to the studio mark (`components/credits/ContributorAvatar.tsx`),
  so an empty roster never looks broken.
- **`lib/lockup.ts`** — generated logo outline data (see below).

## Assets

`public/brand/*` and `public/game/*` are **generated**, and committed, from the raw art in
`../assets` — the studio logo PDF and the two 5760×4320 title-card renders. That folder
sits outside this repo, so a fresh clone can build and run but cannot re-run the pipeline
until the source art is put back alongside it:

```bash
python tools/prepare_assets.py            # everything
python tools/prepare_assets.py brand      # or one step: brand | scene | posters
```

The script does three things worth knowing about:

1. **The logo is rebuilt as real SVG.** The source PDF stores the AT monogram as vector
   outlines clipped over an embedded raster that holds the orange gradient. The script
   lifts the outlines and re-fills them with an SVG `linearGradient`, so the mark is
   scalable and each wordmark letter can be animated independently
   (`components/AtLockup.tsx`). Brand ramp, sampled from the source: `#F2A020 → #EC6C24
   → #D44426 → #C83C27`.
2. **The title card is taken apart.** The chalk logotype, the ghost silhouette and the
   bloody handprint are cut out as transparent layers **and erased from the base plate**
   by a diffusion inpaint. Without the erase, the parallax planes would slide over
   baked-in copies of themselves and read as a printing error rather than depth.
3. Web-sized poster and OG derivatives (the source renders are 5760×4320, ~10 MB each).

Outputs are committed, so the build never needs Python. Re-run only when the source art
changes. Requires `pillow`, `numpy`, `pymupdf`.

## The two things most likely to trip you up

**Never put a CSS transform on a path that carries a `transform` attribute.** The logo
outlines come out of the PDF with a `matrix(...)` presentation attribute, and a CSS
transform silently overrides it — the wordmark collapses to the origin with no error.
Animate a wrapping `<g>` instead. See `components/AtLockup.tsx`.

**Never drive `whileInView` from an element that starts translated out of an
`overflow-hidden` parent.** Its intersection area is zero, so the observer never fires
and the content stays invisible forever. Drive it from the container with variants.
See `components/KuralBlock.tsx`.

## Particle background

`components/TamilParticleBackground.tsx` — Canvas 2D field of Tamil letterforms.

```tsx
<TamilParticleBackground mode="ember" density={1} speed={1} interactive opacity={1} />
```

`mode="chalk"` inverts it into falling dust for the game page. The component waits on
`document.fonts.load('… "Noto Serif Tamil"')` before its first draw — skip that and every
glyph bakes into the atlas as a fallback box. Glyphs are pre-rendered once per
(character × colour) and blitted with `drawImage`; cursor repulsion is a spring-damped
displacement field, not a force on velocity. Pauses off-screen and on tab blur, and
renders one static frame under `prefers-reduced-motion`.
