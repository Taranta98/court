import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
};

export function Avatar({
  initials,
  gradient = "from-zinc-400 to-zinc-600",
  size = "md",
  ring = false,
  className,
}: AvatarProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-linear-to-br font-semibold text-white",
        gradient,
        sizeStyles[size],
        className,
      )}
    >
      {initials}
    </div>
  );

  if (!ring) return inner;

  return (
    <div className="rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2.5px]">
      <div className="rounded-full bg-white p-[2.5px]">{inner}</div>
    </div>
  );
}
