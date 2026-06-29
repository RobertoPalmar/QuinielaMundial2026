import { createAdminClient } from "@/lib/supabase/admin";
import { fetchWorldCupFixtures, ROUND_NAME_TO_SLUG } from "@/lib/api-football";

export interface SyncResult {
  synced: number;
  skipped: number;
  at: string;
}

// Poll a API-Football + upsert de marcadores/estado en `matches`.
// NUNCA toca is_approved/approved_at (eso lo decide el admin).
export async function syncMatches(): Promise<SyncResult> {
  const supabase = createAdminClient();

  const { data: rounds, error: roundsErr } = await supabase
    .from("rounds")
    .select("id, slug");
  if (roundsErr) throw new Error(roundsErr.message);
  const slugToId = new Map(rounds.map((r) => [r.slug, r.id]));

  const fixtures = await fetchWorldCupFixtures();
  const now = new Date().toISOString();

  const rows = [];
  let skipped = 0;
  for (const f of fixtures) {
    const slug = ROUND_NAME_TO_SLUG[f.round_name];
    const roundId = slug ? slugToId.get(slug) : undefined;
    if (!roundId) {
      skipped++;
      continue;
    }
    rows.push({
      round_id: roundId,
      api_fixture_id: f.api_fixture_id,
      home_team: f.home_team,
      away_team: f.away_team,
      kickoff_at: f.kickoff_at,
      home_score: f.home_score,
      away_score: f.away_score,
      winner: f.winner,
      api_status: f.api_status,
      last_synced_at: now,
    });
  }

  if (rows.length > 0) {
    const { error } = await supabase
      .from("matches")
      .upsert(rows, { onConflict: "api_fixture_id" });
    if (error) throw new Error(error.message);
  }

  return { synced: rows.length, skipped, at: now };
}
