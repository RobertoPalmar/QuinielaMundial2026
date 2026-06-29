"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { error?: string; message?: string };

// Guarda (upsert) todas las predicciones de la ronda abierta.
// La RLS valida que la ronda este abierta y antes del deadline.
export async function savePredictions(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada. Vuelve a ingresar." };

  // Recolecta los match ids presentes en el form
  const matchIds = new Set<number>();
  for (const key of formData.keys()) {
    const m = key.match(/^m_(\d+)_/);
    if (m) matchIds.add(Number(m[1]));
  }

  const rows = [];
  for (const id of matchIds) {
    const home = formData.get(`m_${id}_home`);
    const away = formData.get(`m_${id}_away`);
    const winner = String(formData.get(`m_${id}_winner`) ?? "").trim();
    // Si no completó algún campo de ese partido, lo saltamos
    if (home === null || away === null || home === "" || away === "" || !winner)
      continue;
    const ph = Number(home);
    const pa = Number(away);
    if (!Number.isInteger(ph) || !Number.isInteger(pa) || ph < 0 || pa < 0)
      return { error: "Marcadores inválidos." };
    rows.push({
      user_id: user.id,
      match_id: id,
      pred_home: ph,
      pred_away: pa,
      pred_winner: winner,
    });
  }

  if (rows.length === 0) {
    return { error: "Completa al menos un pronóstico." };
  }

  const { error } = await supabase
    .from("predictions")
    .upsert(rows, { onConflict: "user_id,match_id" });

  if (error) {
    // Violación de RLS = ronda cerrada o fuera de plazo
    return {
      error:
        "No se pudieron guardar. La ronda puede estar cerrada o fuera de plazo.",
    };
  }

  revalidatePath("/mi-pronostico");
  return { message: `Guardado: ${rows.length} pronóstico(s).` };
}
