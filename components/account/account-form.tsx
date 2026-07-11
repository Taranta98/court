"use client";

import { updateAccountAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

interface AccountFormProps {
  defaultName: string;
  defaultEmail: string;
}

export function AccountForm({ defaultName, defaultEmail }: AccountFormProps) {
  const [state, formAction, pending] = useActionState(updateAccountAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      )}

      <Input
        label="Nome"
        name="name"
        type="text"
        defaultValue={defaultName}
        autoComplete="name"
        error={state?.fieldErrors?.name?.[0]}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={defaultEmail}
        autoComplete="email"
        error={state?.fieldErrors?.email?.[0]}
      />

      <Button type="submit" disabled={pending}>
        {pending ? "Salvataggio..." : "Salva modifiche"}
      </Button>
    </form>
  );
}
