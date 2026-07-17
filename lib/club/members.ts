import { prisma } from "@/lib/db";
import {
  EXPIRY_STATUS,
  MEMBER_STATUS,
  type ExpiryStatus,
  type MemberStatus,
} from "@/lib/types/db";

/** Giorni entro cui una scadenza viene segnalata come in scadenza. */
export const EXPIRY_WARNING_DAYS = 30;

export interface ClubMemberDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  membershipNumber: string | null;
  status: MemberStatus;
  medicalCertificateExpiresAt: string | null;
  membershipExpiresAt: string | null;
  notes: string | null;
  medicalExpiryStatus: ExpiryStatus;
  membershipExpiryStatus: ExpiryStatus;
}

export interface MemberReminderSummary {
  total: number;
  medicalExpired: number;
  medicalExpiring: number;
  medicalMissing: number;
  membershipExpired: number;
  membershipExpiring: number;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getExpiryStatus(expiresAt: Date | null | undefined): ExpiryStatus {
  if (!expiresAt) {
    return EXPIRY_STATUS.MISSING;
  }

  const today = startOfToday();
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return EXPIRY_STATUS.EXPIRED;
  }

  if (expiry <= addDays(today, EXPIRY_WARNING_DAYS)) {
    return EXPIRY_STATUS.EXPIRING;
  }

  return EXPIRY_STATUS.VALID;
}

function toDateString(value: Date | null) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

function mapMember(
  member: Awaited<ReturnType<typeof prisma.clubMember.findMany>>[number],
): ClubMemberDTO {
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    membershipNumber: member.membershipNumber,
    status: member.status as MemberStatus,
    medicalCertificateExpiresAt: toDateString(member.medicalCertificateExpiresAt),
    membershipExpiresAt: toDateString(member.membershipExpiresAt),
    notes: member.notes,
    medicalExpiryStatus: getExpiryStatus(member.medicalCertificateExpiresAt),
    membershipExpiryStatus: getExpiryStatus(member.membershipExpiresAt),
  };
}

export async function getClubMembers(clubId: string) {
  const members = await prisma.clubMember.findMany({
    where: { clubId },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return members.map(mapMember);
}

export function getMemberReminderSummary(members: ClubMemberDTO[]): MemberReminderSummary {
  const active = members.filter((member) => member.status === MEMBER_STATUS.ACTIVE);

  return {
    total: members.length,
    medicalExpired: active.filter((m) => m.medicalExpiryStatus === EXPIRY_STATUS.EXPIRED).length,
    medicalExpiring: active.filter((m) => m.medicalExpiryStatus === EXPIRY_STATUS.EXPIRING).length,
    medicalMissing: active.filter((m) => m.medicalExpiryStatus === EXPIRY_STATUS.MISSING).length,
    membershipExpired: active.filter((m) => m.membershipExpiryStatus === EXPIRY_STATUS.EXPIRED)
      .length,
    membershipExpiring: active.filter((m) => m.membershipExpiryStatus === EXPIRY_STATUS.EXPIRING)
      .length,
  };
}

export function parseOptionalDate(value: string | undefined) {
  if (!value) return null;
  return new Date(`${value}T00:00:00.000Z`);
}

export function emptyToNull(value: string | undefined) {
  if (!value || value.trim() === "") return null;
  return value.trim();
}
