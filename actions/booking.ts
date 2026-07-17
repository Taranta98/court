"use server";

import { requireSession } from "@/actions/auth";
import { getAvailableSlots } from "@/lib/booking/slots";
import { prisma } from "@/lib/db";
import { BOOKING_STATUS, PAYMENT_STATUS } from "@/lib/types/db";
import { bookingSchema, type ActionState } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function fetchSlotsAction(courtId: string, date: string) {
  if (!courtId || !date) return [];
  return getAvailableSlots(courtId, date);
}

export async function createBookingAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = bookingSchema.safeParse({
    courtId: formData.get("courtId"),
    startAt: formData.get("startAt"),
  });

  if (!parsed.success) {
    return { error: "Dati prenotazione non validi." };
  }

  const court = await prisma.court.findUnique({
    where: { id: parsed.data.courtId },
    include: { club: true },
  });

  if (!court) {
    return { error: "Campo non trovato." };
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(startAt.getTime() + court.slotMinutes * 60_000);

  try {
    await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          courtId: court.id,
          status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        },
      });

      if (conflict) {
        throw new Error("SLOT_TAKEN");
      }

      const booking = await tx.booking.create({
        data: {
          courtId: court.id,
          userId: session.userId,
          startAt,
          endAt,
          totalAmount: Math.round((court.pricePerHour * court.slotMinutes) / 60),
          status: BOOKING_STATUS.PENDING,
          paymentStatus: PAYMENT_STATUS.UNPAID,
        },
      });

      await tx.clubNotification.create({
        data: {
          clubId: court.clubId,
          bookingId: booking.id,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_TAKEN") {
      return { error: "Questo slot non è più disponibile. Scegline un altro." };
    }
    return { error: "Errore durante la prenotazione. Riprova." };
  }

  revalidatePath(`/circoli/${court.club.slug}`);
  revalidatePath(`/circoli/${court.club.slug}/prenota`);
  revalidatePath("/dashboard");
  revalidatePath("/club");
  revalidatePath("/club/prenotazioni");

  return {
    success: `Richiesta inviata per ${court.name} il ${startAt.toLocaleString("it-IT")}. In attesa di conferma del circolo.`,
  };
}
