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

  // El perfil del jugador se resuelve por auth_user_id (profiles.id ya no es
  // el uid de Auth). predictions.user_id referencia profiles.id.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!profile) return { error: "No se encontró tu perfil de jugador." };
  const profileId = profile.id;

  // match ids presentes en el form
  const matchIds = new Set<number>();
  for (const key of formData.keys()) {
    const m = key.match(/^m_(\d+)_/);
    if (m) matchIds.add(Number(m[1]));
  }
  if (matchIds.size === 0) return { error: "No hay partidos para guardar." };

  // En fase de grupos un empate es válido tal cual: no hay penales ni
  // "quién avanza". Para otras rondas, un empate exige elegir quién avanza.
  const isGroupStage = String(formData.get("round_slug") ?? "") === "grupos";

  // Equipos y kickoff de cada match (para derivar el ganador por nombre y
  // aplicar el bloqueo por partido, igual que la RLS).
  const { data: matchRows } = await supabase
    .from("matches")
    .select("id, home_team, away_team, kickoff_at")
    .in("id", [...matchIds]);
  const teams = new Map<number, { home: string; away: string }>();
  const kickoffs = new Map<number, string | null>();
  for (const m of matchRows ?? []) {
    teams.set(m.id, { home: m.home_team, away: m.away_team });
    kickoffs.set(m.id, m.kickoff_at);
  }

  // Bloqueo por partido: si el kickoff de ESTE partido ya pasó, el partido
  // está cerrado aunque la ronda siga abierta. Lo omitimos (sin contarlo como
  // error) para que la RLS no rechace el upsert.
  const now = Date.now();

  const rows = [];
  let incomplete = 0;
  for (const id of matchIds) {
    // Partido ya cerrado por kickoff: se omite (no es error). Espeja la RLS.
    const ko = kickoffs.get(id);
    if (ko != null && new Date(ko).getTime() <= now) continue;

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
    else if (isGroupStage) {
      // fase de grupos: el empate es un pronóstico válido (sin penales).
      // pred_winner queda "" para satisfacer la columna NOT NULL.
      pred_winner = "";
    } else {
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
      user_id: profileId,
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
