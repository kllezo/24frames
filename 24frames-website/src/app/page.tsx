"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import LivingContactSheet from "@/components/homepage/LivingContactSheet";
import TheCollection from "@/components/homepage/TheCollection";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";
import ClientGalleryExperience from "@/components/homepage/ClientGalleryExperience";
import InvitationCTA from "@/components/homepage/InvitationCTA";

const Preloader = dynamic(() => import("@/components/ui/Preloader"), { ssr: false });

export default function HomePage() {
  // Preloader runs only on initial browser entry or full page reload, never on internal SPA navigation
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === "undefined") return true;
    const isDirect = window.location.search.includes("direct");
    const isInternalNav = (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean }).__24FRAMES_INITIAL_LOAD_DONE__;
    return !(isDirect || isInternalNav);
  });

  const [siteReady, setSiteReady] = useState(() => {
    if (typeof window === "undefined") return false;
    const isDirect = window.location.search.includes("direct");
    const isInternalNav = (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean }).__24FRAMES_INITIAL_LOAD_DONE__;
    return Boolean(isDirect || isInternalNav);
  });

  useEffect(() => {
    if (typeof window !== "undefined" && (window.location.search.includes("direct") || (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean }).__24FRAMES_INITIAL_LOAD_DONE__)) {
      setShowPreloader(false);
      setSiteReady(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      (window as unknown as { __24FRAMES_INITIAL_LOAD_DONE__?: boolean }).__24FRAMES_INITIAL_LOAD_DONE__ = true;
    }
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
          {/* Act I — The First Frame (Cinematic Hero Opening) */}
          <HeroSection />

          {/* Chapter 02 — The Vows (Curated Exhibition & Wedding Stories Archive) */}
          <LivingContactSheet />

          {/* Act III — The Archive Opens (The Six Curated Disciplines) */}
          <TheCollection />

          {/* Act IV — The Artist & Visionary (Phani Gogireddy Exact Reference Composition) */}
          <FounderRecognitionSection />

          {/* Royal Palace Client Suite — The 24 Frames Client Gallery Experience */}
          <ClientGalleryExperience />

          {/* Act V — The Lasting Frame (Invitation & Conversation) */}
          <InvitationCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
