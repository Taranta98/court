import { LogoutButton } from "@/components/auth/logout-button";
import { ClubNotificationsBell } from "@/components/club/club-notifications-bell";
import { AppTopBar } from "@/components/layout/app-top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getProfilePath, getSession, type SessionPayload } from "@/lib/auth/session";
import { resolveClubId } from "@/lib/club/access";
import { getClubNotifications, getUnreadNotificationCount } from "@/lib/club/notifications";
import { ROLES, type Role } from "@/lib/types/db";
import { getInitialsFromName } from "@/lib/utils";

const CLUB_ROLES: Role[] = [ROLES.CLUB_OWNER, ROLES.CLUB_STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN];

function isClubRole(role: Role) {
  return CLUB_ROLES.includes(role);
}

async function getNotificationsForSession(session: SessionPayload) {
  if (!isClubRole(session.role)) {
    return null;
  }

  const clubId = await resolveClubId(session);

  if (!clubId) {
    return null;
  }

  const [notifications, unreadCount] = await Promise.all([
    getClubNotifications(clubId),
    getUnreadNotificationCount(clubId),
  ]);

  return { notifications, unreadCount };
}

export async function AppShell({
  children,
  hideTopBar = false,
}: {
  children: React.ReactNode;
  hideTopBar?: boolean;
}) {
  const session = await getSession();
  const profileHref = session ? getProfilePath(session.role) : "/login";
  const userName = session?.name;
  const userFirstName = session?.name.split(" ")[0];
  const notificationData =
    session && !hideTopBar ? await getNotificationsForSession(session) : null;

  const notificationsSlot = notificationData ? (
    <ClubNotificationsBell
      initialNotifications={notificationData.notifications}
      initialUnreadCount={notificationData.unreadCount}
    />
  ) : null;

  return (
    <>
      <AppTopBar
        userName={userName}
        userFirstName={userFirstName}
        profileHref={profileHref}
        isLoggedIn={Boolean(session)}
        logoutSlot={session && !hideTopBar ? <LogoutButton /> : null}
        notificationsSlot={notificationsSlot}
        hidden={hideTopBar}
      />
      <main className="mx-auto w-full max-w-lg flex-1 bg-zinc-50 pb-[calc(60px+env(safe-area-inset-bottom))] sm:max-w-6xl sm:px-6 sm:pb-8 lg:px-8">
        {children}
      </main>
      <BottomNav
        profileHref={profileHref}
        isLoggedIn={Boolean(session)}
        userInitials={session ? getInitialsFromName(session.name) : undefined}
      />
    </>
  );
}
