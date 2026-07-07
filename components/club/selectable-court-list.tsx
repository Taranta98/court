"use client";

import { fetchSlotsAction } from "@/actions/booking";
import { SportBadge } from "@/components/club/sport-badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { ClubCourt } from "@/lib/data/clubs";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";

interface SlotOption {
  startAt: string;
  endAt: string;
  label: string;
}

interface SelectableCourtListProps {
  courts: ClubCourt[];
  clubSlug: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatSlotRange(startAt: string, endAt: string) {
  const start = new Date(startAt).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(endAt).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

function formatDateLabel(dateISO: string) {
  return new Date(`${dateISO}T12:00:00`).toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function SelectableCourtList({ courts, clubSlug }: SelectableCourtListProps) {
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [date, setDate] = useState(todayISO);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [isLoadingSlots, startTransition] = useTransition();

  const selectedCourt = courts.find((court) => court.id === selectedCourtId);

  useEffect(() => {
    if (!selectedCourtId || !date) {
      setSlots([]);
      return;
    }

    startTransition(async () => {
      const available = await fetchSlotsAction(selectedCourtId, date);
      setSlots(available);
      setSelectedSlot(null);
    });
  }, [selectedCourtId, date]);

  function handleCourtClick(courtId: string) {
    if (selectedCourtId === courtId) {
      setSelectedCourtId(null);
      setSelectedSlot(null);
      setSlots([]);
      return;
    }

    setSelectedCourtId(courtId);
    setSelectedSlot(null);
  }

  function handleSlotClick(startAt: string) {
    setSelectedSlot((current) => (current === startAt ? null : startAt));
  }

  const prenotaHref =
    selectedCourtId && selectedSlot
      ? `/circoli/${clubSlug}/prenota?courtId=${selectedCourtId}&date=${date}&startAt=${encodeURIComponent(selectedSlot)}`
      : `/circoli/${clubSlug}/prenota`;

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {courts.map((court) => {
          const isSelected = selectedCourtId === court.id;

          return (
            <li
              key={court.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white transition-shadow",
                isSelected
                  ? "border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500"
                  : "border-zinc-200 shadow-sm",
              )}
            >
              <button
                type="button"
                onClick={() => handleCourtClick(court.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left active:bg-zinc-50"
                aria-expanded={isSelected}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-900">{court.name}</p>
                    {isSelected && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        Selezionato
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{court.surface}</p>
                  <div className="mt-2">
                    <SportBadge sport={court.sport} />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="text-sm font-bold text-emerald-700">€{court.pricePerHour}/h</p>
                  <p className="text-xs text-zinc-400">{court.slotMinutes} min</p>
                  <svg
                    className={cn(
                      "size-5 text-zinc-400 transition-transform",
                      isSelected && "rotate-180 text-emerald-600",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {isSelected && (
                <div className="border-t border-emerald-100 bg-emerald-50/40 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor={`court-date-${court.id}`} className="text-sm font-medium text-zinc-700">
                      Data
                    </label>
                    <input
                      id={`court-date-${court.id}`}
                      type="date"
                      value={date}
                      min={todayISO()}
                      onChange={(event) => setDate(event.target.value)}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900"
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Orari disponibili · {formatDateLabel(date)}
                  </p>

                  {isLoadingSlots ? (
                    <p className="mt-3 text-sm text-zinc-500">Caricamento orari...</p>
                  ) : slots.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-500">
                      Nessuna fascia libera per questa data. Prova un altro giorno.
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {slots.map((slot) => {
                        const isSlotSelected = selectedSlot === slot.startAt;
                        return (
                          <button
                            key={slot.startAt}
                            type="button"
                            onClick={() => handleSlotClick(slot.startAt)}
                            className={cn(
                              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                              isSlotSelected
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-zinc-200 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50",
                            )}
                            aria-pressed={isSlotSelected}
                          >
                            {formatSlotRange(slot.startAt, slot.endAt)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {selectedCourt && selectedSlot && (
        <div className="sticky bottom-[calc(60px+env(safe-area-inset-bottom))] rounded-2xl border border-emerald-200 bg-white p-4 shadow-lg sm:static sm:shadow-sm">
          <p className="text-sm text-zinc-600">La tua selezione</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {selectedCourt.name} · {formatDateLabel(date)} ·{" "}
            {formatSlotRange(selectedSlot, new Date(new Date(selectedSlot).getTime() + selectedCourt.slotMinutes * 60_000).toISOString())}
          </p>
          <ButtonLink href={prenotaHref} className="mt-3 w-full" size="lg">
            Continua prenotazione
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
