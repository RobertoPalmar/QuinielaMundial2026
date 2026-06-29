import { flagCode } from "@/lib/flags";

// Bandera vía flag-icons (CSS importado en layout). `size` en px (alto).
export default function Flag({
  name,
  size = 26,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const code = flagCode(name);
  if (!code) {
    // Fallback: cuadrito neutro con iniciales
    return (
      <span
        aria-hidden
        className={`inline-grid place-items-center rounded-[3px] bg-surface-2 text-muted font-display font-bold ${className}`}
        style={{ width: size * 1.33, height: size, fontSize: size * 0.42 }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={`fi fi-${code} rounded-[3px] ${className}`}
      style={{ width: size * 1.33, height: size, backgroundSize: "cover" }}
    />
  );
}
