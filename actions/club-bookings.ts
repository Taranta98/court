"use server";

import { getBasicClubForSession } from "@/lib/club/access";
import { prisma } from "@/lib/db";
import { updateClubBookingSchema, type ActionState } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateClubBookingAction(
  bookingId: string,
  status: string,
  paymentStatus: string,
): Promise<ActionState> {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = updateClubBookingSchema.safeParse({
    bookingId,
    status,
    paymentStatus,
  });

  if (!parsed.success) {
    return { error: "Dati non validi." };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: parsed.data.bookingId,
      court: { clubId: club.id },
    },
  });

  if (!booking) {
    return { error: "Prenotazione non trovata." };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: parsed.data.status,
      paymentStatus: parsed.data.paymentStatus,
    },
  });

  revalidatePath("/club");
  revalidatePath("/club/prenotazioni");

  return { success: "Prenotazione aggiornata." };
}
