"use client";

import { useActionState } from "react";
import { importGroupPoints, type AdminState } from "../actions";

export function ImportForm() {
  const [state, action, pending] = useActionState<AdminState, FormData>(
    importGroupPoints,
    {}
  );

  return (
    <form action={action} className="card p-6 space-y-4">
      <label className="block text-sm text-[var(--color-muted)]">
        Pega los datos: una línea por participante con{" "}
        <code className="text-[var(--color-text)]">usuario,puntos</code>
      </label>
      <textarea
        name="data"
        rows={12}
        placeholder={"juan,14\nmaria,11\npedro,9"}
        className="input font-mono text-sm"
      />
      <div className="flex items-center gap-3">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Importando..." : "Importar puntos"}
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
      <p className="text-xs text-[var(--color-muted)]">
        El <b>usuario</b> debe coincidir con el username con que se registró el
        participante. Acepta separador coma, punto y coma o tabulador (puedes
        pegar directo desde Excel).
      </p>
    </form>
  );
}
