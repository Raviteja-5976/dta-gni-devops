import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";

/* ===========================================================
   TYPOGRAPHY
   Neo-brutalism wants weight and grit, not neutral UI sans.
   - Archivo Black : ultra-heavy grotesque for headlines
   - Archivo       : same superfamily for body — cohesive, sturdy
   - Space Mono    : quirky slab-ish mono for chips/terminals
   Deliberately avoids Inter / Space Grotesk / system stacks.
   =========================================================== */

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevOps & Docker Workshop | DevTrackAcademy",
    template: "%s",
  },
  description:
    "A hands-on workshop series taking you from “it works on my machine” to containers, pipelines and infrastructure as code.",
  icons: {
    icon: "/logo.png",
  },
};

/* The deck is a fixed 16:9 stage that scales as a whole — never let
   mobile browsers zoom or reflow it. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#12152B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${archivo.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="font-sans selection:bg-[#FF6B35] selection:text-white">
        {children}
      </body>
    </html>
  );
}
