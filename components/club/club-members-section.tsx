"use client";

import {
  createClubMemberAction,
  deleteClubMemberAction,
  updateClubMemberAction,
} from "@/actions/club-members";
import {
  expiryStatusLabels,
  expiryStatusStyles,
  formatMemberDate,
  memberStatusLabels,
  memberStatusStyles,
} from "@/lib/club/member-labels";
import type { ClubMemberDTO, MemberReminderSummary } from "@/lib/club/members";
import { EXPIRY_STATUS, MEMBER_STATUS, type MemberStatus } from "@/lib/types/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useActionState, useState, useTransition } from "react";

interface ClubMembersSectionProps {
  members: ClubMemberDTO[];
  summary: MemberReminderSummary;
}

type FilterKey = "all" | "medical" | "membership";

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

function MemberForm({
  member,
  onCancel,
}: {
  member?: ClubMemberDTO;
  onCancel?: () => void;
}) {
  const action = member
    ? updateClubMemberAction.bind(null, member.id)
    : createClubMemberAction;
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="font-medium text-zinc-900">
        {member ? "Modifica tesserato" : "Nuovo tesserato"}
      </h3>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nome"
          name="firstName"
          defaultValue={member?.firstName}
          error={state?.fieldErrors?.firstName?.[0]}
          required
        />
        <Input
          label="Cognome"
          name="lastName"
          defaultValue={member?.lastName}
          error={state?.fieldErrors?.lastName?.[0]}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          error={state?.fieldErrors?.email?.[0]}
        />
        <Input
          label="Telefono"
          name="phone"
          type="tel"
          defaultValue={member?.phone ?? ""}
          error={state?.fieldErrors?.phone?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Numero tessera"
          name="membershipNumber"
          defaultValue={member?.membershipNumber ?? ""}
          error={state?.fieldErrors?.membershipNumber?.[0]}
        />
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-700">
            Stato
          </label>
          <select
            id="status"
            name="status"
            defaultValue={member?.status ?? MEMBER_STATUS.ACTIVE}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {(Object.keys(MEMBER_STATUS) as MemberStatus[]).map((status) => (
              <option key={status} value={status}>
                {memberStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Scadenza certificato medico"
          name="medicalCertificateExpiresAt"
          type="date"
          defaultValue={member?.medicalCertificateExpiresAt ?? ""}
          error={state?.fieldErrors?.medicalCertificateExpiresAt?.[0]}
        />
        <Input
          label="Scadenza tessera"
          name="membershipExpiresAt"
          type="date"
          defaultValue={member?.membershipExpiresAt ?? ""}
          error={state?.fieldErrors?.membershipExpiresAt?.[0]}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-700">
          Note
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={member?.notes ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        {state?.fieldErrors?.notes?.[0] && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.notes[0]}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvataggio..." : member ? "Salva modifiche" : "Aggiungi tesserato"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
            Annulla
          </Button>
        )}
      </div>
    </form>
  );
}

function ReminderCards({ summary }: { summary: MemberReminderSummary }) {
  const cards = [
    {
      label: "Certificati scaduti",
      value: summary.medicalExpired,
      tone: summary.medicalExpired > 0 ? "text-red-700 bg-red-50" : "text-zinc-700 bg-zinc-50",
    },
    {
      label: "Certificati in scadenza",
      value: summary.medicalExpiring,
      tone: summary.medicalExpiring > 0 ? "text-amber-800 bg-amber-50" : "text-zinc-700 bg-zinc-50",
    },
    {
      label: "Certificati mancanti",
      value: summary.medicalMissing,
      tone: summary.medicalMissing > 0 ? "text-zinc-800 bg-zinc-100" : "text-zinc-700 bg-zinc-50",
    },
    {
      label: "Tessere scadute / in scadenza",
      value: summary.membershipExpired + summary.membershipExpiring,
      tone:
        summary.membershipExpired + summary.membershipExpiring > 0
          ? "text-amber-800 bg-amber-50"
          : "text-zinc-700 bg-zinc-50",
    },
  ];

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={cn("rounded-xl px-4 py-3", card.tone)}>
          <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
          <p className="mt-1 text-sm">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

function MemberRow({
  member,
  onEdit,
}: {
  member: ClubMemberDTO;
  onEdit: (member: ClubMemberDTO) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Rimuovere ${member.firstName} ${member.lastName}?`)) return;
    startTransition(async () => {
      await deleteClubMemberAction(member.id);
    });
  }

  return (
    <tr className={cn("border-b border-zinc-50", isPending && "opacity-60")}>
      <td className="px-4 py-3">
        <div className="font-medium text-zinc-900">
          {member.lastName} {member.firstName}
        </div>
        {member.membershipNumber && (
          <div className="text-xs text-zinc-500">Tessera {member.membershipNumber}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-zinc-700">{member.email ?? "—"}</div>
        {member.phone && <div className="text-xs text-zinc-500">{member.phone}</div>}
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          label={memberStatusLabels[member.status]}
          className={memberStatusStyles(member.status)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <StatusBadge
            label={expiryStatusLabels[member.medicalExpiryStatus]}
            className={expiryStatusStyles(member.medicalExpiryStatus)}
          />
          <span className="text-xs text-zinc-500">
            {formatMemberDate(member.medicalCertificateExpiresAt)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <StatusBadge
            label={expiryStatusLabels[member.membershipExpiryStatus]}
            className={expiryStatusStyles(member.membershipExpiryStatus)}
          />
          <span className="text-xs text-zinc-500">
            {formatMemberDate(member.membershipExpiresAt)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="px-3 py-1.5" onClick={() => onEdit(member)}>
            Modifica
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-1.5"
            onClick={handleDelete}
            disabled={isPending}
          >
            Rimuovi
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function ClubMembersSection({ members, summary }: ClubMembersSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ClubMemberDTO | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = members.filter((member) => {
    if (filter === "medical") {
      return (
        member.medicalExpiryStatus === EXPIRY_STATUS.EXPIRED ||
        member.medicalExpiryStatus === EXPIRY_STATUS.EXPIRING ||
        member.medicalExpiryStatus === EXPIRY_STATUS.MISSING
      );
    }
    if (filter === "membership") {
      return (
        member.membershipExpiryStatus === EXPIRY_STATUS.EXPIRED ||
        member.membershipExpiryStatus === EXPIRY_STATUS.EXPIRING
      );
    }
    return true;
  });

  return (
    <div>
      <ReminderCards summary={summary} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: `Tutti (${members.length})` },
              {
                key: "medical",
                label: `Certificati (${summary.medicalExpired + summary.medicalExpiring + summary.medicalMissing})`,
              },
              {
                key: "membership",
                label: `Tessere (${summary.membershipExpired + summary.membershipExpiring})`,
              },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === item.key
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:text-emerald-700",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {!showForm && !editing && (
          <Button type="button" onClick={() => setShowForm(true)}>
            Aggiungi tesserato
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-6">
          <MemberForm
            key={editing?.id ?? "new"}
            member={editing ?? undefined}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-zinc-600">
          Nessun tesserato in questa vista. Aggiungi il primo iscritto del circolo.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Tesserato</th>
                <th className="px-4 py-3 font-medium">Contatti</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium">Certificato medico</th>
                <th className="px-4 py-3 font-medium">Tessera</th>
                <th className="px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onEdit={(value) => {
                    setShowForm(false);
                    setEditing(value);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
