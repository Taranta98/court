"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  profileHref: string;
}

interface NavItem {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
}

export function BottomNav({ profileHref }: BottomNavProps) {
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      href: "/",
      label: "Home",
      match: (path) => path === "/",
      icon: (active) => (
        <svg
          className={cn("size-6", active ? "text-emerald-600" : "text-zinc-400")}
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={active ? 0 : 1.75}
          stroke="currentColor"
          aria-hidden
        >
          {active ? (
            <path d="M10.707 2.707a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          )}
        </svg>
      ),
    },
    {
      href: "/circoli",
      label: "Prenota",
      match: (path) => path.startsWith("/circoli"),
      icon: (active) => (
        <svg
          className={cn("size-6", active ? "text-emerald-600" : "text-zinc-400")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      ),
    },
    {
      href: "/#partite",
      label: "Gioca",
      match: () => false,
      icon: (active) => (
        <svg
          className={cn("size-6", active ? "text-emerald-600" : "text-zinc-400")}
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={active ? 0 : 1.75}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.43-.85.243-.174.54-.237.84-.174l3.843.893a.75.75 0 0 1 .564.85v8.793a.75.75 0 0 1-.564.85l-3.843.893c-.3.063-.597 0-.84-.174a.937.937 0 0 1-.43-.85V6.087Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 8.25H5.25A2.25 2.25 0 0 0 3 10.5v3a2.25 2.25 0 0 0 2.25 2.25H9.75M9.75 8.25v7.5"
          />
        </svg>
      ),
    },
    {
      href: profileHref,
      label: "Profilo",
      match: (path) =>
        path.startsWith("/login") ||
        path.startsWith("/dashboard") ||
        path.startsWith("/club") ||
        path.startsWith("/admin"),
      icon: (active) => (
        <svg
          className={cn("size-6", active ? "text-emerald-600" : "text-zinc-400")}
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={active ? 0 : 1.75}
          stroke="currentColor"
          aria-hidden
        >
          {active ? (
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          )}
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] sm:hidden"
      aria-label="Navigazione principale"
    >
      <div className="mx-auto flex h-[60px] max-w-lg items-stretch justify-around px-2">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5"
              aria-current={active ? "page" : undefined}
            >
              {item.icon(active)}
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-emerald-600" : "text-zinc-400",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
