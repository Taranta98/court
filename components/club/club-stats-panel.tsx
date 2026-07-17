"use client";

import { ClubBarChart } from "@/components/club/club-bar-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  aggregateBookings,
  aggregateRevenue,
  formatEuro,
  getAvailableYears,
  sumValues,
  type BookingStatRow,
  type StatsPeriod,
} from "@/lib/club/stats";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface ClubStatsPanelProps {
  revenueBookings: BookingStatRow[];
  affluenceBookings: BookingStatRow[];
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {(
        [
          { value: "monthly", label: "Mensile" },
          { value: "annual", label: "Annuale" },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
            period === option.value
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ClubStatsPanel({
  revenueBookings,
  affluenceBookings,
}: ClubStatsPanelProps) {
  const [period, setPeriod] = useState<StatsPeriod>("monthly");
  const availableYears = useMemo(
    () => getAvailableYears([...revenueBookings, ...affluenceBookings]),
    [revenueBookings, affluenceBookings],
  );
  const [year, setYear] = useState(() => availableYears[0] ?? new Date().getFullYear());

  const revenuePoints = useMemo(
    () => aggregateRevenue(revenueBookings, period, year),
    [revenueBookings, period, year],
  );
  const bookingPoints = useMemo(
    () => aggregateBookings(affluenceBookings, period, year),
    [affluenceBookings, period, year],
  );

  const totalRevenue = sumValues(revenuePoints);
  const totalBookings = sumValues(bookingPoints);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Statistiche</h2>
        <div className="flex flex-wrap items-center gap-3">
          <PeriodToggle period={period} onChange={setPeriod} />
          {period === "monthly" && (
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {availableYears.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-zinc-900">Utile impianto</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Incassi dalle prenotazioni pagate
                </p>
              </div>
              <p className="text-right text-lg font-bold text-emerald-700">
                {formatEuro(totalRevenue)}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ClubBarChart
              points={revenuePoints}
              valueFormatter={formatEuro}
              barClassName="bg-emerald-500"
              emptyMessage="Nessun incasso nel periodo selezionato."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-zinc-900">Affluenza</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Prenotazioni attive (in attesa o confermate)
                </p>
              </div>
              <p className="text-right text-lg font-bold text-sky-700">{totalBookings}</p>
            </div>
          </CardHeader>
          <CardContent>
            <ClubBarChart
              points={bookingPoints}
              valueFormatter={(value) => String(value)}
              barClassName="bg-sky-500"
              emptyMessage="Nessuna prenotazione nel periodo selezionato."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
