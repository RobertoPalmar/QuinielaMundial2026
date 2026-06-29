import Link from "next/link";
import { ImportForm } from "./ImportForm";

export const metadata = { title: "Importar grupos · Admin" };

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-[var(--color-muted)]">
          ← Admin
        </Link>
        <h1 className="text-3xl font-bold">Importar puntos de grupos</h1>
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Carga los totales de la fase de grupos. Se suman al ranking junto con
        los puntos de la fase eliminatoria.
      </p>
      <ImportForm />
    </div>
  );
}
