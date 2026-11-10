import type { Metadata } from "next";
import StudioLayout, { viewport as studioViewport } from "../quotebuilder/layout";

/* The quote book shares the private studio's fonts and theme. Never indexed. */
export const metadata: Metadata = {
  title: "24 Frames · Quote Book",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport = studioViewport;

export default StudioLayout;
