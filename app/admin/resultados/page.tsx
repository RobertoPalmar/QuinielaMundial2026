import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SyncButton } from "../SyncButton";
import { ResultRow } from "./ResultRow";
import type { Match, Round } from "@/lib/types";

export const metadata = { title: "Resultados · Admin" };
export const revalidate = 0;

export default async function ResultadosPage() {
  const supabase = await createClient();
  const { data: rounds } = await supabase
    .from("rounds")
    .select("*")
    .order("ordinal", { ascending: true });
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_at", { ascending: true });

  const byRound = new Map<number, Match[]>();
  for (const m of (matches ?? []) as Match[]) {
    if (!byRound.has(m.round_id)) byRound.set(m.round_id, []);
    byRound.get(m.round_id)!.push(m);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin" className="text-sm text-[var(--color-muted)]">
            ← Admin
          </Link>
          <h1 className="text-3xl font-bold">Resultados</h1>
        </div>
        <SyncButton />
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        Los marcadores llegan automáticamente desde football-data.org. Confirma el
        resultado oficial para que sume puntos en el ranking.
      </p>

      {((rounds ?? []) as Round[]).map((r) => {
        const ms = byRound.get(r.id) ?? [];
        if (ms.length === 0) return null;
        return (
          <section key={r.id} className="space-y-3">
            <h2 className="text-xl font-semibold">{r.name}</h2>
            <div className="grid gap-3">
              {ms.map((m) => (
                <ResultRow key={m.id} match={m} />
              ))}
            </div>
          </section>
        );
      })}

      {(matches ?? []).length === 0 && (
        <div className="card p-8 text-center text-[var(--color-muted)]">
          No hay partidos cargados. Pulsa &quot;Sincronizar con API&quot; (requiere
          FOOTBALL_DATA_TOKEN).
        </div>
      )}
    </div>
  );
}
