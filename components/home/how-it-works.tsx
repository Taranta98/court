const steps = [
  {
    number: "1",
    title: "Scegli il circolo",
    description: "Sfoglia gli impianti vicino a te e confronta sport e disponibilità.",
  },
  {
    number: "2",
    title: "Prenota il campo",
    description: "Seleziona data, orario e campo in pochi tap.",
  },
  {
    number: "3",
    title: "Gioca",
    description: "Ricevi la conferma e vai in campo. Puoi anche aprire una partita aperta.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
      {steps.map((step) => (
        <li
          key={step.number}
          className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 sm:flex-col sm:gap-3 sm:p-5"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white sm:size-10"
            aria-hidden
          >
            {step.number}
          </span>
          <div>
            <h3 className="font-semibold text-zinc-900">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
