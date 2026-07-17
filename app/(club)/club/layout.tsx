import { requireRole } from "@/actions/auth";
import { ClubNav } from "@/components/club/club-nav";
import { ClubNotificationsBell } from "@/components/club/club-notifications-bell";
import { AppShell } from "@/components/layout/app-shell";
import { getBasicClubForSession } from "@/lib/club/access";
import { getClubNotifications, getUnreadNotificationCount } from "@/lib/club/notifications";
import { ROLES } from "@/lib/types/db";

export default async function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([
    ROLES.CLUB_OWNER,
    ROLES.CLUB_STAFF,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ]);

  const { club } = await getBasicClubForSession();
  const [notifications, unreadCount] = club
    ? await Promise.all([
        getClubNotifications(club.id),
        getUnreadNotificationCount(club.id),
      ])
    : [[], 0];

  const notificationsSlot = club ? (
    <ClubNotificationsBell
      initialNotifications={notifications}
      initialUnreadCount={unreadCount}
    />
  ) : null;

  return (
    <AppShell hideTopBar>
      <ClubNav clubName={club?.name} notificationsSlot={notificationsSlot} />
      <div className="px-4 py-6 sm:py-10">{children}</div>
    </AppShell>
  );
}
