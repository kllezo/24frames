import type { Metadata } from "next";
import FilmGrain from "@/components/ui/FilmGrain";
import CinematicTransition from "@/components/ui/CinematicTransition";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Anton&family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
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
