"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type AuthState = { error?: string; message?: string };

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/mi-pronostico");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Email o contraseña incorrectos." };
  }
  redirect(redirectTo);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const profileId = String(formData.get("profile_id") ?? "").trim();

  if (!UUID_RE.test(profileId)) {
    return { error: "Selecciona un jugador de la lista." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  // El perfil elegido debe seguir sin reclamar. Lo verificamos con el admin
  // client (saltea RLS) para dar un error claro si ya fue tomado.
  const admin = createAdminClient();
  const { data: chosen } = await admin
    .from("profiles")
    .select("id, auth_user_id")
    .eq("id", profileId)
    .single();
  if (!chosen) {
    return { error: "Ese jugador no existe." };
  }
  if (chosen.auth_user_id) {
    return { error: "Ese jugador ya fue reclamado por otra cuenta." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { claim_profile_id: profileId },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Ese email ya está registrado." };
    }
    return { error: error.message };
  }

  return {
    message:
      "Cuenta creada. Revisa tu email y confirma tu cuenta para poder ingresar.",
  };
}
