import Link from "next/link";

interface FeedPostActionsProps {
  likes: number;
  comments: number;
  ctaHref: string;
  ctaLabel: string;
}

export function FeedPostActions({ likes, comments, ctaHref, ctaLabel }: FeedPostActionsProps) {
  return (
    <div className="px-3 pb-3">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <button type="button" className="text-zinc-900" aria-label="Mi piace">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
          <button type="button" className="text-zinc-900" aria-label="Commenta">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.488.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.813.22 1.668.337 2.555.337Z"
              />
            </svg>
          </button>
          <button type="button" className="text-zinc-900" aria-label="Condividi">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <button type="button" className="text-zinc-900" aria-label="Salva">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </button>
      </div>

      <p className="text-sm font-semibold text-zinc-900">{likes} mi piace</p>

      {comments > 0 && (
        <button type="button" className="mt-1 text-sm text-zinc-500">
          Visualizza tutti i {comments} commenti
        </button>
      )}

      <Link
        href={ctaHref}
        className="mt-3 flex w-full items-center justify-center rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-white active:bg-zinc-700"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
