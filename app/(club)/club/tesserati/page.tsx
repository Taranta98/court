import { ClubMembersSection } from "@/components/club/club-members-section";
import { PageHeader } from "@/components/ui/page-header";
import { getBasicClubForSession } from "@/lib/club/access";
import { getClubMembers, getMemberReminderSummary } from "@/lib/club/members";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tesserati",
};

export default async function ClubMembersPage() {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return <p>Nessun circolo associato.</p>;
  }

  const members = await getClubMembers(club.id);
  const summary = getMemberReminderSummary(members);

  return (
    <section>
      <PageHeader
        title="Tesserati"
        description={`Gestisci iscritti, certificati medici e scadenze di ${club.name}.`}
      />

      <ClubMembersSection members={members} summary={summary} />
    </section>
  );
}
