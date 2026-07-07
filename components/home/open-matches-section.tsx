import type { MatchFeedPost } from "@/lib/data/feed-mock";
import { sportLabels } from "@/lib/sport";
import Link from "next/link";

interface OpenMatchCardProps {
  match: MatchFeedPost;
}

export function OpenMatchCard({ match }: OpenMatchCardProps) {
  return (
    <Link
      href="/registrazione"
      className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm active:bg-zinc-50"
    >
      <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-center">
        <span className="text-[10px] font-bold uppercase text-emerald-700">
          {match.spotsLeft}
        </span>
        <span className="text-[9px] text-emerald-600">posti</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
            {sportLabels[match.sport]}
          </span>
          <span className="truncate text-xs text-zinc-400">{match.location}</span>
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-zinc-900">{match.schedule}</p>
        <p className="truncate text-xs text-zinc-500">
          {match.author} · {match.caption}
        </p>
      </div>

      <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}

interface OpenMatchesSectionProps {
  matches: MatchFeedPost[];
  id?: string;
}

export function OpenMatchesSection({ matches, id }: OpenMatchesSectionProps) {
  if (matches.length === 0) return null;

  return (
    <section id={id}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Partite aperte</h2>
          <p className="text-sm text-zinc-500">Unisciti a chi cerca giocatori</p>
        </div>
        <Link href="/registrazione" className="text-sm font-semibold text-emerald-600">
          Crea partita
        </Link>
      </div>
      <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3">
        {matches.map((match) => (
          <OpenMatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
