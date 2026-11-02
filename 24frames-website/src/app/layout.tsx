import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Montserrat, Allura, Space_Mono } from "next/font/google";
import FilmGrain from "@/components/ui/FilmGrain";
import CinematicTransition from "@/components/ui/CinematicTransition";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://24frames-kllezo.vercel.app"),
  title: "24 Frames Photography — Cinematic Wedding Films & Photography | Hyderabad",
  description:
    "Premium cinematic wedding photography and films by Phani Gogireddy. Capturing South India's grandest celebrations with editorial artistry. ET Excellence Award 2025 Winner. Official Nikon India Partner.",
  keywords: [
    "wedding photography Hyderabad",
    "cinematic wedding films",
    "24 Frames Photography",
    "luxury wedding photographer",
    "Phani Gogireddy",
    "South Indian wedding",
    "destination wedding photographer",
  ],
  openGraph: {
    title: "24 Frames Photography — Cinematic Wedding Films & Photography",
    description:
      "Premium cinematic wedding photography and films. Capturing South India's grandest celebrations.",
    type: "website",
    locale: "en_IN",
    siteName: "24 Frames Photography",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${montserrat.variable} ${allura.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PhotographyBusiness",
              name: "24 Frames Photography",
              alternateName: "24 Frames",
              founder: {
                "@type": "Person",
                name: "Phani Gogireddy",
                jobTitle: "Principal Cinematographer & Photographer",
              },
              url: "https://24frames-kllezo.vercel.app",
              logo: "https://24frames-kllezo.vercel.app/images/logo.png",
              image: "https://24frames-kllezo.vercel.app/images/portfolio/hrithika-abhishek/cover.jpg",
              description:
                "Premium cinematic wedding photography and films by Phani Gogireddy. Capturing South India's grandest celebrations with editorial artistry.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                addressCountry: "IN",
              },
              telephone: "+919014433074",
              email: "hello@24framesphotography.com",
              priceRange: "$$$$",
              sameAs: [
                "https://www.instagram.com/24framesphotography_official/",
                "https://youtube.com/@24framesphotography",
              ],
              award: "ET Excellence Award 2025 Winner",
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <FilmGrain />
        <CinematicTransition />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
