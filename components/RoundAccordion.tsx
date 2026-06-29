"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import MatchCard from "@/components/MatchCard";
import { PredictionForm } from "@/app/mi-pronostico/PredictionForm";
import type { Match as UIMatch } from "@/lib/data";
import type { RoundSlug } from "@/lib/types";

// Medalla por ronda (solo estas tres). Otras rondas no llevan medalla.
const MEDAL: Partial<Record<RoundSlug, string>> = {
  semis: "🥈",
  tercer_lugar: "🥉",
  final: "🥇",
};

export type RoundSection = {
  id: number;
  slug: RoundSlug;
  name: string;
  /** Fecha de cierre preformateada (es-MX) o "Por definir". */
  deadline: string;
  locked: boolean;
  /** Ronda activa: abierta y antes del deadline -> formulario editable. */
  active: boolean;
  matches: UIMatch[];
  /** Puntos por partido (mismo orden/índice que `matches`), solo si hay resultado. */
  points: (number | null)[];
  /** Total de la ronda; null si todavía no hay resultados aprobados. */
  total: number | null;
};

export default function RoundAccordion({ rounds }: { rounds: RoundSection[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {rounds.map((r) => (
        <Accordion key={r.id} round={r} />
      ))}
    </div>
  );
}

function Accordion({ round }: { round: RoundSection }) {
  const [open, setOpen] = useState(round.active);
  const bodyId = `round-body-${round.id}`;
  const medal = MEDAL[round.slug];

  return (
    <section className="card overflow-hidden [color-scheme:light]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="btn-ghost w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="font-display font-bold text-[17px] tracking-tight min-w-0 truncate flex items-center gap-1.5">
            {medal && (
              <span aria-hidden="true" className="shrink-0">
                {medal}
              </span>
            )}
            <span className="truncate">{round.name}</span>
          </span>
          <span className="text-[13px] font-medium text-muted mt-1 truncate">
            Cierre: {round.deadline}
          </span>
        </span>

        {round.total != null && (
          <span className="badge bg-good/12 text-good font-semibold whitespace-nowrap">
            {round.total} pts
          </span>
        )}

        {round.active ? (
          <Badge variant="open" dot>
            Abierta
          </Badge>
        ) : (
          <Badge variant="closed">🔒 Cerrada</Badge>
        )}

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
        <div id={bodyId} className="px-4 pb-4 border-t border-border pt-4">
          {round.active ? (
            <PredictionForm matches={round.matches} locked={round.locked} slug={round.slug} />
          ) : (
            <div className="flex flex-col gap-3">
              {round.matches.map((m, i) => (
                <div key={m.id} className="flex flex-col gap-1.5">
                  <MatchCard match={m} locked />
                  {round.points[i] != null && (
                    <div className="flex justify-end">
                      <span className="badge bg-good/12 text-good font-semibold">
                        +{round.points[i]} pts
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
