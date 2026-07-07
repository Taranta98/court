/**
 * SERVER COMPONENT (nessun "use client")
 *
 * Un link che *sembra* un bottone. Perfetto nelle pagine Server
 * dove non serve JavaScript per l'interazione — Next.js prefetcha
 * la pagina di destinazione in automatico.
 *
 * Differenza con <Button>:
 *   ButtonLink → navigazione (href)
 *   Button     → azioni (onClick, submit form)
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkVariant = "primary" | "outline";
type ButtonLinkSize = "default" | "lg";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonLinkVariant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
  outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100",
};

const sizeStyles: Record<ButtonLinkSize, string> = {
  default: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base sm:min-h-11 sm:text-sm",
};

export function ButtonLink({
  variant = "primary",
  size = "default",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
