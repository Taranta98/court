/**
 * SERVER COMPONENT — intestazione standard per le pagine interne.
 *
 * Evita di ripetere h1 + sottotitolo in ogni page.tsx.
 * La pagina passa solo titolo e descrizione come props.
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Testo piccolo sopra il titolo (es. "Impianti sportivi") */
  eyebrow?: string;
  /** "hero" = titolo grande per la landing, "default" = pagine interne */
  variant?: "default" | "hero";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  variant = "default",
}: PageHeaderProps) {
  return (
    <header className={variant === "hero" ? "mb-8 sm:mb-10" : "mb-8 sm:mb-10"}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 sm:text-sm">
          {eyebrow}
        </p>
      )}
      <h1
        className={
          variant === "hero"
            ? "text-[1.75rem] font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl sm:leading-tight lg:text-5xl"
            : "text-2xl font-bold text-zinc-900 sm:text-3xl"
        }
      >
        {title}
      </h1>
      {description && (
        <p
          className={
            variant === "hero"
              ? "mt-4 text-base leading-relaxed text-zinc-600 sm:mt-6 sm:text-lg sm:leading-8"
              : "mt-2 text-sm text-zinc-600 sm:text-base"
          }
        >
          {description}
        </p>
      )}
    </header>
  );
}
