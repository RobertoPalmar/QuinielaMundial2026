import RegisterForm from "@/components/RegisterForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Crear cuenta · Quiniela Mundial 2026" };

export default async function RegistroPage() {
  const supabase = await createClient();
  const { data: players } = await supabase
    .from("profiles")
    .select("id, username")
    .is("auth_user_id", null)
    .order("username");

  return (
    <section className="max-w-[420px] mx-auto mt-6">
      <div className="text-center mb-6">
        <span className="text-3xl" aria-hidden>⚽</span>
        <h1 className="font-display font-bold text-[26px] tracking-tight mt-2.5 mb-1">Crear cuenta</h1>
        <p className="text-sm text-muted">Regístrate para participar en la quiniela</p>
      </div>
      <RegisterForm players={players ?? []} />
    </section>
  );
}
