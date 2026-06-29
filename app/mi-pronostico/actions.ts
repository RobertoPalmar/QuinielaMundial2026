"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { error?: string; message?: string };

// Guarda (upsert) las predicciones de la ronda abierta.
// El ganador se deriva del marcador; solo en empate se usa m_<id>_winner.
// La RLS valida que la ronda esté abierta y antes del deadline.
export async function savePredictions(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada. Vuelve a ingresar." };

  // match ids presentes en el form
  const matchIds = new Set<number>();
  for (const key of formData.keys()) {
    const m = key.match(/^m_(\d+)_/);
    if (m) matchIds.add(Number(m[1]));
  }
  if (matchIds.size === 0) return { error: "No hay partidos para guardar." };

  // Equipos de cada match (para derivar el ganador por nombre)
  const { data: matchRows } = await supabase
    .from("matches")
    .select("id, home_team, away_team")
    .in("id", [...matchIds]);
  const teams = new Map<number, { home: string; away: string }>();
  for (const m of matchRows ?? [])
    teams.set(m.id, { home: m.home_team, away: m.away_team });

  const rows = [];
  let incomplete = 0;
  for (const id of matchIds) {
    const home = formData.get(`m_${id}_home`);
    const away = formData.get(`m_${id}_away`);
    if (home === null || away === null || home === "" || away === "") {
      incomplete++;
      continue;
    }
    const ph = Number(home);
    const pa = Number(away);
    if (!Number.isInteger(ph) || !Number.isInteger(pa) || ph < 0 || pa < 0)
      return { error: "Marcadores inválidos." };

    const t = teams.get(id);
    if (!t) continue;

    let pred_winner: string | null = null;
    if (ph > pa) pred_winner = t.home;
    else if (pa > ph) pred_winner = t.away;
    else {
      // empate: requiere selección de penales
      const side = String(formData.get(`m_${id}_winner`) ?? "");
      if (side === "home") pred_winner = t.home;
      else if (side === "away") pred_winner = t.away;
      else {
        incomplete++;
        continue; // empate sin elegir quién avanza -> no guardar ese partido
      }
    }

    rows.push({
      user_id: user.id,
      match_id: id,
      pred_home: ph,
      pred_away: pa,
      pred_winner,
    });
  }

  if (rows.length === 0) {
    return { error: "Completa al menos un pronóstico (y en empates, quién avanza)." };
  }

  const { error } = await supabase
    .from("predictions")
    .upsert(rows, { onConflict: "user_id,match_id" });

  if (error) {
    return {
      error:
        "No se pudieron guardar. La ronda puede estar cerrada o fuera de plazo.",
    };
  }

  revalidatePath("/mi-pronostico");
  const extra = incomplete ? ` (${incomplete} sin completar)` : "";
  return { message: `Guardado: ${rows.length} pronóstico(s).${extra}` };
}
