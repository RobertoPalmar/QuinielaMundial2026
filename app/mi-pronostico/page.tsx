import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PredictionForm } from "./PredictionForm";
import type { Match, Prediction, Round } from "@/lib/types";

export const metadata = { title: "Mi Pronóstico · Quiniela Mundial 2026" };

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function MiPronosticoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // El middleware ya garantiza sesión, pero por seguridad:
  if (!user) {
    return (
      <p>
        Debes <Link href="/login" className="text-[var(--color-primary)]">ingresar</Link>.
      </p>
    );
  }

  // Ronda abierta de menor ordinal
  const { data: rounds } = await supabase
    .from("rounds")
    .select("*")
    .eq("is_open", true)
    .order("ordinal", { ascending: true })
    .limit(1);
  const round = (rounds?.[0] ?? null) as Round | null;

  if (!round) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">No hay ronda abierta</h1>
        <p className="text-[var(--color-muted)]">
          Aún no se habilitó una ronda para cargar pronósticos. Vuelve más
          tarde.
        </p>
      </div>
    );
  }

  const locked =
    round.locks_at != null && new Date(round.locks_at).getTime() <= Date.now();

  const { data: matchData } = await supabase
    .from("matches")
    .select("*")
    .eq("round_id", round.id)
    .order("kickoff_at", { ascending: true });
  const matches = (matchData ?? []) as Match[];

  const { data: predData } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user.id)
    .in(
      "match_id",
      matches.map((m) => m.id)
    );
  const predictions: Record<number, Prediction> = {};
  for (const p of (predData ?? []) as Prediction[]) predictions[p.match_id] = p;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">{round.name}</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Cierra: {fmt(round.locks_at)}
          </p>
        </div>
        <span className={`badge ${locked ? "text-red-400" : "text-[var(--color-primary)]"}`}>
          {locked ? "🔒 Cerrada" : "🟢 Abierta"}
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="card p-8 text-center text-[var(--color-muted)]">
          Los partidos de esta ronda todavía no están cargados. Vuelve pronto.
        </div>
      ) : locked ? (
        <LockedView matches={matches} predictions={predictions} fmt={fmt} />
      ) : (
        <>
          <p className="text-sm text-[var(--color-muted)]">
            Ingresa el marcador y quién avanza. Puedes editar hasta el cierre.
          </p>
          <PredictionForm matches={matches} predictions={predictions} />
        </>
      )}
    </div>
  );
}

function LockedView({
  matches,
  predictions,
  fmt,
}: {
  matches: Match[];
  predictions: Record<number, Prediction>;
  fmt: (s: string | null) => string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm">
        🔒 La ronda está cerrada. Estos son tus pronósticos registrados.
      </div>
      {matches.map((m) => {
        const p = predictions[m.id];
        return (
          <div key={m.id} className="card p-4 flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">
                {m.home_team} vs {m.away_team}
              </div>
              <div className="text-[var(--color-muted)]">{fmt(m.kickoff_at)}</div>
            </div>
            <div className="text-right">
              {p ? (
                <>
                  <div className="font-bold text-lg">
                    {p.pred_home} - {p.pred_away}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Avanza: {p.pred_winner}
                  </div>
                </>
              ) : (
                <span className="text-[var(--color-muted)] text-sm">
                  Sin pronóstico
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
