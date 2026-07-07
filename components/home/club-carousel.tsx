import { SportBadge } from "@/components/club/sport-badge";
import type { ClubDTO } from "@/lib/data/clubs";
import Image from "next/image";
import Link from "next/link";

interface ClubCarouselCardProps {
  club: ClubDTO;
  priority?: boolean;
}

function minPrice(club: ClubDTO) {
  if (club.courts.length === 0) return null;
  return Math.min(...club.courts.map((c) => c.pricePerHour));
}

export function ClubCarouselCard({ club, priority = false }: ClubCarouselCardProps) {
  const price = minPrice(club);

  return (
    <Link
      href={`/circoli/${club.slug}`}
      className="flex w-[17.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-transform active:scale-[0.98] sm:w-auto sm:shrink"
    >
      <div className="relative h-36 w-full">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 280px, 33vw"
        />
        {price !== null && (
          <span className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur-sm">
            da €{price}/h
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate font-semibold text-zinc-900">{club.name}</h3>
        <p className="mt-0.5 text-sm text-zinc-500">{club.city}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {club.sports.slice(0, 3).map((sport) => (
            <SportBadge key={sport} sport={sport} className="px-2 py-0.5 text-[10px]" />
          ))}
        </div>
      </div>
    </Link>
  );
}

interface ClubCarouselProps {
  clubs: ClubDTO[];
  title: string;
  seeAllHref?: string;
}

export function ClubCarousel({ clubs, title, seeAllHref = "/circoli" }: ClubCarouselProps) {
  if (clubs.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
        <Link href={seeAllHref} className="text-sm font-semibold text-emerald-600">
          Vedi tutti
        </Link>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {clubs.map((club, index) => (
          <ClubCarouselCard key={club.id} club={club} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
