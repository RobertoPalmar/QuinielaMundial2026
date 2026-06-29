"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthState } from "@/app/(auth)/actions";

export default function LoginForm({ redirectTo = "/mi-pronostico" }: { redirectTo?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, {});

  return (
    <form action={action} className="card p-6 flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      {state.error && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-[11px] bg-bad/12 border border-bad/30 text-bad text-[13px] font-medium">
          <span aria-hidden>⚠</span> {state.error}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-muted">Email</span>
        <input type="email" name="email" placeholder="tu@email.com" className="input" required />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-muted">Contraseña</span>
        <input type="password" name="password" placeholder="••••••••" className="input" required />
      </label>

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-[qspin_.7s_linear_infinite]" />
            Ingresando…
          </>
        ) : (
          "Ingresar"
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[13px] text-muted">
        ¿No tienes cuenta?
        <Link href="/registro" className="font-semibold text-primary">Crear cuenta</Link>
      </p>
    </form>
  );
}
