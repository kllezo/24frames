import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy — 24 Frames Photography",
  description: "Privacy policy and client data protection practices of 24 Frames Photography by Phani Gogireddy.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: "100vh", background: "#FAF8F2", color: "#20231F", padding: "clamp(7rem, 12vh, 9rem) clamp(1.5rem, 5vw, 4rem) 5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#09453E", display: "block", marginBottom: "0.75rem" }}>
            LEGAL ARCHIVE · 24 FRAMES
          </span>
          <h1 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 500, margin: "0 0 1rem 0", color: "#142821", lineHeight: 1.15 }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#77766E", letterSpacing: "0.08em", marginBottom: "2.5rem" }}>
            LAST UPDATED: NOVEMBER 2026 · HYDERABAD, INDIA
          </p>
          <div style={{ width: "100%", height: "1px", background: "rgba(9, 69, 62, 0.12)", marginBottom: "2.5rem" }} />

          <div style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "0.95rem", lineHeight: 1.75, color: "#3B423E" }}>
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>1. Introduction</h2>
              <p>
                24 Frames Photography, led by principal cinematographer and photographer Phani Gogireddy, values the privacy and confidentiality of our clients, couples, patrons, and visitors. This policy outlines how information is gathered, managed, and safeguarded during bespoke inquiries and commission fulfillment.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>2. Collection of Inquiry Data</h2>
              <p>
                When inquiring about a wedding commission, celebrity portraiture, or cultural gala through our Atelier Inquire portal, we collect details you provide voluntarily: your name, contact phone number, email address, wedding dates, celebration locations, and expected guest counts. This information is strictly utilized to evaluate date availability, prepare tailored proposals, and coordinate commission logistics.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>3. Private Client Vaults &amp; Media Protection</h2>
              <p>
                Private client delivery links, uncompressed photographic galleries, and high-definition wedding cinema vaults are access-restricted. These delivery portals are explicitly protected from public search-engine indexing (using <code>noindex</code>, <code>nofollow</code>, and direct access credentials) to ensure family milestones remain private.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>4. Image Rights &amp; Exhibition Consent</h2>
              <p>
                Photographs and cinema teasers showcased publicly on this website represent authorized commission highlights, editorial releases, and public celebration archives. Client agreements specify portrait exhibition permissions. Clients may review and discuss public exhibition preferences during their bespoke consultation.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>5. Analytics &amp; Performance Cookies</h2>
              <p>
                To maintain a buttery-smooth, 60fps cinematic browsing experience, this website utilizes minimal, anonymous performance logging and analytics. We do not sell, rent, or trade your personal information or contact details to third-party data brokers.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>6. Contact &amp; Verification</h2>
              <p>
                For questions regarding personal data or commission records, please contact our atelier directly via <Link href="/inquire" style={{ color: "#09453E", textDecoration: "underline" }}>the Atelier Inquire desk</Link> or by reaching our Hyderabad studio.
              </p>
              <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "#77766E", marginTop: "1rem" }}>
                * Note: Studio legal entity registration details, registered address, and official data protection officer contacts are subject to final studio owner confirmation prior to public launch.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

