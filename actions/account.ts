"use server";

import { requireSession } from "@/actions/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import type { Role } from "@/lib/types/db";
import {
  updateAccountSchema,
  updatePasswordSchema,
  updatePreferencesSchema,
  zodFieldErrors,
  type ActionState,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function refreshSession(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    clubId: user.clubId,
  });
}

export async function updateAccountAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = updateAccountSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing && existing.id !== session.userId) {
    return { fieldErrors: { email: ["Esiste già un account con questa email."] } };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: parsed.data.name,
      email,
    },
  });

  await refreshSession(session.userId);
  revalidatePath("/dashboard/profilo");

  return { success: "Profilo aggiornato con successo." };
}

export async function updatePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { error: "Utente non trovato." };
  }

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { fieldErrors: { currentPassword: ["Password attuale non corretta."] } };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
    },
  });

  revalidatePath("/dashboard/profilo");

  return { success: "Password aggiornata con successo." };
}

export async function updatePreferencesAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = updatePreferencesSchema.safeParse({
    preferredSport: formData.get("preferredSport") ?? "",
    notifyBookings: formData.get("notifyBookings") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      preferredSport: parsed.data.preferredSport || null,
      notifyBookings: parsed.data.notifyBookings,
    },
  });

  revalidatePath("/dashboard/profilo");

  return { success: "Preferenze salvate." };
}
