import Link from "next/link";

export function FeedSearch() {
  return (
    <div className="border-b border-zinc-200 bg-white px-4 py-3">
      <Link
        href="/circoli"
        className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500"
      >
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        Cerca circoli, sport, partite...
      </Link>
    </div>
  );
}
