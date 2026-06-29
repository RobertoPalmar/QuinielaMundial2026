export const metadata = { title: "Reglas · Quiniela Mundial 2026" };

const FASES = [
  { n: 1, name: "Dieciseisavos de final", pts: "3 / 1 pts" },
  { n: 2, name: "Octavos de final", pts: "3 / 1 pts" },
  { n: 3, name: "Cuartos de final", pts: "3 / 1 pts" },
  { n: 4, name: "Semifinales", pts: "3 / 1 pts" },
  { n: 5, name: "Tercer lugar", pts: "3 / 1 pts" },
  { n: 6, name: "Final", pts: "3 / 1 pts" },
];

export default function ReglasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display font-bold text-[clamp(26px,5vw,38px)] tracking-tight">Reglas</h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted max-w-[52ch]">
          Pronostica cada ronda eliminatoria, suma puntos y sube en el ranking. Así funciona el scoring.
        </p>
      </header>

      {/* Scoring */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Cómo se puntúa</h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="card p-[22px] flex gap-4 items-start">
            <span className="font-display font-bold text-[40px] leading-none text-primary">3</span>
            <div>
              <div className="font-semibold text-base">Marcador exacto</div>
              <p className="text-sm leading-relaxed text-muted mt-1">Aciertas el resultado exacto del partido. Ej: pronosticas 2-1 y termina 2-1.</p>
            </div>
          </div>
          <div className="card p-[22px] flex gap-4 items-start">
            <span className="font-display font-bold text-[40px] leading-none text-accent">1</span>
            <div>
              <div className="font-semibold text-base">Equipo que avanza</div>
              <p className="text-sm leading-relaxed text-muted mt-1">Aciertas qué selección pasa de ronda, aunque falles el marcador.</p>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-muted mt-3">
          En empates, eliges quién avanza en penales. Si el marcador no es empate, el equipo que avanza se deduce del marcador.
        </p>
      </section>

      {/* Fases */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Las 6 rondas del torneo</h2>
        <div className="card overflow-hidden">
          {FASES.map((r, i) => (
            <div key={r.n} className={`flex items-center gap-3 px-[18px] py-3.5 ${i < FASES.length - 1 ? "border-b border-border" : ""}`}>
              <span className="grid place-items-center w-[30px] h-[30px] rounded-[9px] bg-surface-2 font-display font-bold text-[13px] text-primary">{r.n}</span>
              <span className="flex-1 font-semibold text-[15px]">{r.name}</span>
              <span className="text-[13px] font-medium text-muted">{r.pts}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section className="flex gap-3.5 items-start p-5 rounded-card border border-warn/25 bg-warn/[0.08]">
        <span className="text-[22px]" aria-hidden>🔒</span>
        <div>
          <div className="font-semibold text-base text-warn">Cierre por ronda</div>
          <p className="text-sm leading-relaxed text-muted mt-1.5">
            Cada ronda cierra al iniciar su primer partido. Al cerrar, tus pronósticos quedan bloqueados (solo lectura) y se
            calculan los puntos cuando el admin aprueba los resultados.
          </p>
        </div>
      </section>
    </div>
  );
}
