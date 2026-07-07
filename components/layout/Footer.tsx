export function Footer() {
  return (
    <footer className="mt-auto hidden border-t border-zinc-200 bg-zinc-50 sm:block">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-zinc-500 sm:py-8">
        © {new Date().getFullYear()} Court — Prenotazioni sportive
      </div>
    </footer>
  );
}
