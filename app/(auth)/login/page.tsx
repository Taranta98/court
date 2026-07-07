import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accedi",
};

export default function LoginPage() {
  return (
    <Card>
      <CardContent>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-emerald-700"
        >
          Torna alla home
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Accedi</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Inserisci le tue credenziali per continuare.
        </p>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
