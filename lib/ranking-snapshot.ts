import { createAdminClient } from "@/lib/supabase/admin";

// Captura las standings ACTUALES (tal como están ANTES de aplicar el último
// resultado) en ranking_snapshots. Lee v_user_scores con el MISMO orden que la
// página de ranking, asigna posición 1..N e inserta una fila por usuario, todas
// compartiendo el mismo `snapshot_at` para que el lote sea atómico.
//
// Limitación: si se aprueban/revierten varios resultados de uno en uno, cada
// llamada crea su propio snapshot; el delta visible en el ranking refleja solo
// el ÚLTIMO cambio aprobado, no el acumulado de toda la sesión de carga.
export async function snapshotRanking(): Promise<void> {
  const admin = createAdminClient();

  // Mismo orden que app/ranking/page.tsx.
  const { data, error } = await admin
    .from("v_user_scores")
    .select("user_id,total_points")
    .order("total_points", { ascending: false })
    .order("exact_hits", { ascending: false })
    .order("username", { ascending: true });

  if (error || !data || data.length === 0) return;

  const snapshotAt = new Date().toISOString();
  const rows = data.map((s, i) => ({
    user_id: s.user_id as string,
    position: i + 1,
    total_points: (s.total_points as number) ?? 0,
    snapshot_at: snapshotAt,
  }));

  await admin.from("ranking_snapshots").insert(rows);
}
