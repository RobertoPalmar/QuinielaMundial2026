import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1024px] flex flex-wrap items-center justify-between gap-3.5 px-4 md:px-6 py-6">
        <span className="text-sm font-medium text-muted">⚽ Quiniela Mundial 2026</span>
        <div className="flex gap-4">
          <Link href="/reglas" className="text-sm font-medium text-muted hover:text-text">Reglas</Link>
        </div>
      </div>
    </footer>
  );
}
