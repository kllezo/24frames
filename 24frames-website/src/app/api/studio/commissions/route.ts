import { NextResponse } from "next/server";
import { createCommission, getConfig, listCommissions } from "@/lib/studio/server/repository";
import { noStore, readJson, requireStudio, storageError, requireAdmin } from "@/lib/studio/server/guard";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import { normaliseDraft } from "@/lib/commission/model";
import { quoteCommission } from "@/lib/commission/pricing";
import type { CommissionDraft } from "@/lib/commission/types";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const q = new URL(request.url).searchParams.get("q") ?? "";
  try {
    return noStore(NextResponse.json({ commissions: await listCommissions(q.slice(0, 100)) }));
  } catch (err) {
    return storageError(err);
  }
}

/* Submit a commission. The server re-prices the draft with the CURRENT
   studio configuration and refuses to store it if the total differs from
   what the couple was shown — so the record, PDF and WhatsApp summary can
   never disagree with the live estimate. */
export async function POST(request: Request) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const body = await readJson<{ draft: CommissionDraft; expectedGrandTotal: number; configVersion: number }>(request);
  if (!body?.draft) return noStore(NextResponse.json({ error: "Missing commission." }, { status: 400 }));

  try {
    const { config } = await getConfig();
    const issues = validateDraftForSubmit(body.draft, config);
    if (issues.length) {
      return noStore(NextResponse.json({ error: "Please complete the commission.", issues }, { status: 422 }));
    }
    const draft = normaliseDraft(body.draft, config);
    const quote = quoteCommission(draft, config);
    if (body.configVersion !== config.version || quote.grandTotal !== body.expectedGrandTotal) {
      return noStore(
        NextResponse.json(
          {
            error:
              "Studio pricing changed during this consultation. The estimate has been refreshed — please review it before submitting.",
            code: "pricing_changed",
            config,
          },
          { status: 409 },
        ),
      );
    }
    const record = await createCommission({ draft, quote, config, consultant: session.consultant });
    return noStore(NextResponse.json({ record }, { status: 201 }));
  } catch (err) {
    return storageError(err);
  }
}
