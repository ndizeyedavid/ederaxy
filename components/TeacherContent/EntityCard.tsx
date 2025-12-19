import type { ReactNode } from "react";

interface EntityCardProps {
  title: string;
  meta?: ReactNode;
  description?: string;
  footer?: ReactNode;
}

export function EntityCard({
  title,
  meta,
  description,
  footer,
}: EntityCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0f1117] p-5 text-white transition hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{title}</h3>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm text-white/50">
              {description}
            </p>
          ) : null}
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}
