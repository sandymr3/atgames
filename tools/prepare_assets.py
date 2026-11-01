"""
Prepare web assets for the ATTI Games site from the raw brand assets in ../assets.

    python tools/prepare_assets.py

Outputs land in public/ and are committed, so the Next.js build never depends on
Python. Re-run this only when the source art in assets/ changes.

Four jobs:

1. BRAND  - The logo PDF stores the AT monogram as vector outlines that are
            *clipped over an embedded raster* holding the orange gradient. We
            lift the outlines and re-fill them with a real SVG linearGradient,
            producing a crisp, animatable lockup.

2. SCENE  - The 5760x4320 title-card poster is flattened art. We cut the chalk
            title, the ghost silhouette and the bloody handprint out of it as
            transparent layers, and erase them from the base plate by
            inpainting, so each can move on its own parallax plane without
            doubling up against a baked-in copy of itself.

3. POSTER - Web-sized derivatives of both title cards for the gallery / OG.

4. STEAM  - Screenshots, banners and clips from the store page. Run on its own
            with `python tools/prepare_assets.py steam`.
"""

from __future__ import annotations

import base64
import io
import re
import shutil
import urllib.request
from pathlib import Path

import fitz  # PyMuPDF
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "assets"
PUBLIC = ROOT / "public"
BRAND = PUBLIC / "brand"
GAME = PUBLIC / "game"

POSTER_EN = SRC / "title card poster copy.jpg.jpeg"
POSTER_TA = SRC / "title card poster - tamil copy.jpg.jpeg"
LOGO_PDF = SRC / "at complite.pdf"

# The store page, saved from the browser. Clips and the capsule are not in the
# saved folder, so those come off Steam's CDN.
STEAM_SAVED = Path.home() / "Downloads" / "Fourth Shadow_நான்காம் நிழல் on Steam_files"
STEAM_CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5105680"
STEAM_CAPSULE = "4e590fb5d149cafd50b545b0f7517aa1757346c4/capsule_616x353.jpg"
# in store order
STEAM_SHOTS = (
    "e39154064d1af1b239c0996ccc845ed5d7018f64",
    "1b8bdde5bd2ca33eec9a6141fd393f2cbde003b4",
    "8fcdb52bd1efbe13fbbcad51507fb492fc522036",
    "ab53890a77c035e73c2f82e06204e3a7869d3c35",
    "7245ce286958327dcf13a4e9c4bef9b8b2ef8b5e",
    "1e64c037c3e8c928b9f5adedc9ec9b9d7fcd84ef",
    "d618d7e58989ef2f0f8276922aff5e2cfdb96d5c",
    "825d6fa238c7087615df1687940e9c650009bf3f",
)
STEAM_BANNERS = {
    "escape": "33670b9dd04c226cc1a41283a8711482",
    "survive": "2324879db6f6014abb4ccc110dd93bd6",
    "resources": "f9e7ed459c6010bf885c867d1281d24d",
    "discover": "62371596d6710659835afafdafd7245e",
}
STEAM_CLIPS = {
    "escape": "8f27877f77a924aa6981b000a946adca",
    "survive": "ec5a3649978b2978adb10cdec8e65427",
    "resources": "f690d8e84dd86d597b1907b8ef36e772",
    "discover": "de790301898357442b4fe2c6c8f30642",
}

# Brand gradient, sampled straight out of the logo raster. Hue runs 35deg (gold)
# at the top-left of the mark down to 8deg (deep red) at the bottom-right.
EMBER_GOLD = "#F2A020"
EMBER = "#EC6C24"
EMBER_DEEP = "#D44426"
EMBER_ASH = "#C83C27"

# --- crop boxes in source-poster pixels (5760 x 4320) -----------------------
BOX_TITLE = (1500, 1450, 4240, 2880)   # chalk logotype incl. drips
BOX_GHOST = (760, 1240, 2080, 3020)    # standing silhouette on the board
BOX_LABELS = (630, 1040, 1040, 1370)   # தேதி / கிழமை — board furniture, keep
BOX_HAND = (3400, 1060, 3870, 1660)    # bloody handprint
BOARD_BOTTOM = 2960                    # inner bottom edge of the blackboard


# ---------------------------------------------------------------------------
# small numeric helpers (kept dependency-free: numpy + Pillow only)
# ---------------------------------------------------------------------------

def box_blur(a: np.ndarray, radius: int, passes: int = 3) -> np.ndarray:
    """Separable box blur via summed-area sums. Three passes ~= a Gaussian."""
    out = a.astype(np.float32)
    for _ in range(passes):
        out = _box_1d(out, radius, axis=0)
        out = _box_1d(out, radius, axis=1)
    return out


def _box_1d(a: np.ndarray, r: int, axis: int) -> np.ndarray:
    if r < 1:
        return a
    a = np.swapaxes(a, 0, axis)
    pad = [(r, r)] + [(0, 0)] * (a.ndim - 1)
    p = np.pad(a, pad, mode="edge")
    c = np.cumsum(p, axis=0, dtype=np.float32)
    c = np.concatenate([np.zeros((1,) + c.shape[1:], np.float32), c], axis=0)
    out = (c[2 * r + 1:] - c[: -(2 * r + 1)]) / (2 * r + 1)
    return np.swapaxes(out, 0, axis)


def luma(rgb: np.ndarray) -> np.ndarray:
    return rgb @ np.array([0.299, 0.587, 0.114], np.float32)


def norm(x: np.ndarray, lo: float, hi: float) -> np.ndarray:
    """Clamped linear ramp -> 0..1."""
    return np.clip((x - lo) / (hi - lo), 0.0, 1.0)


def feather_rect(shape: tuple[int, int], inset: int, blur: int) -> np.ndarray:
    """Soft-edged rectangle mask, used to keep a crop's threshold local."""
    h, w = shape
    m = np.zeros((h, w), np.float32)
    m[inset:h - inset, inset:w - inset] = 1.0
    return np.clip(box_blur(m, blur), 0, 1)


def _shrink(a: np.ndarray, scale: int) -> np.ndarray:
    h, w = a.shape[:2]
    mode = "RGB" if a.ndim == 3 else "F"
    src = a.astype(np.uint8) if a.ndim == 3 else a.astype(np.float32)
    im = Image.fromarray(src, mode).resize((w // scale, h // scale), Image.BOX)
    return np.asarray(im, np.float32)


def _grow(a: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")
    return np.asarray(im.resize(size, Image.BICUBIC), np.float32)


def inpaint(rgb: np.ndarray, mask: np.ndarray, scale: int = 4,
            iterations: int = 56, grain: float = 2.2) -> np.ndarray:
    """Diffusion inpaint. Colour is pulled in from the unmasked surroundings
    until it meets in the middle, which is what a single normalised
    convolution cannot do -- a wide stroke's interior has no known neighbours
    to average, so one pass leaves a dark ghost of whatever was erased.

    Run at 1/`scale` resolution: the fill is low-frequency by nature, so the
    downscale costs nothing visually and turns minutes into seconds. Grain is
    added back afterwards so the patch doesn't read as a suspiciously smooth
    blob against the film-grained plate."""
    h, w = rgb.shape[:2]
    small = _shrink(rgb, scale)
    m = np.clip(_shrink(mask * 255.0, scale) / 255.0 * 1.6, 0, 1)[..., None]
    known = 1.0 - m

    # Seed the masked area with a wide weighted average of what surrounds it,
    # then relax: each pass lets the fill diffuse a few more pixels inward.
    num = box_blur(small * known, 36)
    den = box_blur(np.repeat(known, 3, axis=2), 36) + 1e-4
    filled = np.where(m > 0.01, num / den, small)
    for _ in range(iterations):
        filled = small * known + box_blur(filled, 5, passes=1) * m

    up = _grow(filled, (w, h))
    rng = np.random.default_rng(7)
    noise = rng.normal(0, grain, rgb.shape).astype(np.float32)
    m3 = mask[..., None]
    return np.clip(rgb * (1 - m3) + (up + noise) * m3, 0, 255)


def blob(mask: np.ndarray, dilate: int = 16, thr: float = 0.02,
         soft: int = 12) -> np.ndarray:
    """Turn a matte into a solid, generously dilated erase region.

    A cutout matte deliberately keeps only the strong core of a shape. Erasing
    needs the opposite: every last pixel of halo has to go, or the inpaint
    leaves a bright outline tracing whatever was removed."""
    m = (box_blur(mask, dilate) > thr).astype(np.float32)
    return np.clip(box_blur(m, soft) * 3.0, 0, 1)


def clean(mask: np.ndarray, open_r: int = 14, close_r: int = 12) -> np.ndarray:
    """Blur-threshold open then close: drops speckle from board grain while
    keeping one solid blob, without pulling in scipy for real morphology."""
    m = (box_blur(mask, open_r) > 0.55).astype(np.float32)
    m = (box_blur(m, close_r) > 0.22).astype(np.float32)
    return m


def grade(rgb: np.ndarray, brightness: float, contrast: float,
          saturation: float) -> np.ndarray:
    """Bake a colour grade into the pixels, in the same order CSS applies
    filter: brightness() contrast() saturate().

    This used to be a CSS filter on the plate. A filter on an element that is
    also being transform-scaled every scrub frame forces a full filter pass
    over the whole image on every one of those frames, which is what was
    dropping frames on the game hero. Same look, zero runtime cost.
    """
    out = rgb * brightness
    out = (out - 128.0) * contrast + 128.0
    grey = luma(out)[..., None]
    out = grey + (out - grey) * saturation
    return np.clip(out, 0, 255)


def to_png(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    a = np.clip(alpha * 255, 0, 255).astype(np.uint8)
    c = np.clip(rgb, 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([c, a]), "RGBA")


def fit(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img
    h = round(img.height * width / img.width)
    return img.resize((width, h), Image.LANCZOS)


# ---------------------------------------------------------------------------
# 1. BRAND — rebuild the logo as pure SVG
# ---------------------------------------------------------------------------

def _grad(id_: str, x1: float, y1: float, x2: float, y2: float) -> str:
    return (
        f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" '
        f'x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
        f'<stop offset="0" stop-color="{EMBER_GOLD}"/>'
        f'<stop offset=".48" stop-color="{EMBER}"/>'
        f'<stop offset=".8" stop-color="{EMBER_DEEP}"/>'
        f'<stop offset="1" stop-color="{EMBER_ASH}"/>'
        f"</linearGradient>"
    )


def _attrs(path: str) -> tuple[str, str]:
    d = re.search(r'\sd="([^"]*)"', path).group(1).strip()
    t = re.search(r'\stransform="([^"]*)"', path)
    return d, (t.group(1) if t else "")


def _emit_lockup_module(mark: str, dot: str, letters: list[str],
                        ids: list[str]) -> None:
    """Emit the outline data as a TS module so the hero can inline the logo as
    real DOM and animate each letter, rather than shipping it as a flat <img>."""
    md, mt = _attrs(mark)
    dd, dt = _attrs(dot)
    rows = []
    for path, i in zip(letters, ids):
        ld, lt = _attrs(path)
        rows.append('  { id: "%s", d: "%s", transform: "%s" },' % (i, ld, lt))
    out = ROOT / "lib" / "lockup.ts"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        "// GENERATED by tools/prepare_assets.py from assets/at complite.pdf.\n"
        "// Outline data for the ATTI Games lockup. Do not edit by hand.\n\n"
        'export const LOCKUP_VIEWBOX = "244 171 302 168";\n'
        'export const MARK_VIEWBOX = "339 175 112 111";\n\n'
        "export const MARK = { d: \"%s\", transform: \"%s\" } as const;\n\n"
        "export const DOT = { d: \"%s\", transform: \"%s\" } as const;\n\n"
        "export const WORDMARK = [\n%s\n] as const;\n"
        % (md, mt, dd, dt, "\n".join(rows)),
        encoding="utf-8",
    )
    print("brand  -> lib/lockup.ts")


def build_brand() -> None:
    doc = fitz.open(LOGO_PDF)
    svg = doc[0].get_svg_image(text_as_path=True)

    # The two monogram outlines live as clip paths; cp1 is the large mark, cp3
    # the small one nested inside the wordmark's "G".
    clips = dict(re.findall(r'<clipPath id="(cp\d)">\s*(<path[^>]*/>)', svg, re.S))
    mark_big, mark_small = clips["cp1"], clips["cp3"]

    # The wordmark letters are already honest white vector paths.
    letters = re.findall(r'(<path[^>]*fill="#ffffff"[^>]*/>)', svg)
    if len(letters) != 6:
        raise SystemExit(f"expected 6 wordmark paths, found {len(letters)}")

    def paint(path: str, url: str, id_: str) -> str:
        attrs = ' id="%s" fill="%s" fill-rule="nonzero"/>' % (id_, url)
        return path.replace("/>", attrs)

    ids = ["a", "t", "g", "m", "e", "s"]
    worded = "\n    ".join(
        p.replace("/>", ' id="wm-%s" fill="var(--wordmark, #F2EEE9)"/>' % i)
        for p, i in zip(letters, ids)
    )

    BRAND.mkdir(parents=True, exist_ok=True)

    # --- mark only ---------------------------------------------------------
    (BRAND / "at-mark.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="339 175 112 111" '
        'role="img" aria-label="ATTI Games">\n'
        "  <defs>%s</defs>\n  %s\n</svg>\n"
        % (_grad("markGrad", 343, 179, 447, 282),
           paint(mark_big, "url(#markGrad)", "mark")),
        encoding="utf-8",
    )

    # --- full lockup -------------------------------------------------------
    (BRAND / "at-lockup.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="244 171 302 168" '
        'role="img" aria-label="ATTI Games">\n'
        "  <defs>\n    %s\n    %s\n  </defs>\n"
        "  %s\n"
        '  <g id="lock-wordmark">\n    %s\n  </g>\n'
        "  %s\n</svg>\n"
        % (_grad("lockGrad", 343, 179, 447, 282),
           _grad("lockGradSm", 377, 296, 414, 333),
           paint(mark_big, "url(#lockGrad)", "lock-mark"),
           worded,
           paint(mark_small, "url(#lockGradSm)", "lock-dot")),
        encoding="utf-8",
    )

    # --- raster icon for favicon / OG --------------------------------------
    # MuPDF's SVG renderer ignores linearGradient, so render the outline as a
    # flat white matte and lay the ember gradient over it in numpy instead.
    tmp = BRAND / "_icon.svg"
    tmp.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="335 171 120 119">'
        '<rect x="335" y="171" width="120" height="119" fill="#000"/>'
        "%s</svg>" % paint(mark_big, "#ffffff", "m"),
        encoding="utf-8",
    )
    idoc = fitz.open(tmp)
    pm = idoc[0].get_pixmap(matrix=fitz.Matrix(512 / 120, 512 / 120), alpha=False)
    matte = np.asarray(Image.frombytes("RGB", (pm.width, pm.height), pm.samples),
                       np.float32)[:, :, 0] / 255.0
    idoc.close()
    tmp.unlink()

    h, w = matte.shape
    t = np.clip(np.add.outer(np.linspace(0, 1, h), np.linspace(0, 1, w)) / 2, 0, 1)
    stops = [(0.0, EMBER_GOLD), (0.48, EMBER), (0.8, EMBER_DEEP), (1.0, EMBER_ASH)]
    rgb = np.zeros((h, w, 3), np.float32)
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        a0 = np.array([int(c0[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
        a1 = np.array([int(c1[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
        seg = np.clip((t - p0) / (p1 - p0), 0, 1)[..., None]
        band = ((t >= p0) & (t <= p1))[..., None]
        rgb = np.where(band, a0 + (a1 - a0) * seg, rgb)
    icon = rgb * matte[..., None] + np.array([8, 7, 10], np.float32) * (1 - matte[..., None])
    Image.fromarray(icon.astype(np.uint8), "RGB").save(BRAND / "at-mark-512.png")
    shutil.copy(BRAND / "at-mark-512.png", ROOT / "app" / "icon.png")

    _emit_lockup_module(mark_big, mark_small, letters, ids)
    print("brand  -> at-mark.svg, at-lockup.svg, at-mark-512.png, app/icon.png")


# ---------------------------------------------------------------------------
# 2. SCENE — cut layers out of the poster, erase them from the base plate
# ---------------------------------------------------------------------------

def chalk_alpha(rgb: np.ndarray) -> np.ndarray:
    """Chalk is the only bright thing on the board: luminance is the matte.
    Slight gamma keeps the powdery grain instead of hard-edging the strokes."""
    return norm(luma(rgb), 74.0, 182.0) ** 1.15


def cut_title(poster: Path, out: Path) -> None:
    im = Image.open(poster).convert("RGB").crop(BOX_TITLE)
    rgb = np.asarray(im, np.float32)
    a = chalk_alpha(rgb) * feather_rect(rgb.shape[:2], 6, 14)
    # Lift the chalk toward bone white; the raw crop is muddy where the board
    # shows through the powder.
    lifted = np.clip(rgb * 0.35 + 232 * 0.65, 0, 255)
    png = to_png(lifted, a)
    fit(png, 1500).save(out, "WEBP", quality=90, method=6)
    print(f"scene  -> {out.name}")


def cut_ghost(rgb_full: np.ndarray) -> tuple[Image.Image, np.ndarray]:
    x0, y0, x1, y1 = BOX_GHOST
    crop = rgb_full[y0:y1, x0:x1]
    # The silhouette sits around L~10 while the board around it sits near L~27,
    # so darkness *is* the matte. Blur first so board grain does not speckle it,
    # then open/close so only the one big shape survives.
    l = box_blur(luma(crop), 6)
    a = clean(norm(-l, -24.0, -15.0), open_r=16, close_r=14)
    a *= feather_rect(crop.shape[:2], 4, 20)
    if y1 > BOARD_BOTTOM:  # never let the matte spill past the board's frame
        a[BOARD_BOTTOM - y0:] = 0.0
    a = np.clip(box_blur(a, 9), 0, 1)
    layer = to_png(np.zeros_like(crop) + 5.0, a)
    return fit(layer, 760), a


def cut_hand(rgb_full: np.ndarray) -> tuple[Image.Image, np.ndarray]:
    x0, y0, x1, y1 = BOX_HAND
    crop = rgb_full[y0:y1, x0:x1]
    # The wall itself is warm brown, so absolute redness matches everything.
    # High-pass it against a wide local average and only the print stands out.
    red = box_blur(crop[:, :, 0] - np.maximum(crop[:, :, 1], crop[:, :, 2]), 3)
    a = norm(red - box_blur(red, 110), 4.0, 20.0) ** 0.9
    a *= feather_rect(crop.shape[:2], 4, 16)
    a = np.clip(box_blur(a, 3) * 1.15, 0, 1)
    # Push the sampled blood toward a deeper, wetter red.
    blood = np.dstack([
        np.clip(crop[:, :, 0] * 1.35 + 14, 0, 255),
        crop[:, :, 1] * 0.62,
        crop[:, :, 2] * 0.55,
    ])
    return fit(to_png(blood, a), 420), a


def build_scene() -> None:
    GAME.mkdir(parents=True, exist_ok=True)

    cut_title(POSTER_EN, GAME / "title-en.webp")
    cut_title(POSTER_TA, GAME / "title-ta.webp")

    base = np.asarray(Image.open(POSTER_EN).convert("RGB"), np.float32)

    ghost_img, ghost_a = cut_ghost(base)
    ghost_img.save(GAME / "ghost.png")
    hand_img, hand_a = cut_hand(base)
    hand_img.save(GAME / "handprint.png")
    print("scene  -> ghost.png, handprint.png")

    # Erase all three moving pieces from the plate so the parallax planes are
    # not sliding over baked-in copies of themselves.
    erase = np.zeros(base.shape[:2], np.float32)

    def stamp(box: tuple[int, int, int, int], mask: np.ndarray) -> None:
        x0, y0, x1, y1 = box
        erase[y0:y1, x0:x1] = np.maximum(erase[y0:y1, x0:x1], mask)

    tx0, ty0, tx1, ty1 = BOX_TITLE
    # A lower luminance floor than the cutout uses: catch the chalk *dust*, not
    # just the strokes.
    stamp(BOX_TITLE, blob(norm(luma(base[ty0:ty1, tx0:tx1]), 48.0, 140.0)))
    stamp(BOX_GHOST, blob(ghost_a, dilate=18, thr=0.03, soft=14))
    stamp(BOX_HAND, blob(hand_a, dilate=14, thr=0.03, soft=10))

    # The ghost's hood reaches up beside the date labels; those are chalked
    # board furniture and have to survive the erase.
    lx0, ly0, lx1, ly1 = BOX_LABELS
    erase[ly0:ly1, lx0:lx1] = 0.0

    plate = inpaint(base, np.clip(erase, 0, 1), iterations=110)
    plate = grade(plate, brightness=1.04, contrast=1.10, saturation=0.88)
    plate_img = Image.fromarray(plate.astype(np.uint8), "RGB")
    fit(plate_img, 2560).save(GAME / "scene-plate.webp", "WEBP", quality=84, method=6)
    fit(plate_img, 1280).save(GAME / "scene-plate-sm.webp", "WEBP", quality=82, method=6)
    print("scene  -> scene-plate.webp, scene-plate-sm.webp")


# ---------------------------------------------------------------------------
# 3. POSTER — gallery / social derivatives
# ---------------------------------------------------------------------------

def build_posters() -> None:
    for src, name in ((POSTER_EN, "poster-en"), (POSTER_TA, "poster-ta")):
        im = Image.open(src).convert("RGB")
        fit(im, 1800).save(GAME / f"{name}.webp", "WEBP", quality=82, method=6)
    # Open Graph card: 1200x630 centre crop of the English title card.
    im = Image.open(POSTER_EN).convert("RGB")
    w, h = im.size
    target = 1200 / 630
    ch = int(w / target)
    top = int(h * 0.30)
    im.crop((0, top, w, min(h, top + ch))).resize((1200, 630), Image.LANCZOS).save(
        PUBLIC / "og.jpg", quality=86
    )
    print("poster -> poster-en.webp, poster-ta.webp, og.jpg")


def fetch(url: str, out: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as res:
        out.write_bytes(res.read())


def build_steam() -> None:
    """Self-host the store page's media, so the site never hotlinks Steam."""
    if not STEAM_SAVED.is_dir():
        raise SystemExit(f"missing saved Steam page: {STEAM_SAVED}")
    shots = GAME / "shots"
    banners = GAME / "banners"
    clips = GAME / "clips"
    for d in (shots, banners, clips):
        d.mkdir(parents=True, exist_ok=True)

    for i, sid in enumerate(STEAM_SHOTS, 1):
        im = Image.open(STEAM_SAVED / f"ss_{sid}.1920x1080.jpg").convert("RGB")
        im.save(shots / f"shot-{i:02d}.webp", "WEBP", quality=84, method=6)
        fit(im, 640).save(shots / f"shot-{i:02d}-sm.webp", "WEBP", quality=78, method=6)

    for name, sid in STEAM_BANNERS.items():
        im = Image.open(STEAM_SAVED / f"{sid}.avif").convert("RGB")
        im.save(banners / f"{name}.webp", "WEBP", quality=86, method=6)

    for name, sid in STEAM_CLIPS.items():
        for ext in ("webm", "mp4"):
            fetch(f"{STEAM_CDN}/extras/{sid}.{ext}", clips / f"{name}.{ext}")
        poster = clips / f"{name}.poster.avif"
        fetch(f"{STEAM_CDN}/extras/{sid}.poster.avif", poster)
        Image.open(poster).convert("RGB").save(
            clips / f"{name}.webp", "WEBP", quality=80, method=6
        )
        poster.unlink()

    fetch(f"{STEAM_CDN}/{STEAM_CAPSULE}", GAME / "capsule.jpg")
    print("steam -> shots/, banners/, clips/, capsule.jpg")


if __name__ == "__main__":
    import sys

    steps = {
        "brand": build_brand,
        "scene": build_scene,
        "posters": build_posters,
        "steam": build_steam,
    }
    want = [a.lstrip("-") for a in sys.argv[1:]] or list(steps)
    if want != ["steam"]:
        for missing in [p for p in (POSTER_EN, POSTER_TA, LOGO_PDF) if not p.exists()]:
            raise SystemExit(f"missing source asset: {missing}")
    for name in want:
        if name not in steps:
            raise SystemExit(f"unknown step {name!r}; pick from {list(steps)}")
        steps[name]()
    print("done.")
