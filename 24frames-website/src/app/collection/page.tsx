import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TheCollection from "@/components/homepage/TheCollection";

export const metadata: Metadata = {
  title: "The Collection — Five Practices of Optics | 24 Frames Photography",
  description:
    "From intimate Vedic rituals to high-fashion spreads and cinematic master films. Explore the five photographic disciplines of 24 Frames Photography.",
};

export default function CollectionPage() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: "72px", minHeight: "calc(100vh - 72px)" }}>
        <TheCollection isDedicatedRoute />
      </main>
      <Footer />
    </>
  );
}
