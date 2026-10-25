import type { Metadata } from "next";
import FilmGrain from "@/components/ui/FilmGrain";
import CinematicTransition from "@/components/ui/CinematicTransition";
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
      <body suppressHydrationWarning>
        <FilmGrain />
        <CinematicTransition />
        {children}
      </body>
    </html>
  );
}
