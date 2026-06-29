import { createClient } from "@/lib/supabase/server";
import type { UserScore } from "@/lib/types";

export const metadata = { title: "Ranking · Quiniela Mundial 2026" };
// Revalida en cada request (puntaje en vivo)
export const revalidate = 0;

const medal = ["🥇", "🥈", "🥉"];

export default async function RankingPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("v_user_scores")
    .select("*")
    .order("total_points", { ascending: false })
    .order("exact_hits", { ascending: false })
    .order("username", { ascending: true });

  const scores = (data ?? []) as UserScore[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ranking</h1>
        <span className="badge text-[var(--color-primary)]">🟢 En vivo</span>
      </div>

      {scores.length === 0 ? (
        <div className="card p-8 text-center text-[var(--color-muted)]">
          Aún no hay participantes.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-muted)] border-b border-[var(--color-border)]">
                <th className="p-3 w-12">#</th>
                <th className="p-3">Participante</th>
                <th className="p-3 text-center">Grupos</th>
                <th className="p-3 text-center">Eliminatorias</th>
                <th className="p-3 text-center">Exactos</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr
                  key={s.user_id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]"
                >
                  <td className="p-3 font-semibold">
                    {medal[i] ?? i + 1}
                  </td>
                  <td className="p-3 font-medium">{s.username}</td>
                  <td className="p-3 text-center text-[var(--color-muted)]">
                    {s.group_stage_points}
                  </td>
                  <td className="p-3 text-center text-[var(--color-muted)]">
                    {s.knockout_points}
                  </td>
                  <td className="p-3 text-center text-[var(--color-muted)]">
                    {s.exact_hits}
                  </td>
                  <td className="p-3 text-right font-bold text-[var(--color-primary)]">
                    {s.total_points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-[var(--color-muted)] text-center">
        Total = puntos de fase de grupos + eliminatorias. Solo cuentan partidos
        con resultado confirmado por el administrador.
      </p>
    </div>
  );
}
