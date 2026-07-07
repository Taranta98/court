"use client";

import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState } from "react";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Input
        label="Nome"
        name="name"
        type="text"
        placeholder="Mario Rossi"
        autoComplete="name"
        error={state?.fieldErrors?.name?.[0]}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="nome@email.com"
        autoComplete="email"
        error={state?.fieldErrors?.email?.[0]}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min. 8 caratteri, lettere e numeri"
        autoComplete="new-password"
        error={state?.fieldErrors?.password?.[0]}
      />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Registrazione..." : "Crea account"}
      </Button>

      <p className="text-center text-sm text-zinc-600">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Accedi
        </Link>
      </p>
    </form>
  );
}
