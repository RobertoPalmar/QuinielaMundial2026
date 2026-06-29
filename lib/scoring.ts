// ============================================================
// Puntaje de un pronóstico — ÚNICA fuente de verdad en TS.
//
// Debe coincidir EXACTAMENTE con la vista SQL `v_user_scores`
// (supabase/migrations/0001_init.sql, ~líneas 146-152):
//   - marcador exacto (pred_home/away == score) -> exact_points
//   - acierta ganador (pred_winner == winner)   -> winner_points
//   - en otro caso                              -> 0
//   - SOLO cuentan partidos con is_approved = true
// ============================================================

import type { Match, Prediction, Round } from "@/lib/types";

/** Puntos de un partido para un pronóstico. 0 si no aprobado o sin pronóstico. */
export function matchPoints(
  match: Match,
  pred: Prediction | undefined,
  round: Pick<Round, "exact_points" | "winner_points">,
): number {
  if (!match.is_approved || !pred) return 0;
  if (pred.pred_home === match.home_score && pred.pred_away === match.away_score) {
    return round.exact_points;
  }
  if (pred.pred_winner === match.winner) {
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
