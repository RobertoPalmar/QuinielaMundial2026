import type { ReactNode } from "react";

type Variant = "open" | "closed" | "approved" | "pending" | "live";

const MAP: Record<Variant, string> = {
  open: "badge-open",
  closed: "badge-closed",
  approved: "badge-approved",
  pending: "badge-pending",
  live: "badge-live",
};

/** Pills de estado. `dot` añade el puntito pulsante (para "Abierta"/"En vivo"). */
export default function Badge({
  variant,
  children,
  dot = false,
}: {
  variant: Variant;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span className={`badge ${MAP[variant]}`}>
      {dot && <span className="dot bg-current dot-pulse" />}
      {children}
    </span>
  );
}
