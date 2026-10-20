import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
      />
      <div className="relative w-full max-w-md">
        <Link
          className="mb-8 flex items-center justify-center gap-3"
          href="/login"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md shadow-primary/20">
            P
          </span>
          <span className="text-lg font-semibold tracking-tight">
            PH Instructor
          </span>
        </Link>
        {children}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          A focused workspace for teaching and learning.
        </p>
      </div>
    </main>
  );
}
