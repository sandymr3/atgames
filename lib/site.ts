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
    status: "Coming soon",
    release: "Coming soon",
    genre: "First-person survival horror",
    logline:
      "Three school boys enter an abandoned haunted school out of curiosity, and a mysterious ritual awakens something inside it.",
    href: "/games/fourth-shadow",
    cover: "/game/poster-en.webp",
  },
] as const;

/**
 * Everything below mirrors the Steam store page, which is the source of truth.
 * Media comes from `python tools/prepare_assets.py steam`.
 */
export const FOURTH_SHADOW = {
  description:
    "Three school boys enter an abandoned haunted school out of curiosity. They perform a mysterious ritual, unknowingly awakening something. As darkness takes over, fear becomes their worst nightmare. Will they escape the haunted school alive, or will something keep them there forever?",
  story: [
    "Three school boys enter an abandoned haunted school out of curiosity.",
    "They perform a mysterious ritual, unknowingly awakening something.",
    "As darkness takes over, fear becomes their worst nightmare.",
    "Will they escape the haunted school alive, or will something keep them there forever?",
  ],
  features: [
    {
      slug: "escape",
      title: "Creepy things have happened",
      body: "In the aftermath of the boys' foolishness, escaping the school alive, away from the darkness and the unknown, becomes all that matters.",
    },
    {
      slug: "survive",
      title: "Survival is the only option",
      body: "Overcome your fear of the darkness and the unknown to survive the mysterious creature that wants you dead.",
    },
    {
      slug: "resources",
      title: "Manage your resources",
      body: "Collect and manage the resources spread throughout the school, and be careful how you use them.",
    },
    {
      slug: "discover",
      title: "Discover the mysterious",
      body: "Surrounded by an unknown environment, discover the mysterious things the school was hiding to find a way to stay alive.",
    },
  ],
  screenshots: [
    "Two school boys in white shirts stand before the barred entrance of the school at night",
    "A ritual circle of skulls and candles around a pentagram on the floor",
    "A blood-streaked school corridor in torchlight",
    "A teddy bear sitting on a wooden chair in a dark room",
    "A boy seated on a chair in front of an old computer",
    "A rusted electrical panel on a classroom wall",
    "A steel cupboard between a rocket poster and a map of India",
    "A library with bookshelves, a table and chairs in torchlight",
  ],
  tags: [
    "Exploration",
    "Puzzle",
    "3D",
    "Adventure",
    "First-Person",
    "Horror",
    "Multiple Endings",
    "Story Rich",
    "1990's",
    "Retro",
    "Survival Horror",
    "Indie",
    "Singleplayer",
    "Gore",
  ],
  facts: [
    ["Release", "Coming soon"],
    ["Developer", "Atti Games"],
    ["Publisher", "Atti Games"],
    ["Platform", "Windows PC"],
    ["Features", "Single-player · Family Sharing"],
  ],
  languages: ["English", "Tamil"],
  mature:
    "This game contains horror, suspense, and disturbing imagery, including hostile creatures and human bones. Players may encounter bloody props, graphic gore, dark environments, sudden scares, and unsettling audio-visual effects. The game explores themes of fear, danger, and survival that may be disturbing to some players.",
  requirements: [
    {
      tier: "Minimum",
      specs: [
        ["OS", "Windows 10"],
        ["Processor", "Intel Core i5-7400 or AMD Ryzen 3 2300X"],
        ["Memory", "8 GB RAM"],
        ["Graphics", "NVIDIA GeForce GTX 1650 / AMD Radeon RX 570"],
        ["DirectX", "Version 11"],
        ["Storage", "8 GB available space"],
      ],
    },
    {
      tier: "Recommended",
      specs: [
        ["OS", "Windows 11"],
        ["Processor", "Intel Core i7-9700 or AMD Ryzen 5 3600X"],
        ["Memory", "8 GB RAM"],
        ["Graphics", "NVIDIA GTX 1660 Ti / AMD RX 5600 XT or better"],
        ["DirectX", "Version 12"],
        ["Storage", "8 GB available space"],
      ],
    },
  ],
} as const;

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
  { label: "LinkedIn", handle: "Atti Games", href: "https://www.linkedin.com/posts/atgame_indiangamedevelopment-tamilgame-horrorgame-activity-7516859555180630016-Rbkv" },
  { label: "Instagram", handle: "atti__games_", href: "https://www.instagram.com/atti__games_/reels/" },
  { label: "YouTube", handle: "Atti Games", href: "https://youtube.com/@at_tamilgames?si=u9dUGuCSYb5qel8b" },
  { label: "Discord", handle: "Atti Games", href: "https://discord.gg/9byucw2nGj" },
] as const;
