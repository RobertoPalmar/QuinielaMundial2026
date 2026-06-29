"use client";

import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import { updateRound, type AdminState } from "@/app/admin/actions";
import type { Round } from "@/lib/types";

// ISO -> valor para <input type="datetime-local"> (hora local)
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// valor de <input type="datetime-local"> (hora local) -> ISO UTC.
// En el navegador, new Date("2026-06-28T20:00") interpreta el string como
// hora local y produce el instante UTC correcto. El server lo guarda tal cual.
function localInputToISO(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

/** Editor de ronda (admin). */
export default function RoundEditorCard({ round, n }: { round: Round; n: number }) {
  const [open, setOpen] = useState(round.is_open);
  // Mantenemos el valor visible (hora local) en estado y derivamos el ISO UTC
  // que se envía al server por un input oculto, para que la conversión ocurra
  // en el navegador (donde se conoce la zona horaria).
  const [localLocksAt, setLocalLocksAt] = useState(toLocalInput(round.locks_at));
  const [state, action, pending] = useActionState<AdminState, FormData>(updateRound, {});

  return (
    <form action={action} className="card p-[18px] flex flex-col gap-4">
      <input type="hidden" name="round_id" value={round.id} />
      <input type="hidden" name="is_open" value={open ? "on" : ""} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-surface-2 font-display font-bold text-[13px] text-primary">
            {n}
          </span>
          <span className="font-semibold text-base">{round.name}</span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={open}
          aria-label="Ronda abierta"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-[46px] h-[26px] p-[3px] rounded-pill transition-colors ${open ? "justify-end bg-primary" : "justify-start bg-surface-2"}`}
        >
          <span className={`block w-5 h-5 rounded-full transition ${open ? "bg-on-primary" : "bg-muted"}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Cierre (deadline)">
          {/* El input oculto lleva el ISO UTC ya convertido en el navegador. */}
          <input type="hidden" name="locks_at" value={localInputToISO(localLocksAt)} />
          <input
            type="datetime-local"
            value={localLocksAt}
            onChange={(e) => setLocalLocksAt(e.target.value)}
            className="input !min-h-0 py-2.5 [color-scheme:light]"
          />
        </Field>
        <Field label="Pts marcador exacto">
          <input type="number" name="exact_points" defaultValue={round.exact_points} min={0} className="input !min-h-0 py-2.5 font-display" />
        </Field>
        <Field label="Pts equipo que avanza">
          <input type="number" name="winner_points" defaultValue={round.winner_points} min={0} className="input !min-h-0 py-2.5 font-display" />
        </Field>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={pending} className="btn btn-surface self-start !min-h-0 py-2.5 text-[13px]">
          {pending ? "Guardando…" : "Guardar ronda"}
        </button>
        {(state.error || state.message) && (
          <span className={`text-[13px] font-medium ${state.error ? "text-bad" : "text-good"}`}>
            {state.error ?? state.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
