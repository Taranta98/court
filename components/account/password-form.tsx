"use client";

import { updatePasswordAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useRef } from "react";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      )}

      <Input
        label="Password attuale"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        error={state?.fieldErrors?.currentPassword?.[0]}
      />

      <Input
        label="Nuova password"
        name="newPassword"
        type="password"
        placeholder="Min. 8 caratteri, lettere e numeri"
        autoComplete="new-password"
        error={state?.fieldErrors?.newPassword?.[0]}
      />

      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Aggiornamento..." : "Cambia password"}
      </Button>
    </form>
  );
}
