import LoginForm from "@/components/studio/LoginForm";

export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string }> }) {
  const { next, reason } = await searchParams;
  const safeNext = next && next.startsWith("/quotebuilder") && !next.startsWith("//") ? next : "/quotebuilder";
  const configured = !!process.env.STUDIO_PIN && (process.env.STUDIO_SESSION_SECRET?.length ?? 0) >= 32;
  return <LoginForm next={safeNext} configured={configured} reason={reason ?? null} />;
}
