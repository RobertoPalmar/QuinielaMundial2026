"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "../actions";

export default function RegistroPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUp,
    {}
  );

  return (
    <div className="max-w-md mx-auto card p-8 mt-6">
      <h1 className="text-2xl font-bold mb-1">Crear cuenta</h1>
      <p className="text-[var(--color-muted)] text-sm mb-6">
        Regístrate para participar en la quiniela.
      </p>

      {state.message ? (
        <div className="rounded-lg border border-[var(--color-primary)] bg-[rgba(16,185,129,0.1)] p-4 text-sm">
          {state.message}
        </div>
      ) : (
        <form action={action} className="space-y-4">
          <div>
            <label className="text-sm text-[var(--color-muted)]">
              Usuario
            </label>
            <input
              className="input mt-1"
              type="text"
              name="username"
              minLength={3}
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <button className="btn btn-primary w-full" disabled={pending}>
            {pending ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      )}

      <p className="text-sm text-[var(--color-muted)] mt-6 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[var(--color-primary)]">
          Ingresar
        </Link>
      </p>
    </div>
  );
}
