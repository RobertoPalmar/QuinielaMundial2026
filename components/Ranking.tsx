import Link from "next/link";
import type { RankRow } from "@/lib/data";
import { Avatar } from "@/components/Avatar";

const medal = (pos: number) => (pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : String(pos));

/**
 * Indicador de cambio de posición respecto al último snapshot del ranking.
 *  delta > 0  -> subió (verde, ▲)
 *  delta < 0  -> bajó  (rojo, ▼)
 *  delta === 0 -> sin cambio (em-dash gris)
 *  delta null/undefined -> sin datos previos -> "Nuevo"
 */
function DeltaTag({ delta }: { delta?: number | null }) {
  if (delta == null) {
    return (
      <span className="inline-flex items-center text-[11px] font-medium text-muted" aria-label="Sin posición previa">
        Nuevo
      </span>
    );
  }
  if (delta === 0) {
    return (
      <span className="inline-flex items-center text-xs font-semibold text-muted" aria-label="Sin cambio de posición">
        —
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${up ? "text-good" : "text-bad"}`}
      aria-label={up ? `Subió ${delta} posiciones` : `Bajó ${Math.abs(delta)} posiciones`}
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {Math.abs(delta)}
    </span>
  );
}

/** Estilos por posición del podio */
const PODIUM = {
  1: { medal: "🥇", ring: "ring-[#facc15]", bar: "h-[120px] sm:h-[150px]", avatar: "w-[72px] h-[72px] text-2xl", glow: "shadow-[0_8px_30px_rgba(250,204,21,0.35)]", label: "1º", circle: "bg-[#facc15]", barColor: "bg-gradient-to-b from-[#facc15]/25 to-[#facc15]/5 border-[#facc15]/50" },
  2: { medal: "🥈", ring: "ring-[#cbd5e1]", bar: "h-[88px] sm:h-[112px]", avatar: "w-[60px] h-[60px] text-xl", glow: "shadow-[0_6px_20px_rgba(148,163,184,0.3)]", label: "2º", circle: "bg-[#cbd5e1]", barColor: "bg-gradient-to-b from-[#cbd5e1]/25 to-[#cbd5e1]/5 border-[#cbd5e1]/50" },
  3: { medal: "🥉", ring: "ring-[#d8a07a]", bar: "h-[64px] sm:h-[84px]", avatar: "w-[60px] h-[60px] text-xl", glow: "shadow-[0_6px_20px_rgba(216,160,122,0.3)]", label: "3º", circle: "bg-[#d8a07a]", barColor: "bg-gradient-to-b from-[#d8a07a]/25 to-[#d8a07a]/5 border-[#d8a07a]/50" },
} as const;

function PodiumSpot({ row }: { row: RankRow }) {
  const s = PODIUM[row.pos as 1 | 2 | 3];
  return (
    <Link
      href={`/pronosticos/${row.userId}`}
      className="flex flex-1 flex-col items-center justify-end gap-2 rounded-xl transition-opacity hover:opacity-80"
      aria-label={`Ver pronósticos de ${row.name}`}
    >
      <div className="text-2xl sm:text-3xl leading-none">{s.medal}</div>
      <div
        className={`grid place-items-center overflow-hidden rounded-full ring-4 ${s.circle} ${s.ring} ${s.avatar} ${s.glow}`}
      >
        <Avatar seed={row.userId} size={72} className="w-full h-full" />
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="font-semibold text-sm sm:text-[15px] leading-tight text-center whitespace-normal wrap-break-word">
          {row.name}
          {row.you && <span className="text-muted font-medium"> · tú</span>}
        </span>
        <span className="font-display font-bold text-xl sm:text-2xl text-primary leading-tight">{row.t}</span>
        <span className="text-[11px] text-muted">pts</span>
        <span className="mt-0.5 leading-none">
          <DeltaTag delta={row.delta} />
        </span>
      </div>
      <div
        className={`w-full rounded-t-xl ${s.barColor} border-t-2 ${s.bar} grid place-items-start justify-center pt-2`}
      >
        <span className="font-display font-bold text-lg sm:text-xl text-text/70">{s.label}</span>
      </div>
    </Link>
  );
}

export function Podium({ rows }: { rows: RankRow[] }) {
  const top3 = rows.slice(0, 3);
  if (top3.length === 0) return null;

  const first = top3.find((r) => r.pos === 1);
  const second = top3.find((r) => r.pos === 2);
  const third = top3.find((r) => r.pos === 3);

  return (
    <div className="card px-3 py-5 sm:px-6 sm:py-6 mb-1">
      <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-[520px] mx-auto">
        {second && <PodiumSpot row={second} />}
        {first && <PodiumSpot row={first} />}
        {third && <PodiumSpot row={third} />}
      </div>
    </div>
  );
}

/**
 * Ranking responsive:
 *  - md+  : tabla
 *  - móvil: tarjetas apiladas
 */
export default function Ranking({ rows }: { rows: RankRow[] }) {
  const cols = "grid-cols-[64px_minmax(0,1fr)_72px_80px_80px_72px]";

  return (
    <>
      {/* PODIO: top 3 destacado */}
      <Podium rows={rows} />

      {/* DESKTOP: tabla */}
      <div className="hidden md:block card overflow-hidden">
        <div className={`grid ${cols} px-[18px] py-3 border-b border-border text-[11px] font-semibold uppercase tracking-wide text-muted`}>
          <span>Pos</span>
          <span>Participante</span>
          <span className="text-center">Acertados</span>
          <span className="text-center">Exactos</span>
          <span className="text-right">Total</span>
          <span className="text-right">Cambio</span>
        </div>
        {rows.map((r, i) => (
          <Link
            key={r.name}
            href={`/pronosticos/${r.userId}`}
            className={`grid ${cols} items-center px-[18px] py-3 transition-colors hover:bg-surface-2 ${i < rows.length - 1 ? "border-b border-border" : ""} ${r.you ? "bg-primary/10 ring-1 ring-inset ring-primary/30" : ""}`}
          >
            <span className="font-display font-bold text-base">{medal(r.pos)}</span>
            <span className="flex items-center gap-2.5 font-semibold text-[15px]">
              <Avatar seed={r.userId} size={30} />
              {r.name}
              {r.you && <span className="text-muted font-medium"> · tú</span>}
            </span>
            <span className="text-center text-sm text-muted">{r.a}</span>
            <span className="text-center text-sm text-muted">{r.x}</span>
            <span className="text-right font-display font-bold text-lg text-primary">{r.t}</span>
            <span className="text-right">
              <DeltaTag delta={r.delta} />
            </span>
          </Link>
        ))}
      </div>

      {/* MÓVIL: tarjetas */}
      <div className="md:hidden flex flex-col gap-2.5">
        {rows.map((r) => (
          <Link
            key={r.name}
            href={`/pronosticos/${r.userId}`}
            className={`block rounded-[14px] p-4 border transition-colors active:opacity-80 ${r.you ? "bg-primary/10 border-primary" : "bg-surface border-border"}`}
          >
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg min-w-[34px]">{medal(r.pos)}</span>
              <Avatar seed={r.userId} size={34} />
              <span className="flex-1 font-semibold text-base">
                {r.name}
                {r.you && <span className="text-muted font-medium"> · tú</span>}
              </span>
              <span className="flex flex-col items-end leading-none">
                <span className="font-display font-bold text-[22px] text-primary">{r.t}</span>
                <span className="mt-0.5">
                  <DeltaTag delta={r.delta} />
                </span>
              </span>
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-border text-xs text-muted">
              <span>Acertados <b className="text-text">{r.a}</b></span>
              <span>Exactos <b className="text-text">{r.x}</b></span>
              <span>Total <b className="text-text">{r.t}</b></span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
