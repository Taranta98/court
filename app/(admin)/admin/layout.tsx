import { requireRole } from "@/actions/auth";
import { ROLES } from "@/lib/types/db";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 text-sm">
          <Link href="/" className="font-bold text-emerald-700">
            Court
          </Link>
          <Link href="/admin" className="font-medium text-zinc-800">
            Admin
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
