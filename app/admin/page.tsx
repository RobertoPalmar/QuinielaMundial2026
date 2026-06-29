import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Quiniela Mundial 2026" };
export const revalidate = 0;

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: users }, { count: pending }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false),
  ]);

  const cards = [
    {
      href: "/admin/resultados",
      title: "Resultados",
      desc: "Ver marcadores en vivo y aprobar resultados oficiales.",
      icon: "✅",
    },
    {
      href: "/admin/rondas",
      title: "Rondas",
      desc: "Abrir/cerrar rondas, fijar deadline y puntos.",
      icon: "🗓️",
    },
    {
      href: "/admin/import",
      title: "Importar grupos",
      desc: "Cargar puntos de la fase de grupos desde Excel.",
      icon: "📥",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de administración</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-[var(--color-muted)] text-sm">Participantes</div>
          <div className="text-3xl font-bold">{users ?? 0}</div>
        </div>
        <div className="card p-5">
          <div className="text-[var(--color-muted)] text-sm">
            Partidos sin aprobar
          </div>
          <div className="text-3xl font-bold">{pending ?? 0}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card p-5 hover:bg-[var(--color-surface-2)] transition">
            <div className="text-2xl">{c.icon}</div>
            <h3 className="font-semibold mt-2">{c.title}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
