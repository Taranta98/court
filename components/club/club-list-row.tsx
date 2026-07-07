import { SportBadge } from "@/components/club/sport-badge";
import type { ClubDTO } from "@/lib/data/clubs";
import Image from "next/image";
import Link from "next/link";

interface ClubListRowProps {
  club: ClubDTO;
  priority?: boolean;
}

function minPrice(club: ClubDTO) {
  if (club.courts.length === 0) return null;
  return Math.min(...club.courts.map((c) => c.pricePerHour));
}

export function ClubListRow({ club, priority = false }: ClubListRowProps) {
  const price = minPrice(club);

  return (
    <Link
      href={`/circoli/${club.slug}`}
      className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm active:bg-zinc-50 sm:h-full sm:flex-col sm:items-start sm:p-4"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-36 sm:w-full">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 80px, 33vw"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-zinc-900">{club.name}</h3>
          {price !== null && (
            <span className="shrink-0 text-sm font-bold text-emerald-700">€{price}/h</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-zinc-500">{club.city}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {club.sports.slice(0, 4).map((sport) => (
            <SportBadge key={sport} sport={sport} className="px-2 py-0.5 text-[10px]" />
          ))}
        </div>
      </div>
    </Link>
  );
}
