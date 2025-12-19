import { cn } from "@/lib/utils";
import type { VideoStatus } from "@/lib/mock/teacherData";

interface VideoStatusBadgeProps {
  status: VideoStatus | "none";
  failureReason?: string;
}

export function VideoStatusBadge({
  status,
  failureReason,
}: VideoStatusBadgeProps) {
  const config =
    status === "ready"
      ? {
          label: "Ready",
          className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
        }
      : status === "processing"
      ? {
          label: "Processing",
          className: "border-sky-500/30 bg-sky-500/15 text-sky-200",
        }
      : status === "uploaded"
      ? {
          label: "Queued",
          className: "border-amber-500/30 bg-amber-500/15 text-amber-200",
        }
      : status === "failed"
      ? {
          label: "Failed",
          className: "border-rose-500/30 bg-rose-500/15 text-rose-200",
        }
      : {
          label: "No video",
          className: "border-white/10 bg-white/5 text-white/60",
        };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        config.className
      )}
      title={status === "failed" ? failureReason : undefined}
    >
      <span className="relative flex size-1.5">
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-75",
            status === "ready"
              ? "animate-ping bg-emerald-400"
              : status === "processing"
              ? "animate-ping bg-sky-400"
              : status === "uploaded"
              ? "animate-ping bg-amber-400"
              : status === "failed"
              ? "bg-rose-400"
              : "bg-white/40"
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            status === "ready"
              ? "bg-emerald-400"
              : status === "processing"
              ? "bg-sky-400"
              : status === "uploaded"
              ? "bg-amber-400"
              : status === "failed"
              ? "bg-rose-400"
              : "bg-white/40"
          )}
        />
      </span>
      {config.label}
    </span>
  );
}
