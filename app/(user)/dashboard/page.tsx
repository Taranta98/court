import { requireSession } from "@/actions/auth";
import { PageHeader } from "@/components/ui/page-header";
import { getUserBookings } from "@/lib/booking/slots";
import { ButtonLink } from "@/components/ui/button-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const bookings = await getUserBookings(session.userId);

  return (
    <section>
      <PageHeader
        title={`Ciao, ${session.name}`}
        description="Le tue prenotazioni attive e passate."
      />

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-zinc-600">Non hai ancora prenotazioni.</p>
          <ButtonLink href="/circoli" className="mt-4">
            Sfoglia i circoli
          </ButtonLink>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-5">
              <p className="font-medium text-zinc-900">{booking.court.club.name}</p>
              <p className="text-sm text-zinc-600">{booking.court.name}</p>
              <p className="mt-2 text-sm text-zinc-500">
                {booking.startAt.toLocaleString("it-IT")} · €{booking.totalAmount}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
