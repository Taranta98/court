import { BottomNav } from "@/components/layout/bottom-nav";
import { SocialHeader } from "@/components/layout/social-header";
import { getDashboardPath, getSession } from "@/lib/auth/session";

export async function SocialShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const profileHref = session ? getDashboardPath(session.role) : "/login";

  return (
    <>
      <SocialHeader />
      <main className="mx-auto w-full max-w-lg flex-1 bg-zinc-50 sm:max-w-2xl sm:pb-0 pb-[calc(49px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav profileHref={profileHref} />
    </>
  );
}
