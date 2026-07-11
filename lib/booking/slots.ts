import { prisma } from "@/lib/db";
import { BOOKING_STATUS } from "@/lib/types/db";

export interface TimeSlot {
  startAt: string;
  endAt: string;
  label: string;
}

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatSlotLabel(date: Date) {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function getAvailableSlots(courtId: string, dateISO: string) {
  const court = await prisma.court.findUnique({
    where: { id: courtId },
    include: {
      availability: true,
      bookings: {
        where: {
          status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
          startAt: {
            gte: new Date(`${dateISO}T00:00:00`),
            lt: new Date(`${dateISO}T23:59:59`),
          },
        },
      },
    },
  });

  if (!court) return [];

  const date = new Date(`${dateISO}T12:00:00`);
  const dayOfWeek = date.getDay();
  const rule = court.availability.find((item) => item.dayOfWeek === dayOfWeek);

  if (!rule) return [];

  const openMinutes = parseTimeToMinutes(rule.openTime);
  const closeMinutes = parseTimeToMinutes(rule.closeTime);
  const slots: TimeSlot[] = [];

  for (
    let minutes = openMinutes;
    minutes + court.slotMinutes <= closeMinutes;
    minutes += court.slotMinutes
  ) {
    const startAt = new Date(`${dateISO}T${minutesToTime(minutes)}:00`);
    const endAt = new Date(startAt.getTime() + court.slotMinutes * 60_000);

    const overlaps = court.bookings.some(
      (booking) => startAt < booking.endAt && endAt > booking.startAt,
    );

    if (!overlaps && startAt > new Date()) {
      slots.push({
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        label: formatSlotLabel(startAt),
      });
    }
  }

  return slots;
}

export async function getClubBookings(clubId: string) {
  return prisma.booking.findMany({
    where: {
      court: { clubId },
      status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
    },
    include: {
      court: true,
      user: true,
    },
    orderBy: { startAt: "asc" },
  });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: {
      userId,
      status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
    },
    include: {
      court: { include: { club: true } },
    },
    orderBy: { startAt: "desc" },
  });
}

export function splitUserBookings<T extends { startAt: Date; endAt: Date }>(
  bookings: T[],
  now = new Date(),
) {
  const upcoming: T[] = [];
  const past: T[] = [];

  for (const booking of bookings) {
    if (booking.endAt > now) {
      upcoming.push(booking);
    } else {
      past.push(booking);
    }
  }

  upcoming.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

  return { upcoming, past };
}
