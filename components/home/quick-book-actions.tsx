import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuickBookActionsProps {
  className?: string;
}

const actions = [
  {
    href: "/circoli",
    label: "Campo privato",
    description: "Prenota tutto il campo",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    href: "/#partite",
    label: "Partita aperta",
    description: "Gioca con altri",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
  {
    href: "/circoli",
    label: "Esplora circoli",
    description: "Mappa e lista",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
];

export function QuickBookActions({ className }: QuickBookActionsProps) {
  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white px-2 py-3 text-center shadow-sm active:bg-zinc-50"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              {action.icon}
            </div>
            <p className="mt-2 text-xs font-semibold leading-tight text-zinc-900">{action.label}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-zinc-400">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
