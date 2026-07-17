import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/types/db";

export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: "In attesa",
  [BOOKING_STATUS.CONFIRMED]: "Confermata",
  [BOOKING_STATUS.CANCELLED]: "Rifiutata",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PAID]: "Pagata",
  [PAYMENT_STATUS.UNPAID]: "Non pagata",
};

export function bookingStatusStyles(status: BookingStatus) {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return "bg-amber-50 text-amber-800";
    case BOOKING_STATUS.CONFIRMED:
      return "bg-emerald-50 text-emerald-800";
    case BOOKING_STATUS.CANCELLED:
      return "bg-red-50 text-red-700";
  }
}

export function paymentStatusStyles(status: PaymentStatus) {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return "bg-sky-50 text-sky-800";
    case PAYMENT_STATUS.UNPAID:
      return "bg-zinc-100 text-zinc-600";
  }
}
