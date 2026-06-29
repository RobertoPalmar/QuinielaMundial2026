"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/ranking", label: "Ranking" },
  { href: "/mi-pronostico", label: "Mi Pronóstico" },
  { href: "/reglas", label: "Reglas" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export default function Navbar({
  user = null,
  isAdmin = false,
}: {
  user?: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = LINKS.filter((l) => !l.adminOnly || isAdmin);
  const active = (href: string) =>
    pathname === href || (href === "/admin" && pathname.startsWith("/admin"));

  return (
    <header className="sticky top-0 z-30 bg-bg border-b border-border">
      <div className="mx-auto max-w-[1024px] flex items-center justify-between gap-4 px-4 md:px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-text">
          <span className="text-[22px] leading-none">⚽</span>
          <span className="font-display font-bold text-base tracking-tight">
            Quiniela Mundial <span className="text-primary">2026</span>
          </span>
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-[9px] text-sm font-semibold transition ${
                active(l.href) ? "bg-surface-2 text-text" : "text-muted hover:text-text"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Sesión desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm font-medium text-muted">
                <span className="grid place-items-center w-7 h-7 rounded-full text-on-primary font-display font-bold text-xs bg-gradient-to-br from-primary to-primary-dark">
                  {user[0]?.toUpperCase()}
                </span>
                <span className="text-text">{user}</span>
              </span>
              <form action="/auth/signout" method="post">
                <button
                  title="Salir"
                  aria-label="Salir"
                  className="grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-border text-muted hover:text-text hover:bg-surface-2 transition"
                >
                  <LogoutIcon />
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary !min-h-0 py-2">
              Ingresar
            </Link>
          )}
        </div>

        {/* Toggle móvil */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={open}
          className="md:hidden grid place-items-center w-10 h-10 rounded-[10px] border border-border bg-surface text-text text-lg"
        >
          ☰
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-3 pb-3.5 border-t border-border">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3.5 py-3 rounded-[10px] text-[15px] font-semibold ${
                active(l.href) ? "bg-surface-2 text-text" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between mt-1.5 pt-2.5 border-t border-border">
            <span className="text-sm font-medium text-muted">Sesión: {user ?? "—"}</span>
            {user ? (
              <form action="/auth/signout" method="post">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] border border-border text-muted text-sm font-semibold">
                  <LogoutIcon /> Salir
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-[9px] border border-border text-primary text-sm font-semibold"
              >
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
