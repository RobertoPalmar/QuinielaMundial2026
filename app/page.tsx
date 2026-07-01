import Link from "next/link";
import { Podium } from "@/components/Ranking";
import { createClient } from "@/lib/supabase/server";
import type { RankRow } from "@/lib/data";
import type { UserScore } from "@/lib/types";

const SCORING = [
  { n: "3", t: "Marcador exacto", d: "Aciertas el resultado exacto del partido. Ej: 2-1." },
  { n: "1", t: "Equipo que avanza", d: "Aciertas qué selección pasa de ronda." },
  { n: "⏱", t: "Cierre por ronda", d: "Cada ronda cierra en su fecha límite. Después no se edita." },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("v_user_scores")
    .select("*")
    .order("total_points", { ascending: false })
    .order("exact_hits", { ascending: false })
    .order("username", { ascending: true })
    .limit(3);

  const podiumRows: RankRow[] = ((data ?? []) as UserScore[]).map((s, i) => ({
    pos: i + 1,
    userId: s.user_id,
    name: s.username,
    a: s.hits,
    x: s.exact_hits,
    t: s.total_points,
    you: false,
    delta: null,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* HERO */}
      <section className="pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border border-border bg-surface text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          <span aria-hidden>🇺🇸 🇲🇽 🇨🇦</span>
          <span>World Cup 26 · Fase eliminatoria</span>
        </div>

        <h1 className="mt-4 font-display font-bold text-[clamp(32px,7vw,56px)] leading-[1.04] tracking-tight max-w-[14ch] text-balance">
          Tu quiniela del Mundial, <span className="text-primary">ronda por ronda.</span>
        </h1>
        <p className="mt-4 text-[clamp(15px,2.6vw,18px)] leading-relaxed text-muted max-w-[46ch]">
          Carga tus pronósticos, suma puntos por marcador exacto y compite en el ranking en vivo con tus amigos.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/mi-pronostico" className="btn btn-primary min-h-[48px]">Cargar pronóstico →</Link>
          <Link href="/ranking" className="btn btn-surface min-h-[48px]">Ver ranking</Link>
          <Link href="/reglas" className="btn btn-ghost min-h-[48px]">Reglas</Link>
        </div>
      </section>

      {/* PODIO */}
      {podiumRows.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="font-display font-bold text-[clamp(20px,4vw,26px)] tracking-tight">Podio</h2>
            <Link href="/ranking" className="text-[13px] font-medium text-primary hover:underline">
              Ver ranking completo →
            </Link>
          </div>
          <Podium rows={podiumRows} />
        </section>
      )}

      {/* SCORING */}
      <section className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SCORING.map((c) => (
          <div key={c.t} className="card p-[22px] flex flex-col gap-2.5">
            <span className="font-display font-bold text-[38px] leading-none text-primary">{c.n}</span>
            <span className="font-semibold text-base">{c.t}</span>
            <span className="text-sm leading-relaxed text-muted">{c.d}</span>
          </div>
        ))}
      </section>

      {/* Teaser ronda abierta */}
      <Link
        href="/mi-pronostico"
        className="flex flex-wrap items-center justify-between gap-3.5 p-5 rounded-card border border-border bg-gradient-to-r from-surface-2 to-surface"
      >
        <div className="flex items-center gap-3">
          <span className="badge badge-open"><span className="dot bg-current dot-pulse" />Ronda abierta</span>
          <span className="font-semibold text-[15px]">Dieciseisavos de final</span>
        </div>
        <span className="text-[13px] font-medium text-muted">Carga tu pronóstico →</span>
      </Link>
    </div>
  );
}
