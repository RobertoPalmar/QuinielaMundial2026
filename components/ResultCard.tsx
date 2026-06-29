"use client";

import { useActionState } from "react";
import { flag } from "@/lib/flags";
import { approveResult, unapproveResult, type AdminState } from "@/app/admin/actions";

const apiClass: Record<string, string> = {
  FINISHED: "bg-muted/15 text-muted",
  TIMED: "bg-warn/15 text-warn",
  SCHEDULED: "bg-warn/15 text-warn",
  IN_PLAY: "bg-good/15 text-good",
  PAUSED: "bg-good/15 text-good",
};

function fmtSync(iso: string | null): string {
  if (!iso) return "nunca";
  return new Date(iso).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

/** Result card (admin): marcador editable (viene de API) + aprobar/revertir. */
export default function ResultCard({
  matchId,
  home,
  away,
  homeScore,
  awayScore,
  winnerName,
  apiStatus,
  syncedAt,
  approved,
}: {
  matchId: number;
  home: { code: string; name: string };
  away: { code: string; name: string };
  homeScore: number | null;
  awayScore: number | null;
  winnerName: string | null;
  apiStatus: string | null;
  syncedAt: string | null;
  approved: boolean;
}) {
  const [state, action, pending] = useActionState<AdminState, FormData>(approveResult, {});
  const [, unapprove, unapPending] = useActionState<AdminState, FormData>(unapproveResult, {});

  const status = apiStatus ?? "—";

  return (
    <div className="card p-4 flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-pill text-[11px] font-display font-semibold tracking-wide ${apiClass[status] ?? "bg-surface-2 text-muted"}`}>
            {status}
          </span>
          <span className="text-xs font-medium text-muted">última sync: {fmtSync(syncedAt)}</span>
        </div>
        <span className={`badge ${approved ? "badge-approved" : "badge-pending"}`}>
          {approved ? "✅ Aprobado" : "⏳ Pendiente"}
        </span>
      </div>

      <form action={action} className="flex flex-col gap-3.5">
        <input type="hidden" name="match_id" value={matchId} />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl" aria-hidden>{flag(home.code)}</span>
            <span className="font-semibold text-sm truncate">{home.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input type="number" name="home_score" min={0} max={20} defaultValue={homeScore ?? ""}
              aria-label="Goles local"
              className="w-12 py-2 text-center bg-surface-2 border border-border rounded-[9px] font-display font-bold text-lg outline-none focus:border-primary" />
            <span className="font-display font-bold text-sm text-muted">:</span>
            <input type="number" name="away_score" min={0} max={20} defaultValue={awayScore ?? ""}
              aria-label="Goles visitante"
              className="w-12 py-2 text-center bg-surface-2 border border-border rounded-[9px] font-display font-bold text-lg outline-none focus:border-primary" />
          </div>
          <div className="flex items-center justify-end gap-2.5 min-w-0">
            <span className="font-semibold text-sm truncate text-right">{away.name}</span>
            <span className="text-2xl" aria-hidden>{flag(away.code)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-medium text-muted">Avanza:</span>
          <select name="winner" defaultValue={winnerName ?? ""} className="input !min-h-0 flex-1 min-w-[140px] py-2.5 text-[13px]" aria-label="Quién avanza">
            <option value="">— sin definir —</option>
            <option value={home.name}>{home.name}</option>
            <option value={away.name}>{away.name}</option>
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button type="submit" disabled={pending} className={`!min-h-0 py-2.5 text-[13px] ${approved ? "btn btn-surface" : "btn btn-primary"}`}>
            {pending ? "Guardando…" : approved ? "Actualizar y re-aprobar" : "Aprobar resultado"}
          </button>
          {(state.error || state.message) && (
            <span className={`text-[13px] font-medium ${state.error ? "text-bad" : "text-good"}`}>
              {state.error ?? state.message}
            </span>
          )}
        </div>
      </form>

      {approved && (
        <form action={unapprove}>
          <input type="hidden" name="match_id" value={matchId} />
          <button disabled={unapPending} className="text-xs text-muted underline">
            revertir aprobación
          </button>
        </form>
      )}
    </div>
  );
}
