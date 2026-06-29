import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import RoundAccordion, { type RoundSection } from "@/components/RoundAccordion";
import { createClient } from "@/lib/supabase/server";
import { teamCode } from "@/lib/flags";
import { matchPoints } from "@/lib/scoring";
import type { Match as UIMatch } from "@/lib/data";
import type { Match, Prediction, Round } from "@/lib/types";

export const metadata = { title: "Mi Pronóstico · Quiniela Mundial 2026" };
export const revalidate = 0;

// Hora actual (ms). Aislada en un helper: este es un Server Component async,
// el reloj es una entrada legítima de cada request, no estado derivado del render.
function nowMs(): number {
  return Date.now();
}

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
  return new Date(dt).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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

  // Todas las rondas (por orden), todos sus partidos y los pronósticos del usuario.
  const { data: roundData } = await supabase
    .from("rounds")
    .select("*")
    .order("ordinal", { ascending: true });
  const rounds = (roundData ?? []) as Round[];

  const { data: matchData } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_at", { ascending: true });
  const allMatches = (matchData ?? []) as Match[];

  // El perfil del jugador se resuelve por auth_user_id (profiles.id ya no es
  // el uid de Auth). predictions.user_id apunta a profiles.id.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  const profileId = profile?.id ?? null;

  const { data: predData } = profileId
    ? await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", profileId)
    : { data: [] as Prediction[] };
  const preds = new Map<number, Prediction>();
  for (const p of (predData ?? []) as Prediction[]) preds.set(p.match_id, p);

  // Agrupa partidos por ronda (mantiene el orden por kickoff_at del fetch).
  const byRound = new Map<number, Match[]>();
  for (const m of allMatches) {
    if (!byRound.has(m.round_id)) byRound.set(m.round_id, []);
    byRound.get(m.round_id)!.push(m);
  }

  const now = nowMs();

  const sections: RoundSection[] = rounds.flatMap((round) => {
    const matches = byRound.get(round.id) ?? [];
    if (matches.length === 0) return []; // ocultar rondas sin partidos (patrón admin)

    const locked = round.locks_at != null && new Date(round.locks_at).getTime() <= now;
    const active = round.is_open && !locked;

    const uiMatches: UIMatch[] = matches.map((m) => {
      const p = preds.get(m.id);
      const predWinner =
        p && p.pred_home === p.pred_away
          ? p.pred_winner === m.home_team
            ? ("home" as const)
            : ("away" as const)
          : undefined;
      // Bloqueo POR partido: la ronda no está abierta o ya cerró (mismo
      // criterio que el nivel-ronda), o el kickoff de ESTE partido ya pasó.
      const matchLocked =
        locked ||
        (m.kickoff_at != null && new Date(m.kickoff_at).getTime() <= now);
      return {
        id: m.id,
        time: fmtKickoff(m.kickoff_at),
        home: { code: teamCode(m.home_team), name: m.home_team },
        away: { code: teamCode(m.away_team), name: m.away_team },
        predHome: p?.pred_home,
        predAway: p?.pred_away,
        predWinner,
        groupStage: round.slug === "grupos",
        resHome: m.is_approved ? m.home_score : undefined,
        resAway: m.is_approved ? m.away_score : undefined,
        locked: matchLocked,
      };
    });

    // Puntos por partido (solo aprobados) y total de la ronda.
    const points = matches.map((m) =>
      m.is_approved ? matchPoints(m, preds.get(m.id), round) : null,
    );
    const hasResults = points.some((p) => p != null);
    const total = hasResults
      ? points.reduce<number>((s, p) => s + (p ?? 0), 0)
      : null;

    return [{ id: round.id, slug: round.slug, name: round.name, deadline: fmtDeadline(round.locks_at), locked, active, matches: uiMatches, points, total }];
  });

  if (sections.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No hay rondas con partidos"
        action={<Link href="/ranking" className="btn btn-surface mt-1.5">Ver ranking</Link>}
      >
        Cuando el admin abra una ronda y se carguen los partidos podrás cargar tus pronósticos aquí.
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-5 [color-scheme:light]">
      <div className="card p-5">
        <h1 className="font-display font-bold text-2xl md:text-[26px] tracking-tight">Mi Pronóstico</h1>
        <p className="text-[13px] font-medium text-muted mt-1">
          Toca una ronda para ver o editar tus pronósticos. La ronda abierta está lista para guardar.
        </p>
      </div>

      <RoundAccordion rounds={sections} />
    </div>
  );
}
