import { requireRole } from "@/actions/auth";
import { ROLES } from "@/lib/types/db";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { getClubBookings } from "@/lib/booking/slots";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prenotazioni circolo",
};

export default async function ClubBookingsPage() {
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
    return <p>Nessun circolo associato.</p>;
  }

  const bookings = await getClubBookings(club.id);

  return (
    <section>
      <PageHeader
        title="Prenotazioni"
        description={`Calendario prenotazioni di ${club.name}.`}
      />

      {bookings.length === 0 ? (
        <p className="text-zinc-600">Nessuna prenotazione ancora.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Campo</th>
                <th className="px-4 py-3 font-medium">Utente</th>
                <th className="px-4 py-3 font-medium">Importo</th>
                <th className="px-4 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-zinc-50">
                  <td className="px-4 py-3">
                    {booking.startAt.toLocaleString("it-IT")}
                  </td>
                  <td className="px-4 py-3">{booking.court.name}</td>
                  <td className="px-4 py-3">{booking.user.name}</td>
                  <td className="px-4 py-3">€{booking.totalAmount}</td>
                  <td className="px-4 py-3">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
