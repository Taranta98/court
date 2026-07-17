"use client";

import { updateClubBookingAction } from "@/actions/club-bookings";
import {
  bookingStatusLabels,
  bookingStatusStyles,
  paymentStatusLabels,
  paymentStatusStyles,
} from "@/lib/booking/labels";
import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/types/db";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

export interface ClubBookingRow {
  id: string;
  startAt: string;
  courtName: string;
  userName: string;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

interface ClubBookingsTableProps {
  bookings: ClubBookingRow[];
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

function BookingRow({ booking }: { booking: ClubBookingRow }) {
  const [isPending, startTransition] = useTransition();

  function handleUpdate(status: BookingStatus, paymentStatus: PaymentStatus) {
    startTransition(async () => {
      await updateClubBookingAction(booking.id, status, paymentStatus);
    });
  }

  const dateLabel = new Date(booking.startAt).toLocaleString("it-IT");

  return (
    <tr className={cn("border-b border-zinc-50", isPending && "opacity-60")}>
      <td className="px-4 py-3 whitespace-nowrap">{dateLabel}</td>
      <td className="px-4 py-3">{booking.courtName}</td>
      <td className="px-4 py-3">{booking.userName}</td>
      <td className="px-4 py-3">€{booking.totalAmount}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          <StatusBadge
            label={bookingStatusLabels[booking.status]}
            className={bookingStatusStyles(booking.status)}
          />
          <select
            value={booking.status}
            onChange={(event) =>
              handleUpdate(event.target.value as BookingStatus, booking.paymentStatus)
            }
            disabled={isPending}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-emerald-500"
            aria-label={`Stato prenotazione ${booking.userName}`}
          >
            <option value={BOOKING_STATUS.PENDING}>{bookingStatusLabels.PENDING}</option>
            <option value={BOOKING_STATUS.CONFIRMED}>{bookingStatusLabels.CONFIRMED}</option>
            <option value={BOOKING_STATUS.CANCELLED}>{bookingStatusLabels.CANCELLED}</option>
          </select>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          <StatusBadge
            label={paymentStatusLabels[booking.paymentStatus]}
            className={paymentStatusStyles(booking.paymentStatus)}
          />
          <select
            value={booking.paymentStatus}
            onChange={(event) =>
              handleUpdate(booking.status, event.target.value as PaymentStatus)
            }
            disabled={isPending || booking.status === BOOKING_STATUS.CANCELLED}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-50"
            aria-label={`Pagamento prenotazione ${booking.userName}`}
          >
            <option value={PAYMENT_STATUS.UNPAID}>{paymentStatusLabels.UNPAID}</option>
            <option value={PAYMENT_STATUS.PAID}>{paymentStatusLabels.PAID}</option>
          </select>
        </div>
      </td>
    </tr>
  );
}

export function ClubBookingsTable({ bookings }: ClubBookingsTableProps) {
  if (bookings.length === 0) {
    return <p className="text-zinc-600">Nessuna prenotazione ancora.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Campo</th>
            <th className="px-4 py-3 font-medium">Utente</th>
            <th className="px-4 py-3 font-medium">Importo</th>
            <th className="px-4 py-3 font-medium">Stato</th>
            <th className="px-4 py-3 font-medium">Pagamento</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
