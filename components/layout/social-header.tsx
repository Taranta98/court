import { getDashboardPath, getSession } from "@/lib/auth/session";
import Link from "next/link";

export async function SocialHeader() {
  const session = await getSession();
  const profileHref = session ? getDashboardPath(session.role) : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-11 max-w-lg items-center justify-between px-4 sm:max-w-2xl">
        <Link
          href="/circoli"
          className="flex size-9 items-center justify-center text-zinc-900"
          aria-label="Cerca"
        >
          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </Link>

        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-zinc-900">
          Court
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/registrazione"
            className="flex size-9 items-center justify-center text-zinc-900"
            aria-label="Nuova partita"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
          <Link
            href={profileHref}
            className="flex size-9 items-center justify-center text-zinc-900"
            aria-label="Profilo"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
