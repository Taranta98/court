"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MobileNavLink {
  href: string;
  label: string;
  variant?: "default" | "cta";
}

interface MobileNavProps {
  links: MobileNavLink[];
  logoutAction?: () => Promise<void>;
}

export function MobileNav({ links, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex size-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
      >
        {open ? (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
          aria-label="Chiudi menu"
        />
      )}

      <nav
        id="mobile-nav-panel"
        className={cn(
          "fixed inset-x-0 top-16 z-50 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none",
        )}
      >
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                  link.variant === "cta"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "text-zinc-800 hover:bg-zinc-50",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {logoutAction && (
            <li>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex min-h-12 w-full items-center rounded-xl px-4 text-left text-base font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
                >
                  Esci
                </button>
              </form>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
