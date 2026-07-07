import { prisma } from "@/lib/db";
import { fromDbSport } from "@/lib/sport";
import type { SportSlug } from "@/lib/sport";

export interface ClubCourt {
  id: string;
  name: string;
  sport: SportSlug;
  surface: string;
  pricePerHour: number;
  slotMinutes: number;
}

export interface ClubDTO {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  description: string;
  openingHours: string;
  imageUrl: string;
  sports: SportSlug[];
  courts: ClubCourt[];
}

function mapClub(
  club: Awaited<ReturnType<typeof fetchClubRecord>>,
): ClubDTO | null {
  if (!club) return null;

  const courts = club.courts.map((court) => ({
    id: court.id,
    name: court.name,
    sport: fromDbSport(court.sport),
    surface: court.surface,
    pricePerHour: court.pricePerHour,
    slotMinutes: court.slotMinutes,
  }));

  const sports = [...new Set(courts.map((court) => court.sport))];

  return {
    id: club.id,
    slug: club.slug,
    name: club.name,
    city: club.city,
    address: club.address,
    description: club.description,
    openingHours: club.openingHours,
    imageUrl: club.imageUrl,
    sports,
    courts,
  };
}

async function fetchClubRecord(slug: string) {
  return prisma.club.findUnique({
    where: { slug },
    include: {
      courts: {
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getClubsFromDb() {
  const clubs = await prisma.club.findMany({
    include: { courts: true },
    orderBy: { name: "asc" },
  });

  return clubs
    .map((club) => mapClub({ ...club, courts: club.courts }))
    .filter((club): club is ClubDTO => club !== null);
}

export async function getClubBySlugFromDb(slug: string) {
  const club = await fetchClubRecord(slug);
  return mapClub(club);
}

export async function getAllClubSlugsFromDb() {
  const clubs = await prisma.club.findMany({ select: { slug: true } });
  return clubs.map((club) => club.slug);
}

export async function getCourtById(courtId: string) {
  return prisma.court.findUnique({
    where: { id: courtId },
    include: { club: true },
  });
}
