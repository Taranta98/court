import { FeedPostActions } from "@/components/home/feed-post-actions";
import { Avatar } from "@/components/ui/avatar";
import type { MatchFeedPost } from "@/lib/data/feed-mock";
import { sportLabels } from "@/lib/sport";

interface MatchFeedPostCardProps {
  post: MatchFeedPost;
}

const sportGradients: Record<string, string> = {
  tennis: "from-lime-500 to-green-700",
  padel: "from-blue-500 to-indigo-700",
  calcetto: "from-orange-500 to-red-600",
  calciotto: "from-amber-500 to-orange-700",
  pallavolo: "from-violet-500 to-purple-700",
  beach_volley: "from-yellow-400 to-amber-600",
  beach_tennis: "from-cyan-400 to-blue-600",
};

export function MatchFeedPostCard({ post }: MatchFeedPostCardProps) {
  const gradient = sportGradients[post.sport] ?? "from-zinc-500 to-zinc-700";

  return (
    <article className="border-b border-zinc-200 bg-white">
      <header className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar initials={post.initials} gradient={post.avatarColor} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{post.author}</p>
            <p className="truncate text-xs text-zinc-500">
              {post.location} · {post.schedule}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-600">
          Aperta
        </span>
      </header>

      <div className={`relative flex aspect-square w-full flex-col justify-end bg-linear-to-br ${gradient} p-5`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
            {sportLabels[post.sport]}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{post.schedule}</p>
          <p className="mt-1 text-sm text-white/90">
            {post.spotsLeft} {post.spotsLeft === 1 ? "posto libero" : "posti liberi"} · {post.location}
          </p>
        </div>
      </div>

      <FeedPostActions
        likes={post.likes}
        comments={post.comments}
        ctaHref="/registrazione"
        ctaLabel="Unisciti alla partita"
      />

      <div className="space-y-1 px-3 pb-3">
        <p className="text-sm leading-snug text-zinc-900">
          <span className="font-semibold">{post.author}</span>{" "}
          <span className="text-zinc-800">{post.caption}</span>
        </p>
        <p className="text-[10px] uppercase tracking-wide text-zinc-400">{post.hoursAgo} ORE FA</p>
      </div>
    </article>
  );
}
