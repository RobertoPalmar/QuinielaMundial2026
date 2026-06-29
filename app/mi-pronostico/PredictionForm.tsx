"use client";

import { useActionState } from "react";
import MatchCard from "@/components/MatchCard";
import Banner from "@/components/Banner";
import { savePredictions, type SaveState } from "./actions";
import type { Match } from "@/lib/data";
import type { RoundSlug } from "@/lib/types";

export function PredictionForm({
  matches,
  locked,
  slug,
}: {
  matches: Match[];
  locked: boolean;
  slug: RoundSlug;
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(savePredictions, {});

  if (locked) {
    return (
      <div className="flex flex-col gap-3">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} locked />
        ))}
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="round_slug" value={slug} />
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} locked={m.locked} />
      ))}

      {state.error && <Banner kind="error">{state.error}</Banner>}
      {state.message && <Banner kind="success">{state.message}</Banner>}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary sticky bottom-4 mt-1.5 min-h-[52px] text-base shadow-[var(--shadow-pop)]"
      >
        {pending ? "Guardando…" : "Guardar pronósticos"}
      </button>
    </form>
  );
}
