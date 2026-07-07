"use client";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { ClubSearchForm, focusClubSearch } from "@/components/search/club-search-form";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AppTopBarProps {
  userName?: string;
  profileHref: string;
  isLoggedIn: boolean;
}

export function AppTopBar({ userName, profileHref, isLoggedIn }: AppTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isCircoliList = pathname === "/circoli";

  function handleSearchClick() {
    if (isHome || isCircoliList) {
      focusClubSearch();
      return;
    }
    router.push("/circoli?focus=1");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-lg px-4 pt-3 sm:max-w-6xl sm:px-6 sm:pt-0 lg:px-8">
        {/* Mobile header */}
        <div className="flex items-center justify-between sm:hidden">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            Court<span className="text-emerald-500">.</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSearchClick}
              className="flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-zinc-100"
              aria-label="Cerca circoli"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            {isLoggedIn ? (
              <Link
                href={profileHref}
                className="flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-zinc-100"
                aria-label="Profilo"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-zinc-100" aria-label="Accedi">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </Link>
                <Link href="/registrazione" className="rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden h-16 items-center justify-between gap-8 sm:flex">
          <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
            Court<span className="text-emerald-500">.</span>
          </Link>
          <DesktopNav />
          <div className="flex shrink-0 items-center gap-2">
            {!isCircoliList && (
              <button
                type="button"
                onClick={handleSearchClick}
                className="flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-zinc-100"
                aria-label="Cerca circoli"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            )}
            {isLoggedIn ? (
              <Link
                href={profileHref}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                {userName ?? "Profilo"}
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
                  Accedi
                </Link>
                <Link href="/registrazione" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Home hero — mobile */}
        {isHome && (
          <div className="sm:hidden">
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {userName ? `Ciao, ${userName}` : "Pronto a giocare?"}
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500">Dove vuoi giocare oggi?</p>
            </div>
            <div className="mb-3 mt-4">
              <ClubSearchForm placeholder="Cerca circolo, città o sport..." />
            </div>
          </div>
        )}

        {/* Home hero — desktop */}
        {isHome && (
          <div className="hidden border-t border-zinc-100 py-6 sm:block">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                  {userName ? `Ciao, ${userName}` : "Pronto a giocare?"}
                </h1>
                <p className="mt-2 text-base text-zinc-500">Dove vuoi giocare oggi?</p>
              </div>
              <div className="w-full lg:max-w-md">
                <ClubSearchForm placeholder="Cerca circolo, città o sport..." />
              </div>
            </div>
          </div>
        )}

        {!isHome && <div className="pb-2 sm:hidden" />}
      </div>
    </header>
  );
}
