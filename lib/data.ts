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
  // Resultado oficial (si ya existe)
  resHome?: number | null;
  resAway?: number | null;
};

export type RankRow = {
  pos: number;
  name: string;
  g: number; // grupos
  e: number; // eliminatorias
  x: number; // exactos
  t: number; // total
  you?: boolean;
};

export type ApiStatus = "FINISHED" | "TIMED" | "IN_PLAY";
