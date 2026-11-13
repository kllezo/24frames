import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HomeEditorial from "@/components/home/HomeEditorial";

/* The homepage: an editorial running order — hero, the founder, how we
   work, signature weddings, recognition and an invitation. The previous
   cinematic homepage sections remain in src/components/homepage. */
export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HomeEditorial />
      </main>
      <Footer />
    </>
  );
}
