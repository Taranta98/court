import { requireRole } from "@/actions/auth";
import { ROLES } from "@/lib/types/db";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

  const [clubs, users, bookings] = await Promise.all([
    prisma.club.count(),
    prisma.user.count(),
    prisma.booking.count(),
  ]);

  return (
    <section>
      <PageHeader
        title="Pannello Admin"
        description={`Accesso come ${session.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Circoli</p>
          <p className="mt-1 text-2xl font-bold">{clubs}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Utenti</p>
          <p className="mt-1 text-2xl font-bold">{users}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Prenotazioni</p>
          <p className="mt-1 text-2xl font-bold">{bookings}</p>
        </div>
      </div>
    </section>
  );
}
