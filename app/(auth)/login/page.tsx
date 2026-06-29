"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { signIn, type AuthState } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/mi-pronostico";
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signIn,
    {}
  );

  return (
    <div className="max-w-md mx-auto card p-8 mt-6">
      <h1 className="text-2xl font-bold mb-1">Ingresar</h1>
      <p className="text-[var(--color-muted)] text-sm mb-6">
        Accede para cargar tus pronósticos.
      </p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="redirect" value={redirectTo} />
        <div>
          <label className="text-sm text-[var(--color-muted)]">Email</label>
          <input className="input mt-1" type="email" name="email" required />
        </div>
        <div>
          <label className="text-sm text-[var(--color-muted)]">
            Contraseña
          </label>
          <input
            className="input mt-1"
            type="password"
            name="password"
            required
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}

        <button className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-sm text-[var(--color-muted)] mt-6 text-center">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-[var(--color-primary)]">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
