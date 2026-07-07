"use client";

import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState } from "react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

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
        placeholder="••••••••"
        autoComplete="current-password"
        error={state?.fieldErrors?.password?.[0]}
      />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Accesso in corso..." : "Accedi"}
      </Button>

      <p className="text-center text-sm text-zinc-600">
        Non hai un account?{" "}
        <Link href="/registrazione" className="font-medium text-emerald-700 hover:underline">
          Registrati
        </Link>
      </p>
    </form>
  );
}
