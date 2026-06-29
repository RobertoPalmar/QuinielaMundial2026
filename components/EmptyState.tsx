import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center px-6 py-16 bg-surface border border-dashed border-border rounded-[18px]">
      <span className="text-[40px] opacity-70" aria-hidden>{icon}</span>
      <div className="text-lg font-semibold">{title}</div>
      {children && <p className="max-w-[40ch] text-sm text-muted leading-relaxed">{children}</p>}
      {action}
    </div>
  );
}
