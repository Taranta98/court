import { requireRole } from "@/actions/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { AppShell } from "@/components/layout/app-shell";
import { ROLES } from "@/lib/types/db";
import Link from "next/link";

export default async function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([ROLES.CLUB_OWNER, ROLES.CLUB_STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN]);

  return (
    <AppShell>
      <div className="hidden border-b border-zinc-200 bg-white sm:block">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 text-sm">
          <Link href="/" className="font-bold text-emerald-700">
            Court
          </Link>
          <Link href="/club" className="font-medium text-zinc-800">
            Pannello circolo
          </Link>
          <Link href="/club/prenotazioni" className="text-zinc-600 hover:text-emerald-700">
            Prenotazioni
          </Link>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="px-4 py-6 sm:py-10">{children}</div>
    </AppShell>
  );
}
