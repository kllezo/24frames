"use client";

import Link from "next/link";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import type { PublicAccount } from "@/lib/portal/types";

/* The studio desk's top bar: quotations, the client CRM and — for the
   superadmin only — desk access. */
export default function DeskTop({ me, current }: { me: PublicAccount; current: "quotes" | "converted" | "clients" | "access" }) {
  const links = [
    { id: "quotes", href: "/desk", label: "Quotations" },
    { id: "converted", href: "/desk/converted", label: "Converted" },
    { id: "clients", href: "/desk/clients", label: "Clients" },
    ...(me.superadmin ? [{ id: "access", href: "/desk/access", label: "Access" }] : []),
  ];
  return (
    <header className={qx.top}>
      <Link href="/" aria-label="24 Frames home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={qx.logo} src="/images/logo-dark-header.png" alt="24 Frames" />
      </Link>
      <nav className={px.deskNav} aria-label="Studio desk">
        {links.map((l) => (
          <a key={l.id} href={l.href} className={`${px.deskNavLink} ${current === l.id ? px.deskNavOn : ""}`} aria-current={current === l.id ? "page" : undefined} data-no-transition>
            {l.label}
          </a>
        ))}
      </nav>
      <div className={qx.topRight}>
        <span className={qx.who}>
          {me.name} · {me.superadmin ? "Superadmin" : me.role === "owner" ? "Founder level" : "Sales"}
        </span>
        <a className={base.btnGhost} href="/quotebuilder" data-no-transition>
          Quotebuilder
        </a>
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
