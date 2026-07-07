/**
 * 404 personalizzata per /circoli/[slug]
 *
 * Next.js la mostra quando la page chiama notFound().
 * Vive nella stessa cartella della dynamic route.
 */

import { ButtonLink } from "@/components/ui/button-link";
import Link from "next/link";

export default function ClubNotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-zinc-900">Circolo non trovato</h1>
      <p className="mt-4 text-zinc-600">
        Lo slug nell&apos;URL non corrisponde a nessun impianto sulla piattaforma.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/circoli">Vedi tutti i circoli</ButtonLink>
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-emerald-700">
          Torna alla home
        </Link>
      </div>
    </section>
  );
}
