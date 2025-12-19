import { cn } from "@/lib/utils";

interface PublishedBadgeProps {
  isPublished: boolean;
}

export function PublishedBadge({ isPublished }: PublishedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        isPublished
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
          : "border-white/10 bg-white/5 text-white/60"
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
