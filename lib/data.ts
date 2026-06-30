// ============================================================
// Tipos de presentación de la UI. Los datos reales vienen del
// servidor (Supabase) y se mapean a estas formas en cada página.
// ============================================================

export type Team = { code: string; name: string };

export type Match = {
  id: number;
  time: string;
  home: Team;
  away: Team;
  // Pronóstico guardado del usuario (estado "cerrada"/locked)
  predHome?: number;
  predAway?: number;
  predWinner?: "home" | "away"; // SOLO aplica si el pronóstico fue empate
  // Fase de grupos: un empate es válido tal cual (sin penales / "quién avanza")
  groupStage?: boolean;
  // Resultado oficial (si ya existe)
  resHome?: number | null;
  resAway?: number | null;
  // Bloqueo por partido: true si la ronda cerró/no está abierta, o si el
  // kickoff de ESTE partido ya pasó. Render read-only aunque la ronda siga activa.
  locked?: boolean;
};

export type RankRow = {
  pos: number;
  userId: string; // profiles.id (= v_user_scores.user_id) del participante
  name: string;
  a: number; // acertados (partidos con resultado correcto, incluye exactos)
  x: number; // exactos
  t: number; // total
  you?: boolean;
  // Cambio de posición respecto al último snapshot del ranking.
  // > 0 = subió, < 0 = bajó, 0 = sin cambio, null/undefined = sin datos previos (nuevo).
  delta?: number | null;
};

export type ApiStatus = "FINISHED" | "TIMED" | "IN_PLAY";
