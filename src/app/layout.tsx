import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/** Wall labels and headlines. Its width axis is what stops the room reading
 *  like every other grotesque. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Everything meant to be read for more than a sentence. A screen serif,
 *  because the whole product is a claim that this is easier to read than the
 *  paper it came from. */
const read = Newsreader({
  subsets: ["latin"],
  variable: "--font-read",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Numbers, labels and anything quoted from a results table. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://sadhushehjar.github.io/reading-room";

const DESCRIPTION =
  "A reading room for a folder of research papers. Drop in a folder of PDFs and read a decade of work in minutes: what each study asked, how it was run, what it found, and what it does not prove. On view: SocialBit, eight papers on measuring social connection after stroke.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reading Room — SocialBit",
    template: "%s · Reading Room",
  },
  description: DESCRIPTION,
  applicationName: "Reading Room",
  alternates: { canonical: "/" },
  keywords: [
    "literature review",
    "research summary",
    "SocialBit",
    "social networks",
    "stroke",
    "digital biomarker",
    "wearable sensing",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Reading Room",
    title: "Reading Room — SocialBit",
    description: DESCRIPTION,
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e1218",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${read.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#collection"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-brass focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-wall"
        >
          Skip to the collection
        </a>
        {children}
      </body>
    </html>
  );
}
