import { SportBadge } from "@/components/club/sport-badge";
import type { ClubCourt } from "@/lib/data/clubs";
import { sportLabels } from "@/lib/sport";

interface CourtListProps {
  courts: ClubCourt[];
}

export function CourtList({ courts }: CourtListProps) {
  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
      {courts.map((court) => (
        <li
          key={court.id}
          className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-zinc-900">{court.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{court.surface}</p>
            <div className="mt-2">
              <SportBadge sport={court.sport} />
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-700">
            €{court.pricePerHour}/ora · {court.slotMinutes} min
          </p>
        </li>
      ))}
    </ul>
  );
}
