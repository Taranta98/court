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

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | null;

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}
