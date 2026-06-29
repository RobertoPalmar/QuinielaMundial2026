import Link from "next/link";
import RoundEditorCard from "@/components/RoundEditorCard";
import { createClient } from "@/lib/supabase/server";
import type { Round } from "@/lib/types";

export const metadata = { title: "Rondas · Admin" };
export const revalidate = 0;

export default async function AdminRondasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("rounds").select("*").order("ordinal", { ascending: true });
  const rounds = (data ?? []) as Round[];

  return (
    <div className="flex flex-col gap-[18px]">
      <Link href="/admin" className="self-start text-[13px] font-semibold text-muted hover:text-text">← Volver al panel</Link>
      <h1 className="font-display font-bold text-[clamp(24px,5vw,34px)] tracking-tight">Rondas</h1>
      <p className="text-sm text-muted">
        Abre la ronda y fija el deadline (kickoff del primer partido). Al cerrar una ronda, abre la siguiente.
      </p>

      <div className="flex flex-col gap-3">
        {rounds.map((r) => (
          <RoundEditorCard key={r.id} round={r} n={r.ordinal} />
        ))}
      </div>
    </div>
  );
}
