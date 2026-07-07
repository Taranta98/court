import { FeedPostActions } from "@/components/home/feed-post-actions";
import { Avatar } from "@/components/ui/avatar";
import type { ClubDTO } from "@/lib/data/clubs";
import { sportLabels } from "@/lib/sport";
import Image from "next/image";
import Link from "next/link";

interface ClubFeedPostProps {
  club: ClubDTO;
  priority?: boolean;
  likes?: number;
  hoursAgo?: number;
}

function clubInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ClubFeedPost({ club, priority = false, likes = 24, hoursAgo = 6 }: ClubFeedPostProps) {
  const sportsLabel = club.sports.map((s) => sportLabels[s]).join(" · ");

  return (
    <article className="border-b border-zinc-200 bg-white">
      <header className="flex items-center justify-between px-3 py-2.5">
        <Link href={`/circoli/${club.slug}`} className="flex min-w-0 items-center gap-2.5">
          <Avatar initials={clubInitials(club.name)} gradient="from-emerald-500 to-teal-600" size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{club.name}</p>
            <p className="truncate text-xs text-zinc-500">{club.city}</p>
          </div>
        </Link>
        <button type="button" className="px-2 text-zinc-800" aria-label="Altre opzioni">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <circle cx="5" cy="12" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="19" cy="12" r="1.75" />
          </svg>
        </button>
      </header>

      <Link href={`/circoli/${club.slug}`} className="relative block aspect-square w-full bg-zinc-100">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 470px"
        />
      </Link>

      <FeedPostActions
        likes={likes}
        comments={3}
        ctaHref={`/circoli/${club.slug}/prenota`}
        ctaLabel="Prenota un campo"
      />

      <div className="space-y-1 px-3 pb-3">
        <p className="text-sm leading-snug text-zinc-900">
          <Link href={`/circoli/${club.slug}`} className="font-semibold">
            {club.name}
          </Link>{" "}
          <span className="text-zinc-800">{club.description}</span>
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{sportsLabel}</p>
        <p className="text-[10px] uppercase tracking-wide text-zinc-400">{hoursAgo} ORE FA</p>
      </div>
    </article>
  );
}
