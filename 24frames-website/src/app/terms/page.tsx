import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service — 24 Frames Photography",
  description: "Terms and conditions for bespoke photography commissions and intellectual property rights by 24 Frames Photography.",
};

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: "100vh", background: "#FAF8F2", color: "#20231F", padding: "clamp(7rem, 12vh, 9rem) clamp(1.5rem, 5vw, 4rem) 5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#09453E", display: "block", marginBottom: "0.75rem" }}>
            LEGAL ARCHIVE · 24 FRAMES
          </span>
          <h1 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 500, margin: "0 0 1rem 0", color: "#142821", lineHeight: 1.15 }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "#77766E", letterSpacing: "0.08em", marginBottom: "2.5rem" }}>
            LAST UPDATED: NOVEMBER 2026 · HYDERABAD, INDIA
          </p>
          <div style={{ width: "100%", height: "1px", background: "rgba(9, 69, 62, 0.12)", marginBottom: "2.5rem" }} />

          <div style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "0.95rem", lineHeight: 1.75, color: "#3B423E" }}>
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>1. Bespoke Commission Scope</h2>
              <p>
                All wedding cinematography, celebrity portraits, and cultural celebration assignments booked with 24 Frames Photography are governed by an individual bespoke Commission Agreement executed between the patron and studio management. The inquiry form on this website serves as an initial inquiry and does not constitute a confirmed contract or date reservation until formal agreement and retainer receipt.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>2. Copyright &amp; Intellectual Property</h2>
              <p>
                All photographic stills, digital film frames, motion video sequences, and written editorial materials published on this website are the intellectual property of 24 Frames Photography and Phani Gogireddy, protected by international and Indian copyright laws. Unsanctioned downloading, commercial reproduction, or AI model training on these imagery assets is strictly prohibited.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>3. Client License &amp; Heirloom Usage</h2>
              <p>
                Commissioned clients receive personal heirloom reproduction rights as detailed in their specific engagement contract, allowing personal printing, framing, family distribution, and non-commercial social sharing. Commercial exploitation or licensing to third-party wedding vendors requires prior written studio authorization.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>4. Commission Inquiries &amp; Retainers</h2>
              <p>
                Dates are held on a strict calendar basis upon execution of the formal Commission Agreement and receipt of the booking retainer. Due to the high-demand, handcrafted nature of our wedding season calendar, dates cannot be held tentatively.
              </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-headline, serif)", fontSize: "1.5rem", color: "#142821", marginBottom: "0.75rem" }}>5. Jurisdiction &amp; Governance</h2>
              <p>
                These terms and all bespoke commission agreements are governed by the laws of India, under the jurisdiction of courts in Hyderabad, Telangana.
              </p>
              <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "#77766E", marginTop: "1rem" }}>
                * Note: Studio commercial terms, cancellation policies, and payment milestone terms are subject to final studio owner confirmation and standard contract templates prior to public launch.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

