import { ClubDetail } from "@/components/club/club-detail";
import {
  getAllClubSlugsFromDb,
  getClubBySlugFromDb,
} from "@/lib/data/clubs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ClubPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getAllClubSlugsFromDb();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlugFromDb(slug);

  if (!club) {
    return { title: "Circolo non trovato" };
  }

  return {
    title: club.name,
    description: club.description,
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = await getClubBySlugFromDb(slug);

  if (!club) {
    notFound();
  }

  return (
    <section className="px-4 py-4 sm:px-0 sm:py-6 lg:py-8">
      <ClubDetail club={club} />
    </section>
  );
}
