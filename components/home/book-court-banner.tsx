import Link from "next/link";

interface BookCourtBannerProps {
  href?: string;
}

export function BookCourtBanner({ href = "/circoli" }: BookCourtBannerProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-lg shadow-slate-900/20 transition-transform active:scale-[0.99] sm:p-6 lg:flex lg:min-h-[220px] lg:flex-col lg:justify-between"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-emerald-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 right-8 size-24 rounded-full bg-emerald-400/10 blur-xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Prenota ora</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight">Prenota un campo</h2>
          <p className="mt-2 text-sm text-slate-300">Scegli sport, circolo e orario in pochi tap</p>
        </div>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
          <svg className="size-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 text-sm font-medium text-emerald-300">
        <span>Inizia la prenotazione</span>
        <svg className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
