"use server";

import { clearSessionCookie } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
