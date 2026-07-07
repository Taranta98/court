import { sportLabels, type SportSlug } from "@/lib/sport";
import { buildCircoliSearchUrl } from "@/lib/search/filter-clubs";
import { cn } from "@/lib/utils";
import Link from "next/link";

const featuredSports: SportSlug[] = ["padel", "tennis", "calcetto", "calciotto", "pallavolo"];

const sportIcons: Record<SportSlug, string> = {
  tennis: "🎾",
  padel: "🏸",
  calcetto: "⚽",
  calciotto: "🥅",
  pallavolo: "🏐",
  beach_volley: "🏖️",
  beach_tennis: "🌴",
};

interface SportChipsProps {
  activeSport?: SportSlug;
  query?: string;
}

export function SportChips({ activeSport, query }: SportChipsProps) {
  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {featuredSports.map((sport) => {
          const isActive = activeSport === sport;
          return (
            <Link
              key={sport}
              href={buildCircoliSearchUrl({ q: query, sport: isActive ? undefined : sport })}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm active:scale-[0.98]",
                isActive
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-800 active:bg-zinc-50",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              <span aria-hidden>{sportIcons[sport]}</span>
              {sportLabels[sport]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
