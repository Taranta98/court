"use client";

import { updateCourtAvailabilityAction } from "@/actions/club";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/lib/club/days";
import { useActionState } from "react";

interface AvailabilityRule {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

interface CourtAvailability {
  id: string;
  name: string;
  availability: AvailabilityRule[];
}

interface AvailabilitySectionProps {
  courts: CourtAvailability[];
}

function AvailabilityForm({ court }: { court: CourtAvailability }) {
  const [state, formAction, pending] = useActionState(updateCourtAvailabilityAction, null);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <input type="hidden" name="courtId" value={court.id} />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      )}

      <div className="space-y-3">
        {WEEKDAYS.map((day) => {
          const rule = court.availability.find((item) => item.dayOfWeek === day.value);
          const enabled = Boolean(rule);

          return (
            <div
              key={day.value}
              className="grid gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 sm:grid-cols-[120px_1fr_1fr_1fr] sm:items-center"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                <input
                  type="checkbox"
                  name={`day-${day.value}-enabled`}
                  defaultChecked={enabled}
                  className="size-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                {day.label}
              </label>

              <div>
                <label className="text-xs text-zinc-500 sm:hidden">Apertura</label>
                <input
                  type="time"
                  name={`day-${day.value}-open`}
                  defaultValue={rule?.openTime ?? "08:00"}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 sm:hidden">Chiusura</label>
                <input
                  type="time"
                  name={`day-${day.value}-close`}
                  defaultValue={rule?.closeTime ?? "22:00"}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {state?.fieldErrors?.[`day-${day.value}-close`]?.[0] && (
                  <p className="mt-1 text-xs text-red-600">
                    {state.fieldErrors[`day-${day.value}-close`][0]}
                  </p>
                )}
              </div>

              <p className="text-xs text-zinc-500 sm:text-right">
                {enabled ? "Prenotabile" : "Chiuso"}
              </p>
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Salvataggio..." : `Salva orari — ${court.name}`}
      </Button>
    </form>
  );
}

export function AvailabilitySection({ courts }: AvailabilitySectionProps) {
  if (courts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
        Aggiungi almeno un campo per configurare gli orari di disponibilità.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">
        Imposta per ogni campo i giorni e le fasce orarie in cui è possibile prenotare.
        Deseleziona un giorno per segnarlo come chiuso.
      </p>

      {courts.map((court) => (
        <div key={court.id}>
          <h3 className="mb-3 font-semibold text-zinc-900">{court.name}</h3>
          <AvailabilityForm court={court} />
        </div>
      ))}
    </div>
  );
}
