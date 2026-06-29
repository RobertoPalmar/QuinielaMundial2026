import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">⚽🏆</div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        Quiniela Mundial 2026
      </h1>
      <p className="text-[var(--color-muted)] mt-4 max-w-xl mx-auto">
        Pronostica los partidos de la fase eliminatoria, suma puntos y compite
        por el primer lugar del ranking.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <Link href="/mi-pronostico" className="btn btn-primary">
          Cargar mi pronóstico
        </Link>
        <Link href="/ranking" className="btn btn-ghost">
          Ver ranking
        </Link>
        <Link href="/reglas" className="btn btn-ghost">
          Reglas
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-12 text-left">
        <div className="card p-5">
          <div className="text-2xl">🎯</div>
          <h3 className="font-semibold mt-2">Marcador exacto: 3 pts</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Acierta el resultado tal cual y suma el máximo.
          </p>
        </div>
        <div className="card p-5">
          <div className="text-2xl">✅</div>
          <h3 className="font-semibold mt-2">Equipo que avanza: 1 pt</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Si fallas el marcador pero aciertas quién pasa, sumas igual.
          </p>
        </div>
        <div className="card p-5">
          <div className="text-2xl">⏱️</div>
          <h3 className="font-semibold mt-2">Cierre por ronda</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Carga antes del primer partido de cada ronda.
          </p>
        </div>
      </div>
    </div>
  );
}
