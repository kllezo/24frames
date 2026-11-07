"use client";

/* Lazy-loads the PDF renderer only when a proposal is composed, so the
   consultation itself stays light. */

import { createElement } from "react";
import type { ProposalInput } from "./ProposalDocument";

let fontsRegistered = false;

export async function renderProposalPdf(input: ProposalInput): Promise<Blob> {
  const [{ pdf, Font }, { default: ProposalDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ProposalDocument"),
  ]);

  if (!fontsRegistered) {
    const f = (name: string) => `${input.origin}/studio-fonts/${name}`;
    for (const [family, prefix] of [
      ["Cormorant", "cormorant-garamond-latin"],
      ["CormorantExt", "cormorant-garamond-latin-ext"],
    ] as const) {
      Font.register({
        family,
        fonts: [
          { src: f(`${prefix}-400-normal.woff`), fontWeight: 400 },
          { src: f(`${prefix}-400-italic.woff`), fontWeight: 400, fontStyle: "italic" },
          { src: f(`${prefix}-500-normal.woff`), fontWeight: 500 },
          { src: f(`${prefix}-500-italic.woff`), fontWeight: 500, fontStyle: "italic" },
          { src: f(`${prefix}-600-normal.woff`), fontWeight: 600 },
          { src: f(`${prefix}-600-italic.woff`), fontWeight: 600, fontStyle: "italic" },
        ],
      });
    }
    for (const [family, prefix] of [
      ["Inter", "inter-latin"],
      ["InterExt", "inter-latin-ext"],
    ] as const) {
      Font.register({
        family,
        fonts: [
          { src: f(`${prefix}-400-normal.woff`), fontWeight: 400 },
          { src: f(`${prefix}-400-italic.woff`), fontWeight: 400, fontStyle: "italic" },
          { src: f(`${prefix}-500-normal.woff`), fontWeight: 500 },
          { src: f(`${prefix}-600-normal.woff`), fontWeight: 600 },
        ],
      });
    }
    // Keep words whole — editorial text should never hyphenate mid-name.
    Font.registerHyphenationCallback((word) => [word]);
    fontsRegistered = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pdf(createElement(ProposalDocument, input) as any).toBlob();
}

export function proposalFilename(names: string, reference: string | null): string {
  const slug = names.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "Couple";
  return `24-Frames-Proposal-${slug}${reference ? `-${reference}` : "-Draft"}.pdf`;
}
