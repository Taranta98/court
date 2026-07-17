"use client";

import { logoutAction } from "@/actions/logout";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ClubAccountMenuProps {
  clubName: string;
}

export function ClubAccountMenu({ clubName }: ClubAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex max-w-40 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 sm:max-w-56",
          open && "bg-zinc-50",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="truncate">{clubName}</span>
        <svg
          className={cn("size-4 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Esci
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
