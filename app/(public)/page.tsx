/**
 * Homepage — ispirata a Playtomic, con identità Court.
 * Mobile invariato; layout a griglia da sm in su.
 */

import { BookCourtBanner } from "@/components/home/book-court-banner";
import { ClubCarousel } from "@/components/home/club-carousel";
import { OpenMatchesSection } from "@/components/home/open-matches-section";
import { QuickBookActions } from "@/components/home/quick-book-actions";
import { SportChips } from "@/components/home/sport-chips";
import { getClubsFromDb } from "@/lib/data/clubs";
import { matchFeedPosts } from "@/lib/data/feed-mock";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const clubs = await getClubsFromDb();

  return (
    <div className="space-y-6 px-4 py-4 sm:space-y-8 sm:px-0 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <BookCourtBanner />
        <QuickBookActions className="lg:flex lg:flex-col lg:justify-center" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Scegli lo sport
        </h2>
        <SportChips />
      </section>

      <ClubCarousel clubs={clubs} title="Circoli vicini a te" />

      <OpenMatchesSection matches={matchFeedPosts} id="partite" />

      {clubs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900">Nessun circolo disponibile</p>
          <p className="mt-2 text-sm text-zinc-500">
            Torna presto: stiamo aggiungendo nuovi impianti nella tua zona.
          </p>
        </div>
      )}
    </div>
  );
}
