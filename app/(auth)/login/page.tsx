import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Ingresar · Quiniela Mundial 2026" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <section className="max-w-[420px] mx-auto mt-6">
      <div className="text-center mb-6">
        <span className="text-3xl" aria-hidden>⚽</span>
        <h1 className="font-display font-bold text-[26px] tracking-tight mt-2.5 mb-1">Ingresar</h1>
        <p className="text-sm text-muted">Bienvenido de vuelta a la quiniela</p>
      </div>
      <LoginForm redirectTo={redirect ?? "/mi-pronostico"} />
    </section>
  );
}
