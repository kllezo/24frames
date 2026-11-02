import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import LivingContactSheet from "@/components/homepage/LivingContactSheet";
import TheCollection from "@/components/homepage/TheCollection";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";
import AsSeenInStrip from "@/components/homepage/AsSeenInStrip";
import ClientGalleryExperience from "@/components/homepage/ClientGalleryExperience";
import InvitationCTA from "@/components/homepage/InvitationCTA";
import HomePreloader from "@/components/homepage/HomePreloader";

export default function HomePage() {
  return (
    <>
      <HomePreloader />
      <Navigation />
      <main>
        {/* The First Frame (Cinematic Hero Opening) */}
        <HeroSection />

        {/* The Vows (Curated Exhibition & Wedding Stories Archive) */}
        <LivingContactSheet />

        {/* The Collection (Curated Disciplines of Optics) */}
        <TheCollection />

        {/* The Artist & Visionary (Phani Gogireddy Exact Reference Composition) */}
        <FounderRecognitionSection />

        {/* Media Recognition & Publication Strip */}
        <AsSeenInStrip />

        {/* Royal Palace Client Suite — The 24 Frames Client Gallery Experience */}
        <ClientGalleryExperience />

        {/* The Lasting Frame (Invitation & Conversation) */}
        <InvitationCTA />
      </main>
      <Footer />
    </>
  );
}
