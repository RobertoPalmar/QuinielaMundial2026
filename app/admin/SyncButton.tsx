"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncNow } from "./actions";

export function SyncButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        className="btn btn-primary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await syncNow();
            setMsg(r.message ?? r.error ?? null);
            router.refresh();
          })
        }
      >
        {pending ? "Sincronizando..." : "🔄 Actualizar partidos"}
      </button>
      {msg && <span className="text-sm text-[var(--color-muted)]">{msg}</span>}
    </div>
  );
}
