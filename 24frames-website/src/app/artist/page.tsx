import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";

export const metadata: Metadata = {
  title: "The Artist & Visionary — Phani Gogireddy | 24 Frames Photography",
  description:
    "Phani Gogireddy, Founder & Managing Director of 24 Frames Photography. Conferred with the Times Excellence in Luxury Wedding Photography Award and official Nikon India Creator Association.",
};

export default function ArtistPage() {
  return (
    <>
      <Navigation />
      <main style={{ paddingTop: "72px", minHeight: "calc(100vh - 72px)" }}>
        <FounderRecognitionSection isDedicatedRoute />
      </main>
      <Footer />
    </>
  );
}
