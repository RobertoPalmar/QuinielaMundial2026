import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/ranking", label: "Ranking" },
  { href: "/mi-pronostico", label: "Mi Pronóstico" },
  { href: "/reglas", label: "Reglas" },
];

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
    username = profile?.username ?? null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_80%,transparent)] backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <span>⚽</span>
          <span className="hidden sm:inline">Quiniela Mundial 2026</span>
          <span className="sm:hidden">Quiniela 26</span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-accent)] transition"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <span className="hidden sm:inline text-[var(--color-muted)]">
                {username}
              </span>
              <form action="/auth/signout" method="post">
                <button className="btn btn-ghost py-1.5 px-3">Salir</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary py-1.5 px-3">
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
