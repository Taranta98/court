import { AppShell } from "@/components/layout/app-shell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AppShell>
  );
}
