import { logoutAction } from "@/actions/logout";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={cn(
          "text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",
          className,
        )}
      >
        Esci
      </button>
    </form>
  );
}
