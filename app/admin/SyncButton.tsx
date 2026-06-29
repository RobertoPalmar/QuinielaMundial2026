"use client";

import { useState, useTransition } from "react";
import { syncNow } from "./actions";

export function SyncButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        className="btn btn-ghost"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await syncNow();
            setMsg(r.message ?? r.error ?? null);
          })
        }
      >
        {pending ? "Sincronizando..." : "🔄 Sincronizar con API"}
      </button>
      {msg && <span className="text-sm text-[var(--color-muted)]">{msg}</span>}
    </div>
  );
}
