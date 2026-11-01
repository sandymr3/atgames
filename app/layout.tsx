import type { Metadata } from "next";
import { Michroma, Sora, Noto_Serif_Tamil } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CursorRing from "@/components/CursorRing";
import "./globals.css";

/* Michroma carries the wide, clipped-corner geometry of the ATTI GAMES wordmark;
   Sora does the reading; Noto Serif Tamil gives the Kural literary weight and
   feeds the glyph atlas in the particle field. */
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const tamil = Noto_Serif_Tamil({
  subsets: ["tamil", "latin"],
  variable: "--font-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atgames.studio"),
  title: {
    default: "ATTI Games — Tamil myth, modern machines",
    template: "%s — ATTI Games",
  },
  description:
    "ATTI Games is a game studio from Tamil Nadu building games out of Tamil literature, folklore and fear. Makers of Fourth Shadow / நான்காம் நிழல்.",
  openGraph: {
    title: "ATTI Games — Tamil myth, modern machines",
    description:
      "A game studio from Tamil Nadu. Makers of Fourth Shadow / நான்காம் நிழல்.",
    images: ["/og.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${michroma.variable} ${sora.variable} ${tamil.variable} h-full antialiased`}
    >
      <body className="grain vignette relative flex min-h-full flex-col">
        <CursorRing />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
