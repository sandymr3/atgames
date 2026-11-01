export const STUDIO = {
  name: "ATTI Games",
  tagline: "Tamil myth, modern machines.",
  location: "Tamil Nadu, India",
  founded: "2024",
  email: "atindegames@gmail.com",
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

export const STEAM_URL =
  "https://store.steampowered.com/app/5105680/Fourth_Shadow%E0%AE%A8%E0%AE%BE%E0%AE%A9%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%AE%E0%AF%8D_%E0%AE%A8%E0%AE%BF%E0%AE%B4%E0%AE%B2%E0%AF%8D/";

export const GAMES = [
  {
    slug: "fourth-shadow",
    title: "Fourth Shadow",
    ta: "நான்காம் நிழல்",
    status: "In development",
    year: "2026",
    genre: "First-person psychological horror",
    logline:
      "In a rural government school, three curious students enter a forbidden place, unaware of the terrifying mysteries awaiting them.",
    href: "/games/fourth-shadow",
    cover: "/game/poster-en.webp",
  },
] as const;

export const UPCOMING = [
  { code: "PROJECT உ", note: "Untitled horror game" },
  { code: "PROJECT ங", note: "Untitled simulation game" },
] as const;

/**
 * `photo` is optional and null until someone supplies one. Drop an image in
 * `public/credits/` (square, ≥256px, sensible file size) and point this field
 * at it, e.g. `photo: "/credits/priya.jpg"` — ContributorAvatar falls back to
 * the studio mark when it's null, so entries without a photo never look broken.
 */
export const CREDITS = [
  { role: "Creative Director", name: "Ganesh Ram", ta: "படைப்பு இயக்குநர்", photo: null },
  { role: "Game Design", name: "Allwyn", ta: "விளையாட்டு வடிவமைப்பு", photo: null },
  { role: "Art Direction", name: "Vijaysundar", ta: "கலை இயக்கம்", photo: null },
  { role: "Character Design", name: "Guru Prakash", ta: "கதாபாத்திர வடிவமைப்பு", photo: null },
  { role: "Sound Design", name: "Brington", ta: "ஒலி வடிவமைப்பு", photo: null },
  { role: "Concept Artist", name: "Lokesh Kumar", ta: "கருத்து ஓவியர்", photo: null },
  { role: "Video & Poster Editor", name: "Suthish", ta: "காணொளி & சுவரொட்டி தொகுப்பாளர்", photo: null },
] as const;

export const SOCIALS = [
  { label: "Steam", handle: "Fourth Shadow / நான்காம் நிழல்", href: STEAM_URL },
  { label: "LinkedIn", handle: "atgame", href: "https://www.linkedin.com/posts/atgame_indiangamedevelopment-tamilgame-horrorgame-activity-7516859555180630016-Rbkv" },
] as const;
