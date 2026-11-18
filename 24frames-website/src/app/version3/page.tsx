import type { Metadata } from "next";
import v3 from "@/components/version3/version3.module.css";
import Navigation from "@/components/version3/layout/Navigation";
import Footer from "@/components/version3/layout/Footer";
import HeroSection from "@/components/version3/homepage/HeroSection";
import LivingContactSheet from "@/components/version3/homepage/LivingContactSheet";
import TheCollection from "@/components/version3/homepage/TheCollection";
import ArtistChapter from "@/components/version3/homepage/ArtistChapter";
import AsSeenInStrip from "@/components/version3/homepage/AsSeenInStrip";
import ClientGalleryExperience from "@/components/version3/homepage/ClientGalleryExperience";
import InvitationCTA from "@/components/version3/homepage/InvitationCTA";
import Ornament from "@/components/version3/ui/Ornament";


/* Version 3 of the homepage — the oxblood restyle — for review before it
   replaces "/". Kept out of search results. */
export const metadata: Metadata = {
  title: "24 Frames — Wedding Photography & Films, Hyderabad (version 3)",
  description: "Preview of the restyled 24 Frames homepage.",
  robots: { index: false, follow: false },
};

/* Running order leads with people: the photograph, then the artist behind
   it, then the weddings, the collection, recognition, the client
   experience and an invitation. Native scrolling throughout. */
export default function Version3Page() {
  return (
    <div className={v3.v3}>
      <Navigation />
      <main>
        {/* The First Frame */}
        <HeroSection />

        {/* The Vows — wedding stories and films */}
        <LivingContactSheet />

        {/* The Collection */}
        <TheCollection />

        {/* As seen in */}
        <AsSeenInStrip />

        <Ornament label="For our clients" />

        {/* The client gallery experience */}
        <ClientGalleryExperience />

        {/* The Artist — after the work and the client experience: the studio
            leads, and most shoots are covered by Phani's crew. */}
        <ArtistChapter />

        {/* The invitation */}
        <InvitationCTA />
      </main>
      <Footer />
    </div>
  );
}
