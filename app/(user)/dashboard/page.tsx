import { requireSession } from "@/actions/auth";
import {
  UserBookingsSection,
  type UserBookingItem,
} from "@/components/booking/user-bookings-section";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { getUserBookings, splitUserBookings } from "@/lib/booking/slots";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le mie prenotazioni",
};

function toBookingItem(
  booking: Awaited<ReturnType<typeof getUserBookings>>[number],
): UserBookingItem {
  return {
    id: booking.id,
    clubName: booking.court.club.name,
    courtName: booking.court.name,
    startAt: booking.startAt.toISOString(),
    endAt: booking.endAt.toISOString(),
    totalAmount: booking.totalAmount,
  };
}

export default async function DashboardPage() {
  const session = await requireSession();
  const bookings = await getUserBookings(session.userId);
  const { upcoming, past } = splitUserBookings(bookings);
  const hasAny = upcoming.length > 0 || past.length > 0;

  return (
    <section>
      <PageHeader
        title={`Ciao, ${session.name}`}
        description="Gestisci le tue prenotazioni attive e consulta lo storico."
      />

      {!hasAny ? (
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">Le mie prenotazioni</h2>
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <p className="text-zinc-600">Non hai ancora prenotazioni.</p>
            <ButtonLink href="/circoli" className="mt-4">
              Sfoglia i circoli
            </ButtonLink>
          </div>
        </section>
      ) : (
        <UserBookingsSection
          upcoming={upcoming.map(toBookingItem)}
          past={past.map(toBookingItem)}
        />
      )}
    </section>
  );
}
