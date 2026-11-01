import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Client Archive & Delivery Vault — 24 Frames Photography",
  description: "Secure, uncompressed private client archive and exhibition portal for commissioned patrons.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ClientGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

