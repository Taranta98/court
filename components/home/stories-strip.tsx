import type { ClubDTO } from "@/lib/data/clubs";
import Image from "next/image";
import Link from "next/link";

interface StoriesStripProps {
  clubs: ClubDTO[];
}

export function StoriesStrip({ clubs }: StoriesStripProps) {
  const items = clubs.slice(0, 8);

  return (
    <div className="-mx-4 border-b border-zinc-200 bg-white px-4 py-3">
      <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/circoli" className="flex w-16 shrink-0 flex-col items-center gap-1.5">
          <div className="flex size-[4.25rem] items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50">
            <svg className="size-6 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="w-full truncate text-center text-[11px] text-zinc-800">Prenota</span>
        </Link>

        {items.map((club) => (
          <Link
            key={club.id}
            href={`/circoli/${club.slug}`}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5"
          >
            <div className="rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2.5px]">
              <div className="rounded-full bg-white p-[2.5px]">
                <div className="relative size-[3.65rem] overflow-hidden rounded-full">
                  <Image
                    src={club.imageUrl}
                    alt={club.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
            </div>
            <span className="w-full truncate text-center text-[11px] text-zinc-800">{club.name}</span>
          </Link>
        ))}

        {clubs.length === 0 &&
          ["Tennis", "Padel", "Calcetto"].map((sport) => (
            <div key={sport} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <div className="rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2.5px]">
                <div className="flex size-[4.25rem] items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white">
                  {sport.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="w-full truncate text-center text-[11px] text-zinc-800">{sport}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
