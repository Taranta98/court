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

export function getInitialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
