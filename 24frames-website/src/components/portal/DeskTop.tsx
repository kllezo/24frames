"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import ix from "./insights.module.css";
import type { DeskNotification, PublicAccount } from "@/lib/portal/types";

export type DeskPage = "dashboard" | "quotes" | "converted" | "clients" | "production" | "links" | "analytics" | "team" | "access";

const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/* The studio desk's top bar: every desk page, the signed-in person's
   notifications, and — for the superadmin only — analytics, the team and
   desk access. */
export default function DeskTop({ me, current }: { me: PublicAccount; current: DeskPage }) {
  const links: { id: DeskPage; href: string; label: string }[] = [
    { id: "dashboard", href: "/desk/dashboard", label: "My desk" },
    { id: "quotes", href: "/desk", label: "Quotations" },
    { id: "clients", href: "/desk/clients", label: "Clients" },
    { id: "converted", href: "/desk/converted", label: "Converted" },
    { id: "production", href: "/desk/production", label: "Production" },
    { id: "links", href: "/desk/price-links", label: "Price links" },
    ...(me.superadmin
      ? ([
          { id: "analytics", href: "/desk/analytics", label: "Analytics" },
          { id: "team", href: "/desk/team", label: "Team" },
          { id: "access", href: "/desk/access", label: "Access" },
        ] as const)
      : []),
  ];
  return (
    <header className={`${qx.top} ${ix.top}`}>
      <Link href="/" aria-label="24 Frames home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={qx.logo} src="/images/logo-dark-header.png" alt="24 Frames" />
      </Link>
      <nav className={`${px.deskNav} ${ix.nav}`} aria-label="Studio desk">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.href}
            className={`${px.deskNavLink} ${current === l.id ? px.deskNavOn : ""}`}
            aria-current={current === l.id ? "page" : undefined}
            data-no-transition
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className={qx.topRight}>
        <Bell />
        <a className={base.btnGhost} href="/quotebuilder" data-no-transition>
          Quotebuilder
        </a>
        <span className={qx.who}>
          {me.name} · {me.superadmin ? "Superadmin" : me.role === "owner" ? "Founder level" : "Sales"}
        </span>
        <button
          className={base.btnGhost}
          onClick={async () => {
            await fetch("/api/portal/auth", { method: "DELETE" }).catch(() => null);
            window.location.assign("/desk/login");
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

/* Notifications: who changed what on your book. */
function Bell() {
  const [items, setItems] = useState<DeskNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/notifications", { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return;
    const d = (await res.json().catch(() => ({}))) as { notifications?: DeskNotification[]; unread?: number };
    setItems(d.notifications ?? []);
    setUnread(d.unread ?? 0);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = window.setInterval(load, 45000);
    return () => window.clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  async function markAll() {
    await fetch("/api/portal/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) }).catch(() => null);
    setItems((xs) => xs.map((x) => ({ ...x, read: true })));
    setUnread(0);
  }

  return (
    <div className={ix.bellWrap} ref={box}>
      <button
        type="button"
        className={ix.bell}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={unread ? `${unread} new notifications` : "Notifications"}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {unread > 0 && <span className={ix.bellCount}>{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className={ix.bellPanel} role="dialog" aria-label="Notifications">
          <div className={ix.bellHead}>
            <b>Notifications</b>
            {unread > 0 && (
              <button type="button" onClick={markAll}>
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className={ix.bellEmpty}>You&apos;re all caught up.</p>
          ) : (
            <ul>
              {items.map((n) => (
                <li key={n.id} className={n.read ? "" : ix.bellNew}>
                  <a href={n.quoteId ? `/desk?q=${n.quoteId}` : n.clientId ? `/desk/clients?c=${n.clientId}` : "/desk/dashboard"} data-no-transition>
                    <span>{n.text}</span>
                    <time>{ago(n.at)}</time>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
