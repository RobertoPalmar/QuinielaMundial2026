import Ranking from "@/components/Ranking";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { RankRow } from "@/lib/data";
import type { UserScore } from "@/lib/types";

export const metadata = { title: "Ranking · Quiniela Mundial 2026" };
export const revalidate = 0;

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El id del perfil del usuario se resuelve por auth_user_id (profiles.id ya
  // no es el uid de Auth). v_user_scores.user_id referencia profiles.id.
  let myProfileId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
    myProfileId = profile?.id ?? null;
  }

  const { data } = await supabase
    .from("v_user_scores")
    .select("*")
    .order("total_points", { ascending: false })
    .order("exact_hits", { ascending: false })
    .order("username", { ascending: true });

  const scores = (data ?? []) as UserScore[];
  const rows: RankRow[] = scores.map((s, i) => ({
    pos: i + 1,
    name: s.username,
    a: s.hits,
    x: s.exact_hits,
    t: s.total_points,
    you: myProfileId != null && myProfileId === s.user_id,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="font-display font-bold text-[clamp(26px,5vw,38px)] tracking-tight">Ranking</h1>
          <p className="mt-2 text-sm text-muted">Clasificación general por puntos totales</p>
        </div>
        <Badge variant="live" dot>En vivo</Badge>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="🏆" title="Aún no hay participantes">
          Cuando se carguen los puntos de grupos o se aprueben resultados, el ranking aparecerá aquí.
        </EmptyState>
      ) : (
        <Ranking rows={rows} />
      )}

      <p className="text-xs text-muted text-center">
        Total = puntos de grupos + eliminatorias. Solo cuentan partidos con resultado aprobado.
      </p>
    </div>
  );
}
