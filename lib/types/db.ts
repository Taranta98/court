export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  CLUB_OWNER: "CLUB_OWNER",
  CLUB_STAFF: "CLUB_STAFF",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
  PAID: "PAID",
  UNPAID: "UNPAID",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const DB_SPORTS = {
  TENNIS: "TENNIS",
  PADEL: "PADEL",
  CALCETTO: "CALCETTO",
  CALCIOTTO: "CALCIOTTO",
  PALLAVOLO: "PALLAVOLO",
  BEACH_VOLLEY: "BEACH_VOLLEY",
  BEACH_TENNIS: "BEACH_TENNIS",
} as const;

export type DbSport = (typeof DB_SPORTS)[keyof typeof DB_SPORTS];

export const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
} as const;

export type MemberStatus = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

export const EXPIRY_STATUS = {
  MISSING: "MISSING",
  VALID: "VALID",
  EXPIRING: "EXPIRING",
  EXPIRED: "EXPIRED",
} as const;

export type ExpiryStatus = (typeof EXPIRY_STATUS)[keyof typeof EXPIRY_STATUS];
