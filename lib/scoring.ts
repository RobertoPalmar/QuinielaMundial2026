// ============================================================
// Puntaje de un pronóstico — ÚNICA fuente de verdad en TS.
//
// Debe coincidir EXACTAMENTE con la vista SQL `v_user_scores`
// (supabase/migrations/0005_scoring_marcador_only.sql):
//   - marcador exacto (pred_home/away == score) -> exact_points
//   - punto de "ganador" por el SENTIDO del marcador (1X2):
//     sign(pred_home - pred_away) == sign(home_score - away_score)
//     -> winner_points. Cubre local, visitante y empate.
//     NUNCA se otorga por matches.winner, así los penales no suman.
//   - en otro caso                              -> 0
//   - SOLO cuentan partidos con is_approved = true
// ============================================================

import type { Match, Prediction, Round } from "@/lib/types";

const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);

/** Puntos de un partido para un pronóstico. 0 si no aprobado o sin pronóstico. */
export function matchPoints(
  match: Match,
  pred: Prediction | undefined,
  round: Pick<Round, "exact_points" | "winner_points">,
): number {
  if (!match.is_approved || !pred) return 0;
  if (match.home_score == null || match.away_score == null) return 0;
  if (pred.pred_home === match.home_score && pred.pred_away === match.away_score) {
    return round.exact_points;
  }
  if (sign(pred.pred_home - pred.pred_away) === sign(match.home_score - match.away_score)) {
    return round.winner_points;
  }
  return 0;
}

/** Suma de puntos de una ronda sobre sus partidos aprobados. */
export function roundPoints(
  matches: Match[],
  preds: Map<number, Prediction>,
  round: Pick<Round, "exact_points" | "winner_points">,
): number {
  return matches.reduce((sum, m) => sum + matchPoints(m, preds.get(m.id), round), 0);
}
