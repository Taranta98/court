import { SelectableCourtList } from "@/components/club/selectable-court-list";
import { SportBadge } from "@/components/club/sport-badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { ClubDTO } from "@/lib/data/clubs";
import Image from "next/image";
import Link from "next/link";

interface ClubDetailProps {
  club: ClubDTO;
}

export function ClubDetail({ club }: ClubDetailProps) {
  return (
    <div>
      <Link
        href="/circoli"
        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-emerald-700"
      >
        ← Torna ai circoli
      </Link>

      <div className="relative mt-6 h-64 w-full overflow-hidden rounded-xl sm:h-80 lg:h-96 lg:rounded-2xl">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm font-medium text-emerald-600">{club.city}</p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900">{club.name}</h1>
          <p className="mt-4 leading-7 text-zinc-600">{club.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {club.sports.map((sport) => (
              <SportBadge key={sport} sport={sport} />
            ))}
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-zinc-900">Campi disponibili</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Seleziona un campo per vedere le fasce orarie disponibili.
            </p>
            <div className="mt-4">
              <SelectableCourtList courts={club.courts} clubSlug={club.slug} />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-zinc-200 bg-zinc-50 p-6 lg:sticky lg:top-24">
          <h2 className="font-semibold text-zinc-900">Informazioni</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-zinc-500">Indirizzo</dt>
              <dd className="mt-1 text-zinc-800">{club.address}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Orari</dt>
              <dd className="mt-1 text-zinc-800">{club.openingHours}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Sport</dt>
              <dd className="mt-1 text-zinc-800">{club.sports.length} discipline</dd>
            </div>
          </dl>

          <ButtonLink href={`/circoli/${club.slug}/prenota`} className="mt-6 w-full">
            Prenota un campo
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
