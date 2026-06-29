"use client";

import { useActionState } from "react";
import { approveResult, unapproveResult, type AdminState } from "../actions";
import type { Match } from "@/lib/types";

export function ResultRow({ match }: { match: Match }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(
    approveResult,
    {}
  );
  const [, unapprove, unapprovePending] = useActionState<AdminState, FormData>(
    unapproveResult,
    {}
  );

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-muted)]">
          {match.api_status ?? "—"}{" "}
          {match.last_synced_at && (
            <span className="text-xs">
              · sync {new Date(match.last_synced_at).toLocaleTimeString("es-MX")}
            </span>
          )}
        </div>
        <span
          className={`badge ${
            match.is_approved
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-accent)]"
          }`}
        >
          {match.is_approved ? "✅ Aprobado" : "⏳ Pendiente"}
        </span>
      </div>

      <form action={action} className="space-y-3">
        <input type="hidden" name="match_id" value={match.id} />
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="font-medium text-right min-w-[8rem]">
            {match.home_team}
          </span>
          <input
            name="home_score"
            type="number"
            min={0}
            defaultValue={match.home_score ?? ""}
            className="input w-16 text-center"
          />
          <span className="text-[var(--color-muted)]">-</span>
          <input
            name="away_score"
            type="number"
            min={0}
            defaultValue={match.away_score ?? ""}
            className="input w-16 text-center"
          />
          <span className="font-medium min-w-[8rem]">{match.away_team}</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-[var(--color-muted)]">Avanza:</span>
          <select
            name="winner"
            defaultValue={match.winner ?? ""}
            className="input w-auto"
          >
            <option value="">— sin definir —</option>
            <option value={match.home_team}>{match.home_team}</option>
            <option value={match.away_team}>{match.away_team}</option>
          </select>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-primary" disabled={pending}>
            {pending
              ? "Guardando..."
              : match.is_approved
              ? "Actualizar y re-aprobar"
              : "Aprobar resultado"}
          </button>
        </div>
      </form>

      {match.is_approved && (
        <form action={unapprove} className="text-center">
          <input type="hidden" name="match_id" value={match.id} />
          <button
            className="text-xs text-[var(--color-muted)] underline"
            disabled={unapprovePending}
          >
            revertir aprobación
          </button>
        </form>
      )}

      {(state.error || state.message) && (
        <p
          className={`text-sm text-center ${
            state.error ? "text-red-400" : "text-[var(--color-primary)]"
          }`}
        >
          {state.error ?? state.message}
        </p>
      )}
    </div>
  );
}
