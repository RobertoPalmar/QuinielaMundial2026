import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import RoundAccordion, { type RoundSection } from "@/components/RoundAccordion";
import { createClient } from "@/lib/supabase/server";
import { teamCode } from "@/lib/flags";
import { matchPoints } from "@/lib/scoring";
import type { Match as UIMatch } from "@/lib/data";
import type { Match, Prediction, Round } from "@/lib/types";

export const metadata = { title: "Pronósticos · Quiniela Mundial 2026" };
export const revalidate = 0;

// Hora actual (ms). Aislada en un helper: este es un Server Component async,
// el reloj es una entrada legítima de cada request, no estado derivado del render.
function nowMs(): number {
  return Date.now();
}

function fmtKickoff(dt: string | null): string {
  if (!dt) return "Por definir";
  return new Date(dt).toLocaleString("es-MX", {
    timeZone: "America/Caracas",
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
    timeZone: "America/Caracas",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function PronosticosUsuarioPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  // Perfil objetivo: se identifica por profiles.id (el UUID que expone
  // v_user_scores.user_id / el ranking), NO por auth_user_id.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", userId)
    .single();

  if (!profile) notFound();

  // Todas las rondas (por orden) y todos sus partidos.
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

  // Pronósticos del usuario objetivo. La RLS de `predictions` solo devuelve, a
  // un espectador que no sea el dueño/admin, los de rondas YA cerradas. Esa es
  // exactamente la visibilidad deseada: no se cambia ninguna política.
  const { data: predData } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId);
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

    // ¿La RLS ocultó los pronósticos? Si la ronda NO está cerrada y no llegó
    // ningún pronóstico de sus partidos, el espectador no es dueño/admin y los
    // pronósticos están ocultos hasta que cierre la ronda. (Si fuera dueño/
    // admin, la RLS devuelve todo y caemos al render normal de tarjetas.)
    const hasAnyPred = matches.some((m) => preds.has(m.id));
    const hidden = !locked && !hasAnyPred;

    if (hidden) {
      return [
        {
          id: round.id,
          slug: round.slug,
          name: round.name,
          deadline: fmtDeadline(round.locks_at),
          locked: true,
          active: false,
          matches: [],
          points: [],
          total: null,
          placeholder: "Pronósticos ocultos hasta que cierre la ronda",
        },
      ];
    }

    const uiMatches: UIMatch[] = matches.map((m) => {
      const p = preds.get(m.id);
      const predWinner =
        p && p.pred_home === p.pred_away
          ? p.pred_winner === m.home_team
            ? ("home" as const)
            : ("away" as const)
          : undefined;
      // Tablero de OTRO usuario: siempre read-only.
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
        locked: true,
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

    return [
      {
        id: round.id,
        slug: round.slug,
        name: round.name,
        deadline: fmtDeadline(round.locks_at),
        locked: true,
        // active SIEMPRE false: nunca se edita el tablero de otro usuario.
        active: false,
        matches: uiMatches,
        points,
        total,
      },
    ];
  });

  return (
    <div className="flex flex-col gap-5 [color-scheme:light]">
      <div className="card p-5">
        <Link
          href="/ranking"
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          ← Volver al ranking
        </Link>
        <h1 className="font-display font-bold text-2xl md:text-[26px] tracking-tight mt-2">
          Pronósticos de {profile.username}
        </h1>
        <p className="text-[13px] font-medium text-muted mt-1">
          Solo se muestran los pronósticos de las rondas ya cerradas.
        </p>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No hay rondas con partidos"
          action={<Link href="/ranking" className="btn btn-surface mt-1.5">Ver ranking</Link>}
        >
          Cuando el admin abra rondas y se carguen los partidos, aparecerán aquí.
        </EmptyState>
      ) : (
        <RoundAccordion rounds={sections} />
      )}
    </div>
  );
}
