"use client";

import { useActionState } from "react";
import { importGroupPoints, type AdminState } from "../actions";

export function ImportForm() {
  const [state, action, pending] = useActionState<AdminState, FormData>(importGroupPoints, {});

  return (
    <form action={action} className="flex flex-col gap-[18px] max-w-[560px]">
      <p className="text-sm leading-relaxed text-muted">
        Pega los puntos de la fase de grupos desde Excel, una línea por participante con el formato{" "}
        <code className="px-1.5 py-0.5 rounded-md bg-surface-2 font-display text-[13px] text-text">usuario,puntos</code>.
      </p>

      <textarea
        name="data"
        rows={10}
        placeholder={"juan,8\nmaria,6\npedro,5"}
        className="min-h-[160px] resize-y bg-surface border border-border rounded-[13px] p-3.5 text-text text-sm font-display leading-relaxed outline-none focus:border-primary"
      />

      <div className="flex items-center gap-3.5 flex-wrap">
        <button type="submit" disabled={pending} className="btn btn-primary min-h-[48px]">
          {pending ? "Importando…" : "Importar"}
        </button>
        {(state.error || state.message) && (
          <span className={`text-sm font-semibold ${state.error ? "text-bad" : "text-good"}`}>
            {state.error ?? `✓ ${state.message}`}
          </span>
        )}
      </div>
      <p className="text-xs text-muted">
        El usuario debe coincidir con el username de registro. Acepta separador coma, punto y coma o tabulador.
      </p>
    </form>
  );
}
