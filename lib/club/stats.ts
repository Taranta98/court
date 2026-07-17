export interface BookingStatRow {
  startAt: string;
  totalAmount: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export type StatsPeriod = "monthly" | "annual";

const MONTH_LABELS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
] as const;

export function getAvailableYears(bookings: BookingStatRow[]) {
  const years = new Set<number>();

  for (const booking of bookings) {
    years.add(new Date(booking.startAt).getFullYear());
  }

  const currentYear = new Date().getFullYear();
  years.add(currentYear);

  return [...years].sort((a, b) => b - a);
}

export function aggregateRevenue(
  bookings: BookingStatRow[],
  period: StatsPeriod,
  year: number,
): ChartPoint[] {
  if (period === "monthly") {
    const points = MONTH_LABELS.map((label) => ({ label, value: 0 }));

    for (const booking of bookings) {
      const date = new Date(booking.startAt);
      if (date.getFullYear() !== year) continue;
      points[date.getMonth()].value += booking.totalAmount;
    }

    return points;
  }

  const byYear = new Map<number, number>();

  for (const booking of bookings) {
    const y = new Date(booking.startAt).getFullYear();
    byYear.set(y, (byYear.get(y) ?? 0) + booking.totalAmount);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([y, value]) => ({ label: String(y), value }));
}

export function aggregateBookings(
  bookings: BookingStatRow[],
  period: StatsPeriod,
  year: number,
): ChartPoint[] {
  if (period === "monthly") {
    const points = MONTH_LABELS.map((label) => ({ label, value: 0 }));

    for (const booking of bookings) {
      const date = new Date(booking.startAt);
      if (date.getFullYear() !== year) continue;
      points[date.getMonth()].value += 1;
    }

    return points;
  }

  const byYear = new Map<number, number>();

  for (const booking of bookings) {
    const y = new Date(booking.startAt).getFullYear();
    byYear.set(y, (byYear.get(y) ?? 0) + 1);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([y, value]) => ({ label: String(y), value }));
}

export function sumValues(points: ChartPoint[]) {
  return points.reduce((total, point) => total + point.value, 0);
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
