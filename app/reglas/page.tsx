export const metadata = { title: "Reglas · Quiniela Mundial 2026" };

export default function ReglasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reglas del torneo</h1>

      <section className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold">¿Cómo se suman puntos?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="text-3xl font-extrabold text-[var(--color-primary)]">
              3 pts
            </div>
            <p className="font-medium mt-1">Marcador exacto</p>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Aciertas el resultado exacto del partido (goles de cada equipo en
              tiempo reglamentario).
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="text-3xl font-extrabold text-[var(--color-accent)]">
              1 pt
            </div>
            <p className="font-medium mt-1">Equipo que avanza</p>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              No aciertas el marcador, pero sí qué equipo gana / clasifica a la
              siguiente ronda.
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Si aciertas el marcador exacto ya se considera incluido el acierto del
          ganador: en ese caso suman los 3 puntos (no se acumulan 3 + 1).
        </p>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold">Fases del torneo</h2>
        <p className="text-sm text-[var(--color-muted)]">
          La quiniela cubre la fase eliminatoria. Cada ronda se habilita cuando
          la anterior termina:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Dieciseisavos de final</li>
          <li>Octavos de final</li>
          <li>Cuartos de final</li>
          <li>Semifinales</li>
          <li>Tercer lugar</li>
          <li>Final</li>
        </ol>
        <p className="text-sm text-[var(--color-muted)]">
          Los puntos de la fase de grupos ya están registrados y se suman al
          total del ranking.
        </p>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold">Cierre de pronósticos</h2>
        <ul className="space-y-2 text-sm">
          <li>
            ⏱️ Cada ronda cierra al iniciar el <b>primer partido</b> de esa
            ronda. Después de esa hora no se aceptan cargas ni cambios.
          </li>
          <li>
            🔒 Una vez cerrada la ronda, puedes ver los pronósticos del resto.
          </li>
          <li>
            📡 Los marcadores se actualizan en vivo automáticamente. El puntaje
            oficial se calcula cuando el administrador confirma el resultado
            final de cada partido.
          </li>
        </ul>
      </section>
    </div>
  );
}
