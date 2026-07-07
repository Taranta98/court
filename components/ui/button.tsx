"use client";

/**
 * CLIENT COMPONENT
 *
 * Perché "use client"?
 * - Questo componente gestisce il click (onClick) e lo stato del browser.
 * - In Next.js, tutto ciò che è interattivo lato utente vive nei Client Component.
 *
 * Usalo per: submit form, toggle, modali, ecc.
 * NON serve per i link di navigazione → usa ButtonLink (Server Component).
 */

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

/** Le "varianti" definiscono lo stile visivo del bottone */
type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Stili base condivisi da tutte le varianti
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
