import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrati",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardContent>
        <h1 className="text-2xl font-bold text-zinc-900">Crea account</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Registrati per prenotare campi e gestire le tue partite.
        </p>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
