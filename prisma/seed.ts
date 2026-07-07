import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";
import { DB_SPORTS, ROLES } from "../lib/types/db";

const prisma = new PrismaClient();

const clubsSeed = [
  {
    slug: "tennis-club-roma",
    name: "Tennis Club Roma",
    city: "Roma",
    address: "Via dei Campi Sportivi 12, 00100 Roma",
    description: "Circolo storico con 8 campi in terra rossa e 4 padel.",
    openingHours: "Lun–Dom 7:00 – 23:00",
    imageUrl:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80",
    courts: [
      {
        name: "Campo 1 — Terra rossa",
        sport: DB_SPORTS.TENNIS,
        surface: "Terra rossa",
        pricePerHour: 25,
        slotMinutes: 60,
      },
      {
        name: "Campo 2 — Terra rossa",
        sport: DB_SPORTS.TENNIS,
        surface: "Terra rossa",
        pricePerHour: 25,
        slotMinutes: 60,
      },
      {
        name: "Padel 1",
        sport: DB_SPORTS.PADEL,
        surface: "Erba sintetica",
        pricePerHour: 35,
        slotMinutes: 90,
      },
    ],
  },
  {
    slug: "beach-arena-fregene",
    name: "Beach Arena Fregene",
    city: "Fregene",
    address: "Lungomare di Fregene, 00054 Fregene",
    description: "Beach volley, beach tennis e bar sulla spiaggia.",
    openingHours: "Mar–Dom 9:00 – 20:00",
    imageUrl:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
    courts: [
      {
        name: "Campo beach 1",
        sport: DB_SPORTS.BEACH_VOLLEY,
        surface: "Sabbia",
        pricePerHour: 20,
        slotMinutes: 60,
      },
      {
        name: "Campo beach tennis",
        sport: DB_SPORTS.BEACH_TENNIS,
        surface: "Sabbia",
        pricePerHour: 22,
        slotMinutes: 60,
      },
    ],
  },
  {
    slug: "sport-center-milano",
    name: "Sport Center Milano",
    city: "Milano",
    address: "Via dello Sport 45, 20100 Milano",
    description: "Calcetto, calciotto e pallavolo indoor tutto l'anno.",
    openingHours: "Lun–Ven 8:00 – 24:00, Sab–Dom 9:00 – 22:00",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    courts: [
      {
        name: "Calcetto A",
        sport: DB_SPORTS.CALCETTO,
        surface: "Sintetico indoor",
        pricePerHour: 80,
        slotMinutes: 90,
      },
      {
        name: "Calciotto B",
        sport: DB_SPORTS.CALCIOTTO,
        surface: "Parquet",
        pricePerHour: 70,
        slotMinutes: 90,
      },
      {
        name: "Palestra pallavolo",
        sport: DB_SPORTS.PALLAVOLO,
        surface: "Parquet",
        pricePerHour: 60,
        slotMinutes: 60,
      },
    ],
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.court.deleteMany();
  await prisma.user.deleteMany();
  await prisma.club.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  for (const clubData of clubsSeed) {
    const club = await prisma.club.create({
      data: {
        slug: clubData.slug,
        name: clubData.name,
        city: clubData.city,
        address: clubData.address,
        description: clubData.description,
        openingHours: clubData.openingHours,
        imageUrl: clubData.imageUrl,
        courts: {
          create: clubData.courts.map((court) => ({
            name: court.name,
            sport: court.sport,
            surface: court.surface,
            pricePerHour: court.pricePerHour,
            slotMinutes: court.slotMinutes,
            availability: {
              create: Array.from({ length: 7 }, (_, dayOfWeek) => ({
                dayOfWeek,
                openTime: "08:00",
                closeTime: "22:00",
              })),
            },
          })),
        },
      },
    });

    if (clubData.slug === "tennis-club-roma") {
      await prisma.user.create({
        data: {
          email: "owner@tennis-club-roma.it",
          name: "Marco Rossi",
          passwordHash,
          role: ROLES.CLUB_OWNER,
          clubId: club.id,
        },
      });
    }
  }

  await prisma.user.createMany({
    data: [
      {
        email: "superadmin@court.it",
        name: "Super Admin",
        passwordHash,
        role: ROLES.SUPER_ADMIN,
      },
      {
        email: "admin@court.it",
        name: "Admin Court",
        passwordHash,
        role: ROLES.ADMIN,
      },
      {
        email: "utente@test.it",
        name: "Giulia Bianchi",
        passwordHash,
        role: ROLES.USER,
      },
    ],
  });

  console.log("Database seeded.");
  console.log("Account di test (password: password123):");
  console.log("- superadmin@court.it (Super Admin)");
  console.log("- admin@court.it (Admin)");
  console.log("- owner@tennis-club-roma.it (Circolo)");
  console.log("- utente@test.it (Utente)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
