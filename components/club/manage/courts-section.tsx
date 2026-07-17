"use client";

import { createCourtAction, deleteCourtAction, updateCourtAction } from "@/actions/club";
import { SportBadge } from "@/components/club/sport-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fromDbSport, sportLabels, toDbSport, type SportSlug } from "@/lib/sport";
import { DB_SPORTS } from "@/lib/types/db";
import { useActionState, useState, useTransition } from "react";

interface CourtItem {
  id: string;
  name: string;
  sport: string;
  surface: string;
  pricePerHour: number;
  slotMinutes: number;
  bookingCount: number;
}

interface CourtsSectionProps {
  courts: CourtItem[];
}

const sportOptions = (Object.keys(sportLabels) as SportSlug[]).map((slug) => ({
  label: sportLabels[slug],
  value: toDbSport(slug),
}));

const slotOptions = [
  { label: "30 min", value: 30 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
  { label: "120 min", value: 120 },
];

function CourtForm({
  court,
  onCancel,
}: {
  court?: CourtItem;
  onCancel?: () => void;
}) {
  const action = court
    ? updateCourtAction.bind(null, court.id)
    : createCourtAction;

  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h4 className="font-medium text-zinc-900">
        {court ? "Modifica campo" : "Nuovo campo"}
      </h4>

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
        defaultValue={court?.name}
        error={state?.fieldErrors?.name?.[0]}
      />

      <div>
        <label htmlFor="sport" className="block text-sm font-medium text-zinc-700">
          Sport
        </label>
        <select
          id="sport"
          name="sport"
          defaultValue={court?.sport ?? DB_SPORTS.TENNIS}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          {sportOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.sport?.[0] && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.sport[0]}</p>
        )}
      </div>

      <Input
        label="Superficie"
        name="surface"
        defaultValue={court?.surface}
        error={state?.fieldErrors?.surface?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Prezzo orario (€)"
          name="pricePerHour"
          type="number"
          min={1}
          defaultValue={court?.pricePerHour ?? 25}
          error={state?.fieldErrors?.pricePerHour?.[0]}
        />

        <div>
          <label htmlFor="slotMinutes" className="block text-sm font-medium text-zinc-700">
            Durata slot
          </label>
          <select
            id="slotMinutes"
            name="slotMinutes"
            defaultValue={court?.slotMinutes ?? 60}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {slotOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {state?.fieldErrors?.slotMinutes?.[0] && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.slotMinutes[0]}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvataggio..." : court ? "Aggiorna campo" : "Aggiungi campo"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        )}
      </div>
    </form>
  );
}

export function CourtsSection({ courts }: CourtsSectionProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDelete(courtId: string) {
    if (!confirm("Eliminare questo campo?")) return;

    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteCourtAction(courtId);
      if (result?.error) {
        setDeleteError(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      {deleteError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</p>
      )}

      <ul className="space-y-3">
        {courts.map((court) =>
          editingId === court.id ? (
            <li key={court.id}>
              <CourtForm court={court} onCancel={() => setEditingId(null)} />
            </li>
          ) : (
            <li
              key={court.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-zinc-900">{court.name}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {court.surface} · €{court.pricePerHour}/h · slot {court.slotMinutes} min
                </p>
                <div className="mt-2">
                  <SportBadge sport={fromDbSport(court.sport)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowNewForm(false);
                    setEditingId(court.id);
                  }}
                >
                  Modifica
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => handleDelete(court.id)}
                >
                  Elimina
                </Button>
              </div>
            </li>
          ),
        )}
      </ul>

      {courts.length === 0 && !showNewForm && (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
          Nessun campo configurato. Aggiungi il primo campo per iniziare.
        </p>
      )}

      {showNewForm ? (
        <CourtForm onCancel={() => setShowNewForm(false)} />
      ) : (
        <Button type="button" variant="outline" onClick={() => setShowNewForm(true)}>
          + Aggiungi campo
        </Button>
      )}
    </div>
  );
}
