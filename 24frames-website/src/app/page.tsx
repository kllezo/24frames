"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import LivingContactSheet from "@/components/homepage/LivingContactSheet";
import TheVowSection from "@/components/homepage/TheVowSection";
import SignatureCollection from "@/components/homepage/SignatureCollection";
import ExploreTheWorld from "@/components/homepage/ExploreTheWorld";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";
import InvitationCTA from "@/components/homepage/InvitationCTA";

const Preloader = dynamic(() => import("@/components/ui/Preloader"), { ssr: false });

export default function HomePage() {
  // Preloader plays on every full page refresh / fresh load
  const [showPreloader, setShowPreloader] = useState(true);
  const [siteReady, setSiteReady] = useState(false);

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

          {/* Chapter 02 — The Living Contact Sheet (24-Frame Archival Matrix) */}
          <LivingContactSheet />

          {/* Chapter 02.b — Scroll-Driven Photographic Installation (Reference Image 2) */}
          <TheVowSection />

          {/* Chapter 03 — Signature Collection (Archival Stacks) */}
          <SignatureCollection />

          {/* Chapter 04 — Explore the World (Category Worlds) */}
          <ExploreTheWorld />

          {/* Chapter 05 — Founder & Recognition Wall (Reference Image 1: Left Portrait + Two Curved Rails) */}
          <FounderRecognitionSection />

          {/* Chapter 06 — The Invitation (Bespoke Commission Portals) */}
          <InvitationCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
