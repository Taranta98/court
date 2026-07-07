import { BookingForm } from "@/components/booking/booking-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireSession } from "@/actions/auth";
import { getClubBySlugFromDb } from "@/lib/data/clubs";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PrenotaPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ courtId?: string; date?: string; startAt?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PrenotaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlugFromDb(slug);

  if (!club) {
    return { title: "Circolo non trovato" };
  }

  return {
    title: `Prenota — ${club.name}`,
    description: `Prenota un campo presso ${club.name}.`,
  };
}

export default async function PrenotaPage({ params, searchParams }: PrenotaPageProps) {
  await requireSession();

  const { slug } = await params;
  const { courtId, date, startAt } = await searchParams;
  const club = await getClubBySlugFromDb(slug);

  if (!club) {
    notFound();
  }

  const validCourtId =
    courtId && club.courts.some((court) => court.id === courtId) ? courtId : undefined;

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-0 sm:py-10 lg:max-w-4xl">
      <Link
        href={`/circoli/${club.slug}`}
        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-emerald-700"
      >
        ← Torna a {club.name}
      </Link>

      <div className="mt-6">
        <PageHeader
          title="Prenota un campo"
          description={`Scegli data, orario e campo presso ${club.name}.`}
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <BookingForm
          courts={club.courts}
          clubSlug={club.slug}
          defaultCourtId={validCourtId}
          defaultDate={date}
          defaultStartAt={startAt}
        />
      </div>
    </section>
  );
}
