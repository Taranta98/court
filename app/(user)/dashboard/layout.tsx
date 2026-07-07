import { requireSession } from "@/actions/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 text-sm">
          <Link href="/" className="font-bold text-emerald-700">
            Court
          </Link>
          <Link href="/dashboard" className="font-medium text-zinc-800">
            Le mie prenotazioni
          </Link>
          <Link href="/circoli" className="text-zinc-600 hover:text-emerald-700">
            Circoli
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
