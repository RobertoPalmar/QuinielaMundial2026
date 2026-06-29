import type { RankRow } from "@/lib/data";

const medal = (pos: number) => (pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : String(pos));

/**
 * Ranking responsive:
 *  - md+  : tabla
 *  - móvil: tarjetas apiladas
 */
export default function Ranking({ rows }: { rows: RankRow[] }) {
  const cols = "grid-cols-[64px_1fr_90px_90px_90px_90px]";

  return (
    <>
      {/* DESKTOP: tabla */}
      <div className="hidden md:block card overflow-hidden">
        <div className={`grid ${cols} px-[18px] py-3 border-b border-border text-[11px] font-semibold uppercase tracking-wide text-muted`}>
          <span>Pos</span>
          <span>Participante</span>
          <span className="text-center">Grupos</span>
          <span className="text-center">Elim.</span>
          <span className="text-center">Exactos</span>
          <span className="text-right">Total</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={`grid ${cols} items-center px-[18px] py-3 ${i < rows.length - 1 ? "border-b border-border" : ""} ${r.you ? "bg-surface-2" : ""}`}
          >
            <span className="font-display font-bold text-base">{medal(r.pos)}</span>
            <span className="flex items-center gap-2.5 font-semibold text-[15px]">
              <span className="grid place-items-center w-[30px] h-[30px] rounded-full bg-surface-2 font-display font-bold text-xs text-muted">
                {r.name[0].toUpperCase()}
              </span>
              {r.name}
              {r.you && <span className="text-muted font-medium"> · tú</span>}
            </span>
            <span className="text-center text-sm text-muted">{r.g}</span>
            <span className="text-center text-sm text-muted">{r.e}</span>
            <span className="text-center text-sm text-muted">{r.x}</span>
            <span className="text-right font-display font-bold text-lg text-primary">{r.t}</span>
          </div>
        ))}
      </div>

      {/* MÓVIL: tarjetas */}
      <div className="md:hidden flex flex-col gap-2.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className={`bg-surface rounded-[14px] p-4 border ${r.you ? "border-primary" : "border-border"}`}
          >
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg min-w-[34px]">{medal(r.pos)}</span>
              <span className="grid place-items-center w-[34px] h-[34px] rounded-full bg-surface-2 font-display font-bold text-[13px] text-muted">
                {r.name[0].toUpperCase()}
              </span>
              <span className="flex-1 font-semibold text-base">
                {r.name}
                {r.you && <span className="text-muted font-medium"> · tú</span>}
              </span>
              <span className="font-display font-bold text-[22px] text-primary">{r.t}</span>
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-border text-xs text-muted">
              <span>Grupos <b className="text-text">{r.g}</b></span>
              <span>Elim. <b className="text-text">{r.e}</b></span>
              <span>Exactos <b className="text-text">{r.x}</b></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
