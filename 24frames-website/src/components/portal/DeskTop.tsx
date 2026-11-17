"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const main: { id: DeskPage; href: string; label: string }[] = [
    { id: "dashboard", href: "/desk/dashboard", label: "My desk" },
    { id: "quotes", href: "/desk", label: "Quotations" },
    { id: "clients", href: "/desk/clients", label: "Clients" },
    { id: "converted", href: "/desk/converted", label: "Converted" },
    { id: "production", href: "/desk/production", label: "Production" },
    { id: "links", href: "/desk/price-links", label: "Price links" },
  ];
  const admin: { id: DeskPage; href: string; label: string; note: string }[] = me.superadmin
    ? [
        { id: "analytics", href: "/desk/analytics", label: "Analytics", note: "Revenue, conversion, team" },
        { id: "team", href: "/desk/team", label: "Team", note: "Accounts, targets, commission" },
        { id: "access", href: "/desk/access", label: "Access", note: "Who may use the desk" },
      ]
    : [];
  const inAdmin = admin.some((a) => a.id === current);
  const initials = me.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <header className={`${qx.top} ${ix.top}`}>
      <Link href="/" aria-label="24 Frames home" className={ix.brand}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={qx.logo} src="/images/logo-dark-header.png" alt="24 Frames" />
      </Link>
      <nav className={`${px.deskNav} ${ix.nav}`} aria-label="Studio desk">
        {main.map((l) => (
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
        {admin.length > 0 && (
          <Menu
            label={
              <span className={`${px.deskNavLink} ${inAdmin ? px.deskNavOn : ""}`}>
                Admin <span aria-hidden="true">▾</span>
              </span>
            }
          >
            {admin.map((a) => (
              <a key={a.id} href={a.href} className={current === a.id ? ix.menuOn : ""} data-no-transition>
                <b>{a.label}</b>
                <span>{a.note}</span>
              </a>
            ))}
          </Menu>
        )}
      </nav>
      <div className={ix.topActions}>
        <a className={ix.quoteBtn} href="/quotebuilder" data-no-transition>
          Quotebuilder
        </a>
        <Bell />
        <Menu label={<span className={ix.avatar} title={me.name}>{initials || "•"}</span>} align="right">
          <div className={ix.menuWho}>
            <b>{me.name}</b>
            <span>{me.superadmin ? "Superadmin" : me.role === "owner" ? "Founder level" : "Sales"} · {me.email}</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/portal/auth", { method: "DELETE" }).catch(() => null);
              window.location.assign("/desk/login");
            }}
          >
            <b>Sign out</b>
          </button>
        </Menu>
      </div>
    </header>
  );
}

/* A small dropdown that closes on outside click or Escape. */
function Menu({ label, children, align = "left" }: { label: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className={ix.menuWrap} ref={box}>
      <button type="button" className={ix.menuBtn} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && <div className={`${ix.menu} ${align === "right" ? ix.menuRight : ""}`}>{children}</div>}
    </div>
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
