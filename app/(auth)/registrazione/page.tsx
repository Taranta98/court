import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrati",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardContent>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-emerald-700"
        >
          Torna alla home
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Crea account</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Registrati per prenotare campi e gestire le tue partite.
        </p>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
