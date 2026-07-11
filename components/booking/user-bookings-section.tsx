"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface UserBookingItem {
  id: string;
  clubName: string;
  courtName: string;
  startAt: string;
  endAt: string;
  totalAmount: number;
}

interface UserBookingsSectionProps {
  upcoming: UserBookingItem[];
  past: UserBookingItem[];
}

function formatBookingDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BookingList({
  bookings,
  variant = "upcoming",
}: {
  bookings: UserBookingItem[];
  variant?: "upcoming" | "past";
}) {
  const isPast = variant === "past";

  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
      {bookings.map((booking) => (
        <li key={booking.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`font-medium ${isPast ? "text-zinc-600" : "text-zinc-900"}`}>
                {booking.clubName}
              </p>
              <p className="text-sm text-zinc-600">{booking.courtName}</p>
              <p className="mt-2 text-sm text-zinc-500">
                {formatBookingDate(booking.startAt)} · €{booking.totalAmount}
              </p>
            </div>
            {isPast && (
              <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                Conclusa
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function UserBookingsSection({ upcoming, past }: UserBookingsSectionProps) {
  const [showPast, setShowPast] = useState(false);

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900">Le mie prenotazioni</h2>

      {upcoming.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center">
          <p className="text-zinc-600">Nessuna prenotazione in corso.</p>
        </div>
      ) : (
        <div className="mt-4">
          <BookingList bookings={upcoming} />
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPast((prev) => !prev)}
          >
            {showPast ? "Nascondi precedenti" : "Mostra precedenti"}
          </Button>

          {showPast && (
            <div className="mt-4">
              <p className="mb-3 text-sm text-zinc-500">
                {past.length} prenotazion{past.length === 1 ? "e" : "i"} passat
                {past.length === 1 ? "a" : "e"}
              </p>
              <BookingList bookings={past} variant="past" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
