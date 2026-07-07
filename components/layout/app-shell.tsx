import { AppTopBar } from "@/components/layout/app-top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getDashboardPath, getSession } from "@/lib/auth/session";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const profileHref = session ? getDashboardPath(session.role) : "/login";
  const userName = session?.name.split(" ")[0];

  return (
    <>
      <AppTopBar userName={userName} profileHref={profileHref} isLoggedIn={Boolean(session)} />
      <main className="mx-auto w-full max-w-lg flex-1 bg-zinc-50 pb-[calc(60px+env(safe-area-inset-bottom))] sm:max-w-6xl sm:px-6 sm:pb-8 lg:px-8">
        {children}
      </main>
      <BottomNav profileHref={profileHref} />
    </>
  );
}
