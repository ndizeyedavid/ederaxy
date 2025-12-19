import type { ReactNode } from "react";

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function EntityHeader({ title, subtitle, actions }: EntityHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle ? <p className="text-sm text-white/50">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
