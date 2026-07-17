"use client";

import { ClubAccountMenu } from "@/components/club/club-account-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ClubNavProps {
  clubName?: string;
  notificationsSlot?: React.ReactNode;
}

const navItems = [
  {
    href: "/club",
    label: "Pannello",
    match: (pathname: string) => pathname === "/club",
  },
  {
    href: "/club/prenotazioni",
    label: "Prenotazioni",
    match: (pathname: string) => pathname.startsWith("/club/prenotazioni"),
  },
  {
    href: "/club/tesserati",
    label: "Tesserati",
    match: (pathname: string) => pathname.startsWith("/club/tesserati"),
  },
  {
    href: "/club/gestione",
    label: "Gestione",
    match: (pathname: string) => pathname.startsWith("/club/gestione"),
  },
] as const;

export function ClubNav({ clubName, notificationsSlot }: ClubNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:h-16 sm:gap-6">
        <Link
          href="/club"
          className="shrink-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
        >
          Court<span className="text-emerald-500">.</span>
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:gap-2"
          aria-label="Navigazione pannello circolo"
        >
          {navItems.map((item) => {
            const active = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {notificationsSlot && (
          <div className="shrink-0 border-l border-zinc-100 pl-3">{notificationsSlot}</div>
        )}

        {clubName && (
          <div className="shrink-0 border-l border-zinc-100 pl-3">
            <ClubAccountMenu clubName={clubName} />
          </div>
        )}
      </div>
    </header>
  );
}
