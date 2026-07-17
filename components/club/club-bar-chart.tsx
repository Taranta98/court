"use client";

import type { ChartPoint } from "@/lib/club/stats";
import { cn } from "@/lib/utils";

interface ClubBarChartProps {
  points: ChartPoint[];
  valueFormatter: (value: number) => string;
  barClassName?: string;
  emptyMessage?: string;
}

export function ClubBarChart({
  points,
  valueFormatter,
  barClassName = "bg-emerald-500",
  emptyMessage = "Nessun dato nel periodo selezionato.",
}: ClubBarChartProps) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const hasData = points.some((point) => point.value > 0);

  if (!hasData) {
    return (
      <p className="flex h-48 items-center justify-center rounded-lg bg-zinc-50 text-sm text-zinc-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="h-52">
      <div className="flex h-full items-end gap-1.5 sm:gap-2">
        {points.map((point) => {
          const height = Math.max((point.value / maxValue) * 100, point.value > 0 ? 8 : 0);

          return (
            <div
              key={point.label}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 hidden text-[10px] font-medium text-zinc-600 sm:block">
                {point.value > 0 ? valueFormatter(point.value) : ""}
              </span>
              <div className="flex h-36 w-full items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all group-hover:opacity-80",
                    barClassName,
                  )}
                  style={{ height: `${height}%` }}
                  title={`${point.label}: ${valueFormatter(point.value)}`}
                />
              </div>
              <span className="mt-2 truncate text-[10px] text-zinc-500 sm:text-xs">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
