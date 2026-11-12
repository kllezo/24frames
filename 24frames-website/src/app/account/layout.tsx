import type { Metadata } from "next";
import StudioLayout, { viewport as studioViewport } from "../quotebuilder/layout";

/* The 24 Frames portal shares the studio's fonts and theme. Never indexed. */
export const metadata: Metadata = {
  title: "24 Frames · Your Quotations",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport = studioViewport;

export default StudioLayout;
