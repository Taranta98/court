import { sportLabels, type SportSlug } from "@/lib/sport";

const featuredSports: SportSlug[] = [
  "tennis",
  "padel",
  "calcetto",
  "calciotto",
  "pallavolo",
  "beach_volley",
  "beach_tennis",
];

export function SportPills() {
  return (
    <div className="-mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {featuredSports.map((sport) => (
          <span
            key={sport}
            className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
          >
            {sportLabels[sport]}
          </span>
        ))}
      </div>
    </div>
  );
}
