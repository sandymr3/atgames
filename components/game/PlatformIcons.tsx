import { STEAM_URL } from "@/lib/site";

const PLATFORMS = [
  {
    name: "PC / Steam",
    note: "Wishlist now",
    href: STEAM_URL,
    // simplified Steam mark
    path: "M12 2a10 10 0 0 0-9.96 9.16l5.34 2.2a2.82 2.82 0 0 1 1.6-.5h.14l2.37-3.44v-.05a3.77 3.77 0 1 1 3.77 3.77h-.09l-3.38 2.42v.12a2.83 2.83 0 0 1-5.6.55L2.4 14.7A10 10 0 1 0 12 2Zm-3.2 15.16a2.18 2.18 0 0 0 3.03-1.99 2.18 2.18 0 0 0-3-2l1.13.47a1.6 1.6 0 1 1-1.24 2.96l-1.1-.46a2.18 2.18 0 0 0 1.18 1.02Zm6.46-4.9a2.52 2.52 0 1 0 0-5.03 2.52 2.52 0 0 0 0 5.03Zm0-.62a1.9 1.9 0 1 1 0-3.79 1.9 1.9 0 0 1 0 3.8Z",
  },
  {
    name: "PlayStation 5",
    note: "TBA",
    path: "M9.5 3.6v13.9l3.2 1V7.9c0-.6.3-1 .8-.9.6.2.8.8.8 1.5v4.1c1.9.9 3.4.1 3.4-2.4 0-2.6-.9-3.7-3.6-4.6-1.1-.4-3-1-4.6-1.5v-.5ZM6.1 18.1c-1.3.4-1.5.9-.4 1.3 1 .3 2.6.4 3.7 0l3.6-1.3v-1.6l-4.7 1.7c-.5.2-1.2.2-1.7 0-.4-.1-.4-.4.1-.6l6.3-2.2v-1.7l-6 2.1s-.5.2-.9.3Zm12.6-2.6c-1.1-.4-3-.5-4.6 0l-.9.3v1.6l1.6-.6c.5-.2 1.3-.2 1.8 0 .5.1.4.4-.1.6l-3.3 1.2v1.6l4.6-1.7s.6-.2 1-.5c.4-.2.8-.9-.1-1.3Z",
  },
  {
    name: "Xbox Series",
    note: "TBA",
    path: "M12 2a10 10 0 0 1 5.9 1.94c-1.6-.9-4.3.6-5.9 2.2-1.6-1.6-4.3-3.1-5.9-2.2A10 10 0 0 1 12 2ZM4.3 5.6C6 5 9.1 7.8 12 11c2.9-3.2 6-6 7.7-5.4A10 10 0 0 1 20.7 17c-.9-2.7-5-6-8.7-8.3C8.3 11 4.2 14.3 3.3 17a10 10 0 0 1 1-11.4Z",
  },
  {
    name: "Nintendo Switch",
    note: "TBA",
    path: "M9.5 2h-2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h2V2Zm-2 2h.5v16h-.5A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4Zm-.4 2.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM16.5 2h-2v20h2a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2Zm.4 9.4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z",
  },
] as const;

export const STEAM_PATH = PLATFORMS[0].path;

export default function PlatformIcons() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden border border-chalk/10 bg-chalk/10 sm:grid-cols-4">
      {PLATFORMS.map((p) => {
        const card = (
          <>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-7 w-7 fill-chalk/45 transition-colors duration-500 group-hover:fill-blood-lit"
            >
              <path d={p.path} />
            </svg>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.16em] text-chalk/80">
                {p.name}
              </p>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.22em] text-chalk/30">
                {p.note}
              </p>
            </div>
          </>
        );
        const cardClass =
          "group flex h-full flex-col items-start gap-5 bg-[#0a0908] px-6 py-8 transition-colors duration-500 hover:bg-[#120e0e]";

        return (
          <li key={p.name}>
            {"href" in p ? (
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {card}
              </a>
            ) : (
              <div className={cardClass}>{card}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
