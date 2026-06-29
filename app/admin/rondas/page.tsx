import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RoundForm } from "./RoundForm";
import type { Round } from "@/lib/types";

export const metadata = { title: "Rondas · Admin" };
export const revalidate = 0;

export default async function RondasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rounds")
    .select("*")
    .order("ordinal", { ascending: true });
  const rounds = (data ?? []) as Round[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-[var(--color-muted)]">
          ← Admin
        </Link>
        <h1 className="text-3xl font-bold">Rondas</h1>
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Abre la ronda y fija el deadline (kickoff del primer partido). Al cerrar
        una ronda, abre la siguiente.
      </p>
      <div className="grid gap-3">
        {rounds.map((r) => (
          <RoundForm key={r.id} round={r} />
        ))}
      </div>
    </div>
  );
}
