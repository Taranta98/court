import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Inserisci un'email valida."),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri."),
  email: z.string().email("Inserisci un'email valida."),
  password: z
    .string()
    .min(8, "La password deve avere almeno 8 caratteri.")
    .regex(/[A-Za-z]/, "La password deve contenere almeno una lettera.")
    .regex(/[0-9]/, "La password deve contenere almeno un numero."),
});

export const bookingSchema = z.object({
  courtId: z.string().min(1, "Seleziona un campo."),
  startAt: z.string().datetime("Orario non valido."),
});

export const updateAccountSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri."),
  email: z.string().email("Inserisci un'email valida."),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Inserisci la password attuale."),
  newPassword: z
    .string()
    .min(8, "La password deve avere almeno 8 caratteri.")
    .regex(/[A-Za-z]/, "La password deve contenere almeno una lettera.")
    .regex(/[0-9]/, "La password deve contenere almeno un numero."),
});

const sportSlugs = [
  "tennis",
  "padel",
  "calcetto",
  "calciotto",
  "pallavolo",
  "beach_volley",
  "beach_tennis",
] as const;

export const updatePreferencesSchema = z.object({
  preferredSport: z.enum(sportSlugs).or(z.literal("")),
  notifyBookings: z.boolean(),
});

const imageUrlSchema = z.string().url("Inserisci un URL valido per l'immagine.");

export const updateClubProfileSchema = z.object({
  description: z.string().min(10, "La descrizione deve avere almeno 10 caratteri."),
  openingHours: z.string().min(3, "Inserisci gli orari di apertura."),
  imageUrl: imageUrlSchema,
});

export const addClubPhotoSchema = z.object({
  url: imageUrlSchema,
});

const dbSportValues = [
  "TENNIS",
  "PADEL",
  "CALCETTO",
  "CALCIOTTO",
  "PALLAVOLO",
  "BEACH_VOLLEY",
  "BEACH_TENNIS",
] as const;

export const courtSchema = z.object({
  name: z.string().min(1, "Inserisci il nome del campo."),
  sport: z.enum(dbSportValues),
  surface: z.string().min(1, "Inserisci la superficie."),
  pricePerHour: z.coerce.number().int().min(1, "Il prezzo deve essere almeno 1 €."),
  slotMinutes: z.coerce
    .number()
    .int()
    .refine((value) => [30, 60, 90, 120].includes(value), {
      message: "Durata slot non valida.",
    }),
});

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Formato orario: HH:mm");

export const availabilityDaySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  enabled: z.boolean(),
  openTime: timeSchema,
  closeTime: timeSchema,
});

export const updateAvailabilitySchema = z.object({
  courtId: z.string().min(1),
  days: z.array(availabilityDaySchema).length(7),
});

export const updateClubBookingSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  paymentStatus: z.enum(["PAID", "UNPAID"]),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | null;

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}
