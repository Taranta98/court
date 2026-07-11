import { LogoutButton } from "@/components/auth/logout-button";
import { AppTopBar } from "@/components/layout/app-top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getProfilePath, getSession } from "@/lib/auth/session";
import { getInitialsFromName } from "@/lib/utils";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const profileHref = session ? getProfilePath(session.role) : "/login";
  const userName = session?.name;
  const userFirstName = session?.name.split(" ")[0];

  return (
    <>
      <AppTopBar
        userName={userName}
        userFirstName={userFirstName}
        profileHref={profileHref}
        isLoggedIn={Boolean(session)}
        logoutSlot={session ? <LogoutButton /> : null}
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
