import { getBasicClubForSession } from "@/lib/club/access";
import { ClubBookingsTable } from "@/components/club/club-bookings-table";
import { PageHeader } from "@/components/ui/page-header";
import { getClubBookings } from "@/lib/booking/slots";
import type { BookingStatus, PaymentStatus } from "@/lib/types/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prenotazioni circolo",
};

export default async function ClubBookingsPage() {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return <p>Nessun circolo associato.</p>;
  }

  const bookings = await getClubBookings(club.id);

  return (
    <section>
      <PageHeader
        title="Prenotazioni"
        description={`Gestisci stato e pagamento delle prenotazioni di ${club.name}.`}
      />

      <ClubBookingsTable
        bookings={bookings.map((booking) => ({
          id: booking.id,
          startAt: booking.startAt.toISOString(),
          courtName: booking.court.name,
          userName: booking.user.name,
          totalAmount: booking.totalAmount,
          status: booking.status as BookingStatus,
          paymentStatus: booking.paymentStatus as PaymentStatus,
        }))}
      />
    </section>
  );
}
