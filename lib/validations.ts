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

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | null;

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}
