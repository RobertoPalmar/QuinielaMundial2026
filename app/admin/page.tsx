import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Quiniela Mundial 2026" };
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [{ count: users }, { count: pending }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("matches").select("*", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <span className="self-start badge bg-warn/15 text-warn uppercase tracking-[0.06em]">⚙ Admin</span>
      <h1 className="font-display font-bold text-[clamp(26px,5vw,36px)] tracking-tight">Panel de administración</h1>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="card p-[22px]">
          <div className="font-display font-bold text-[44px] leading-none text-primary">{users ?? 0}</div>
          <div className="mt-2 text-sm font-medium text-muted">Participantes totales</div>
        </div>
        <div className="card p-[22px]">
          <div className="font-display font-bold text-[44px] leading-none text-warn">{pending ?? 0}</div>
          <div className="mt-2 text-sm font-medium text-muted">Partidos sin aprobar</div>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-3">
        {[
          { href: "/admin/resultados", icon: "📊", t: "Resultados", d: "Sincroniza, edita y aprueba marcadores." },
          { href: "/admin/rondas", icon: "🗓", t: "Rondas", d: "Abre/cierra rondas y define deadlines y puntos." },
          { href: "/admin/import", icon: "📥", t: "Importar grupos", d: "Pega puntos de fase de grupos desde Excel." },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="card p-[22px] flex flex-col gap-2 hover:bg-surface-2 transition">
            <span className="text-2xl" aria-hidden>{a.icon}</span>
            <span className="font-semibold text-base">{a.t}</span>
            <span className="text-[13px] leading-snug text-muted">{a.d}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
