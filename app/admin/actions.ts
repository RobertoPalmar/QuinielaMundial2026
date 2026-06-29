"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncMatches } from "@/lib/sync-matches";

export type AdminState = { error?: string; message?: string };

// Verifica que quien llama sea admin. Server actions pueden invocarse desde
// cualquier lado -> nunca confiar solo en el middleware.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("No autorizado");
  return user;
}

// ---------- Resultados ----------

// Aprobar resultado oficial -> dispara el cálculo de puntos (vista).
export async function approveResult(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  try {
    await requireAdmin();
    const matchId = Number(formData.get("match_id"));
    const admin = createAdminClient();

    // Si el admin mandó override de marcador/ganador, lo guardamos también.
    const home = formData.get("home_score");
    const away = formData.get("away_score");
    const winner = String(formData.get("winner") ?? "").trim();

    const patch: Record<string, unknown> = {
      is_approved: true,
      approved_at: new Date().toISOString(),
    };
    if (home !== null && home !== "") patch.home_score = Number(home);
    if (away !== null && away !== "") patch.away_score = Number(away);
    if (winner) patch.winner = winner;

    const { error } = await admin
      .from("matches")
      .update(patch)
      .eq("id", matchId);
    if (error) return { error: error.message };

    revalidatePath("/admin/resultados");
    revalidatePath("/ranking");
    return { message: "Resultado aprobado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error" };
  }
}

export async function unapproveResult(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  try {
    await requireAdmin();
    const matchId = Number(formData.get("match_id"));
    const admin = createAdminClient();
    const { error } = await admin
      .from("matches")
      .update({ is_approved: false, approved_at: null })
      .eq("id", matchId);
    if (error) return { error: error.message };
    revalidatePath("/admin/resultados");
    revalidatePath("/ranking");
    return { message: "Aprobación revertida." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error" };
  }
}

// Sync manual con API-Football
export async function syncNow(): Promise<AdminState> {
  try {
    await requireAdmin();
    const r = await syncMatches();
    revalidatePath("/admin/resultados");
    return { message: `Sincronizado: ${r.synced} partidos.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error de sync" };
  }
}

// ---------- Rondas ----------

export async function updateRound(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  try {
    await requireAdmin();
    const id = Number(formData.get("round_id"));
    const isOpen = formData.get("is_open") === "on";
    const locksAt = String(formData.get("locks_at") ?? "").trim();
    const exact = Number(formData.get("exact_points"));
    const winner = Number(formData.get("winner_points"));

    const admin = createAdminClient();
    const { error } = await admin
      .from("rounds")
      .update({
        is_open: isOpen,
        locks_at: locksAt ? new Date(locksAt).toISOString() : null,
        exact_points: Number.isInteger(exact) ? exact : 3,
        winner_points: Number.isInteger(winner) ? winner : 1,
      })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/rondas");
    revalidatePath("/mi-pronostico");
    return { message: "Ronda actualizada." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error" };
  }
}

// ---------- Import puntos de grupos ----------

// Pega líneas "usuario,puntos" (una por participante).
export async function importGroupPoints(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  try {
    await requireAdmin();
    const raw = String(formData.get("data") ?? "");
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const admin = createAdminClient();
    let updated = 0;
    const notFound: string[] = [];

    for (const line of lines) {
      const [username, ptsStr] = line.split(/[,;\t]/).map((s) => s?.trim());
      if (!username) continue;
      const pts = Number(ptsStr);
      if (!Number.isInteger(pts)) continue;
      const { data, error } = await admin
        .from("profiles")
        .update({ group_stage_points: pts })
        .eq("username", username)
        .select("id");
      if (error) return { error: error.message };
      if (data && data.length > 0) updated++;
      else notFound.push(username);
    }

    revalidatePath("/ranking");
    const msg = `Actualizados: ${updated}.${
      notFound.length ? ` No encontrados: ${notFound.join(", ")}` : ""
    }`;
    return { message: msg };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error" };
  }
}
