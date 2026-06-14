import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mukul Singhal — Developer, Creator, Craftsman",
  description:
    "Building at the intersection of AI and full-stack development — AI agents, autonomous systems, and modern web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${notoSerif.variable} ${spaceMono.variable}`}
    >
      <body>
        <div className="grain-overlay" />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

