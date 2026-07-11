"use client";

import { createBookingAction, fetchSlotsAction } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import type { ClubCourt } from "@/lib/data/clubs";
import { sportLabels } from "@/lib/sport";
import { useActionState, useEffect, useState, useTransition } from "react";

interface BookingFormProps {
  courts: ClubCourt[];
  clubSlug: string;
  defaultCourtId?: string;
  defaultDate?: string;
  defaultStartAt?: string;
}

interface SlotOption {
  startAt: string;
  endAt: string;
  label: string;
}

export function BookingForm({
  courts,
  clubSlug,
  defaultCourtId,
  defaultDate,
  defaultStartAt,
}: BookingFormProps) {
  const [state, formAction, pending] = useActionState(createBookingAction, null);
  const [isLoadingSlots, startTransition] = useTransition();
  const [courtId, setCourtId] = useState(defaultCourtId ?? courts[0]?.id ?? "");
  const [date, setDate] = useState(defaultDate ?? (() => new Date().toISOString().slice(0, 10)));
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState(defaultStartAt ?? "");

  useEffect(() => {
    if (!courtId || !date) return;

    startTransition(async () => {
      const available = await fetchSlotsAction(courtId, date);
      setSlots(available);
      if (defaultStartAt && courtId === defaultCourtId && date === defaultDate) {
        const stillAvailable = available.some((slot) => slot.startAt === defaultStartAt);
        setSelectedSlot(stillAvailable ? defaultStartAt : "");
      } else {
        setSelectedSlot("");
      }
    });
  }, [courtId, date, defaultCourtId, defaultDate, defaultStartAt]);

  const selectedCourt = courts.find((court) => court.id === courtId);

  return (
    <div className="space-y-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="court" className="block text-sm font-medium text-zinc-700">
            Campo
          </label>
          <select
            id="court"
            value={courtId}
            onChange={(event) => setCourtId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name} — {sportLabels[court.sport]} (€{court.pricePerHour}/h)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-zinc-700">
            Data
          </label>
          <input
            id="date"
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-700">Orari disponibili</p>
        {isLoadingSlots ? (
          <p className="mt-2 text-sm text-zinc-500">Caricamento slot...</p>
        ) : slots.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Nessuno slot libero per questa data.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.startAt}
                type="button"
                onClick={() => setSelectedSlot(slot.startAt)}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  selectedSlot === slot.startAt
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-zinc-300 text-zinc-700 hover:border-emerald-400"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <form action={formAction}>
        <input type="hidden" name="courtId" value={courtId} />
        <input type="hidden" name="startAt" value={selectedSlot} />

        {selectedCourt && selectedSlot && (
          <p className="mb-4 text-sm text-zinc-600">
            Confermi {selectedCourt.name} alle{" "}
            {new Date(selectedSlot).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            ?
          </p>
        )}

        <Button type="submit" disabled={pending || !selectedSlot} className="w-full">
          {pending ? "Prenotazione..." : "Conferma prenotazione"}
        </Button>
      </form>

      <p className="text-xs text-zinc-500">
        Circolo: {clubSlug} · Durata slot: {selectedCourt?.slotMinutes ?? 60} min
      </p>
    </div>
  );
}
