// Tipos de dominio de la quiniela

export type Role = "user" | "admin";

export type RoundSlug =
  | "16avos"
  | "8vos"
  | "4tos"
  | "semis"
  | "tercer_lugar"
  | "final";

export interface Profile {
  id: string;
  username: string;
  role: Role;
  group_stage_points: number;
  created_at: string;
}

export interface Round {
  id: number;
  slug: RoundSlug;
  name: string;
  ordinal: number;
  locks_at: string | null;
  is_open: boolean;
  exact_points: number;
  winner_points: number;
}

export interface Match {
  id: number;
  round_id: number;
  api_fixture_id: number | null;
  home_team: string;
  away_team: string;
  kickoff_at: string | null;
  home_score: number | null;
  away_score: number | null;
  winner: string | null;
  api_status: string | null;
  is_approved: boolean;
  approved_at: string | null;
  last_synced_at: string | null;
}

export interface Prediction {
  id: number;
  user_id: string;
  match_id: number;
  pred_home: number;
  pred_away: number;
  pred_winner: string;
  created_at: string;
  updated_at: string;
}

export interface UserScore {
  user_id: string;
  username: string;
  group_stage_points: number;
  knockout_points: number;
  exact_hits: number;
  total_points: number;
}
