import type { Metadata } from "next";
import HomeEditorial from "@/components/home/HomeEditorial";
import V2Header from "@/components/home/V2Header";
import V2Footer from "@/components/home/V2Footer";

/* Version 2 of the homepage, for review before it replaces "/".
   Kept out of search results so it never competes with the live homepage. */
export const metadata: Metadata = {
  title: "24 Frames — Wedding Photography & Films, Hyderabad (version 2)",
  description: "Preview of the redesigned 24 Frames homepage.",
  robots: { index: false, follow: false },
};

export default function Version2Page() {
  return (
    <>
      <V2Header />
      <main>
        <HomeEditorial />
      </main>
      <V2Footer />
    </>
  );
}
