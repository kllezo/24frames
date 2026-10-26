"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import LivingContactSheet from "@/components/homepage/LivingContactSheet";
import TheCollection from "@/components/homepage/TheCollection";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";
import InvitationCTA from "@/components/homepage/InvitationCTA";

const Preloader = dynamic(() => import("@/components/ui/Preloader"), { ssr: false });

export default function HomePage() {
  // Preloader plays on every full page refresh / fresh load
  const [showPreloader, setShowPreloader] = useState(true);
  const [siteReady, setSiteReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("direct")) {
      queueMicrotask(() => {
        setShowPreloader(false);
        setSiteReady(true);
      });
    }
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setSiteReady(true);
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      <div
        style={{
          opacity: siteReady ? 1 : 0,
          transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Navigation />
        <main>
          {/* Chapter 01 — The Opening Frame */}
          <HeroSection />

          {/* Chapter 02 — The Vows (Curated Exhibition & Wedding Films) */}
          <LivingContactSheet />

          {/* Chapter 03 — The Collection (Six Editorial Disciplines Showcase) */}
          <TheCollection />

          {/* Chapter 04 — Founder & Recognition Wall */}
          <FounderRecognitionSection />

          {/* Chapter 05 — The Invitation (Bespoke Commission Portals) */}
          <InvitationCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
