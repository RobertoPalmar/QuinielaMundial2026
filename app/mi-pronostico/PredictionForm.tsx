"use client";

import { useActionState } from "react";
import { savePredictions, type SaveState } from "./actions";
import type { Match, Prediction } from "@/lib/types";

export function PredictionForm({
  matches,
  predictions,
}: {
  matches: Match[];
  predictions: Record<number, Prediction>;
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(
    savePredictions,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      {matches.map((m) => {
        const p = predictions[m.id];
        return (
          <div key={m.id} className="card p-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-medium text-right min-w-[7rem]">
                {m.home_team}
              </span>
              <input
                name={`m_${m.id}_home`}
                type="number"
                min={0}
                defaultValue={p?.pred_home ?? ""}
                className="input w-16 text-center"
              />
              <span className="text-[var(--color-muted)]">vs</span>
              <input
                name={`m_${m.id}_away`}
                type="number"
                min={0}
                defaultValue={p?.pred_away ?? ""}
                className="input w-16 text-center"
              />
              <span className="font-medium min-w-[7rem]">{m.away_team}</span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="text-[var(--color-muted)]">Avanza:</span>
              <select
                name={`m_${m.id}_winner`}
                defaultValue={p?.pred_winner ?? ""}
                className="input w-auto"
              >
                <option value="">— elegir —</option>
                <option value={m.home_team}>{m.home_team}</option>
                <option value={m.away_team}>{m.away_team}</option>
              </select>
            </div>
          </div>
        );
      })}

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.message && (
        <p className="text-sm text-[var(--color-primary)]">{state.message}</p>
      )}

      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Guardando..." : "Guardar pronósticos"}
      </button>
    </form>
  );
}
