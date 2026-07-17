import { getBasicClubForSession } from "@/lib/club/access";
import { ClubStatsPanel } from "@/components/club/club-stats-panel";
import { PageHeader } from "@/components/ui/page-header";
import {
  filterAffluenceBookings,
  filterRevenueBookings,
  getClubBookings,
} from "@/lib/booking/slots";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pannello circolo",
};

export default async function ClubDashboardPage() {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return <p>Nessun circolo associato al tuo account.</p>;
  }

  const bookings = await getClubBookings(club.id);
  const upcoming = bookings.filter((booking) => booking.startAt >= new Date());
  const revenueBookings = filterRevenueBookings(bookings).map((booking) => ({
    startAt: booking.startAt.toISOString(),
    totalAmount: booking.totalAmount,
  }));
  const affluenceBookings = filterAffluenceBookings(bookings).map((booking) => ({
    startAt: booking.startAt.toISOString(),
    totalAmount: booking.totalAmount,
  }));

  return (
    <section>
      <PageHeader
        title={club.name}
        description="Panoramica del tuo impianto sportivo."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Prenotazioni totali</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{bookings.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Prossime</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{upcoming.length}</p>
        </div>
        <a
          href="/club/gestione"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 transition-colors hover:bg-emerald-100"
        >
          <p className="text-sm font-medium text-emerald-700">Gestione impianto</p>
          <p className="mt-1 text-sm text-emerald-800">Foto, campi e orari →</p>
        </a>
      </div>

      <ClubStatsPanel revenueBookings={revenueBookings} affluenceBookings={affluenceBookings} />
    </section>
  );
}
