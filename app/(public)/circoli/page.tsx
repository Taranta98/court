import { ClubListRow } from "@/components/club/club-list-row";
import { SportChips } from "@/components/home/sport-chips";
import { ClubSearchForm } from "@/components/search/club-search-form";
import { getClubsFromDb } from "@/lib/data/clubs";
import { filterClubs } from "@/lib/search/filter-clubs";
import { sportLabels, type SportSlug } from "@/lib/sport";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prenota",
};

export const dynamic = "force-dynamic";

const validSports = new Set<string>(Object.keys(sportLabels));

type CircoliPageProps = {
  searchParams: Promise<{ q?: string; sport?: string; focus?: string }>;
};

function parseSport(value?: string): SportSlug | undefined {
  if (!value || !validSports.has(value)) return undefined;
  return value as SportSlug;
}

export default async function CircoliPage({ searchParams }: CircoliPageProps) {
  const { q, sport: sportParam, focus } = await searchParams;
  const sport = parseSport(sportParam);
  const allClubs = await getClubsFromDb();
  const clubs = filterClubs(allClubs, { q, sport });
  const hasFilters = Boolean(q?.trim() || sport);

  return (
    <div className="min-h-full bg-zinc-50 sm:rounded-2xl sm:border sm:border-zinc-200 sm:bg-white">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:rounded-t-2xl sm:px-6 sm:py-6">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Prenota un campo</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          {hasFilters
            ? `${clubs.length} ${clubs.length === 1 ? "risultato" : "risultati"}${q?.trim() ? ` per "${q.trim()}"` : ""}${sport ? ` · ${sportLabels[sport]}` : ""}`
            : `${allClubs.length} circoli disponibili`}
        </p>

        <div className="mt-4">
          <ClubSearchForm
            defaultQuery={q ?? ""}
            sport={sport}
            live
            autoFocus={focus === "1"}
            placeholder="Cerca per nome o città..."
          />
        </div>

        <div className="mt-4">
          <SportChips activeSport={sport} query={q} />
        </div>
      </div>

      <div className="space-y-2 p-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 sm:p-6 lg:grid-cols-3">
        {clubs.map((club, index) => (
          <ClubListRow key={club.id} club={club} priority={index === 0} />
        ))}

        {clubs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="font-semibold text-zinc-900">
              {hasFilters ? "Nessun circolo trovato" : "Nessun circolo disponibile"}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {hasFilters
                ? "Prova con un altro nome, città o sport."
                : "Torna presto: stiamo aggiungendo nuovi impianti."}
            </p>
            {hasFilters && (
              <Link href="/circoli" className="mt-3 inline-block text-sm font-semibold text-emerald-600">
                Cancella filtri
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
