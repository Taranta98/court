"use server";

import { requireRole } from "@/actions/auth";
import { CLUB_MANAGEMENT_ROLES, getClubForSession } from "@/lib/club/access";
import {
  getClubNotifications,
  getUnreadNotificationCount,
  type ClubNotificationDTO,
} from "@/lib/club/notifications";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fetchClubNotificationsAction(): Promise<{
  notifications: ClubNotificationDTO[];
  unreadCount: number;
}> {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) {
    return { notifications: [], unreadCount: 0 };
  }

  const [notifications, unreadCount] = await Promise.all([
    getClubNotifications(club.id),
    getUnreadNotificationCount(club.id),
  ]);

  return { notifications, unreadCount };
}

export async function markNotificationReadAction(notificationId: string) {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) return;

  await prisma.clubNotification.updateMany({
    where: { id: notificationId, clubId: club.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/club");
}

export async function markAllNotificationsReadAction() {
  await requireRole(CLUB_MANAGEMENT_ROLES);
  const { club } = await getClubForSession();

  if (!club) return;

  await prisma.clubNotification.updateMany({
    where: { clubId: club.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/club");
}
