import { requireSession } from "@/actions/auth";
import { AccountForm } from "@/components/account/account-form";
import { PasswordForm } from "@/components/account/password-form";
import { PreferencesForm } from "@/components/account/preferences-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardPath } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ROLES } from "@/lib/types/db";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Il mio account",
};

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ProfilePage() {
  const session = await requireSession();

  if (session.role !== ROLES.USER) {
    redirect(getDashboardPath(session.role));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      preferredSport: true,
      notifyBookings: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <PageHeader
        title={user.name}
        description="Gestisci il tuo account, le preferenze e la sessione."
      />

      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Le mie prenotazioni
        </Link>
      </div>

      <div className="space-y-6">
        <SettingsCard
          title="Dati account"
          description="Aggiorna il nome e l'email associati al tuo profilo."
        >
          <AccountForm defaultName={user.name} defaultEmail={user.email} />
        </SettingsCard>

        <SettingsCard
          title="Password"
          description="Cambia la password di accesso al tuo account."
        >
          <PasswordForm />
        </SettingsCard>

        <SettingsCard
          title="Preferenze"
          description="Personalizza la tua esperienza su Court."
        >
          <PreferencesForm
            defaultPreferredSport={user.preferredSport}
            defaultNotifyBookings={user.notifyBookings}
          />
        </SettingsCard>

        <SettingsCard title="Sessione" description="Esci dal tuo account su questo dispositivo.">
          <LogoutButton className="rounded-lg border border-zinc-300 px-4 py-2.5 hover:bg-zinc-50" />
        </SettingsCard>
      </div>
    </section>
  );
}
