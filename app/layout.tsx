import type { Metadata } from "next";
import { Cormorant_Garamond, Yuji_Syuku } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

// ---- Primary Typeface: Cormorant Garamond ----
// Used for: Name reveal, subtitles, navigation, body, metadata
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// ---- Japanese Typeface: Yuji Syuku ----
// Used for: ムクル (Katakana), section markers, 終 closing mark
const yujiSyuku = Yuji_Syuku({
  weight: "400",
  variable: "--font-yuji",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "MUKUL — Developer. AI Architect. Storyteller.",
  description:
    "A cinematic portfolio experience. Building at the intersection of AI, full-stack systems, and digital craftsmanship.",
  openGraph: {
    title: "MUKUL — Developer. AI Architect. Storyteller.",
    description:
      "A cinematic portfolio experience. Building at the intersection of AI, full-stack systems, and digital craftsmanship.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUKUL — Developer. AI Architect. Storyteller.",
    description:
      "A cinematic portfolio experience. Building at the intersection of AI, full-stack systems, and digital craftsmanship.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${yujiSyuku.variable}`}
    >
      <body>
        {/* Skip link — accessibility */}
        <a href="#selected-works" className="sr-only">
          Skip to portfolio
        </a>

        {/* Film grain overlay — persistent across all pages */}
        <div className="grain-overlay" aria-hidden="true">
          <svg>
            <filter id="grain-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves={3}
                stitchTiles="stitch"
                seed={0}
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </svg>
        </div>

        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
