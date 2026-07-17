import { prisma } from "@/lib/db";
import { BOOKING_STATUS } from "@/lib/types/db";

export interface ClubNotificationDTO {
  id: string;
  readAt: string | null;
  createdAt: string;
  booking: {
    id: string;
    startAt: string;
    endAt: string;
    totalAmount: number;
    courtName: string;
    userName: string;
    status: string;
  };
}

export async function getClubNotifications(clubId: string, limit = 20) {
  const notifications = await prisma.clubNotification.findMany({
    where: {
      clubId,
      booking: {
        status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      },
    },
    include: {
      booking: {
        include: {
          court: true,
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications.map(mapNotification);
}

function mapNotification(
  notification: Awaited<ReturnType<typeof prisma.clubNotification.findMany>>[number] & {
    booking: {
      id: string;
      startAt: Date;
      endAt: Date;
      totalAmount: number;
      status: string;
      court: { name: string };
      user: { name: string };
    };
  },
): ClubNotificationDTO {
  return {
    id: notification.id,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
    booking: {
      id: notification.booking.id,
      startAt: notification.booking.startAt.toISOString(),
      endAt: notification.booking.endAt.toISOString(),
      totalAmount: notification.booking.totalAmount,
      courtName: notification.booking.court.name,
      userName: notification.booking.user.name,
      status: notification.booking.status,
    },
  };
}

export async function getUnreadNotificationCount(clubId: string) {
  return prisma.clubNotification.count({
    where: {
      clubId,
      readAt: null,
      booking: {
        status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      },
    },
  });
}
