import { sportLabels, type SportSlug } from "@/lib/sport";
import { cn } from "@/lib/utils";

interface SportBadgeProps {
  sport: SportSlug;
  className?: string;
}

export function SportBadge({ sport, className }: SportBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700",
        className,
      )}
    >
      {sportLabels[sport]}
    </span>
  );
}
