import { requireRole } from "@/actions/auth";
import { ROLES } from "@/lib/types/db";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { getClubBookings } from "@/lib/booking/slots";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pannello circolo",
};

export default async function ClubDashboardPage() {
  const session = await requireRole([
    ROLES.CLUB_OWNER,
    ROLES.CLUB_STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ]);

  const club = session.clubId
    ? await prisma.club.findUnique({ where: { id: session.clubId } })
    : await prisma.club.findFirst();

  if (!club) {
    return <p>Nessun circolo associato al tuo account.</p>;
  }

  const bookings = await getClubBookings(club.id);
  const upcoming = bookings.filter((booking) => booking.startAt >= new Date());

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
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Città</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{club.city}</p>
        </div>
      </div>
    </section>
  );
}
