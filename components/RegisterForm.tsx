"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/app/(auth)/actions";

export type PlayerOption = { id: string; username: string };

export default function RegisterForm({ players }: { players: PlayerOption[] }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, {});

  if (state.message) {
    return (
      <div className="card p-6">
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-[11px] bg-good/12 border border-good/30 text-good text-[13px] font-medium">
          <span aria-hidden>✓</span>
          <span>{state.message}</span>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-[13px] text-muted mt-5">
          ¿Ya confirmaste?
          <Link href="/login" className="font-semibold text-primary">Ingresar</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6 flex flex-col gap-4">
      {state.error && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-[11px] bg-bad/12 border border-bad/30 text-bad text-[13px] font-medium">
          <span aria-hidden>⚠</span> {state.error}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-muted">Jugador</span>
        <select name="profile_id" className="input" required defaultValue="">
          <option value="" disabled>Selecciona tu nombre…</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.username}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-muted">Email</span>
        <input type="email" name="email" placeholder="tu@email.com" className="input" required />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-muted">Contraseña</span>
        <input type="password" name="password" placeholder="Mínimo 6 caracteres" className="input" minLength={6} required />
      </label>

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-[qspin_.7s_linear_infinite]" />
            Creando…
          </>
        ) : (
          "Crear cuenta"
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[13px] text-muted">
        ¿Ya tienes cuenta?
        <Link href="/login" className="font-semibold text-primary">Ingresar</Link>
      </p>
    </form>
  );
}
