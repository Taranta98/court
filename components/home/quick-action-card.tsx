import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent?: "emerald" | "zinc";
}

const accentStyles = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  zinc: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export function QuickActionCard({
  href,
  title,
  description,
  icon,
  accent = "emerald",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-[5.5rem] items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
        "transition-all active:scale-[0.98] active:bg-zinc-50",
        "hover:border-emerald-200 hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1",
          accentStyles[accent],
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900 group-hover:text-emerald-700">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-zinc-500">{description}</p>
      </div>
      <svg
        className="size-5 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
