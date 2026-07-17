"use server";

import { requireRole } from "@/actions/auth";
import { assertCourtBelongsToClub, CLUB_MANAGEMENT_ROLES, getClubForSession } from "@/lib/club/access";
import { prisma } from "@/lib/db";
import { BOOKING_STATUS } from "@/lib/types/db";
import {
  addClubPhotoSchema,
  courtSchema,
  updateAvailabilitySchema,
  updateClubProfileSchema,
  zodFieldErrors,
  type ActionState,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATHS = ["/club/gestione", "/circoli"];

function revalidateClubPages() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/circoli", "layout");
}

export async function updateClubProfileAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = updateClubProfileSchema.safeParse({
    description: formData.get("description"),
    openingHours: formData.get("openingHours"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.club.update({
    where: { id: club.id },
    data: parsed.data,
  });

  revalidateClubPages();
  return { success: "Profilo circolo aggiornato." };
}

export async function addClubPhotoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = addClubPhotoSchema.safeParse({
    url: formData.get("url"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const maxOrder = club.photos.reduce((max, photo) => Math.max(max, photo.sortOrder), -1);

  await prisma.clubPhoto.create({
    data: {
      clubId: club.id,
      url: parsed.data.url,
      sortOrder: maxOrder + 1,
    },
  });

  revalidateClubPages();
  return { success: "Foto aggiunta alla galleria." };
}

export async function deleteClubPhotoAction(photoId: string): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const photo = await prisma.clubPhoto.findFirst({
    where: { id: photoId, clubId: club.id },
  });

  if (!photo) {
    return { error: "Foto non trovata." };
  }

  await prisma.clubPhoto.delete({ where: { id: photoId } });

  revalidateClubPages();
  return { success: "Foto eliminata." };
}

export async function setCoverPhotoAction(photoId: string): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const photo = await prisma.clubPhoto.findFirst({
    where: { id: photoId, clubId: club.id },
  });

  if (!photo) {
    return { error: "Foto non trovata." };
  }

  await prisma.club.update({
    where: { id: club.id },
    data: { imageUrl: photo.url },
  });

  revalidateClubPages();
  return { success: "Immagine di copertina aggiornata." };
}

export async function createCourtAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = courtSchema.safeParse({
    name: formData.get("name"),
    sport: formData.get("sport"),
    surface: formData.get("surface"),
    pricePerHour: formData.get("pricePerHour"),
    slotMinutes: formData.get("slotMinutes"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.court.create({
    data: {
      clubId: club.id,
      ...parsed.data,
      availability: {
        create: Array.from({ length: 7 }, (_, dayOfWeek) => ({
          dayOfWeek,
          openTime: "08:00",
          closeTime: "22:00",
        })),
      },
    },
  });

  revalidateClubPages();
  return { success: "Campo aggiunto con successo." };
}

export async function updateCourtAction(
  courtId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const court = await assertCourtBelongsToClub(courtId, club.id);
  if (!court) {
    return { error: "Campo non trovato." };
  }

  const parsed = courtSchema.safeParse({
    name: formData.get("name"),
    sport: formData.get("sport"),
    surface: formData.get("surface"),
    pricePerHour: formData.get("pricePerHour"),
    slotMinutes: formData.get("slotMinutes"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.court.update({
    where: { id: courtId },
    data: parsed.data,
  });

  revalidateClubPages();
  return { success: "Campo aggiornato." };
}

export async function deleteCourtAction(courtId: string): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const court = await assertCourtBelongsToClub(courtId, club.id);
  if (!court) {
    return { error: "Campo non trovato." };
  }

  const activeBookings = await prisma.booking.count({
    where: {
      courtId,
      status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      endAt: { gt: new Date() },
    },
  });

  if (activeBookings > 0) {
    return { error: "Non puoi eliminare un campo con prenotazioni future." };
  }

  await prisma.court.delete({ where: { id: courtId } });

  revalidateClubPages();
  return { success: "Campo eliminato." };
}

export async function updateCourtAvailabilityAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const courtId = String(formData.get("courtId") ?? "");
  const court = await assertCourtBelongsToClub(courtId, club.id);

  if (!court) {
    return { error: "Campo non trovato." };
  }

  const days = Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    enabled: formData.get(`day-${dayOfWeek}-enabled`) === "on",
    openTime: String(formData.get(`day-${dayOfWeek}-open`) ?? "08:00"),
    closeTime: String(formData.get(`day-${dayOfWeek}-close`) ?? "22:00"),
  }));

  const parsed = updateAvailabilitySchema.safeParse({ courtId, days });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  for (const day of parsed.data.days) {
    if (!day.enabled) {
      await prisma.availabilityRule.deleteMany({
        where: { courtId, dayOfWeek: day.dayOfWeek },
      });
      continue;
    }

    if (day.openTime >= day.closeTime) {
      return {
        fieldErrors: {
          [`day-${day.dayOfWeek}-close`]: ["L'orario di chiusura deve essere dopo l'apertura."],
        },
      };
    }

    const existing = court.availability.find((rule) => rule.dayOfWeek === day.dayOfWeek);

    if (existing) {
      await prisma.availabilityRule.update({
        where: { id: existing.id },
        data: {
          openTime: day.openTime,
          closeTime: day.closeTime,
        },
      });
    } else {
      await prisma.availabilityRule.create({
        data: {
          courtId,
          dayOfWeek: day.dayOfWeek,
          openTime: day.openTime,
          closeTime: day.closeTime,
        },
      });
    }
  }

  revalidateClubPages();
  return { success: "Orari aggiornati." };
}
