import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import CollapsibleRound from "@/components/CollapsibleRound";
import { SyncButton } from "../SyncButton";
import { createClient } from "@/lib/supabase/server";
import { teamCode } from "@/lib/flags";
import type { Match, Round } from "@/lib/types";

export const metadata = { title: "Resultados · Admin" };
export const revalidate = 0;

export default async function AdminResultadosPage() {
  const supabase = await createClient();
  const { data: rounds } = await supabase.from("rounds").select("*").order("ordinal", { ascending: true });
  const { data: matches } = await supabase.from("matches").select("*").order("kickoff_at", { ascending: true });

  const byRound = new Map<number, Match[]>();
  for (const m of (matches ?? []) as Match[]) {
    if (!byRound.has(m.round_id)) byRound.set(m.round_id, []);
    byRound.get(m.round_id)!.push(m);
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <Link href="/admin" className="self-start text-[13px] font-semibold text-muted hover:text-text">← Volver al panel</Link>

      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <h1 className="font-display font-bold text-[clamp(24px,5vw,34px)] tracking-tight">Resultados</h1>
        <SyncButton />
      </div>

      <p className="text-sm text-muted">
        Los marcadores llegan desde football-data.org. Confirma el resultado oficial para que sume puntos.
      </p>

      <div className="flex flex-col gap-3.5">
        {((rounds ?? []) as Round[]).map((r) => {
          const ms = byRound.get(r.id) ?? [];
          if (ms.length === 0) return null;
          return (
            <CollapsibleRound key={r.id} name={r.name} slug={r.slug} defaultOpen={r.is_open}>
              {ms.map((m) => (
                <ResultCard
                  key={m.id}
                  matchId={m.id}
                  home={{ code: teamCode(m.home_team), name: m.home_team }}
                  away={{ code: teamCode(m.away_team), name: m.away_team }}
                  homeScore={m.home_score}
                  awayScore={m.away_score}
                  winnerName={m.winner}
                  apiStatus={m.api_status}
                  syncedAt={m.last_synced_at}
                  approved={m.is_approved}
                  roundSlug={r.slug}
                />
              ))}
            </CollapsibleRound>
          );
        })}
      </div>

      {(matches ?? []).length === 0 && (
        <div className="card p-8 text-center text-muted">
          No hay partidos cargados. Pulsa &quot;Actualizar partidos&quot;.
        </div>
      )}
    </div>
  );
}
