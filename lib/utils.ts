/**
 * Utility per unire classi CSS in modo sicuro.
 *
 * Esempio:
 *   cn("px-4", isActive && "bg-emerald-600", className)
 *
 * Filtra i valori falsy (false, undefined, "") così non finiscono
 * stringhe vuote nel className finale.
 */
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
