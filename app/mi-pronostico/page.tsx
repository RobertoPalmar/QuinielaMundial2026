import Link from "next/link";
import Badge from "@/components/Badge";
import Banner from "@/components/Banner";
import EmptyState from "@/components/EmptyState";
import { PredictionForm } from "./PredictionForm";
import { createClient } from "@/lib/supabase/server";
import { teamCode } from "@/lib/flags";
import type { Match as UIMatch } from "@/lib/data";
import type { Match, Prediction, Round } from "@/lib/types";

export const metadata = { title: "Mi Pronóstico · Quiniela Mundial 2026" };
export const revalidate = 0;

function fmtKickoff(dt: string | null): string {
  if (!dt) return "Por definir";
  return new Date(dt).toLocaleString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDeadline(dt: string | null): string {
  if (!dt) return "Por definir";
  return new Date(dt).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

export default async function MiPronosticoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <p>
        Debes <Link href="/login" className="text-primary font-semibold">ingresar</Link>.
      </p>
    );
  }

  const { data: rounds } = await supabase
    .from("rounds")
    .select("*")
    .eq("is_open", true)
    .order("ordinal", { ascending: true })
    .limit(1);
  const round = (rounds?.[0] ?? null) as Round | null;

  if (!round) {
    return (
      <EmptyState
        icon="📭"
        title="No hay ninguna ronda abierta"
        action={<Link href="/ranking" className="btn btn-surface mt-1.5">Ver ranking</Link>}
      >
        Cuando el admin abra la siguiente ronda podrás cargar tus pronósticos aquí. Mientras tanto, revisa el ranking.
      </EmptyState>
    );
  }

  const locked = round.locks_at != null && new Date(round.locks_at).getTime() <= Date.now();

  const { data: matchData } = await supabase
    .from("matches")
    .select("*")
    .eq("round_id", round.id)
    .order("kickoff_at", { ascending: true });
  const matches = (matchData ?? []) as Match[];

  if (matches.length === 0) {
    return (
      <EmptyState icon="⏳" title="Partidos aún no cargados">
        La ronda está abierta, pero los partidos todavía no se sincronizaron. Vuelve en un rato.
      </EmptyState>
    );
  }

  const { data: predData } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user.id)
    .in("match_id", matches.map((m) => m.id));
  const preds = new Map<number, Prediction>();
  for (const p of (predData ?? []) as Prediction[]) preds.set(p.match_id, p);

  const uiMatches: UIMatch[] = matches.map((m) => {
    const p = preds.get(m.id);
    const predWinner =
      p && p.pred_home === p.pred_away
        ? p.pred_winner === m.home_team
          ? ("home" as const)
          : ("away" as const)
        : undefined;
    return {
      id: m.id,
      time: fmtKickoff(m.kickoff_at),
      home: { code: teamCode(m.home_team), name: m.home_team },
      away: { code: teamCode(m.away_team), name: m.away_team },
      predHome: p?.pred_home,
      predAway: p?.pred_away,
      predWinner,
      resHome: m.is_approved ? m.home_score : undefined,
      resAway: m.is_approved ? m.away_score : undefined,
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="card p-5 flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-[26px] tracking-tight">{round.name}</h1>
          <p className="text-[13px] font-medium text-muted mt-1">Cierre: {fmtDeadline(round.locks_at)}</p>
        </div>
        {locked ? <Badge variant="closed">🔒 Cerrada</Badge> : <Badge variant="open" dot>Abierta</Badge>}
      </div>

      {locked && (
        <Banner kind="info">
          Esta ronda está cerrada. Tus pronósticos quedaron guardados en modo solo lectura.
        </Banner>
      )}

      <PredictionForm matches={uiMatches} locked={locked} />
    </div>
  );
}
