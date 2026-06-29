import { createClient } from "@supabase/supabase-js";

// Cliente con service role key. SOLO usar en servidor (route handlers / server
// actions de admin / cron). Saltea RLS -> nunca exponer al cliente.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
