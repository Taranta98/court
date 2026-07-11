import { requireSession } from "@/actions/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <AppShell>
      <div className="hidden border-b border-zinc-200 bg-white sm:block">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 text-sm">
          <Link href="/" className="font-bold text-emerald-700">
            Court
          </Link>
          <Link href="/dashboard" className="font-medium text-zinc-800">
            Le mie prenotazioni
          </Link>
          <Link href="/dashboard/profilo" className="text-zinc-600 hover:text-emerald-700">
            Il mio account
          </Link>
          <Link href="/circoli" className="text-zinc-600 hover:text-emerald-700">
            Circoli
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
