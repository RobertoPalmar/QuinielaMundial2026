// Adaptador de football-data.org (v4) + mapeo de partido -> match.
// Docs: https://www.football-data.org/documentation/quickstart
// Mundial: competition code = WC (id 2000). El free tier cubre la temporada 2026.

const API_BASE = "https://api.football-data.org/v4";
export const WORLD_CUP_CODE = "WC";

// Mapeo del "stage" de football-data al slug interno de la quiniela.
// (Mundial 48 equipos: LAST_32 = dieciseisavos / round of 32.)
export const ROUND_NAME_TO_SLUG: Record<string, string> = {
  LAST_32: "16avos",
  LAST_16: "8vos",
  QUARTER_FINALS: "4tos",
  SEMI_FINALS: "semis",
  THIRD_PLACE: "tercer_lugar",
  FINAL: "final",
};

interface FdMatch {
  id: number;
  utcDate: string;
  status: string; // SCHEDULED, TIMED, IN_PLAY, PAUSED, FINISHED, SUSPENDED, POSTPONED
  stage: string; // GROUP_STAGE, LAST_32, LAST_16, QUARTER_FINALS, SEMI_FINALS, THIRD_PLACE, FINAL
  homeTeam: { name: string | null };
  awayTeam: { name: string | null };
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
  };
}

export interface MappedFixture {
  api_fixture_id: number;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  home_score: number | null;
  away_score: number | null;
  winner: string | null;
  api_status: string;
  round_name: string; // stage de football-data
}

const FINISHED = new Set(["FINISHED"]);

function token(): string {
  const t = process.env.FOOTBALL_DATA_TOKEN;
  if (!t) throw new Error("Falta FOOTBALL_DATA_TOKEN");
  return t;
}

async function apiGet(path: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "X-Auth-Token": token() },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`football-data ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Mapea un partido crudo de football-data al shape de `matches`.
export function mapFixture(m: FdMatch): MappedFixture {
  let winner: string | null = null;
  if (FINISHED.has(m.status)) {
    if (m.score.winner === "HOME_TEAM") winner = m.homeTeam.name;
    else if (m.score.winner === "AWAY_TEAM") winner = m.awayTeam.name;
  }
  return {
    api_fixture_id: m.id,
    home_team: m.homeTeam.name ?? "Por definir",
    away_team: m.awayTeam.name ?? "Por definir",
    kickoff_at: m.utcDate,
    home_score: m.score.fullTime.home,
    away_score: m.score.fullTime.away,
    winner,
    api_status: m.status,
    round_name: m.stage,
  };
}

// Trae todos los partidos del Mundial (todas las fases).
export async function fetchWorldCupFixtures(): Promise<MappedFixture[]> {
  const data = (await apiGet(
    `/competitions/${WORLD_CUP_CODE}/matches`
  )) as { matches?: FdMatch[] };
  return (data.matches ?? []).map(mapFixture);
}

export function isFinished(status: string | null): boolean {
  return status != null && FINISHED.has(status);
}
