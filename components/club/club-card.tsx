import { SportBadge } from "@/components/club/sport-badge";
import type { ClubDTO } from "@/lib/data/clubs";
import Image from "next/image";
import Link from "next/link";

interface ClubCardProps {
  club: ClubDTO;
  priority?: boolean;
}

export function ClubCard({ club, priority = false }: ClubCardProps) {
  return (
    <Link
      href={`/circoli/${club.slug}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <article>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={club.imageUrl}
            alt={club.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="p-5">
          <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-700">
            {club.name}
          </h2>
          <p className="text-sm text-zinc-500">{club.city}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
            {club.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {club.sports.map((sport) => (
                <SportBadge key={sport} sport={sport} />
              ))}
            </div>
            <span className="text-xs font-medium text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
              Dettagli →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
