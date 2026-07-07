/**
 * SERVER COMPONENT — campo input con label integrata.
 *
 * Per ora è un semplice wrapper HTML. Al Modulo 4 (Server Actions)
 * potremo aggiungere gestione errori e validazione.
 */

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Messaggio di errore sotto il campo (usato in futuro con la validazione) */
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  // Se non passi un id, lo generiamo dal label (accessibilità: label ↔ input)
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>

      <input
        id={inputId}
        className={cn(
          "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
          "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          error ? "border-red-400" : "border-zinc-300",
          className,
        )}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
