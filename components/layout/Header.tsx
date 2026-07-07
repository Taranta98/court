import { logoutAction } from "@/actions/logout";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getDashboardPath, getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn("text-sm font-medium text-zinc-700 hover:text-emerald-700", className)}
    >
      {children}
    </Link>
  );
}

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <Link href="/" className="text-lg font-bold text-emerald-700 sm:text-xl">
          Court
        </Link>

        <nav className="hidden items-center gap-4 sm:flex sm:gap-6">
          <NavLink href="/circoli">Circoli</NavLink>

          {session ? (
            <>
              <NavLink href={getDashboardPath(session.role)}>{session.name}</NavLink>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
                >
                  Esci
                </button>
              </form>
            </>
          ) : (
            <NavLink
              href="/login"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 hover:text-white"
            >
              Accedi
            </NavLink>
          )}
        </nav>

        <MobileNav
          links={
            session
              ? [
                  { href: "/circoli", label: "Circoli" },
                  { href: getDashboardPath(session.role), label: session.name },
                ]
              : [
                  { href: "/circoli", label: "Circoli" },
                  { href: "/login", label: "Accedi", variant: "cta" },
                ]
          }
          logoutAction={session ? logoutAction : undefined}
        />
      </div>
    </header>
  );
}
