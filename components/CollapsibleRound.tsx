"use client";

import { useState } from "react";
import type { RoundSlug } from "@/lib/types";

// Medalla por ronda (solo estas tres). Otras rondas no llevan medalla.
const MEDAL: Partial<Record<RoundSlug, string>> = {
  semis: "🥈",
  tercer_lugar: "🥉",
  final: "🥇",
};

/** Sección colapsable genérica (header + children). Espeja el estilo de RoundAccordion. */
export default function CollapsibleRound({
  name,
  slug,
  defaultOpen,
  badge,
  children,
}: {
  name: string;
  slug: RoundSlug;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const bodyId = `collapsible-round-${slug}`;
  const medal = MEDAL[slug];

  return (
    <section className="card overflow-hidden [color-scheme:light]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="btn-ghost w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="flex-1 min-w-0 font-display font-bold text-[17px] tracking-tight truncate flex items-center gap-1.5">
          {medal && (
            <span aria-hidden="true" className="shrink-0">
              {medal}
            </span>
          )}
          <span className="truncate">{name}</span>
        </span>

        {badge}

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div id={bodyId} className="px-4 pb-4 border-t border-border pt-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </section>
  );
}
