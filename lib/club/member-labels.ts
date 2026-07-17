import { EXPIRY_STATUS, MEMBER_STATUS, type ExpiryStatus, type MemberStatus } from "@/lib/types/db";

export const memberStatusLabels: Record<MemberStatus, string> = {
  [MEMBER_STATUS.ACTIVE]: "Attivo",
  [MEMBER_STATUS.SUSPENDED]: "Sospeso",
  [MEMBER_STATUS.ARCHIVED]: "Archiviato",
};

export function memberStatusStyles(status: MemberStatus) {
  switch (status) {
    case MEMBER_STATUS.ACTIVE:
      return "bg-emerald-50 text-emerald-700";
    case MEMBER_STATUS.SUSPENDED:
      return "bg-amber-50 text-amber-800";
    case MEMBER_STATUS.ARCHIVED:
      return "bg-zinc-100 text-zinc-600";
  }
}

export const expiryStatusLabels: Record<ExpiryStatus, string> = {
  [EXPIRY_STATUS.MISSING]: "Mancante",
  [EXPIRY_STATUS.VALID]: "Valido",
  [EXPIRY_STATUS.EXPIRING]: "In scadenza",
  [EXPIRY_STATUS.EXPIRED]: "Scaduto",
};

export function expiryStatusStyles(status: ExpiryStatus) {
  switch (status) {
    case EXPIRY_STATUS.VALID:
      return "bg-emerald-50 text-emerald-700";
    case EXPIRY_STATUS.EXPIRING:
      return "bg-amber-50 text-amber-800";
    case EXPIRY_STATUS.EXPIRED:
      return "bg-red-50 text-red-700";
    case EXPIRY_STATUS.MISSING:
      return "bg-zinc-100 text-zinc-600";
  }
}

export function formatMemberDate(value: string | null) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
