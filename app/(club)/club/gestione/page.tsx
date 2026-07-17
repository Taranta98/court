import { getClubForSession } from "@/lib/club/access";
import { AvailabilitySection } from "@/components/club/manage/availability-section";
import { ClubPhotosSection } from "@/components/club/manage/club-photos-section";
import { CourtsSection } from "@/components/club/manage/courts-section";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestione circolo",
};

export default async function ClubGestionePage() {
  const { club } = await getClubForSession();

  if (!club) {
    return <p>Nessun circolo associato al tuo account.</p>;
  }

  const courts = club.courts.map((court) => ({
    id: court.id,
    name: court.name,
    sport: court.sport,
    surface: court.surface,
    pricePerHour: court.pricePerHour,
    slotMinutes: court.slotMinutes,
    bookingCount: court._count.bookings,
    availability: court.availability.map((rule) => ({
      dayOfWeek: rule.dayOfWeek,
      openTime: rule.openTime,
      closeTime: rule.closeTime,
    })),
  }));

  return (
    <section className="mx-auto max-w-3xl">
      <PageHeader
        title="Gestione impianto"
        description="Aggiorna foto, campi e orari di disponibilità del tuo circolo."
      />

      <nav className="mb-8 flex flex-wrap gap-2 text-sm">
        <a
          href="#foto"
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
        >
          Foto
        </a>
        <a
          href="#campi"
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
        >
          Campi
        </a>
        <a
          href="#orari"
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
        >
          Orari
        </a>
      </nav>

      <div className="space-y-12">
        <section id="foto" className="scroll-mt-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Foto del circolo</h2>
          <ClubPhotosSection
            imageUrl={club.imageUrl}
            description={club.description}
            openingHours={club.openingHours}
            photos={club.photos}
          />
        </section>

        <section id="campi" className="scroll-mt-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Campi</h2>
          <CourtsSection
            courts={courts.map(({ availability: _availability, ...court }) => court)}
          />
        </section>

        <section id="orari" className="scroll-mt-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Giorni e orari disponibili</h2>
          <AvailabilitySection courts={courts} />
        </section>
      </div>
    </section>
  );
}
