import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import LivingContactSheet from "@/components/homepage/LivingContactSheet";
import TheCollection from "@/components/homepage/TheCollection";
import FounderRecognitionSection from "@/components/homepage/FounderRecognitionSection";
import AsSeenInStrip from "@/components/homepage/AsSeenInStrip";
import ClientGalleryExperience from "@/components/homepage/ClientGalleryExperience";
import InvitationCTA from "@/components/homepage/InvitationCTA";
import Ornament from "@/components/ui/Ornament";

/* Running order leads with people: the photograph, then the artist behind
   it, then the weddings, the collection, recognition, the client
   experience and an invitation. Native scrolling throughout. */
export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* The First Frame */}
        <HeroSection />

        {/* The Artist — Phani Gogireddy, right after the opening photograph */}
        <FounderRecognitionSection />

        {/* The Vows — wedding stories and films */}
        <LivingContactSheet />

        {/* The Collection */}
        <TheCollection />

        {/* As seen in */}
        <AsSeenInStrip />

        <Ornament label="For our clients" />

        {/* The client gallery experience */}
        <ClientGalleryExperience />

        {/* The invitation */}
        <InvitationCTA />
      </main>
      <Footer />
    </>
  );
}
