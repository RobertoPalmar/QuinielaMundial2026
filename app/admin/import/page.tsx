import Link from "next/link";
import { ImportForm } from "./ImportForm";

export const metadata = { title: "Importar grupos · Admin" };

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-[18px]">
      <Link href="/admin" className="self-start text-[13px] font-semibold text-muted hover:text-text">← Volver al panel</Link>
      <h1 className="font-display font-bold text-[clamp(24px,5vw,34px)] tracking-tight">Importar grupos</h1>
      <ImportForm />
    </div>
  );
}
