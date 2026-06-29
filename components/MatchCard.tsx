"use client";

import { useState } from "react";
import { flag } from "@/lib/flags";
import type { Match, Team } from "@/lib/data";

/**
 * Match card — predicción.
 *
 * Reglas de "quién avanza":
 *  - Marcador NO empate → avanza el de más goles (no se pregunta).
 *  - EMPATE → se pregunta quién avanza en penales → envía `m_<id>_winner`.
 *
 * Campos de formulario (NO cambiar):
 *  - m_<id>_home   (number)
 *  - m_<id>_away   (number)
 *  - m_<id>_winner ("home" | "away", solo en empate)
 */
export default function MatchCard({ match, locked = false }: { match: Match; locked?: boolean }) {
  const [home, setHome] = useState<string>(locked ? String(match.predHome ?? "") : String(match.predHome ?? ""));
  const [away, setAway] = useState<string>(locked ? String(match.predAway ?? "") : String(match.predAway ?? ""));
  const [winner, setWinner] = useState<"home" | "away" | "">(match.predWinner ?? "");

  const both = home !== "" && away !== "";
  const nh = Number(home);
  const na = Number(away);
  const isDraw = both && nh === na;
  const autoSide = both && nh !== na ? (nh > na ? "home" : "away") : null;
  const advSide = isDraw ? winner : autoSide;
  const advTeam = advSide === "home" ? match.home : advSide === "away" ? match.away : null;
  const hasResult = match.resHome != null && match.resAway != null;

  return (
    <div className="card p-4 pb-[18px] flex flex-col gap-3.5">
      {/* meta */}
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>{match.time}</span>
        {hasResult && (
          <span className="flex items-center gap-1.5 font-semibold text-good">
            <span className="dot bg-good" /> Final {match.resHome}-{match.resAway}
          </span>
        )}
      </div>

      {/* equipos + marcador */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[26px] leading-none" aria-hidden>{flag(match.home.code)}</span>
          <span className="font-semibold text-[15px] truncate">{match.home.name}</span>
        </div>

        {locked ? (
          <div className="px-3.5 py-1.5 rounded-[10px] bg-surface-2 font-display font-bold text-[22px]">
            {match.predHome ?? "–"} : {match.predAway ?? "–"}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number" name={`m_${match.id}_home`} min={0} max={9} inputMode="numeric"
              value={home} onChange={(e) => setHome(e.target.value)}
              aria-label={`Goles ${match.home.name}`} className="score-input"
            />
            <span className="font-display font-bold text-base text-muted">:</span>
            <input
              type="number" name={`m_${match.id}_away`} min={0} max={9} inputMode="numeric"
              value={away} onChange={(e) => setAway(e.target.value)}
              aria-label={`Goles ${match.away.name}`} className="score-input"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 min-w-0">
          <span className="font-semibold text-[15px] truncate text-right">{match.away.name}</span>
          <span className="text-[26px] leading-none" aria-hidden>{flag(match.away.code)}</span>
        </div>
      </div>

      {/* quién avanza */}
      {!locked && !both && (
        <p className="text-xs font-medium text-muted">Ingresa el marcador para definir quién avanza.</p>
      )}

      {advTeam && !isDraw && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-[11px] bg-surface-2 text-[13px] font-semibold">
          <span className="text-good">✓ Avanza</span>
          <span className="text-[20px] leading-none" aria-hidden>{flag(advTeam.code)}</span>
          <span>{advTeam.name}</span>
        </div>
      )}

      {isDraw && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            🥅 Empate · ¿quién avanza en penales?
          </span>
          {/* solo se envía en empate */}
          <input type="hidden" name={`m_${match.id}_winner`} value={winner} />
          <div className="grid grid-cols-2 gap-2">
            <PenaltyPill team={match.home} selected={winner === "home"} locked={locked} onClick={() => !locked && setWinner("home")} />
            <PenaltyPill team={match.away} selected={winner === "away"} locked={locked} onClick={() => !locked && setWinner("away")} />
          </div>
        </div>
      )}
    </div>
  );
}

function PenaltyPill({
  team,
  selected,
  locked,
  onClick,
}: {
  team: Team;
  selected: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      aria-pressed={selected}
      className={`flex items-center justify-center gap-1.5 min-h-[44px] p-2.5 rounded-[10px] text-[13px] font-semibold bg-surface-2 border transition
        ${selected ? (locked ? "border-good text-good bg-good/10" : "border-primary text-primary") : "border-border text-muted"}
        ${locked ? "opacity-80 cursor-default" : "cursor-pointer hover:border-primary/60"}`}
    >
      <span className="text-base leading-none" aria-hidden>{flag(team.code)}</span>
      <span>{team.code}</span>
    </button>
  );
}
