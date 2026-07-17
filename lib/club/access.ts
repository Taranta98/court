import { requireRole } from "@/actions/auth";
import type { SessionPayload } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ROLES, type Role } from "@/lib/types/db";

export const CLUB_MANAGEMENT_ROLES: Role[] = [
  ROLES.CLUB_OWNER,
  ROLES.CLUB_STAFF,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

const clubInclude = {
  photos: { orderBy: { sortOrder: "asc" as const } },
  courts: {
    orderBy: { name: "asc" as const },
    include: {
      availability: { orderBy: { dayOfWeek: "asc" as const } },
      _count: { select: { bookings: true } },
    },
  },
};

export async function resolveClubId(session: SessionPayload) {
  if (session.clubId) {
    const club = await prisma.club.findUnique({
      where: { id: session.clubId },
      select: { id: true },
    });
    if (club) return club.id;
  }

  let user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { clubId: true },
  });

  // Dopo un re-seed gli ID in cookie possono essere obsoleti: prova dall'email.
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { clubId: true },
    });
  }

  if (user?.clubId) {
    const club = await prisma.club.findUnique({
      where: { id: user.clubId },
      select: { id: true },
    });
    if (club) return club.id;
  }

  if (session.role === ROLES.ADMIN || session.role === ROLES.SUPER_ADMIN) {
    const club = await prisma.club.findFirst({ select: { id: true } });
    return club?.id ?? null;
  }

  return null;
}

export async function getClubForSession() {
  const session = await requireRole(CLUB_MANAGEMENT_ROLES);
  const clubId = await resolveClubId(session);

  const club = clubId
    ? await prisma.club.findUnique({
        where: { id: clubId },
        include: clubInclude,
      })
    : null;

  return { session, club };
}

export async function getBasicClubForSession() {
  const session = await requireRole(CLUB_MANAGEMENT_ROLES);
  const clubId = await resolveClubId(session);

  const club = clubId
    ? await prisma.club.findUnique({
        where: { id: clubId },
      })
    : null;

  return { session, club };
}

export async function assertCourtBelongsToClub(courtId: string, clubId: string) {
  return prisma.court.findFirst({
    where: { id: courtId, clubId },
    include: { availability: true },
  });
}
