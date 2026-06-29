"use client";

import { useActionState } from "react";
import { updateRound, type AdminState } from "../actions";
import type { Round } from "@/lib/types";

// ISO -> valor para <input type="datetime-local"> (hora local)
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function RoundForm({ round }: { round: Round }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(
    updateRound,
    {}
  );

  return (
    <form action={action} className="card p-4 space-y-3">
      <input type="hidden" name="round_id" value={round.id} />
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{round.name}</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_open"
            defaultChecked={round.is_open}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
          Abierta
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <label className="space-y-1">
          <span className="text-[var(--color-muted)]">Cierre (deadline)</span>
          <input
            type="datetime-local"
            name="locks_at"
            defaultValue={toLocalInput(round.locks_at)}
            className="input"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[var(--color-muted)]">Pts exacto</span>
          <input
            type="number"
            name="exact_points"
            min={0}
            defaultValue={round.exact_points}
            className="input"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[var(--color-muted)]">Pts ganador</span>
          <input
            type="number"
            name="winner_points"
            min={0}
            defaultValue={round.winner_points}
            className="input"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando..." : "Guardar"}
        </button>
        {(state.error || state.message) && (
          <span
            className={`text-sm ${
              state.error ? "text-red-400" : "text-[var(--color-primary)]"
            }`}
          >
            {state.error ?? state.message}
          </span>
        )}
      </div>
    </form>
  );
}
