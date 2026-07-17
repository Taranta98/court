"use server";

import { getBasicClubForSession } from "@/lib/club/access";
import { emptyToNull, parseOptionalDate } from "@/lib/club/members";
import { prisma } from "@/lib/db";
import { clubMemberSchema, zodFieldErrors, type ActionState } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function parseMemberForm(formData: FormData) {
  return clubMemberSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    membershipNumber: formData.get("membershipNumber") ?? "",
    status: formData.get("status"),
    medicalCertificateExpiresAt: formData.get("medicalCertificateExpiresAt") ?? "",
    membershipExpiresAt: formData.get("membershipExpiresAt") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function memberDataFromParsed(data: ReturnType<typeof clubMemberSchema.parse>) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: emptyToNull(data.email),
    phone: emptyToNull(data.phone),
    membershipNumber: emptyToNull(data.membershipNumber),
    status: data.status,
    medicalCertificateExpiresAt: parseOptionalDate(data.medicalCertificateExpiresAt),
    membershipExpiresAt: parseOptionalDate(data.membershipExpiresAt),
    notes: emptyToNull(data.notes),
  };
}

function revalidateMembers() {
  revalidatePath("/club/tesserati");
  revalidatePath("/club");
}

export async function createClubMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = parseMemberForm(formData);
  if (!parsed.success) {
    return { error: "Controlla i dati inseriti.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.clubMember.create({
    data: {
      clubId: club.id,
      ...memberDataFromParsed(parsed.data),
    },
  });

  revalidateMembers();
  return { success: "Tesserato aggiunto." };
}

export async function updateClubMemberAction(
  memberId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const parsed = parseMemberForm(formData);
  if (!parsed.success) {
    return { error: "Controlla i dati inseriti.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const existing = await prisma.clubMember.findFirst({
    where: { id: memberId, clubId: club.id },
  });

  if (!existing) {
    return { error: "Tesserato non trovato." };
  }

  await prisma.clubMember.update({
    where: { id: existing.id },
    data: memberDataFromParsed(parsed.data),
  });

  revalidateMembers();
  return { success: "Tesserato aggiornato." };
}

export async function deleteClubMemberAction(memberId: string): Promise<ActionState> {
  const { club } = await getBasicClubForSession();

  if (!club) {
    return { error: "Nessun circolo associato al tuo account." };
  }

  const existing = await prisma.clubMember.findFirst({
    where: { id: memberId, clubId: club.id },
  });

  if (!existing) {
    return { error: "Tesserato non trovato." };
  }

  await prisma.clubMember.delete({ where: { id: existing.id } });

  revalidateMembers();
  return { success: "Tesserato rimosso." };
}
