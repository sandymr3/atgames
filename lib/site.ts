export const STUDIO = {
  name: "AT Games",
  tagline: "Tamil myth, modern machines.",
  location: "Tamil Nadu, India",
  founded: "2024",
  email: "hello@atgames.studio",
} as const;

export const NAV = [
  { href: "/", label: "Home", ta: "இல்லம்" },
  { href: "/about", label: "About", ta: "எங்களைப் பற்றி" },
  { href: "/games", label: "Games", ta: "விளையாட்டுகள்" },
  { href: "/credits", label: "Credits", ta: "நன்றி" },
] as const;

/** The studio motto — Thirukkural 467, Adhikaram 47: தெரிந்து செயல்வகை. */
export const KURAL = {
  number: 467,
  chapter: "தெரிந்து செயல்வகை",
  lines: ["எண்ணித் துணிக கருமம்; துணிந்தபின்", "எண்ணுவது இழுக்கு."],
  translit: "eṇṇit tuṇika karumam; tuṇintapiṉ eṇṇuvatu iḻukku.",
  meaning:
    "Think carefully before you act; once you decide, don't hesitate.",
} as const;

export const VALUES = [
  {
    ta: "கருமம்",
    en: "The Deed",
    body: "We ship. A design that only exists in a doc is a rumour, not a game.",
    span: "md:col-span-3 md:row-span-2",
    tone: "ember",
  },
  {
    ta: "துணிவு",
    en: "Nerve",
    body: "Horror, folklore, grief, caste, memory. We don't sand the edges off a story to widen a funnel.",
    span: "md:col-span-3",
    tone: "plain",
  },
  {
    ta: "மெய்ப்பொருள்",
    en: "The True Thing",
    body: "Tamil that a Tamil player recognises. Written first in Tamil, then localised out — never the reverse.",
    span: "md:col-span-2",
    tone: "plain",
  },
  {
    ta: "நிழல்",
    en: "Shadow",
    body: "What you don't render is louder than what you do.",
    span: "md:col-span-2",
    tone: "plain",
  },
  {
    ta: "கதை",
    en: "Story",
    body: "Two thousand years of literature is our art bible.",
    span: "md:col-span-2",
    tone: "plain",
  },
] as const;

export const GAMES = [
  {
    slug: "fourth-shadow",
    title: "Fourth Shadow",
    ta: "நான்காம் நிழல்",
    status: "In development",
    year: "2026",
    genre: "First-person psychological horror",
    logline:
      "A government school in the Kongu belt. Class 7-A. Twelve buds, three flowers, fifteen in total — and one shadow too many at the back of the room.",
    href: "/games/fourth-shadow",
    cover: "/game/poster-en.webp",
  },
] as const;

export const UPCOMING = [
  { code: "PROJECT ௨", note: "Untitled — village folklore, co-op" },
  { code: "PROJECT ௩", note: "Untitled — Sangam-era action" },
] as const;

export const CREDITS = [
  { role: "Creative Director", name: "—", ta: "படைப்பு இயக்குநர்" },
  { role: "Game Design", name: "—", ta: "விளையாட்டு வடிவமைப்பு" },
  { role: "Art Direction", name: "—", ta: "கலை இயக்கம்" },
  { role: "Environment & Lighting", name: "—", ta: "சூழல் & ஒளி" },
  { role: "Narrative & Tamil Writing", name: "—", ta: "கதை & தமிழ் எழுத்து" },
  { role: "Sound Design", name: "—", ta: "ஒலி வடிவமைப்பு" },
  { role: "Engineering", name: "—", ta: "பொறியியல்" },
] as const;

/** Handles are placeholders until the accounts exist. */
export const SOCIALS = [
  { label: "X / Twitter", handle: "@atgames", href: "#" },
  { label: "Instagram", handle: "@atgames.studio", href: "#" },
  { label: "YouTube", handle: "/@atgames", href: "#" },
  { label: "Discord", handle: "discord.gg/atgames", href: "#" },
  { label: "Steam", handle: "AT Games", href: "#" },
  { label: "itch.io", handle: "atgames.itch.io", href: "#" },
] as const;
