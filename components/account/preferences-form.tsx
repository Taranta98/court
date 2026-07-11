"use client";

import { updatePreferencesAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { sportLabels, type SportSlug } from "@/lib/sport";
import { useActionState } from "react";

const sportOptions = Object.entries(sportLabels) as [SportSlug, string][];

interface PreferencesFormProps {
  defaultPreferredSport: string | null;
  defaultNotifyBookings: boolean;
}

export function PreferencesForm({
  defaultPreferredSport,
  defaultNotifyBookings,
}: PreferencesFormProps) {
  const [state, formAction, pending] = useActionState(updatePreferencesAction, null);

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

      <div>
        <label htmlFor="preferredSport" className="block text-sm font-medium text-zinc-700">
          Sport preferito
        </label>
        <select
          id="preferredSport"
          name="preferredSport"
          defaultValue={defaultPreferredSport ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Nessuna preferenza</option>
          {sportOptions.map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.preferredSport?.[0] && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.preferredSport[0]}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <input
          type="checkbox"
          name="notifyBookings"
          defaultChecked={defaultNotifyBookings}
          className="mt-0.5 size-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span>
          <span className="block text-sm font-medium text-zinc-900">
            Promemoria prenotazioni
          </span>
          <span className="mt-0.5 block text-sm text-zinc-500">
            Ricevi notifiche email per le tue prenotazioni in arrivo.
          </span>
        </span>
      </label>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvataggio..." : "Salva preferenze"}
      </Button>
    </form>
  );
}
