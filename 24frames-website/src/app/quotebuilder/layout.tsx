import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import styles from "@/components/studio/studio.module.css";

/* The studio loads its own font variables: the site-wide globals.css
   redefines --font-cormorant / --font-allura in terms of themselves, which
   resolves to nothing, so the studio cannot rely on those names. */
const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--studio-serif",
  display: "swap",
});
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--studio-sans", display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400"], variable: "--studio-mono", display: "swap" });
const script = Allura({ subsets: ["latin"], weight: ["400"], variable: "--studio-script", display: "swap" });

/* Private studio experience — never indexed, never linked publicly. */
export const metadata: Metadata = {
  title: "24 Frames · Private Studio",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.root} ${serif.variable} ${sans.variable} ${mono.variable} ${script.variable}`}>
      {children}
    </div>
  );
}
