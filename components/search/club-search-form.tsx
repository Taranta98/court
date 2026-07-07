"use client";

import { buildCircoliSearchUrl } from "@/lib/search/filter-clubs";
import type { SportSlug } from "@/lib/sport";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const CLUB_SEARCH_INPUT_ID = "club-search-input";

interface ClubSearchFormProps {
  defaultQuery?: string;
  sport?: SportSlug;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  /** Aggiorna l'URL mentre si digita (solo su /circoli) */
  live?: boolean;
}

export function ClubSearchForm({
  defaultQuery = "",
  sport,
  autoFocus = false,
  placeholder = "Cerca circolo, città o sport...",
  className,
  live = false,
}: ClubSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(defaultQuery);
  const skipLiveRef = useRef(true);

  useEffect(() => {
    setQuery(defaultQuery);
    skipLiveRef.current = true;
  }, [defaultQuery]);

  useEffect(() => {
    if (!live || pathname !== "/circoli") return;

    if (skipLiveRef.current) {
      skipLiveRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      router.replace(buildCircoliSearchUrl({ q: query, sport }), { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, live, pathname, router, sport]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push(buildCircoliSearchUrl({ q: query, sport }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center", className)}
      role="search"
    >
      <label htmlFor={CLUB_SEARCH_INPUT_ID} className="sr-only">
        Cerca circoli
      </label>
      <svg
        className="pointer-events-none absolute left-3 size-4 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        id={CLUB_SEARCH_INPUT_ID}
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
        className="w-full rounded-xl bg-zinc-100 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/30"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (live && pathname === "/circoli") {
              router.replace(buildCircoliSearchUrl({ sport }), { scroll: false });
            }
          }}
          className="absolute right-3 flex size-6 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
          aria-label="Cancella ricerca"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}

/** Pulsante lente che mette il focus sul campo ricerca visibile */
export function focusClubSearch() {
  document.getElementById(CLUB_SEARCH_INPUT_ID)?.focus();
}
