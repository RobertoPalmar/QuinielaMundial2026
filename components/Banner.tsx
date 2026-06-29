import type { ReactNode } from "react";

type Kind = "success" | "error" | "info";

const STYLES: Record<Kind, string> = {
  success: "bg-good/12 border-good/30 text-good",
  error: "bg-bad/12 border-bad/30 text-bad",
  info: "bg-surface-2 border-border text-muted",
};
const ICONS: Record<Kind, string> = { success: "✓", error: "⚠", info: "🔒" };

export default function Banner({ kind, children }: { kind: Kind; children: ReactNode }) {
  return (
    <div className={`flex items-start gap-2.5 px-3.5 py-3 rounded-[11px] border text-[13px] font-medium ${STYLES[kind]}`}>
      <span aria-hidden>{ICONS[kind]}</span>
      <span>{children}</span>
    </div>
  );
}
